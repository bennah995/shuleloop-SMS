require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcrypt');
const { pool } = require('../lib/db');

// EDIT THESE before running:
const EMAIL = 'you@digistartech.co.ke';
const PASSWORD = 'ChangeMe123!';
const NAME = 'Bennah';

async function seed() {
  try {
    const existing = await pool.query('SELECT id FROM platform_admins WHERE email = $1', [EMAIL]);
    if (existing.rows.length > 0) {
      console.log('Platform admin already exists, skipping');
      return;
    }
    const hash = await bcrypt.hash(PASSWORD, 10);
    const res = await pool.query(
      'INSERT INTO platform_admins (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [NAME, EMAIL, hash]
    );
    console.log(`Created platform admin id=${res.rows[0].id}`);
    console.log(`Login: ${EMAIL} / ${PASSWORD}`);
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    pool.end();
  }
}

seed();