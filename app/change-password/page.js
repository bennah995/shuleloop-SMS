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

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
      <div className="w-full max-w-sm bg-white border border-[#E2E8F0] rounded-lg p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-[#F0A500] rounded-md flex items-center justify-center text-[#1A3C5E] font-bold text-sm">
            S
          </div>
          <span className="text-lg font-medium text-[#1A3C5E]">ShuleLoop</span>
        </div>
        <p className="text-sm text-[#64748B] mb-6">
          For security, set a new password before continuing.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            className="w-full h-10 bg-[#1A3C5E] text-white rounded-md text-sm font-medium hover:bg-[#15324f] disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}