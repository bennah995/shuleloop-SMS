import { pool } from '../../../../lib/db';
import PDFDocument from 'pdfkit';
import { getAwardsData } from '../../../../lib/awards';

const POSITION_LABEL = ['1st', '2nd', '3rd'];

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

    const { topOverall, perSubject } = await getAwardsData(classId, term);

    const chunks = [];
    const doc = new PDFDocument({ margin: 50 });
    doc.on('data', (chunk) => chunks.push(chunk));

    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).fillColor('#1A3C5E').text('ShuleLoop Awards', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(11).fillColor('#000').text(`Class: ${className}   |   Term: ${term}`, { align: 'center' });
      doc.moveDown(1.5);

      doc.fontSize(14).fillColor('#1A3C5E').text('Top Overall');
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#000');
      if (topOverall.length === 0) {
        doc.text('No grades entered yet.');
      } else {
        topOverall.forEach((s, i) => {
          doc.text(`${POSITION_LABEL[i] || i + 1}  —  ${s.name}   (${s.average}, ${s.grade})`);
        });
      }
      doc.moveDown(1.5);

      doc.fontSize(14).fillColor('#1A3C5E').text('Top Scorer Per Subject');
      doc.moveDown(0.5);

      const startX = 50;
      let y = doc.y;
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000');
      doc.text('Subject', startX, y, { width: 160 });
      doc.text('Top Scorer', startX + 160, y, { width: 160 });
      doc.text('Score', startX + 320, y, { width: 60 });
      doc.text('Class Avg', startX + 380, y, { width: 80 });
      doc.font('Helvetica');
      y += 16;
      doc.moveTo(startX, y).lineTo(startX + 460, y).stroke();
      y += 6;

      perSubject.forEach((s) => {
        doc.text(s.subjectName, startX, y, { width: 160 });
        doc.text(s.topStudent ? s.topStudent.name : '—', startX + 160, y, { width: 160 });
        doc.text(s.topStudent ? String(s.topStudent.score) : '-', startX + 320, y, { width: 60 });
        doc.text(s.classAverage ?? '-', startX + 380, y, { width: 80 });
        y += 16;
      });

      doc.end();
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="awards-${classId}-${term}.pdf"`,
      },
    });
  } catch (err) {
    console.error('Awards PDF error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}