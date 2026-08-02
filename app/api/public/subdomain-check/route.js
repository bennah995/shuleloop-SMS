import { pool } from '../../../../lib/db';
import { isValidSubdomain, slugify, generateSuggestions, RESERVED } from '../../../../lib/subdomain';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = searchParams.get('value') || '';
    const value = slugify(raw);

    if (!value || !isValidSubdomain(value)) {
      return Response.json({
        available: false,
        error: 'Use lowercase letters, numbers, and hyphens only (3-63 chars)',
        suggestions: generateSuggestions(raw),
      });
    }

    if (RESERVED.has(value)) {
      return Response.json({
        available: false,
        error: 'That subdomain is reserved',
        suggestions: generateSuggestions(raw),
      });
    }

    const existing = await pool.query('SELECT id FROM schools WHERE subdomain = $1', [value]);
    if (existing.rows.length > 0) {
      const candidates = generateSuggestions(raw);
      const takenRes = await pool.query('SELECT subdomain FROM schools WHERE subdomain = ANY($1)', [candidates]);
      const taken = new Set(takenRes.rows.map((r) => r.subdomain));
      const suggestions = candidates.filter((c) => !taken.has(c) && !RESERVED.has(c));
      return Response.json({ available: false, error: 'That subdomain is already taken', suggestions });
    }

    return Response.json({ available: true, value });
  } catch (err) {
    console.error('Subdomain check error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}