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
      `SELECT st.id AS student_id, st.name AS student_name, st.admission_number,
              sub.id AS subject_id,
              (ss.student_id IS NOT NULL) AS registered,
              g.score
       FROM students st
       CROSS JOIN subjects sub
       LEFT JOIN student_subjects ss ON ss.student_id = st.id AND ss.subject_id = sub.id
       LEFT JOIN grades g ON g.student_id = st.id AND g.subject_id = sub.id AND g.term = $2
       WHERE st.class_id = $1 AND st.status = 'active'
       ORDER BY st.name`,
      [classId, term]
    );

    const studentMap = new Map();
    for (const row of matrixRes.rows) {
      if (!studentMap.has(row.student_id)) {
        studentMap.set(row.student_id, {
          name: row.student_name,
          admissionNumber: row.admission_number,
          cells: {},
        });
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

      // Column layout: Pos | Adm# | Name | [subjects...] | Avg | Grade
      const colWidths = [28, 45, 100, ...subjectList.map(() => 36), 40, 40];
      const startX = 30;
      const rowH = 18;
      const tableWidth = colWidths.reduce((a, b) => a + b, 0);

      function colX(index) {
        let x = startX;
        for (let i = 0; i < index; i++) x += colWidths[i];
        return x;
      }

      function drawRow(values, y, opts = {}) {
        const { bold = false, align = 'center' } = opts;
        doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(7.5);
        values.forEach((val, i) => {
          const x = colX(i);
          const w = colWidths[i];
          doc.rect(x, y, w, rowH).stroke('#CBD5E1');
          doc.fillColor('#1E293B').text(String(val), x + 2, y + 5, {
            width: w - 4,
            align: i === 2 ? 'left' : align, // name column left-aligned
          });
        });
      }

      doc.fontSize(16).fillColor('#1A3C5E').text('ShuleLoop Class Report', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('#1E293B').text(`Class: ${className}  |  Term: ${term}`);
      if (ranking.classAverage !== null) {
        doc.text(`Class Average: ${ranking.classAverage} (${ranking.classMeanGrade})`);
      }
      doc.fontSize(8).fillColor('#666').text('N/A = subject not taken   |   -  = not yet graded');
      doc.fillColor('#000');
      doc.moveDown(0.5);

      let y = doc.y;
      const headerRow = ['Pos', 'Adm#', 'Name', ...subjectList.map((s) => abbreviate(s.name)), 'Avg', 'Grd'];
      drawRow(headerRow, y, { bold: true });
      y += rowH;

      students.forEach((s) => {
        if (y > 500) {
          doc.addPage();
          y = 40;
          drawRow(headerRow, y, { bold: true });
          y += rowH;
        }
        const row = [
          s.rank?.position ? String(s.rank.position) : '-',
          s.admissionNumber ?? '—',
          s.name,
          ...subjectList.map((subj) => s.cells[subj.id] || 'N/A'),
          s.rank?.average !== null && s.rank?.average !== undefined ? s.rank.average.toFixed(1) : '-',
          s.rank?.grade || '-',
        ];
        drawRow(row, y);
        y += rowH;
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