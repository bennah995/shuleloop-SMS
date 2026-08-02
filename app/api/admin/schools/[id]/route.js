import { pool } from '../../../../../lib/db';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { name, subdomain, brandColor, logoUrl } = await request.json();

    const result = await pool.query(
      `UPDATE schools SET
         name = COALESCE($1, name),
         subdomain = COALESCE($2, subdomain),
         brand_color = COALESCE($3, brand_color),
         logo_url = COALESCE($4, logo_url)
       WHERE id = $5
       RETURNING id, name, subdomain, brand_color, logo_url, status`,
      [name || null, subdomain || null, brandColor || null, logoUrl || null, id]
    );

    if (result.rows.length === 0) return Response.json({ error: 'School not found' }, { status: 404 });
    return Response.json({ school: result.rows[0] });
  } catch (err) {
    console.error('Admin school update error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}