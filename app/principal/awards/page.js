'use client';

import { useState, useEffect } from 'react';
import { useActiveTerm } from '../../hooks/useActiveTerm';

export default function PrincipalAwardsPage() {
  const term = useActiveTerm();
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (classId && term) loadAwards();
  }, [classId, term]);

  async function loadClasses() {
    const res = await fetch('/api/classes');
    const d = await res.json();
    setClasses(d.classes || []);
    if (d.classes?.length > 0) setClassId(d.classes[0].id);
  }

  async function loadAwards() {
    setLoading(true);
    const res = await fetch(`/api/teacher/awards?classId=${classId}&term=${encodeURIComponent(term)}`);
    const d = await res.json();
    setData(d);
    setLoading(false);
  }

  const MEDALS = ['🥇', '🥈', '🥉'];

  if (!term) return <div className="p-6 text-sm text-[#64748B]">Loading...</div>;

  return (
    <div className="p-6">
      <div className="max-w-3xl space-y-6">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-base font-medium text-[#1A3C5E]">Awards — {term}</h2>
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

          {loading || !data ? (
            <p className="text-sm text-[#64748B]">Loading...</p>
          ) : (
            <>
              <h3 className="text-sm font-medium text-[#1A3C5E] mb-3">Top Overall</h3>
              {data.topOverall.length === 0 ? (
                <p className="text-sm text-[#94A3B8] mb-4">No grades entered yet.</p>
              ) : (
                <div className="space-y-2 mb-2">
                  {data.topOverall.map((s, i) => (
                    <div key={s.studentId} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                      <span className="text-sm text-[#1E293B]">
                        {MEDALS[i]} {s.name}
                      </span>
                      <span className="text-xs text-[#64748B]">{s.average} ({s.grade})</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {!loading && data && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[#1A3C5E] mb-3">Top Scorer Per Subject</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#94A3B8] border-b border-[#E2E8F0]">
                  <th className="pb-2 font-medium">Subject</th>
                  <th className="pb-2 font-medium">Top Scorer</th>
                  <th className="pb-2 font-medium w-20">Score</th>
                  <th className="pb-2 font-medium w-24">Class Avg</th>
                </tr>
              </thead>
              <tbody>
                {data.perSubject.map((s) => (
                  <tr key={s.subjectId} className="border-b border-[#F1F5F9] last:border-0">
                    <td className="py-2 text-[#1E293B]">{s.subjectName}</td>
                    <td className="py-2 text-[#1E293B]">{s.topStudent ? s.topStudent.name : '—'}</td>
                    <td className="py-2 text-[#1E293B]">{s.topStudent ? s.topStudent.score : '-'}</td>
                    <td className="py-2 text-[#1E293B]">{s.classAverage ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}