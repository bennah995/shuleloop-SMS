'use client';

import { useState, useEffect } from 'react';

export default function StudentManagementPage() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);

  const [nextAdmissionNumber, setNextAdmissionNumber] = useState(null);
  const [counterInput, setCounterInput] = useState('');

  const [promoteToId, setPromoteToId] = useState('');
  const [promoting, setPromoting] = useState(false);
  const [graduating, setGraduating] = useState(false);

  useEffect(() => {
    loadClasses();
    loadAdmissionCounter();
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
    const res = await fetch(`/api/students?classId=${classId}`);
    const data = await res.json();
    setStudents(data.students || []);
    setLoading(false);
  }

  async function loadAdmissionCounter() {
    const res = await fetch('/api/principal/admission-settings');
    const data = await res.json();
    setNextAdmissionNumber(data.nextAdmissionNumber);
  }

  async function saveAdmissionCounter() {
    const num = Number(counterInput);
    if (!Number.isInteger(num) || num < 1) {
      alert('Enter a positive whole number');
      return;
    }
    const res = await fetch('/api/principal/admission-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nextAdmissionNumber: num }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      return;
    }
    setNextAdmissionNumber(data.nextAdmissionNumber);
  }

  async function addStudent() {
    if (!newStudentName.trim()) return;
    setAddingStudent(true);
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newStudentName.trim(), classId }),
    });
    const data = await res.json();
    setAddingStudent(false);
    if (!res.ok) {
      alert(data.error);
      return;
    }
    setNewStudentName('');
    setShowAddStudent(false);
    await loadStudents();
    await loadAdmissionCounter();
  }

  async function promoteClass() {
    if (!promoteToId) {
      alert('Choose a destination class');
      return;
    }
    if (!confirm(`Move every active student from this class into the selected class?`)) return;
    setPromoting(true);
    const res = await fetch('/api/principal/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromClassId: classId, toClassId: Number(promoteToId) }),
    });
    const data = await res.json();
    setPromoting(false);
    if (!res.ok) {
      alert(data.error);
      return;
    }
    alert(`Promoted ${data.promotedCount} student(s).`);
    setPromoteToId('');
    await loadStudents();
  }

  async function graduateClass() {
    if (!confirm('Mark every active student in this class as graduated? This removes them from active rosters.')) return;
    setGraduating(true);
    const res = await fetch('/api/principal/graduate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId }),
    });
    const data = await res.json();
    setGraduating(false);
    if (!res.ok) {
      alert(data.error);
      return;
    }
    alert(`Graduated ${data.graduatedCount} student(s).`);
    await loadStudents();
  }

  const otherClasses = classes.filter((c) => c.id !== classId);

  return (
    <div className="p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-base font-medium text-[#1A3C5E]">Student Management</h2>
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
          <p className="text-sm text-[#94A3B8] mb-4">No students in this class yet.</p>
        ) : (
          <div className="space-y-1 mb-4">
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                <span className="text-sm text-[#1E293B]">
                  <span className="text-xs text-[#94A3B8] mr-2">#{s.admission_number ?? '—'}</span>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Add Student */}
        <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
          {nextAdmissionNumber === 1 ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#64748B]">
                First time setup — continue your existing admission numbering from:
              </span>
              <input
                type="number"
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                placeholder="e.g. 6799"
                className="w-24 h-7 px-2 border border-[#CBD5E1] rounded-md text-xs"
              />
              <button onClick={saveAdmissionCounter} className="underline text-[#1A3C5E]">
                Set (one-time)
              </button>
            </div>
          ) : (
            <p className="text-xs text-[#64748B]">
              Next admission number: <span className="font-medium text-[#1A3C5E]">{nextAdmissionNumber ?? '...'}</span>
            </p>
          )}

          {!showAddStudent ? (
            <button
              onClick={() => setShowAddStudent(true)}
              className="text-xs px-3 h-8 border border-[#CBD5E1] rounded-md text-[#1A3C5E] hover:bg-[#F5F7FA]"
            >
              + Add New Student
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                placeholder="Student full name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addStudent()}
                className="flex-1 h-9 px-3 border border-[#CBD5E1] rounded-md text-sm"
                autoFocus
              />
              <button
                onClick={addStudent}
                disabled={addingStudent}
                className="px-4 h-9 bg-[#1A3C5E] text-white rounded-md text-sm font-medium disabled:opacity-60"
              >
                {addingStudent ? 'Adding...' : 'Add'}
              </button>
              <button
                onClick={() => { setShowAddStudent(false); setNewStudentName(''); }}
                className="px-3 h-9 text-sm text-[#64748B]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Promotion / Graduation */}
        <div className="border-t border-[#E2E8F0] pt-4 mt-4 space-y-3">
          <p className="text-xs font-medium text-[#475569]">End of Year: Promote or Graduate This Class</p>

          <div className="flex gap-2 items-center">
            <select
              value={promoteToId}
              onChange={(e) => setPromoteToId(e.target.value)}
              className="h-9 px-3 border border-[#CBD5E1] rounded-md text-sm"
            >
              <option value="">Promote to class...</option>
              {otherClasses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button
              onClick={promoteClass}
              disabled={promoting || !promoteToId}
              className="px-3 h-9 bg-[#1A3C5E] text-white rounded-md text-xs font-medium disabled:opacity-60"
            >
              {promoting ? 'Promoting...' : 'Promote Class'}
            </button>
          </div>

          <button
            onClick={graduateClass}
            disabled={graduating}
            className="px-3 h-9 border border-red-300 text-red-600 rounded-md text-xs font-medium hover:bg-red-50 disabled:opacity-60"
          >
            {graduating ? 'Graduating...' : 'Graduate This Class (Form 4 leavers)'}
          </button>
        </div>
      </div>
    </div>
  );
}