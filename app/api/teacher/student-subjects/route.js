import { pool } from '../../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    if (!studentId) return Response.json({ error: 'studentId is required' }, { status: 400 });

    const result = await pool.query(
      `SELECT s.id, s.name, s.category FROM student_subjects ss
       JOIN subjects s ON s.id = ss.subject_id
       WHERE ss.student_id = $1 ORDER BY s.category, s.name`,
      [studentId]
    );
    return Response.json({ subjects: result.rows });
  } catch (err) {
    console.error('Student subjects fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'teacher' && role !== 'principal') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { studentId, subjectIds } = await request.json();
    if (!studentId || !Array.isArray(subjectIds)) {
      return Response.json({ error: 'studentId and subjectIds are required' }, { status: 400 });
    }

    const catalogRes = await pool.query('SELECT id, category FROM subjects');
    const catalog = catalogRes.rows;
    const byId = Object.fromEntries(catalog.map((s) => [s.id, s.category]));

    const compulsoryIds = catalog.filter((s) => s.category === 'compulsory').map((s) => s.id);
    const selectedSet = new Set(subjectIds);

    const missingCompulsory = compulsoryIds.filter((id) => !selectedSet.has(id));
    if (missingCompulsory.length > 0) {
      return Response.json({ error: 'All 5 compulsory subjects must be included' }, { status: 400 });
    }

    const humanitiesSelected = subjectIds.filter((id) => byId[id] === 'humanities');
    if (humanitiesSelected.length !== 2) {
      return Response.json({ error: 'Select exactly 2 humanities subjects' }, { status: 400 });
    }

    const technicalSelected = subjectIds.filter((id) => byId[id] === 'technical');
    if (technicalSelected.length !== 1) {
      return Response.json({ error: 'Select exactly 1 technical subject' }, { status: 400 });
    }

    const optionalSelected = subjectIds.filter((id) => byId[id] === 'optional_compulsory');
    if (optionalSelected.length > 1) {
      return Response.json({ error: 'Only Physics can be selected here' }, { status: 400 });
    }

    await pool.query('DELETE FROM student_subjects WHERE student_id = $1', [studentId]);
    for (const subjectId of subjectIds) {
      await pool.query(
        'INSERT INTO student_subjects (student_id, subject_id) VALUES ($1, $2)',
        [studentId, subjectId]
      );
    }

    return Response.json({ success: true, count: subjectIds.length });
  } catch (err) {
    console.error('Student subjects save error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}