'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar({ role, items }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="w-56 bg-[#1A3C5E] min-h-screen flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div className="w-7 h-7 bg-[#F0A500] rounded-md flex items-center justify-center text-[#1A3C5E] font-bold text-xs">
          S
        </div>
        <span className="text-white font-medium text-sm">ShuleLoop</span>
      </div>

      <div className="px-5 py-3 text-xs text-white/40 uppercase tracking-wide">
        {role}
      </div>

      <nav className="flex-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 mb-1 rounded-md text-sm ${
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-2">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/5"
        >
          Log out
        </button>
      </div>

      <div className="px-5 py-4 border-t border-white/10 text-xs text-white/30">
        Digistar Tech
      </div>
    </div>
  );
}