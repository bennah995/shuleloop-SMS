import { pool } from '../../../../lib/db';
import PDFDocument from 'pdfkit';

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

    const studentRes = await pool.query(`SELECT name FROM students WHERE id = $1`, [studentId]);
    if (studentRes.rows.length === 0) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }
    const student = studentRes.rows[0];

    const gradesRes = await pool.query(
      `SELECT subject, score FROM grades WHERE student_id = $1 AND term = $2 ORDER BY subject`,
      [studentId, term]
    );
    const grades = gradesRes.rows;

    // Build the PDF into a buffer, then return it as a downloadable response
    const chunks = [];
    const doc = new PDFDocument({ margin: 50 });
    doc.on('data', (chunk) => chunks.push(chunk));

    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('ShuleLoop Report Card', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Student: ${student.name}`);
      doc.text(`Term: ${term}`);
      doc.moveDown();

      doc.fontSize(14).text('Subject Scores', { underline: true });
      doc.moveDown(0.5);

      if (grades.length === 0) {
        doc.fontSize(12).text('No grades recorded for this term.');
      } else {
        grades.forEach((g) => {
          doc.fontSize(12).text(`${g.subject}: ${g.score}/100`);
        });

        const average = grades.reduce((sum, g) => sum + Number(g.score), 0) / grades.length;
        doc.moveDown();
        doc.fontSize(12).text(`Average: ${average.toFixed(1)}/100`, { underline: true });
      }

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