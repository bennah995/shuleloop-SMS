'use client';

import Sidebar from '../components/Sidebar';

const PRINCIPAL_ITEMS = [
  { href: '/principal', label: 'Dashboard' },
  { href: '/principal/students', label: 'Student Management' },
  { href: '/principal/attendance', label: 'Attendance' },
  { href: '/principal/grades', label: 'Grades Overview' },
  { href: '/principal/comments', label: 'Report Comments' },
  { href: '/principal/terms', label: 'Terms' },
  { href: '/principal/finance', label: 'Finance' },
  { href: '/principal/staff', label: 'Staff' },
];

export default function PrincipalLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar role="Principal" items={PRINCIPAL_ITEMS} />
      <div className="flex-1 bg-[#F5F7FA] min-h-screen">{children}</div>
    </div>
  );
}