import { pool } from '../../../lib/db';

export async function POST(request) {
  try {
    const { studentId, type, message } = await request.json();

    if (!studentId || !type) {
      return Response.json({ error: 'studentId and type are required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO notifications (student_id, type, payload, status)
       VALUES ($1, $2, $3, 'pending') RETURNING id, student_id, type, status`,
      [studentId, type, message || '']
    );

    return Response.json({ notification: result.rows[0] });
  } catch (err) {
    console.error('Notification error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}