import { pool } from '../../../../lib/db';

export async function GET(request) {
  try {
    const schoolId = request.headers.get('x-school-id');
    const result = await pool.query('SELECT next_admission_number FROM schools WHERE id = $1', [schoolId]);
    return Response.json({ nextAdmissionNumber: result.rows[0]?.next_admission_number ?? 1 });
  } catch (err) {
    console.error('Admission settings fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const schoolId = request.headers.get('x-school-id');
    const { nextAdmissionNumber } = await request.json();

    const num = Number(nextAdmissionNumber);
    if (!Number.isInteger(num) || num < 1) {
      return Response.json({ error: 'nextAdmissionNumber must be a positive whole number' }, { status: 400 });
    }

    await pool.query('UPDATE schools SET next_admission_number = $1 WHERE id = $2', [num, schoolId]);
    return Response.json({ nextAdmissionNumber: num });
  } catch (err) {
    console.error('Admission settings save error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}