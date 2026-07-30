'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useActiveTerm } from '../../../hooks/useActiveTerm';

export default function StudentReportPage() {
  const params = useParams();
  const studentId = params.studentId;
  const term = useActiveTerm();

  const [student, setStudent] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [subjectsLoaded, setSubjectsLoaded] = useState(false);
  const [gradeRows, setGradeRows] = useState([]);
  const [average, setAverage] = useState(null);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (term) loadAll();
  }, [studentId, term]);

  async function loadAll() {
    const studentRes = await fetch(`/api/students?id=${studentId}`);
    const studentData = await studentRes.json();
    setStudent(studentData.student);

    const catalogRes = await fetch('/api/subjects');
    const catalogData = await catalogRes.json();
    setCatalog(catalogData.subjects || []);

    const selRes = await fetch(`/api/teacher/student-subjects?studentId=${studentId}`);
    const selData = await selRes.json();

    const compulsoryIds = (catalogData.subjects || [])
      .filter((s) => s.category === 'compulsory')
      .map((s) => s.id);
    const ids = new Set([...(selData.subjects || []).map((s) => s.id), ...compulsoryIds]);
    setSelectedIds(ids);
    setSubjectsLoaded((selData.subjects || []).length > 0);

    if ((selData.subjects || []).length > 0) await loadGrades();

    const commentRes = await fetch(`/api/teacher/comments?studentId=${studentId}&term=${encodeURIComponent(term)}`);
    const commentData = await commentRes.json();
    setComment(commentData.teacher_comment || '');
  }

  async function loadGrades() {
    const res = await fetch(`/api/teacher/grades?studentId=${studentId}&term=${encodeURIComponent(term)}`);
    const data = await res.json();
    setGradeRows(data.subjects || []);
    setAverage(data.average);
  }

  function toggleSubject(id, category) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (category === 'technical') {
        catalog.filter((s) => s.category === 'technical').forEach((s) => next.delete(s.id));
        next.add(id);
      } else if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function saveSubjects() {
    setSaving(true);
    const res = await fetch('/api/teacher/student-subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: Number(studentId), subjectIds: Array.from(selectedIds) }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
    } else {
      setSubjectsLoaded(true);
      await loadGrades();
    }
    setSaving(false);
  }

  async function saveScore(subjectId, score) {
    if (score === '' || score === null) return;
    await fetch('/api/teacher/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: Number(studentId), subjectId, term, score: Number(score) }),
    });
    await loadGrades();
  }

  async function saveComment() {
    await fetch('/api/teacher/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: Number(studentId), term, comment }),
    });
    alert('Comment saved');
  }

  const compulsory = catalog.filter((s) => s.category === 'compulsory');
  const optional = catalog.filter((s) => s.category === 'optional_compulsory');
  const humanities = catalog.filter((s) => s.category === 'humanities');
  const technical = catalog.filter((s) => s.category === 'technical');
  const humanitiesCount = humanities.filter((s) => selectedIds.has(s.id)).length;

  if (!term || !student) return <div className="p-6 text-sm text-[#64748B]">Loading...</div>;

  return (
    <div className="p-6">
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-medium text-[#1A3C5E]">{student.name}</h2>
          <p className="text-sm text-[#64748B]">
            Admission #{student.admission_number ?? '—'} &middot; {term}
          </p>
        </div>

        {!subjectsLoaded && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#1A3C5E] mb-3">Select Subjects</h3>

            <p className="text-xs text-[#94A3B8] mb-1">Compulsory (auto-included)</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {compulsory.map((s) => (
                <span key={s.id} className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">
                  {s.name}
                </span>
              ))}
            </div>

            <p className="text-xs text-[#94A3B8] mb-1">Optional</p>
            <div className="mb-3">
              {optional.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm mb-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(s.id)}
                    onChange={() => toggleSubject(s.id, s.category)}
                  />
                  {s.name}
                </label>
              ))}
            </div>

            <p className="text-xs text-[#94A3B8] mb-1">Humanities — choose exactly 2 ({humanitiesCount}/2 selected)</p>
            <div className="mb-3">
              {humanities.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm mb-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(s.id)}
                    disabled={!selectedIds.has(s.id) && humanitiesCount >= 2}
                    onChange={() => toggleSubject(s.id, s.category)}
                  />
                  {s.name}
                </label>
              ))}
            </div>

            <p className="text-xs text-[#94A3B8] mb-1">Technical — choose exactly 1</p>
            <div className="mb-4">
              {technical.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm mb-1">
                  <input
                    type="radio"
                    name="technical"
                    checked={selectedIds.has(s.id)}
                    onChange={() => toggleSubject(s.id, s.category)}
                  />
                  {s.name}
                </label>
              ))}
            </div>

            <button
              onClick={saveSubjects}
              disabled={saving}
              className="px-4 h-9 bg-[#1A3C5E] text-white rounded-md text-sm font-medium disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Subjects'}
            </button>
          </div>
        )}

        {subjectsLoaded && (
          <>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#1A3C5E]">Subject Marks</h3>
                <button
                  onClick={() => setSubjectsLoaded(false)}
                  className="text-xs text-[#1A3C5E] underline"
                >
                  Edit subjects
                </button>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[#94A3B8] border-b border-[#E2E8F0]">
                    <th className="pb-2 font-medium">Subject</th>
                    <th className="pb-2 font-medium w-24">Mark</th>
                    <th className="pb-2 font-medium w-20">Grade</th>
                    <th className="pb-2 font-medium w-20">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeRows.map((row) => (
                    <tr key={row.subject_id} className="border-b border-[#F1F5F9] last:border-0">
                      <td className="py-2 text-[#1E293B]">{row.subject_name}</td>
                      <td className="py-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={row.score ?? ''}
                          onBlur={(e) => saveScore(row.subject_id, e.target.value)}
                          className="w-16 h-8 px-2 border border-[#CBD5E1] rounded-md text-sm"
                        />
                      </td>
                      <td className="py-2 text-[#1E293B]">{row.grade || '-'}</td>
                      <td className="py-2 text-[#1E293B]">{row.points ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-sm font-medium text-[#1A3C5E]">
                <span>Average</span>
                <span>{average !== null && average !== undefined ? average.toFixed(1) : '-'}</span>
              </div>

              <a
                href={`/api/teacher/report-card?studentId=${studentId}&term=${encodeURIComponent(term)}`}
                target="_blank"
                className="inline-block mt-4 text-xs text-[#1A3C5E] underline"
              >
                Download Report Card
              </a>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
              <h3 className="text-sm font-medium text-[#1A3C5E] mb-3">Teacher's Comment</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full p-2 border border-[#CBD5E1] rounded-md text-sm"
                placeholder="Write a comment for this student's report card..."
              />
              <button
                onClick={saveComment}
                className="mt-2 px-4 h-9 bg-[#1A3C5E] text-white rounded-md text-sm font-medium"
              >
                Save Comment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}