'use client';

import { useState, useEffect } from 'react';

const TABS = ['pending', 'active', 'suspended', 'rejected'];

export default function AdminSchoolsPage() {
  const [tab, setTab] = useState('pending');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempPasswordModal, setTempPasswordModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // { school, reason }
  const [suspendModal, setSuspendModal] = useState(null); // { school }
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadSchools();
  }, [tab]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  async function loadSchools() {
    setLoading(true);
    const res = await fetch(`/api/admin/schools?status=${tab}`);
    const data = await res.json();
    setSchools(data.schools || []);
    setLoading(false);
  }

  async function approve(school) {
    const res = await fetch(`/api/admin/schools/${school.id}/approve`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      setToast({ type: 'error', message: data.error });
      return;
    }
    if (data.tempPassword) {
      setTempPasswordModal({ schoolName: school.name, email: data.principalEmail, tempPassword: data.tempPassword });
    } else {
      setToast({ type: 'success', message: `${school.name} approved.` });
    }
    await loadSchools();
  }

  async function confirmReject() {
    const { school, reason } = rejectModal;
    const res = await fetch(`/api/admin/schools/${school.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    setRejectModal(null);
    if (!res.ok) {
      setToast({ type: 'error', message: data.error });
      return;
    }
    setToast({ type: 'success', message: `${school.name} rejected.` });
    await loadSchools();
  }

  async function confirmSuspend() {
    const { school } = suspendModal;
    await fetch(`/api/admin/schools/${school.id}/suspend`, { method: 'POST' });
    setSuspendModal(null);
    setToast({ type: 'success', message: `${school.name} suspended.` });
    await loadSchools();
  }

  async function reactivate(school) {
    await fetch(`/api/admin/schools/${school.id}/reactivate`, { method: 'POST' });
    setToast({ type: 'success', message: `${school.name} reactivated.` });
    await loadSchools();
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-white mb-4">Schools</h2>

      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 h-8 rounded-md text-xs font-medium capitalize ${
              tab === t ? 'bg-[#F0A500] text-[#1A3C5E]' : 'bg-[#1E293B] text-slate-400 border border-[#334155]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 max-w-3xl">
        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : schools.length === 0 ? (
          <p className="text-sm text-slate-400">No {tab} schools.</p>
        ) : (
          <div className="space-y-2">
            {schools.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-[#334155] last:border-0">
                <div>
                  <p className="text-sm text-white">{s.name}</p>
                  <p className="text-xs text-slate-400">
                    {s.subdomain ? `${s.subdomain}.shuleloop.ac.ke` : 'no subdomain'} · {s.contact_email}
                  </p>
                </div>
                <div className="flex gap-2">
                  {tab === 'pending' && (
                    <>
                      <button onClick={() => approve(s)} className="px-3 h-8 bg-green-600 text-white rounded-md text-xs font-medium">
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectModal({ school: s, reason: '' })}
                        className="px-3 h-8 bg-red-600 text-white rounded-md text-xs font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {tab === 'active' && (
                    <button
                      onClick={() => setSuspendModal({ school: s })}
                      className="px-3 h-8 border border-red-500 text-red-400 rounded-md text-xs font-medium"
                    >
                      Suspend
                    </button>
                  )}
                  {tab === 'suspended' && (
                    <button onClick={() => reactivate(s)} className="px-3 h-8 bg-green-600 text-white rounded-md text-xs font-medium">
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject modal — replaces window.prompt() */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-base font-medium text-white mb-2">Reject {rejectModal.school.name}</h3>
            <p className="text-sm text-slate-400 mb-3">Reason (optional, shown to the applicant):</p>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              rows={3}
              className="w-full p-2 bg-[#0F172A] border border-[#334155] rounded-md text-sm text-white mb-4"
              placeholder="e.g. Missing required information"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={confirmReject} className="flex-1 h-9 bg-red-600 text-white rounded-md text-sm font-medium">
                Confirm Reject
              </button>
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 h-9 border border-[#334155] text-slate-300 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend confirmation modal — replaces window.confirm() */}
      {suspendModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-base font-medium text-white mb-2">Suspend {suspendModal.school.name}?</h3>
            <p className="text-sm text-slate-400 mb-4">
              Their staff and principal will be unable to log in until reactivated.
            </p>
            <div className="flex gap-2">
              <button onClick={confirmSuspend} className="flex-1 h-9 bg-red-600 text-white rounded-md text-sm font-medium">
                Confirm Suspend
              </button>
              <button
                onClick={() => setSuspendModal(null)}
                className="flex-1 h-9 border border-[#334155] text-slate-300 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Temp password reveal */}
      {tempPasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-base font-medium text-white mb-2">{tempPasswordModal.schoolName} approved</h3>
            <p className="text-sm text-slate-400 mb-4">Share these credentials with the school's principal.</p>
            <div className="bg-[#0F172A] rounded-md p-3 mb-4 space-y-1">
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm font-medium text-white">{tempPasswordModal.email}</p>
              <p className="text-xs text-slate-400 mt-2">Temporary Password</p>
              <p className="text-sm font-mono font-medium text-[#F0A500]">{tempPasswordModal.tempPassword}</p>
            </div>
            <button
              onClick={() => setTempPasswordModal(null)}
              className="w-full h-9 bg-[#F0A500] text-[#1A3C5E] rounded-md text-sm font-medium"
            >
              I've copied it — Close
            </button>
          </div>
        </div>
      )}

      {/* Toast — for simple confirmations/errors */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-md text-sm font-medium shadow-lg ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}