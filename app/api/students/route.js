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
        "SELECT id, name FROM students WHERE class_id = $1 AND status = 'active' ORDER BY name",
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

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'principal') {
      return Response.json({ error: 'Only the principal can add students' }, { status: 403 });
    }

    const schoolId = request.headers.get('x-school-id');
    const { name, classId } = await request.json();

    if (!name || !classId) {
      return Response.json({ error: 'name and classId are required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO students (school_id, class_id, name, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING id, name, class_id`,
      [schoolId, classId, name.trim()]
    );

    return Response.json({ student: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Student create error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}