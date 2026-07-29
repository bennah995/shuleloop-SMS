import { pool } from '../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT id, name, category FROM subjects ORDER BY category, name');
    return Response.json({ subjects: result.rows });
  } catch (err) {
    console.error('Subjects fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}