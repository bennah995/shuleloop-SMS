import { pool } from '../../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const term = searchParams.get('term');
    if (!studentId || !term) {
      return Response.json({ error: 'studentId and term are required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT teacher_comment, principal_comment FROM report_comments WHERE student_id = $1 AND term = $2`,
      [studentId, term]
    );

    const row = result.rows[0] || { teacher_comment: null, principal_comment: null };
    return Response.json(row);
  } catch (err) {
    console.error('Comments fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'teacher') {
      return Response.json({ error: 'Only the teacher can set this comment here' }, { status: 403 });
    }

    const { studentId, term, comment } = await request.json();
    if (!studentId || !term) {
      return Response.json({ error: 'studentId and term are required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO report_comments (student_id, term, teacher_comment)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, term) DO UPDATE SET teacher_comment = EXCLUDED.teacher_comment
       RETURNING student_id, term, teacher_comment, principal_comment`,
      [studentId, term, comment || '']
    );

    return Response.json({ comment: result.rows[0] });
  } catch (err) {
    console.error('Comment save error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}