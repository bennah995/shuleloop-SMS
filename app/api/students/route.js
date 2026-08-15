import { pool } from '../../../lib/db';

const VALID_RELATIONSHIPS = ['mother', 'father', 'guardian', 'other'];

function fullName(first, middle, last) {
  return [first, middle, last].filter((p) => p && p.trim()).join(' ').trim();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const classId = searchParams.get('classId');

    if (id) {
      const result = await pool.query(
        `SELECT id, name, first_name, middle_name, last_name, class_id, admission_number,
                medical_conditions, passport_photo_url, kcpe_certificate_url, leaving_certificate_url
         FROM students WHERE id = $1`,
        [id]
      );
      if (result.rows.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });
      return Response.json({ student: result.rows[0] });
    }

    if (classId) {
      const result = await pool.query(
        "SELECT id, name, admission_number FROM students WHERE class_id = $1 AND status = 'active' ORDER BY name",
        [classId]
      );
      return Response.json({ students: result.rows });
    }

    return Response.json({ error: 'id or classId is required' }, { status: 400 });
  } catch (err) {
    console.error('Students fetch error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  const client = await pool.connect();
  try {
    const role = request.headers.get('x-user-role');
    if (role !== 'principal') {
      client.release();
      return Response.json({ error: 'Only the principal can add students' }, { status: 403 });
    }

    const schoolId = request.headers.get('x-school-id');
    const {
      firstName,
      middleName,
      lastName,
      classId,
      medicalConditions,
      passportPhotoUrl,
      kcpeCertificateUrl,
      leavingCertificateUrl,
      parents,
    } = await request.json();

    if (!firstName || !lastName || !classId) {
      client.release();
      return Response.json({ error: 'firstName, lastName, and classId are required' }, { status: 400 });
    }

    if (!passportPhotoUrl) {
      client.release();
      return Response.json({ error: 'Passport photo is required' }, { status: 400 });
    }

    if (!Array.isArray(parents) || parents.length < 1 || parents.length > 2) {
      client.release();
      return Response.json({ error: 'At least one parent/guardian is required (max 2)' }, { status: 400 });
    }

    for (const [i, p] of parents.entries()) {
      if (!p.firstName || !p.firstName.trim() || !p.lastName || !p.lastName.trim()) {
        client.release();
        return Response.json({ error: `Parent ${i + 1}: first and last name are required` }, { status: 400 });
      }
      if (!p.phone || !p.phone.trim()) {
        client.release();
        return Response.json({ error: `Parent ${i + 1}: phone is required` }, { status: 400 });
      }
      if (!p.relationship || !VALID_RELATIONSHIPS.includes(p.relationship)) {
        client.release();
        return Response.json(
          { error: `Parent ${i + 1}: relationship must be one of ${VALID_RELATIONSHIPS.join(', ')}` },
          { status: 400 }
        );
      }
    }

    await client.query('BEGIN');

    // Atomically claim the next admission number and advance the counter
    const counterRes = await client.query(
      'UPDATE schools SET next_admission_number = next_admission_number + 1 WHERE id = $1 RETURNING next_admission_number',
      [schoolId]
    );
    const admissionNumber = counterRes.rows[0].next_admission_number - 1;

    const computedName = fullName(firstName, middleName, lastName);

    const studentRes = await client.query(
      `INSERT INTO students (
         school_id, class_id, name, first_name, middle_name, last_name,
         status, admission_number, medical_conditions,
         passport_photo_url, kcpe_certificate_url, leaving_certificate_url
       )
       VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, $8, $9, $10, $11)
       RETURNING id, name, first_name, middle_name, last_name, class_id, admission_number,
                 medical_conditions, passport_photo_url, kcpe_certificate_url, leaving_certificate_url`,
      [
        schoolId,
        classId,
        computedName,
        firstName.trim(),
        middleName?.trim() || null,
        lastName.trim(),
        admissionNumber,
        medicalConditions?.trim() || null,
        passportPhotoUrl,
        kcpeCertificateUrl || null,
        leavingCertificateUrl || null,
      ]
    );
    const student = studentRes.rows[0];

    const insertedParents = [];
    for (const [i, p] of parents.entries()) {
      const parentRes = await client.query(
        `INSERT INTO parents (student_id, first_name, middle_name, last_name, phone, email, national_id, relationship, is_primary)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, first_name, middle_name, last_name, phone, email, national_id, relationship, is_primary`,
        [
          student.id,
          p.firstName.trim(),
          p.middleName?.trim() || null,
          p.lastName.trim(),
          p.phone.trim(),
          p.email?.trim() || null,
          p.nationalId?.trim() || null,
          p.relationship,
          i === 0,
        ]
      );
      insertedParents.push(parentRes.rows[0]);
    }

    await client.query('COMMIT');
    return Response.json({ student, parents: insertedParents }, { status: 201 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Student create error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  } finally {
    client.release();
  }
}