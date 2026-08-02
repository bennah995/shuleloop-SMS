import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../../../lib/db';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id');
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const userRes = await pool.query(
      'SELECT id, school_id, name, email, role FROM users WHERE id = $1',
      [userId]
    );
    if (userRes.rows.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    const user = userRes.rows[0];

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1, must_change_password = FALSE WHERE id = $2',
      [passwordHash, userId]
    );

    // Reissue the session JWT without the mustChangePassword flag,
    // otherwise the old token keeps forcing the redirect until it expires.
    const token = jwt.sign(
      {
        userId: user.id,
        schoolId: user.school_id,
        role: user.role,
        name: user.name,
        mustChangePassword: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('shuleloop_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error('Change password error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}