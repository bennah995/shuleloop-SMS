import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// POST /api/principal/graduate — mark every active student in a class
// (Form 4) as graduated. class_id is left as-is on the student row —
// history (grades/attendance) already has its own snapshot, and the
// live class_id is harmless to leave since status='graduated' is what
// active-roster queries filter on.
// body: { classId: 5 }
export async function POST(request) {
  const { classId } = await request.json();

  if (!classId) {
    return NextResponse.json({ error: 'classId is required' }, { status: 400 });
  }

  const { rows } = await pool.query(
    `UPDATE students
     SET status = 'graduated'
     WHERE class_id = $1 AND status = 'active'
     RETURNING id, name`,
    [classId]
  );

  return NextResponse.json({ graduatedCount: rows.length, students: rows });
}