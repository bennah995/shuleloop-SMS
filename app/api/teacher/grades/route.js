import { pool } from '../../../../lib/db';

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'teacher' && role !== 'principal') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { studentId, subject, term, score } = await request.json();

    if (!studentId || !subject || !term || score === undefined) {
      return Response.json(
        { error: 'studentId, subject, term, and score are required' },
        { status: 400 }
      );
    }

    const numericScore = Number(score);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      return Response.json({ error: 'score must be a number between 0 and 100' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO grades (student_id, subject, term, score)
       VALUES ($1, $2, $3, $4) RETURNING id, student_id, subject, term, score`,
      [studentId, subject, term, numericScore]
    );

    return Response.json({ grade: result.rows[0] });
  } catch (err) {
    console.error('Grade error:', err);
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
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return Response.json({ error: 'studentId is required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, subject, term, score FROM grades WHERE student_id = $1 ORDER BY term, subject`,
      [studentId]
    );

    return Response.json({ grades: result.rows });
  } catch (err) {
    console.error('Grades fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}