import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../../../lib/db';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Look up the user
    const result = await pool.query(
      `SELECT id, school_id, name, email, password_hash, role FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Issue JWT
    const token = jwt.sign(
      { userId: user.id, schoolId: user.school_id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set as HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('shuleloop_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return Response.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}