'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      if (data.user.role === 'principal') {
        router.push('/principal');
      } else {
        router.push('/teacher');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
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
        <p className="text-sm text-[#64748B] mb-6">Sign in to continue</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#475569] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] outline-none focus:border-[#1A3C5E]"
              placeholder="you@school.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-[#475569] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-10 px-3 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B] outline-none focus:border-[#1A3C5E]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[#1A3C5E] text-white rounded-md text-sm font-medium hover:bg-[#15324f] disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}