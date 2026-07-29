import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// POST /api/principal/promote — move every active student in one class
// into another (e.g. all of Form 1 -> Form 2).
// body: { fromClassId: 2, toClassId: 3 }
//
// Safe to run because grades/attendance now snapshot class_id at write
// time (see db/migration-terms-snapshot-status.sql) — this only changes
// where the student sits going forward, it never rewrites history.
export async function POST(request) {
  const { fromClassId, toClassId } = await request.json();

  if (!fromClassId || !toClassId) {
    return NextResponse.json({ error: 'fromClassId and toClassId are required' }, { status: 400 });
  }
  if (fromClassId === toClassId) {
    return NextResponse.json({ error: 'fromClassId and toClassId must differ' }, { status: 400 });
  }

  const toClassCheck = await pool.query('SELECT id FROM classes WHERE id = $1', [toClassId]);
  if (toClassCheck.rows.length === 0) {
    return NextResponse.json({ error: 'Destination class not found' }, { status: 404 });
  }

  const { rows } = await pool.query(
    `UPDATE students
     SET class_id = $1
     WHERE class_id = $2 AND status = 'active'
     RETURNING id, name`,
    [toClassId, fromClassId]
  );

  return NextResponse.json({ promotedCount: rows.length, students: rows });
}