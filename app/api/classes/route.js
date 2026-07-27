import { pool } from '../../../lib/db';

export async function GET(request) {
  try {
    const schoolId = request.headers.get('x-school-id');

    const result = await pool.query(
      `SELECT id, name FROM classes WHERE school_id = $1 ORDER BY name`,
      [schoolId]
    );

    return Response.json({ classes: result.rows });
  } catch (err) {
    console.error('Classes fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}