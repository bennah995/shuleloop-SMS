'use client';

import Sidebar from '../components/Sidebar';

const TEACHER_ITEMS = [
  { href: '/teacher/attendance', label: 'Attendance' },
  { href: '/teacher/grades', label: 'Grades & Report Cards' },
  { href: '/teacher/awards', label: 'Awards' },
  { href: '/teacher/notifications', label: 'Parent Notifications' },
];

export default function TeacherLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar role="Teacher" items={TEACHER_ITEMS} />
      <div className="flex-1 bg-[#F5F7FA] min-h-screen">{children}</div>
    </div>
  );
}