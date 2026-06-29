'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/use-auth-store';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { name: 'Hotel Management', href: '/admin/hotels', icon: 'hotel' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col py-6 px-4 z-40 hidden md:flex">
      <div className="mb-12 px-2">
        <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
        <p className="text-sm text-on-surface-variant">Manage Listings</p>
      </div>
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-2 rounded-lg transition-all active:scale-95",
                isActive
                  ? "text-primary font-bold border-r-2 border-primary bg-surface-container-high"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-base">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-4 p-4 border-t border-outline-variant">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPIuNL30dxrj1nrjo7cVWFOLtp6Vq--pfpxA4RHNJd7EKnTWGsGnnbXqt_p9A_yJ7UE5Rs3NZw6Zi9NAWsa-53Fv8eSaQOuuLIkQGCeLMkK2eSG03obNgRq1_vO3B5KdmLk4HpODVHw9d9uHyhKKqWlIbEq40Sx3olTjyJNGgaeKNgU8wuTk9ej1E1PK2bpkYJW8O-d2wJUemRFedX57evfn30ZIk6kNIFvKCXWud9a9ykmUBXiTce7SO5HVsuHE1tYTyxDl-S8mI"
              alt="Admin"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">{user?.name || 'Alex Rivera'}</p>
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Senior Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-error/10 text-error rounded-lg text-sm font-bold hover:bg-error/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
