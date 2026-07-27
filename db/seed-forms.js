require('dotenv').config({ path: '.env.local' });
const { pool } = require('../lib/db');

const CLASS_STUDENTS = {
  'Form 1': ['Peter Kamau', 'Grace Njeri', 'Samuel Odhiambo', 'Mercy Chebet'],
  'Form 2': ['David Mutua', 'Esther Wambui', 'Collins Omondi', 'Ruth Nyambura'],
  'Form 3': ['James Kariuki', 'Sarah Adhiambo', 'Michael Kiprono', 'Ann Wairimu'],
  'Form 4': ['Joseph Njoroge', 'Diana Akinyi', 'Patrick Mwangi', 'Lilian Chepkoech'],
};

async function seed() {
  try {
    const schoolRes = await pool.query(`SELECT id FROM schools WHERE name = $1`, ['Maono School']);
    const schoolId = schoolRes.rows[0].id;

    const teacherRes = await pool.query(`SELECT id FROM users WHERE email = $1`, ['teacher@maono.school']);
    const teacherId = teacherRes.rows[0].id;

    for (const [className, students] of Object.entries(CLASS_STUDENTS)) {
      const existing = await pool.query(`SELECT id FROM classes WHERE name = $1 AND school_id = $2`, [className, schoolId]);
      if (existing.rows.length > 0) {
        console.log(`${className} already exists, skipping`);
        continue;
      }

      const classRes = await pool.query(
        `INSERT INTO classes (school_id, teacher_id, name) VALUES ($1, $2, $3) RETURNING id`,
        [schoolId, teacherId, className]
      );
      const classId = classRes.rows[0].id;
      console.log(`Created ${className}: classId ${classId}`);

      for (const name of students) {
        await pool.query(
          `INSERT INTO students (school_id, class_id, name) VALUES ($1, $2, $3)`,
          [schoolId, classId, name]
        );
      }
      console.log(`  Added ${students.length} students`);
    }

    console.log('\nDone.');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    pool.end();
  }
}

seed();