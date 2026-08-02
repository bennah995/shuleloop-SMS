import { pool } from '../../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const result = status
      ? await pool.query(
          `SELECT id, name, subdomain, custom_domain, logo_url, brand_color, status,
                  contact_name, contact_email, created_at
           FROM schools WHERE status = $1 ORDER BY created_at DESC`,
          [status]
        )
      : await pool.query(
          `SELECT id, name, subdomain, custom_domain, logo_url, brand_color, status,
                  contact_name, contact_email, created_at
           FROM schools ORDER BY created_at DESC`
        );

    return Response.json({ schools: result.rows });
  } catch (err) {
    console.error('Admin schools fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}