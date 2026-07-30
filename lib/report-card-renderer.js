function renderReportCard(doc, data) {
  const { student, className, term, subjects, average, averageGrade, comments, studentRank, classAverage } = data;

  doc.fontSize(18).text('ShuleLoop Report Card', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(11).text(`Student: ${student.name}`);
  doc.text(`Admission No: ${student.admission_number ?? '—'}`);
  doc.text(`Class: ${className}`);
  doc.text(`Term: ${term}`);
  doc.moveDown();

  const startX = 50;
  let y = doc.y;
  doc.fontSize(11).font('Helvetica-Bold');
  doc.text('Subject', startX, y, { width: 220 });
  doc.text('Mark', startX + 220, y, { width: 80 });
  doc.text('Grade', startX + 300, y, { width: 80 });
  doc.text('Points', startX + 380, y, { width: 80 });
  doc.font('Helvetica');
  y += 18;
  doc.moveTo(startX, y).lineTo(startX + 460, y).stroke();
  y += 6;

  subjects.forEach((s) => {
    doc.text(s.subject_name, startX, y, { width: 220 });
    doc.text(s.score !== null ? String(s.score) : '-', startX + 220, y, { width: 80 });
    doc.text(s.grade || '-', startX + 300, y, { width: 80 });
    doc.text(String(s.points ?? '-'), startX + 380, y, { width: 80 });
    y += 18;
  });

  y += 6;
  doc.moveTo(startX, y).lineTo(startX + 460, y).stroke();
  y += 10;
  doc.font('Helvetica-Bold');
  doc.text('Average', startX, y, { width: 220 });
  doc.text(average !== null ? average.toFixed(1) : '-', startX + 220, y, { width: 80 });
  doc.text(averageGrade, startX + 300, y, { width: 80 });
  doc.font('Helvetica');
  y += 30;
  doc.y = y;

  if (classAverage !== null) doc.text(`Class Average: ${classAverage.toFixed(1)}`);
  if (studentRank?.position) doc.text(`Class Position: ${studentRank.position}`);
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Teacher's Comment:");
  doc.font('Helvetica').text(comments.teacher_comment || '(no comment)');
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Principal's Comment:");
  doc.font('Helvetica').text(comments.principal_comment || '(no comment)');
}

module.exports = { renderReportCard };