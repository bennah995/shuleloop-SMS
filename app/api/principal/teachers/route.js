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
export async function POST(request) {
  const schoolId = request.headers.get('x-school-id');
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
    `INSERT INTO users (school_id, name, email, password_hash, role, is_active)
     VALUES ($1, $2, $3, $4, 'teacher', TRUE)
     RETURNING id, name, email`,
    [schoolId, name.trim(), email.trim().toLowerCase(), passwordHash]
  );

  return NextResponse.json(
    { teacher: rows[0], tempPassword },
    { status: 201 }
  );
}