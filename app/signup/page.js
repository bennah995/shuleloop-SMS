'use client';

import { useState, useEffect } from 'react';

export default function SignupPage() {
  const [schoolName, setSchoolName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [brandColor, setBrandColor] = useState('#1A3C5E');
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!subdomain) {
      setAvailability(null);
      return;
    }
    const t = setTimeout(checkAvailability, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain]);

  async function checkAvailability() {
    setChecking(true);
    const res = await fetch(`/api/public/subdomain-check?value=${encodeURIComponent(subdomain)}`);
    const data = await res.json();
    setAvailability(data);
    setChecking(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!availability?.available) {
      setError('Please choose an available subdomain first');
      return;
    }
    setSubmitting(true);
    const res = await fetch('/api/public/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolName, contactName, contactEmail, subdomain, brandColor }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-medium text-[#1A3C5E] mb-2">Application received</h1>
          <p className="text-sm text-[#64748B]">
            We'll review your school's application and get back to you at the email you provided. Once
            approved, your school will go live at {subdomain}.shuleloop.ac.ke.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-lg p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-[#F0A500] rounded-md flex items-center justify-center text-[#1A3C5E] font-bold text-sm">
            S
          </div>
          <span className="text-lg font-medium text-[#1A3C5E]">ShuleLoop</span>
        </div>
        <p className="text-sm text-[#64748B] mb-6">Bring your school onto ShuleLoop</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">School name</label>
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
              className="w-full h-10 px-3 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">Your name (principal/director)</label>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className="w-full h-10 px-3 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">Your email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              className="w-full h-10 px-3 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">Preferred subdomain</label>
            <div className="flex items-center gap-2">
              <input
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                required
                className="flex-1 h-10 px-3 border border-[#CBD5E1] rounded-md text-sm text-[#1E293B]"
                placeholder="greenwood"
              />
              <span className="text-sm text-[#64748B]">.shuleloop.ac.ke</span>
            </div>
            {checking && <p className="text-xs text-[#94A3B8] mt-1">Checking availability...</p>}
            {!checking && availability && availability.available && (
              <p className="text-xs text-green-600 mt-1">✓ Available</p>
            )}
            {!checking && availability && !availability.available && (
              <div className="text-xs text-red-600 mt-1">
                {availability.error}
                {availability.suggestions?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {availability.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSubdomain(s)}
                        className="px-2 py-0.5 bg-[#F5F7FA] border border-[#CBD5E1] rounded text-[#1A3C5E]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">Brand color</label>
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-10 w-16 border border-[#CBD5E1] rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 bg-[#1A3C5E] text-white rounded-md text-sm font-medium disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}