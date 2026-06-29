'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/use-auth-store';

export default function TopNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-surface sticky top-0 w-full z-30 shadow-sm border-b border-outline-variant/30">
      <div className="flex justify-between items-center h-16 px-4 md:px-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-xl font-bold text-primary">Hotels</Link>
          {!isAdmin && (
            <nav className="hidden lg:flex gap-6">
              <Link
                href="/"
                className={cn(
                  "text-sm transition-all",
                  pathname === '/' ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
                )}
              >
                Discover
              </Link>
              <Link
                href="/my-bookings"
                className={cn(
                  "text-sm transition-all",
                  pathname === '/my-bookings' ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
                )}
              >
                My Bookings
              </Link>
              <Link
                href="/settings"
                className={cn(
                  "text-sm transition-all",
                  pathname === '/settings' ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
                )}
              >
                Settings
              </Link>
              <Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-all">Support</Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              className="pl-10 pr-4 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary w-64"
              placeholder={isAdmin ? "Search analytics..." : "Where are you going?"}
              type="text"
            />
          </div>
          <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">notifications</button>
          {!isAdmin && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <button onClick={() => logout()} className="text-sm text-error font-semibold">Logout</button>
                </div>
              ) : (
                <Link href="/login" className="text-sm text-secondary font-semibold">Sign In</Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
