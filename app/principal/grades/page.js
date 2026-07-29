'use client';

import { useState, useEffect } from 'react';
import { useActiveTerm } from '../../hooks/useActiveTerm';

export default function PrincipalGradesPage() {
  const term = useActiveTerm();
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (classId && term) loadRanking();
  }, [classId, term]);

  async function loadClasses() {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data.classes || []);
    if (data.classes?.length > 0) setClassId(data.classes[0].id);
  }

  async function loadRanking() {
    setLoading(true);
    const res = await fetch(`/api/teacher/class-ranking?classId=${classId}&term=${encodeURIComponent(term)}`);
    const data = await res.json();
    setRanking(data);
    setLoading(false);
  }

  if (!term) return <div className="p-6 text-sm text-[#64748B]">Loading...</div>;

  return (
    <div className="p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-base font-medium text-[#1A3C5E]">Grades Overview — {term}</h2>
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

        {loading || !ranking ? (
          <p className="text-sm text-[#64748B]">Loading...</p>
        ) : (
          <>
            <p className="text-sm text-[#64748B] mb-4">
              Class Average: <span className="font-medium text-[#1A3C5E]">
                {ranking.classAverage !== null ? `${ranking.classAverage} (${ranking.classMeanGrade})` : '—'}
              </span>
            </p>

            <div className="space-y-1 mb-6">
              {ranking.students.map((s) => (
                <div key={s.studentId} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                  <span className="text-sm text-[#1E293B]">
                    {s.position ? `${s.position}. ` : ''}{s.name}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {s.average !== null ? `${s.average} (${s.grade})` : 'No grades yet'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <a
                href={`/api/teacher/class-report-cards?classId=${classId}&term=${encodeURIComponent(term)}`}
                target="_blank"
                className="px-3 h-9 flex items-center bg-[#1A3C5E] text-white rounded-md text-xs font-medium"
              >
                Download All Report Cards
              </a>
              <a
                href={`/api/teacher/class-report?classId=${classId}&term=${encodeURIComponent(term)}`}
                target="_blank"
                className="px-3 h-9 flex items-center border border-[#1A3C5E] text-[#1A3C5E] rounded-md text-xs font-medium"
              >
                Download Class Report
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}