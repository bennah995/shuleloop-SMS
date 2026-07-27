'use client';

import { useState, useEffect } from 'react';

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [notifiedIds, setNotifiedIds] = useState(new Set());

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

  async function markAttendance(studentId, status) {
    setSavingId(studentId);
    await fetch('/api/teacher/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, date, status }),
    });
    await loadAttendance();
    setSavingId(null);
  }

  async function notifyParent(studentId, studentName) {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        type: 'absence',
        message: `${studentName} was marked absent on ${date}`,
      }),
    });
    setNotifiedIds((prev) => new Set(prev).add(studentId));
  }

  return (
    <div className="p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-base font-medium text-[#1A3C5E]">Attendance</h2>
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
        ) : students.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No students in this class yet.</p>
        ) : (
          <div className="space-y-2">
            {students.map((s) => (
              <div key={s.student_id} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                <span className="text-sm text-[#1E293B]">{s.name}</span>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => markAttendance(s.student_id, 'present')}
                    disabled={savingId === s.student_id}
                    className={`px-3 h-8 rounded-md text-xs font-medium ${
                      s.status === 'present'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-white text-[#64748B] border border-[#CBD5E1]'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => markAttendance(s.student_id, 'absent')}
                    disabled={savingId === s.student_id}
                    className={`px-3 h-8 rounded-md text-xs font-medium ${
                      s.status === 'absent'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-white text-[#64748B] border border-[#CBD5E1]'
                    }`}
                  >
                    Absent
                  </button>
                  {s.status === 'absent' && (
                    <button
                      onClick={() => notifyParent(s.student_id, s.name)}
                      disabled={notifiedIds.has(s.student_id)}
                      className="px-3 h-8 rounded-md text-xs font-medium bg-[#F0A500] text-[#1A3C5E] disabled:opacity-50"
                    >
                      {notifiedIds.has(s.student_id) ? 'Notified' : 'Notify Parent'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}