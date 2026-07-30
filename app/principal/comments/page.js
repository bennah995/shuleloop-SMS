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
  const [gradeRows, setGradeRows] = useState([]);
  const [average, setAverage] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

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
    setLoadingResults(true);

    const [commentsRes, gradesRes] = await Promise.all([
      fetch(`/api/principal/comments?studentId=${student.id}&term=${encodeURIComponent(term)}`),
      fetch(`/api/teacher/grades?studentId=${student.id}&term=${encodeURIComponent(term)}`),
    ]);
    const commentsData = await commentsRes.json();
    const gradesData = await gradesRes.json();

    setTeacherComment(commentsData.teacher_comment || '');
    setPrincipalComment(commentsData.principal_comment || '');
    setGradeRows(gradesData.subjects || []);
    setAverage(gradesData.average);
    setLoadingResults(false);
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
      <div className="flex gap-6 max-w-5xl">
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
                <span className={`text-xs mr-1 ${selectedStudent?.id === s.id ? 'text-white/60' : 'text-[#94A3B8]'}`}>
                  #{s.admission_number ?? '—'}
                </span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {!selectedStudent ? (
            <div className="bg-white border border-dashed border-[#CBD5E1] rounded-lg p-10 text-center">
              <p className="text-sm text-[#94A3B8]">Select a student to see their results and add a comment.</p>
            </div>
          ) : loadingResults ? (
            <p className="text-sm text-[#64748B]">Loading...</p>
          ) : (
            <>
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
                <h3 className="text-base font-medium text-[#1A3C5E] mb-4">
                  {selectedStudent.name} — {term}
                </h3>

                {gradeRows.length === 0 ? (
                  <p className="text-sm text-[#94A3B8] mb-2">No subjects registered yet for this student.</p>
                ) : (
                  <table className="w-full text-sm mb-3">
                    <thead>
                      <tr className="text-left text-xs text-[#94A3B8] border-b border-[#E2E8F0]">
                        <th className="pb-2 font-medium">Subject</th>
                        <th className="pb-2 font-medium w-20">Mark</th>
                        <th className="pb-2 font-medium w-20">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradeRows.map((row) => (
                        <tr key={row.subject_id} className="border-b border-[#F1F5F9] last:border-0">
                          <td className="py-1.5 text-[#1E293B]">{row.subject_name}</td>
                          <td className="py-1.5 text-[#1E293B]">{row.score ?? '-'}</td>
                          <td className="py-1.5 text-[#1E293B]">{row.grade || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {gradeRows.length > 0 && (
                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-sm font-medium text-[#1A3C5E]">
                    <span>Average</span>
                    <span>{average !== null && average !== undefined ? average.toFixed(1) : '-'}</span>
                  </div>
                )}
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}