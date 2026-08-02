import { pool } from '../../../../lib/db';

export async function GET() {
  try {
    const [schoolCounts, studentCount, teacherCount] = await Promise.all([
      pool.query('SELECT status, COUNT(*) FROM schools GROUP BY status'),
      pool.query("SELECT COUNT(*) FROM students WHERE status = 'active'"),
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'teacher' AND is_active = TRUE"),
    ]);

    const counts = { pending: 0, active: 0, suspended: 0, rejected: 0 };
    schoolCounts.rows.forEach((r) => {
      counts[r.status] = Number(r.count);
    });

    return Response.json({
      schools: counts,
      totalActiveStudents: Number(studentCount.rows[0].count),
      totalActiveTeachers: Number(teacherCount.rows[0].count),
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}