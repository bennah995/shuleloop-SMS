require('dotenv').config({ path: '.env.local' });
const { pool } = require('../lib/db');

async function seed() {
  try {
    const schoolRes = await pool.query(`SELECT id FROM schools WHERE name = $1`, ['Maono School']);
    if (schoolRes.rows.length === 0) {
      console.error('No school found — run db/seed.js first.');
      return;
    }
    const schoolId = schoolRes.rows[0].id;

    const teacherRes = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      ['teacher@maono.school']
    );
    const teacherId = teacherRes.rows[0].id;

    const classRes = await pool.query(
      `INSERT INTO classes (school_id, teacher_id, name) VALUES ($1, $2, $3) RETURNING id`,
      [schoolId, teacherId, 'Grade 5 Blue']
    );
    const classId = classRes.rows[0].id;
    console.log('Created class:', classId);

    const studentNames = ['Amina Otieno', 'Brian Kiptoo', 'Faith Wanjiru', 'Kevin Mwangi', 'Lucy Achieng'];
    for (const name of studentNames) {
      const res = await pool.query(
        `INSERT INTO students (school_id, class_id, name) VALUES ($1, $2, $3) RETURNING id`,
        [schoolId, classId, name]
      );
      console.log('Created student:', res.rows[0].id, name);
    }

    console.log('\nDone. classId =', classId, '— use this in attendance/grading tests.');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    pool.end();
  }
}

seed();