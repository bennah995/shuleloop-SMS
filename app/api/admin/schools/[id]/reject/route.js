import { pool } from '../../../../../../lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { reason } = await request.json();

    const result = await pool.query(
      "UPDATE schools SET status = 'rejected', rejection_reason = $1 WHERE id = $2 RETURNING id, name, status",
      [reason || null, id]
    );
    if (result.rows.length === 0) return Response.json({ error: 'School not found' }, { status: 404 });
    return Response.json({ school: result.rows[0] });
  } catch (err) {
    console.error('Reject school error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}