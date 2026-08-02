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

    const result = await pool.query(
      `SELECT id, school_id, name, email, password_hash, role, is_active, must_change_password
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    if (user.is_active === false) {
      return Response.json(
        { error: 'This account has been deactivated. Contact your school principal.' },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        schoolId: user.school_id,
        role: user.role,
        name: user.name,
        mustChangePassword: user.must_change_password,
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

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: user.must_change_password,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}