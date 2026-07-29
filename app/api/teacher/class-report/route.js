import { pool } from '../../../../lib/db';
import PDFDocument from 'pdfkit';
import { getClassRanking } from '../../../../lib/ranking';

const ABBREV = {
  'English': 'ENG',
  'Kiswahili': 'KIS',
  'Mathematics': 'MAT',
  'Biology': 'BIO',
  'Chemistry': 'CHE',
  'Physics': 'PHY',
  'History & Government': 'H&G',
  'Geography': 'GEO',
  'CRE/IRE/HRE': 'REL',
  'Business Studies': 'BST',
  'Agriculture': 'AGR',
  'Computer Studies': 'COM',
};

function abbreviate(name) {
  return ABBREV[name] || name.slice(0, 3).toUpperCase();
}

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

    const classRes = await pool.query('SELECT name FROM classes WHERE id = $1', [classId]);
    const className = classRes.rows[0]?.name || '';

    const subjectsRes = await pool.query(
      'SELECT id, name, category FROM subjects ORDER BY category, name'
    );
    const subjectList = subjectsRes.rows;

    const matrixRes = await pool.query(
      `SELECT st.id AS student_id, st.name AS student_name,
              sub.id AS subject_id,
              (ss.student_id IS NOT NULL) AS registered,
              g.score
       FROM students st
       CROSS JOIN subjects sub
       LEFT JOIN student_subjects ss ON ss.student_id = st.id AND ss.subject_id = sub.id
       LEFT JOIN grades g ON g.student_id = st.id AND g.subject_id = sub.id AND g.term = $2
       WHERE st.class_id = $1
       ORDER BY st.name`,
      [classId, term]
    );

    // Build studentId -> { name, cells: { subjectId: 'N/A' | '-' | score } }
    const studentMap = new Map();
    for (const row of matrixRes.rows) {
      if (!studentMap.has(row.student_id)) {
        studentMap.set(row.student_id, { name: row.student_name, cells: {} });
      }
      const cell = !row.registered ? 'N/A' : row.score !== null ? String(Math.round(row.score)) : '-';
      studentMap.get(row.student_id).cells[row.subject_id] = cell;
    }

    const ranking = await getClassRanking(classId, term);
    const rankMap = new Map(ranking.students.map((s) => [s.studentId, s]));

    const students = Array.from(studentMap.entries()).map(([studentId, data]) => ({
      studentId,
      ...data,
      rank: rankMap.get(studentId),
    }));
    students.sort((a, b) => (a.rank?.position ?? 999) - (b.rank?.position ?? 999));

    const chunks = [];
    const doc = new PDFDocument({ margin: 30, layout: 'landscape', size: 'A4' });
    doc.on('data', (chunk) => chunks.push(chunk));

    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const nameW = 110;
      const subjW = 38;
      const statW = 45;
      const startX = 30;

      function drawHeader(y) {
        doc.font('Helvetica-Bold').fontSize(8);
        let x = startX;
        doc.text('Pos', x, y, { width: 25 });
        x += 25;
        doc.text('Name', x, y, { width: nameW });
        x += nameW;
        subjectList.forEach((s) => {
          doc.text(abbreviate(s.name), x, y, { width: subjW, align: 'center' });
          x += subjW;
        });
        doc.text('Avg', x, y, { width: statW, align: 'center' });
        x += statW;
        doc.text('Grade', x, y, { width: statW, align: 'center' });
        doc.font('Helvetica');
        return y + 16;
      }

      doc.fontSize(16).text('ShuleLoop Class Report', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).text(`Class: ${className}  |  Term: ${term}`);
      if (ranking.classAverage !== null) {
        doc.text(`Class Average: ${ranking.classAverage} (${ranking.classMeanGrade})`);
      }
      doc.fontSize(8).fillColor('#666').text('N/A = subject not taken   |   -  = not yet graded', { });
      doc.fillColor('#000');
      doc.moveDown(0.5);

      let y = doc.y;
      y = drawHeader(y);
      doc.moveTo(startX, y - 4).lineTo(startX + 25 + nameW + subjW * subjectList.length + statW * 2, y - 4).stroke();

      doc.fontSize(8);
      students.forEach((s) => {
        if (y > 500) {
          doc.addPage();
          y = 40;
          y = drawHeader(y);
        }
        let x = startX;
        doc.text(s.rank?.position ? String(s.rank.position) : '-', x, y, { width: 25 });
        x += 25;
        doc.text(s.name, x, y, { width: nameW });
        x += nameW;
        subjectList.forEach((subj) => {
          doc.text(s.cells[subj.id] || 'N/A', x, y, { width: subjW, align: 'center' });
          x += subjW;
        });
        doc.text(s.rank?.average !== null && s.rank?.average !== undefined ? s.rank.average.toFixed(1) : '-', x, y, { width: statW, align: 'center' });
        x += statW;
        doc.text(s.rank?.grade || '-', x, y, { width: statW, align: 'center' });
        y += 16;
      });

      doc.end();
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="class-report-${classId}-${term}.pdf"`,
      },
    });
  } catch (err) {
    console.error('Class report error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}