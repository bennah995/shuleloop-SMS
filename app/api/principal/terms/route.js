import { pool } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { name, year } = await request.json();

    if (!name || !year) {
      return Response.json({ error: 'name and year are required' }, { status: 400 });
    }
    if (!['Term 1', 'Term 2', 'Term 3'].includes(name)) {
      return Response.json({ error: 'name must be "Term 1", "Term 2", or "Term 3"' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO terms (name, year, is_active)
       VALUES ($1, $2, false)
       ON CONFLICT (name, year) DO NOTHING
       RETURNING id, name, year, is_active`,
      [name, year]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'That term already exists' }, { status: 400 });
    }

    return Response.json({ term: result.rows[0] });
  } catch (err) {
    console.error('Term create error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}