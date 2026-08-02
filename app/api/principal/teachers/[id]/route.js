import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// PATCH /api/principal/teachers/:id — toggle active/inactive, scoped to the requesting school
export async function PATCH(request, { params }) {
  const schoolId = request.headers.get('x-school-id');
  const { id } = await params;
  const { isActive } = await request.json();

  if (typeof isActive !== 'boolean') {
    return NextResponse.json({ error: 'isActive (boolean) is required' }, { status: 400 });
  }

  const { rows } = await pool.query(
    `UPDATE users SET is_active = $1
     WHERE id = $2 AND role = 'teacher' AND school_id = $3
     RETURNING id, name, email, is_active`,
    [isActive, id, schoolId]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
  }
  return NextResponse.json({ teacher: rows[0] });
}