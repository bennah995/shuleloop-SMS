import { pool } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const classId = searchParams.get('classId');

    if (id) {
      const result = await pool.query('SELECT id, name, class_id FROM students WHERE id = $1', [id]);
      if (result.rows.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });
      return Response.json({ student: result.rows[0] });
    }

    if (classId) {
      const result = await pool.query(
        'SELECT id, name FROM students WHERE class_id = $1 ORDER BY name',
        [classId]
      );
      return Response.json({ students: result.rows });
    }

    return Response.json({ error: 'id or classId is required' }, { status: 400 });
  } catch (err) {
    console.error('Students fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}