'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6 text-sm text-slate-400">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-white mb-4">Platform Dashboard</h2>
      <div className="grid grid-cols-4 gap-4 max-w-3xl mb-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-2xl font-medium text-[#F0A500]">{data.schools.active}</p>
          <p className="text-xs text-slate-400">Active Schools</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-2xl font-medium text-white">{data.schools.pending}</p>
          <p className="text-xs text-slate-400">Pending Approval</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-2xl font-medium text-white">{data.totalActiveStudents}</p>
          <p className="text-xs text-slate-400">Total Students</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-2xl font-medium text-white">{data.totalActiveTeachers}</p>
          <p className="text-xs text-slate-400">Total Teachers</p>
        </div>
      </div>
      <div className="flex gap-4 text-xs text-slate-400">
        <span>Suspended: {data.schools.suspended}</span>
        <span>Rejected: {data.schools.rejected}</span>
        <span>Active: {data.schools.active}</span>
        {/* <span>Requested: {data.schools.requested}</span> */}
      </div>
    </div>
  );
}