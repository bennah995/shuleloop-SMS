// import { pool } from '../../../lib/db';
import { pool } from '../../../../lib/db';
// import { markToGrade } from '../../../../lib/grading';
import { markToGrade } from '../../../../lib/grading';

export async function GET(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'teacher' && role !== 'principal') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const term = searchParams.get('term');
    if (!classId || !term) {
      return Response.json({ error: 'classId and term are required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT st.id AS student_id, st.name,
              AVG(g.score)::numeric(5,2) AS average,
              COUNT(g.id) AS subjects_graded
       FROM students st
       LEFT JOIN grades g ON g.student_id = st.id AND g.term = $2
       WHERE st.class_id = $1
       GROUP BY st.id, st.name
       ORDER BY average DESC NULLS LAST, st.name`,
      [classId, term]
    );

    const students = result.rows.map((r) => {
      const avg = r.average !== null ? Number(r.average) : null;
      const gradeInfo = avg !== null ? markToGrade(avg) : { grade: null, points: null };
      return {
        studentId: r.student_id,
        name: r.name,
        average: avg,
        grade: gradeInfo.grade,
        subjectsGraded: Number(r.subjects_graded),
      };
    });

    let position = 0;
    let lastAverage = null;
    students.forEach((s, idx) => {
      if (s.average === null) {
        s.position = null;
        return;
      }
      if (s.average !== lastAverage) {
        position = idx + 1;
        lastAverage = s.average;
      }
      s.position = position;
    });

    const scoredStudents = students.filter((s) => s.average !== null);
    const classAverage =
      scoredStudents.length > 0
        ? scoredStudents.reduce((sum, s) => sum + s.average, 0) / scoredStudents.length
        : null;

    return Response.json({
      students,
      classAverage: classAverage !== null ? Number(classAverage.toFixed(2)) : null,
      classMeanGrade: classAverage !== null ? markToGrade(classAverage).grade : null,
    });
  } catch (err) {
    console.error('Class ranking error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}