'use client';

import { useState, useEffect } from 'react';

const TERM = 'Term 2 2026';

export default function TeacherGradesPage() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeInputs, setGradeInputs] = useState({});

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (classId) loadStudents();
  }, [classId]);

  async function loadClasses() {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data.classes || []);
    if (data.classes?.length > 0) setClassId(data.classes[0].id);
  }

  async function loadStudents() {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(`/api/teacher/attendance?classId=${classId}&date=${today}`);
    const data = await res.json();
    setStudents(data.students || []);
    setLoading(false);
  }

  async function saveGrade(studentId) {
    const subject = document.getElementById(`subject-${studentId}`).value;
    const score = gradeInputs[`${studentId}-subj`];
    if (!subject || !score) {
      alert('Enter subject and score');
      return;
    }
    await fetch('/api/teacher/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, subject, term: TERM, score: Number(score) }),
    });
    alert('Grade saved');
  }

  return (
    <div className="p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-[#1A3C5E]">Enter Grades — {TERM}</h2>
          <select
            value={classId || ''}
            onChange={(e) => setClassId(Number(e.target.value))}
            className="h-9 px-3 border border-[#CBD5E1] rounded-md text-sm"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-[#64748B]">Loading...</p>
        ) : students.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No students in this class yet.</p>
        ) : (
          <div className="space-y-3">
            {students.map((s) => (
              <div key={s.student_id} className="flex items-center gap-2">
                <span className="text-sm text-[#1E293B] w-32 truncate">{s.name}</span>
                <input
                  placeholder="Subject"
                  id={`subject-${s.student_id}`}
                  className="h-8 px-2 border border-[#CBD5E1] rounded-md text-sm w-28"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Score"
                  value={gradeInputs[`${s.student_id}-subj`] || ''}
                  onChange={(e) =>
                    setGradeInputs((prev) => ({ ...prev, [`${s.student_id}-subj`]: e.target.value }))
                  }
                  className="h-8 px-2 border border-[#CBD5E1] rounded-md text-sm w-20"
                />
                <button
                  onClick={() => saveGrade(s.student_id)}
                  className="h-8 px-3 bg-[#1A3C5E] text-white rounded-md text-xs font-medium"
                >
                  Save
                </button>
                <a
                  href={`/api/teacher/report-card?studentId=${s.student_id}&term=${encodeURIComponent(TERM)}`}
                  target="_blank"
                  className="text-xs text-[#1A3C5E] underline ml-1"
                >
                  Report card
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}