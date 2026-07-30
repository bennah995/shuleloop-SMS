const { pool } = require('./db');
const { getClassRanking } = require('./ranking');

async function getAwardsData(classId, term) {
  const ranking = await getClassRanking(classId, term);
  const topOverall = ranking.students.filter((s) => s.average !== null).slice(0, 3);

  const catalogRes = await pool.query('SELECT id, name, category FROM subjects ORDER BY category, name');
  const catalog = catalogRes.rows;

  const gradesRes = await pool.query(
    `SELECT g.subject_id, g.score, st.id AS student_id, st.name AS student_name, st.admission_number
     FROM grades g
     JOIN students st ON st.id = g.student_id
     WHERE st.class_id = $1 AND st.status = 'active' AND g.term = $2`,
    [classId, term]
  );

  const bySubject = new Map();
  for (const row of gradesRes.rows) {
    if (!bySubject.has(row.subject_id)) bySubject.set(row.subject_id, []);
    bySubject.get(row.subject_id).push(row);
  }

  const perSubject = catalog.map((subj) => {
    const rows = bySubject.get(subj.id) || [];
    if (rows.length === 0) {
      return { subjectId: subj.id, subjectName: subj.name, topStudent: null, classAverage: null };
    }
    const top = rows.reduce((best, r) => (Number(r.score) > Number(best.score) ? r : best), rows[0]);
    const avg = rows.reduce((sum, r) => sum + Number(r.score), 0) / rows.length;
    return {
      subjectId: subj.id,
      subjectName: subj.name,
      topStudent: {
        studentId: top.student_id,
        name: top.student_name,
        admissionNumber: top.admission_number,
        score: Number(top.score),
      },
      classAverage: Number(avg.toFixed(1)),
    };
  });

  return { topOverall, perSubject };
}

module.exports = { getAwardsData };