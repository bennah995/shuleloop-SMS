import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { pool } from '@/lib/db';
import { generateTempPassword } from '@/lib/temp-password';

// GET /api/principal/teachers — staff list (active first)
export async function GET() {
  const { rows } = await pool.query(
    `SELECT id, name, email, is_active
     FROM users
     WHERE role = 'teacher'
     ORDER BY is_active DESC, name ASC`
  );
  return NextResponse.json({ teachers: rows });
}

// POST /api/principal/teachers — create a teacher account
// body: { name: 'Jane Doe', email: 'jane@maono.school' }
// Returns the temp password ONCE in this response — the frontend must
// show it in a "copy this now, it won't be shown again" dialog. It is
// never stored in plaintext or returned by any other endpoint.
export async function POST(request) {
  const { name, email } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'name and email are required' }, { status: 400 });
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'A user with that email already exists' }, { status: 409 });
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, is_active)
     VALUES ($1, $2, $3, 'teacher', TRUE)
     RETURNING id, name, email`,
    [name.trim(), email.trim().toLowerCase(), passwordHash]
  );

  return NextResponse.json(
    { teacher: rows[0], tempPassword },
    { status: 201 }
  );
}