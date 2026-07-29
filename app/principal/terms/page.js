'use client';

import { useState, useEffect } from 'react';

export default function TermsPage() {
  const [terms, setTerms] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [termName, setTermName] = useState('Term 1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  async function loadTerms() {
    setLoading(true);
    const res = await fetch('/api/terms');
    const data = await res.json();
    setTerms(data.terms || []);
    setLoading(false);
  }

  async function createTerm() {
    const res = await fetch('/api/principal/terms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: termName, year: Number(year) }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
    } else {
      await loadTerms();
    }
  }

  async function activateTerm(termId) {
    await fetch('/api/principal/terms/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ termId }),
    });
    await loadTerms();
  }

  return (
    <div className="p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 max-w-lg">
        <h2 className="text-base font-medium text-[#1A3C5E] mb-4">Terms</h2>

        {loading ? (
          <p className="text-sm text-[#64748B]">Loading...</p>
        ) : (
          <div className="space-y-2 mb-6">
            {terms.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                <span className="text-sm text-[#1E293B]">{t.name}</span>
                {t.is_active ? (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md font-medium">Active</span>
                ) : (
                  <button
                    onClick={() => activateTerm(t.id)}
                    className="text-xs px-2 py-1 border border-[#CBD5E1] rounded-md text-[#64748B] hover:bg-[#F5F7FA]"
                  >
                    Set Active
                  </button>
                )}
              </div>
            ))}
            {terms.length === 0 && <p className="text-sm text-[#94A3B8]">No terms yet.</p>}
          </div>
        )}

        <div className="border-t border-[#E2E8F0] pt-4">
          <p className="text-xs font-medium text-[#475569] mb-2">Add a New Term</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-24 h-9 px-2 border border-[#CBD5E1] rounded-md text-sm"
              placeholder="Year"
            />
            <select
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
              className="h-9 px-2 border border-[#CBD5E1] rounded-md text-sm"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
            <button
              onClick={createTerm}
              className="h-9 px-4 bg-[#1A3C5E] text-white rounded-md text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}