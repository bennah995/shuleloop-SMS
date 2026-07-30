import { pool } from '../../../../lib/db';
import PDFDocument from 'pdfkit';
import { markToGrade } from '../../../../lib/grading';
import { getClassRanking } from '../../../../lib/ranking';
import { renderReportCard } from '../../../../lib/report-card-renderer';

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

    const studentRes = await pool.query(
      'SELECT name, class_id, admission_number FROM students WHERE id = $1',
      [studentId]
    );
    if (studentRes.rows.length === 0) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }
    const student = studentRes.rows[0];

    const classRes = await pool.query('SELECT name FROM classes WHERE id = $1', [student.class_id]);
    const className = classRes.rows[0]?.name || '';

    const subjectsRes = await pool.query(
      `SELECT sub.name AS subject_name, sub.category, g.score
       FROM student_subjects ss
       JOIN subjects sub ON sub.id = ss.subject_id
       LEFT JOIN grades g ON g.student_id = ss.student_id AND g.subject_id = sub.id AND g.term = $2
       WHERE ss.student_id = $1
       ORDER BY sub.category, sub.name`,
      [studentId, term]
    );
    const subjects = subjectsRes.rows.map((r) => {
      if (r.score === null) return { ...r, grade: '-', points: '-' };
      const { grade, points } = markToGrade(r.score);
      return { ...r, grade, points };
    });

    const scored = subjects.filter((s) => s.score !== null);
    const average =
      scored.length > 0 ? scored.reduce((sum, s) => sum + Number(s.score), 0) / scored.length : null;
    const averageGrade = average !== null ? markToGrade(average).grade : '-';

    const commentsRes = await pool.query(
      'SELECT teacher_comment, principal_comment FROM report_comments WHERE student_id = $1 AND term = $2',
      [studentId, term]
    );
    const comments = commentsRes.rows[0] || { teacher_comment: '', principal_comment: '' };

    const ranking = await getClassRanking(student.class_id, term);
    const studentRank = ranking.students.find((s) => s.studentId === Number(studentId));

    const chunks = [];
    const doc = new PDFDocument({ margin: 50 });
    doc.on('data', (chunk) => chunks.push(chunk));

    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      renderReportCard(doc, {
        student,
        className,
        term,
        subjects,
        average,
        averageGrade,
        comments,
        studentRank,
        classAverage: ranking.classAverage,
      });
      doc.end();
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-card-${studentId}-${term}.pdf"`,
      },
    });
  } catch (err) {
    console.error('Report card error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}