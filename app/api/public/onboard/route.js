import { pool } from '../../../../lib/db';
import { isValidSubdomain, slugify, RESERVED } from '../../../../lib/subdomain';

export async function POST(request) {
  try {
    const { schoolName, contactName, contactEmail, subdomain, brandColor } = await request.json();

    if (!schoolName || !contactName || !contactEmail || !subdomain) {
      return Response.json(
        { error: 'schoolName, contactName, contactEmail, and subdomain are required' },
        { status: 400 }
      );
    }

    const cleanSubdomain = slugify(subdomain);
    if (!isValidSubdomain(cleanSubdomain) || RESERVED.has(cleanSubdomain)) {
      return Response.json({ error: 'Invalid or reserved subdomain' }, { status: 400 });
    }

    const existing = await pool.query('SELECT id FROM schools WHERE subdomain = $1', [cleanSubdomain]);
    if (existing.rows.length > 0) {
      return Response.json({ error: 'That subdomain was just taken, please choose another' }, { status: 409 });
    }

    const result = await pool.query(
      `INSERT INTO schools (name, subdomain, brand_color, contact_name, contact_email, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id, name, subdomain, status`,
      [schoolName.trim(), cleanSubdomain, brandColor || '#1A3C5E', contactName.trim(), contactEmail.trim().toLowerCase()]
    );

    return Response.json({ school: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Onboard error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}