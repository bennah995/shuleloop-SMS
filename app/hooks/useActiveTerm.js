'use client';

import { useState, useEffect } from 'react';

export function useActiveTerm() {
  const [term, setTerm] = useState(null);

  useEffect(() => {
    fetch('/api/terms/active')
      .then((res) => res.json())
      .then((data) => setTerm(data.term?.name || null));
  }, []);

  return term;
}