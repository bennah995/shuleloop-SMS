require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcrypt');
const { pool } = require('../lib/db');

async function seed() {
  try {
    // 1. Create a school
    const schoolRes = await pool.query(
      `INSERT INTO schools (name) VALUES ($1) RETURNING id`,
      ['Maono School']
    );
    const schoolId = schoolRes.rows[0].id;
    console.log('Created school:', schoolId);

    // 2. Hash passwords
    const principalPassword = await bcrypt.hash('principal123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);

    // 3. Create principal
    const principalRes = await pool.query(
      `INSERT INTO users (school_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [schoolId, 'Jane Principal', 'principal@maono.school', principalPassword, 'principal']
    );
    console.log('Created principal:', principalRes.rows[0].id);

    // 4. Create teacher
    const teacherRes = await pool.query(
      `INSERT INTO users (school_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [schoolId, 'John Teacher', 'teacher@maono.school', teacherPassword, 'teacher']
    );
    console.log('Created teacher:', teacherRes.rows[0].id);

    console.log('\nSeed complete. Login credentials:');
    console.log('Principal: principal@maono.school / principal123');
    console.log('Teacher:   teacher@maono.school / teacher123');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    pool.end();
  }
}

seed();