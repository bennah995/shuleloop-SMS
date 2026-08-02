import { pool } from '../../../lib/db';

export async function GET(request) {
  try {
    const schoolId = request.headers.get('x-school-id');
    const result = await pool.query(
      'SELECT id, name FROM classes WHERE school_id = $1 ORDER BY name',
      [schoolId]
    );
    return Response.json({ classes: result.rows });
  } catch (err) {
    console.error('Classes fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'principal') {
      return Response.json({ error: 'Only the principal can add classes' }, { status: 403 });
    }

    const schoolId = request.headers.get('x-school-id');
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return Response.json({ error: 'name is required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO classes (school_id, name) VALUES ($1, $2) RETURNING id, name`,
      [schoolId, name.trim()]
    );

    return Response.json({ class: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Class create error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}