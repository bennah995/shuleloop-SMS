'use client';

import { useState, useEffect } from 'react';

export default function PrincipalAttendancePage() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (classId) loadAttendance();
  }, [classId, date]);

  async function loadClasses() {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data.classes || []);
    if (data.classes?.length > 0) setClassId(data.classes[0].id);
  }

  async function loadAttendance() {
    setLoading(true);
    const res = await fetch(`/api/teacher/attendance?classId=${classId}&date=${date}`);
    const data = await res.json();
    setStudents(data.students || []);
    setLoading(false);
  }

  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;
  const unmarkedCount = students.filter((s) => !s.status).length;

  return (
    <div className="p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-base font-medium text-[#1A3C5E]">Attendance Overview</h2>
          <div className="flex gap-2">
            <select
              value={classId || ''}
              onChange={(e) => setClassId(Number(e.target.value))}
              className="h-9 px-3 border border-[#CBD5E1] rounded-md text-sm"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-9 px-3 border border-[#CBD5E1] rounded-md text-sm"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-[#64748B]">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
                <p className="text-xl font-medium text-green-700">{presentCount}</p>
                <p className="text-xs text-green-600">Present</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center">
                <p className="text-xl font-medium text-red-700">{absentCount}</p>
                <p className="text-xs text-red-600">Absent</p>
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-md p-3 text-center">
                <p className="text-xl font-medium text-slate-600">{unmarkedCount}</p>
                <p className="text-xs text-slate-500">Unmarked</p>
              </div>
            </div>

            {students.length === 0 ? (
              <p className="text-sm text-[#94A3B8]">No students in this class yet.</p>
            ) : (
              <div className="space-y-2">
                {students.map((s) => (
                  <div key={s.student_id} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                    <span className="text-sm text-[#1E293B]">
                      <span className="text-xs text-[#94A3B8] mr-2">#{s.admission_number ?? '—'}</span>
                      {s.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${
                        s.status === 'present'
                          ? 'bg-green-100 text-green-700'
                          : s.status === 'absent'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {s.status || 'unmarked'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}