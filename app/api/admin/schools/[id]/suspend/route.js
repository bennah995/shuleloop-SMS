import { pool } from '../../../../../../lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const result = await pool.query(
      "UPDATE schools SET status = 'suspended' WHERE id = $1 RETURNING id, name, status",
      [id]
    );
    if (result.rows.length === 0) return Response.json({ error: 'School not found' }, { status: 404 });
    return Response.json({ school: result.rows[0] });
  } catch (err) {
    console.error('Suspend school error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}