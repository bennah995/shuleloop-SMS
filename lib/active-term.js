import { pool } from './db';

// Returns the single active term row ({ id, name, year }) or throws
// if the principal hasn't set one yet — callers should surface that
// as a clear error rather than silently writing null term_id.
export async function getActiveTerm() {
  const { rows } = await pool.query(
    'SELECT id, name, year FROM terms WHERE is_active = TRUE LIMIT 1'
  );
  if (rows.length === 0) {
    const err = new Error('No active term set. Ask the principal to set one.');
    err.statusCode = 409;
    throw err;
  }
  return rows[0];
}