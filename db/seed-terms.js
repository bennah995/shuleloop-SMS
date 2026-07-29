require('dotenv').config({ path: '.env.local' });
const { pool } = require('../lib/db');

async function seed() {
  try {
    const schoolRes = await pool.query('SELECT id FROM schools WHERE name = $1', ['Maono School']);
    const schoolId = schoolRes.rows[0].id;

    const existing = await pool.query('SELECT id FROM terms WHERE school_id = $1', [schoolId]);
    if (existing.rows.length > 0) {
      console.log('Terms already seeded, skipping');
      return;
    }

    await pool.query(
      `INSERT INTO terms (school_id, name, year, term_number, is_active) VALUES ($1, $2, $3, $4, $5)`,
      [schoolId, 'Term 2 2026', 2026, 2, true]
    );
    console.log('Seeded active term: Term 2 2026');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    pool.end();
  }
}

seed();