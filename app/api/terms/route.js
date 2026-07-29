import { pool } from '../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name, year, is_active FROM terms ORDER BY year DESC, name DESC'
    );
    const terms = result.rows.map((t) => ({ ...t, name: `${t.name} ${t.year}` }));
    return Response.json({ terms });
  } catch (err) {
    console.error('Terms fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}