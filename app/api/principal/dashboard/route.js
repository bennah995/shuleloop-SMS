import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request) {
  const schoolId = request.headers.get('x-school-id');

  const totalsQuery = pool.query(
    `SELECT
      (SELECT COUNT(*) FROM students WHERE status = 'active' AND school_id = $1) AS total_students,
      (SELECT COUNT(*) FROM users WHERE role = 'teacher' AND is_active = TRUE AND school_id = $1) AS total_teachers`,
    [schoolId]
  );

  const todayQuery = pool.query(
    `SELECT
      c.id AS class_id,
      c.name AS class_name,
      COUNT(*) FILTER (WHERE a.status = 'present') AS present_count,
      COUNT(*) FILTER (WHERE a.status = 'absent') AS absent_count
    FROM attendance a
    JOIN classes c ON c.id = a.class_id
    WHERE a.date = CURRENT_DATE AND c.school_id = $1
    GROUP BY c.id, c.name
    ORDER BY absent_count DESC`,
    [schoolId]
  );

  const [totalsResult, todayResult] = await Promise.all([totalsQuery, todayQuery]);
  const totals = totalsResult.rows[0];
  const perClassToday = todayResult.rows;

  const presentToday = perClassToday.reduce((sum, r) => sum + Number(r.present_count), 0);
  const absentToday = perClassToday.reduce((sum, r) => sum + Number(r.absent_count), 0);
  const mostAbsencesClass = perClassToday[0] ?? null;

  return NextResponse.json({
    totalStudents: Number(totals.total_students),
    totalTeachers: Number(totals.total_teachers),
    presentToday,
    absentToday,
    attendanceTakenToday: perClassToday.length > 0,
    mostAbsencesClass: mostAbsencesClass
      ? {
          classId: mostAbsencesClass.class_id,
          className: mostAbsencesClass.class_name,
          absentCount: Number(mostAbsencesClass.absent_count),
        }
      : null,
  });
}