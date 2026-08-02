import { pool } from '../../../../../../lib/db';
import bcrypt from 'bcrypt';
import { generateTempPassword } from '../../../../../../lib/temp-password';

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const schoolRes = await pool.query(
      'SELECT id, name, contact_name, contact_email, status FROM schools WHERE id = $1',
      [id]
    );
    if (schoolRes.rows.length === 0) return Response.json({ error: 'School not found' }, { status: 404 });
    const school = schoolRes.rows[0];

    if (school.status === 'active') {
      return Response.json({ error: 'School is already active' }, { status: 400 });
    }
    if (!school.contact_email) {
      return Response.json({ error: 'School has no contact email on file' }, { status: 400 });
    }

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [school.contact_email]);
    let tempPassword = null;

    if (existingUser.rows.length === 0) {
      tempPassword = generateTempPassword();
      const passwordHash = await bcrypt.hash(tempPassword, 10);
      await pool.query(
        `INSERT INTO users (school_id, name, email, password_hash, role, is_active, must_change_password)
         VALUES ($1, $2, $3, $4, 'principal', TRUE, TRUE)`,
        [id, school.contact_name || school.name, school.contact_email, passwordHash]
      );
    }

    await pool.query("UPDATE schools SET status = 'active' WHERE id = $1", [id]);

    return Response.json({
      school: { id: school.id, name: school.name, status: 'active' },
      principalEmail: school.contact_email,
      tempPassword,
    });
  } catch (err) {
    console.error('Approve school error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}