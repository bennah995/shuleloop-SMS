import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../../../../lib/db';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT id, name, email, password_hash FROM platform_admins WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { adminId: admin.id, name: admin.name, isPlatformAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('shuleloop_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return Response.json({ admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error('Admin login error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}