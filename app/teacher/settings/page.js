'use client';

import { useState } from 'react';

function EyeToggle({ show, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-[#94A3B8] hover:text-[#1A3C5E]"
      aria-label={show ? 'Hide password' : 'Show password'}
      tabIndex={-1}
    >
      {show ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

export default function SettingsPage() {
  const [expanded, setExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-lg max-w-sm overflow-hidden">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-left"
        >
          <span className="text-sm font-medium text-[#1A3C5E]">Change Password</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className={`text-[#94A3B8] transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {expanded && (
          <div className="px-6 pb-6 border-t border-[#F1F5F9] pt-4">
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                Password updated.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-medium text-[#475569] mb-1.5">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full h-10 pl-3 pr-10 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] outline-none focus:border-[#1A3C5E]"
                  />
                  <EyeToggle show={showCurrent} onClick={() => setShowCurrent((v) => !v)} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-[#475569] mb-1.5">New password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full h-10 pl-3 pr-10 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] outline-none focus:border-[#1A3C5E]"
                  />
                  <EyeToggle show={showNew} onClick={() => setShowNew((v) => !v)} />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-medium text-[#475569] mb-1.5">Confirm new password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-10 pl-3 pr-10 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] outline-none focus:border-[#1A3C5E]"
                  />
                  <EyeToggle show={showConfirm} onClick={() => setShowConfirm((v) => !v)} />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-10 px-5 bg-[#1A3C5E] text-white rounded-md text-sm font-medium hover:bg-[#15324f] disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}