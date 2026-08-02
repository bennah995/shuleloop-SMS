'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-4.13 5.71M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Login failed');
      return;
    }
    router.push('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
      <div className="w-full max-w-sm bg-[#1E293B] border border-[#334155] rounded-lg p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-[#F0A500] rounded-md flex items-center justify-center text-[#1A3C5E] font-bold text-sm">
            S
          </div>
          <span className="text-lg font-medium text-white">ShuleLoop Console</span>
        </div>
        <p className="text-sm text-slate-400 mb-6">Digistar Tech internal admin</p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-950 border border-red-800 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 border border-[#334155] bg-[#0F172A] rounded-md text-sm text-white outline-none focus:border-[#F0A500]"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-10 px-3 border border-[#334155] bg-[#0F172A] rounded-md text-sm text-white outline-none focus:border-[#F0A500]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[#F0A500] text-[#1A3C5E] rounded-md text-sm font-medium disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}