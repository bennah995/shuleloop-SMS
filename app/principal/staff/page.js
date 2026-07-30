'use client';

import { useState, useEffect } from 'react';

export default function StaffPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tempPasswordModal, setTempPasswordModal] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    setLoading(true);
    const res = await fetch('/api/principal/teachers');
    const data = await res.json();
    setTeachers(data.teachers || []);
    setLoading(false);
  }

  async function addTeacher() {
    if (!name || !email) {
      alert('Name and email are required');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/principal/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      alert(data.error);
      return;
    }
    setTempPasswordModal({ name: data.teacher.name, email: data.teacher.email, tempPassword: data.tempPassword });
    setName('');
    setEmail('');
    setShowAddForm(false);
    await loadTeachers();
  }

  async function toggleActive(teacher) {
    await fetch(`/api/principal/teachers/${teacher.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !teacher.is_active }),
    });
    await loadTeachers();
  }

  return (
    <div className="p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-[#1A3C5E]">Staff</h2>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="px-3 h-9 bg-[#1A3C5E] text-white rounded-md text-xs font-medium"
          >
            + Add Teacher
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 bg-[#F5F7FA] rounded-md space-y-2">
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 border border-[#CBD5E1] rounded-md text-sm"
            />
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-9 px-3 border border-[#CBD5E1] rounded-md text-sm"
            />
            <button
              onClick={addTeacher}
              disabled={saving}
              className="px-4 h-9 bg-[#1A3C5E] text-white rounded-md text-sm font-medium disabled:opacity-60"
            >
              {saving ? 'Creating...' : 'Create Teacher'}
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-[#64748B]">Loading...</p>
        ) : (
          <div className="space-y-2">
            {teachers.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                <div>
                  <p className="text-sm text-[#1E293B]">{t.name}</p>
                  <p className="text-xs text-[#94A3B8]">{t.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                      t.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {t.is_active ? 'Active' : 'Deactivated'}
                  </span>
                  <button
                    onClick={() => toggleActive(t)}
                    className="text-xs px-2 py-1 border border-[#CBD5E1] rounded-md text-[#64748B] hover:bg-[#F5F7FA]"
                  >
                    {t.is_active ? 'Deactivate' : 'Reactivate'}
                  </button>
                </div>
              </div>
            ))}
            {teachers.length === 0 && <p className="text-sm text-[#94A3B8]">No teachers yet.</p>}
          </div>
        )}
      </div>

      {tempPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-base font-medium text-[#1A3C5E] mb-2">Teacher account created</h3>
            <p className="text-sm text-[#64748B] mb-4">
              Share these credentials with {tempPasswordModal.name}. This password will not be shown again.
            </p>
            <div className="bg-[#F5F7FA] rounded-md p-3 mb-4 space-y-1">
              <p className="text-xs text-[#64748B]">Email</p>
              <p className="text-sm font-medium text-[#1E293B]">{tempPasswordModal.email}</p>
              <p className="text-xs text-[#64748B] mt-2">Temporary Password</p>
              <p className="text-sm font-mono font-medium text-[#1E293B]">{tempPasswordModal.tempPassword}</p>
            </div>
            <button
              onClick={() => setTempPasswordModal(null)}
              className="w-full h-9 bg-[#1A3C5E] text-white rounded-md text-sm font-medium"
            >
              I've copied it — Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}