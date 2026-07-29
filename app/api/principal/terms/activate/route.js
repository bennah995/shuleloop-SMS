import { pool } from '../../../../../lib/db';

export async function POST(request) {
  try {
    const { termId } = await request.json();

    if (!termId) {
      return Response.json({ error: 'termId is required' }, { status: 400 });
    }

    await pool.query('UPDATE terms SET is_active = false WHERE is_active = true');
    const result = await pool.query(
      'UPDATE terms SET is_active = true WHERE id = $1 RETURNING id, name, year, is_active',
      [termId]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'Term not found' }, { status: 404 });
    }

    return Response.json({ term: result.rows[0] });
  } catch (err) {
    console.error('Term activate error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}