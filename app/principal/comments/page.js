'use client';

import { useState, useEffect } from 'react';
import { useActiveTerm } from '../../hooks/useActiveTerm';

export default function PrincipalCommentsPage() {
  const term = useActiveTerm();
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [teacherComment, setTeacherComment] = useState('');
  const [principalComment, setPrincipalComment] = useState('');

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
    const res = await fetch(`/api/students?classId=${classId}`);
    const data = await res.json();
    setStudents(data.students || []);
    setSelectedStudent(null);
  }

  async function selectStudent(student) {
    setSelectedStudent(student);
    const res = await fetch(`/api/principal/comments?studentId=${student.id}&term=${encodeURIComponent(term)}`);
    const data = await res.json();
    setTeacherComment(data.teacher_comment || '');
    setPrincipalComment(data.principal_comment || '');
  }

  async function saveComment() {
    await fetch('/api/principal/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: selectedStudent.id, term, comment: principalComment }),
    });
    alert('Comment saved');
  }

  if (!term) return <div className="p-6 text-sm text-[#64748B]">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex gap-6 max-w-4xl">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 w-64 shrink-0">
          <select
            value={classId || ''}
            onChange={(e) => setClassId(Number(e.target.value))}
            className="w-full h-9 px-3 border border-[#CBD5E1] rounded-md text-sm mb-3"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="space-y-1">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => selectStudent(s)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                  selectedStudent?.id === s.id ? 'bg-[#1A3C5E] text-white' : 'text-[#1E293B] hover:bg-[#F5F7FA]'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {!selectedStudent ? (
            <div className="bg-white border border-dashed border-[#CBD5E1] rounded-lg p-10 text-center">
              <p className="text-sm text-[#94A3B8]">Select a student to add a comment.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
              <h3 className="text-base font-medium text-[#1A3C5E] mb-4">{selectedStudent.name} — {term}</h3>

              <div className="mb-4">
                <p className="text-xs font-medium text-[#475569] mb-1">Teacher's Comment</p>
                <p className="text-sm text-[#64748B] bg-[#F5F7FA] rounded-md p-3">
                  {teacherComment || '(no comment yet)'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-[#475569] mb-1">Your Comment</p>
                <textarea
                  value={principalComment}
                  onChange={(e) => setPrincipalComment(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-[#CBD5E1] rounded-md text-sm"
                  placeholder="Add your comment for this student's report card..."
                />
                <button
                  onClick={saveComment}
                  className="mt-2 px-4 h-9 bg-[#1A3C5E] text-white rounded-md text-sm font-medium"
                >
                  Save Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}