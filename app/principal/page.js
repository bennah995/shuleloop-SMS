'use client';

import { useState, useEffect } from 'react';

export default function PrincipalDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/principal/dashboard')
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6 text-sm text-[#64748B]">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-[#1A3C5E] mb-4">Dashboard</h2>

      <div className="grid grid-cols-4 gap-4 max-w-3xl mb-6">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-2xl font-medium text-[#1A3C5E]">{data.totalStudents}</p>
          <p className="text-xs text-[#64748B]">Total Students</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-2xl font-medium text-[#1A3C5E]">{data.totalTeachers}</p>
          <p className="text-xs text-[#64748B]">Total Teachers</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-2xl font-medium text-green-600">{data.presentToday}</p>
          <p className="text-xs text-[#64748B]">Present Today</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
          <p className="text-2xl font-medium text-red-600">{data.absentToday}</p>
          <p className="text-xs text-[#64748B]">Absent Today</p>
        </div>
      </div>

      {!data.attendanceTakenToday ? (
        <p className="text-sm text-[#94A3B8]">No attendance has been recorded for any class today yet.</p>
      ) : data.mostAbsencesClass ? (
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 max-w-md">
          <p className="text-sm text-[#64748B]">
            Most absences today:{' '}
            <span className="font-medium text-[#1A3C5E]">{data.mostAbsencesClass.className}</span>
            {' '}({data.mostAbsencesClass.absentCount} absent)
          </p>
        </div>
      ) : null}
    </div>
  );
}