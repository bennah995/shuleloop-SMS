import { pool } from '../../../../lib/db';

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');

    if (role !== 'teacher' && role !== 'principal') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { studentId, date, status } = await request.json();

    if (!studentId || !date || !status) {
      return Response.json(
        { error: 'studentId, date, and status are required' },
        { status: 400 }
      );
    }

    if (!['present', 'absent'].includes(status)) {
      return Response.json(
        { error: 'status must be "present" or "absent"' },
        { status: 400 }
      );
    }

    // Upsert: if this student already has a record for this date, update it;
    // otherwise insert a new one. Relies on the UNIQUE(student_id, date) constraint.
    const result = await pool.query(
      `INSERT INTO attendance (student_id, date, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, date)
       DO UPDATE SET status = $3
       RETURNING id, student_id, date, status`,
      [studentId, date, status]
    );

    return Response.json({ attendance: result.rows[0] });
  } catch (err) {
    console.error('Attendance error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'teacher' && role !== 'principal') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const date = searchParams.get('date');

    if (!classId || !date) {
      return Response.json({ error: 'classId and date are required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT s.id AS student_id, s.name, a.status
       FROM students s
       LEFT JOIN attendance a ON a.student_id = s.id AND a.date = $2
       WHERE s.class_id = $1
       ORDER BY s.name`,
      [classId, date]
    );

    return Response.json({ students: result.rows });
  } catch (err) {
    console.error('Attendance fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}