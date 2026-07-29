import { pool } from '../../../../lib/db';
import { markToGrade } from '../../../../lib/grading';

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'teacher' && role !== 'principal') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { studentId, subjectId, term, score } = await request.json();
    if (!studentId || !subjectId || !term || score === undefined) {
      return Response.json(
        { error: 'studentId, subjectId, term, and score are required' },
        { status: 400 }
      );
    }

    const numericScore = Number(score);
    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      return Response.json({ error: 'score must be a number between 0 and 100' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO grades (student_id, subject_id, term, score)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, subject_id, term)
       DO UPDATE SET score = $4
       RETURNING id, student_id, subject_id, term, score`,
      [studentId, subjectId, term, numericScore]
    );

    const { grade, points } = markToGrade(numericScore);
    return Response.json({ grade: { ...result.rows[0], grade, points } });
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
    const term = searchParams.get('term');
    if (!studentId || !term) {
      return Response.json({ error: 'studentId and term are required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT sub.id AS subject_id, sub.name AS subject_name, sub.category, g.score
       FROM student_subjects ss
       JOIN subjects sub ON sub.id = ss.subject_id
       LEFT JOIN grades g ON g.student_id = ss.student_id AND g.subject_id = sub.id AND g.term = $2
       WHERE ss.student_id = $1
       ORDER BY sub.category, sub.name`,
      [studentId, term]
    );

    const rows = result.rows.map((r) => {
      if (r.score === null) return { ...r, grade: null, points: null };
      const { grade, points } = markToGrade(r.score);
      return { ...r, grade, points };
    });

    const scored = rows.filter((r) => r.score !== null);
    const average =
      scored.length > 0 ? scored.reduce((sum, r) => sum + Number(r.score), 0) / scored.length : null;

    return Response.json({ subjects: rows, average });
  } catch (err) {
    console.error('Grades fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}