'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/schools', label: 'Schools' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      <div className="w-56 bg-[#1E293B] border-r border-[#334155] flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-[#334155]">
          <div className="w-7 h-7 bg-[#F0A500] rounded-md flex items-center justify-center text-[#1A3C5E] font-bold text-xs">
            S
          </div>
          <span className="text-white font-medium text-sm">ShuleLoop Console</span>
        </div>
        <nav className="flex-1 px-3 py-3">
          {ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 mb-1 rounded-md text-sm ${
                  active ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/5"
          >
            Log out
          </button>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}