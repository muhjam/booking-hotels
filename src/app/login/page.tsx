'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/use-auth-store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Login failed');
        return;
      }

      const user = await response.json();
      login(user);
      router.push(user.role === 'ADMIN' ? '/admin' : '/');
    } catch (error) {
      alert('An error occurred during login');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 md:px-16 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#d8e3fa_0.5px,transparent_0.5px)] bg-[length:24px_24px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-4xl">hotel</span>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Hotels</h1>
          </div>
          <p className="text-sm text-on-surface-variant">Modern comfort, effortless booking.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
          <div className="space-y-6">
            <header>
              <h2 className="text-xl font-semibold text-on-surface">Welcome back</h2>
              <p className="text-sm text-on-surface-variant">Sign in to your account to continue.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary outline-none transition-all text-sm"
                    id="email"
                    placeholder="name@company.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="password">Password</label>
                  <Link className="text-sm text-secondary hover:underline transition-colors" href="#">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary outline-none transition-all text-sm"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                className="w-full bg-primary-container text-on-primary py-2 rounded-xl text-base font-bold hover:bg-primary transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
                type="submit"
              >
                Sign In
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            <footer className="pt-4 border-t border-outline-variant text-center">
              <p className="text-sm text-on-surface-variant">
                Don't have an account?{' '}
                <Link className="text-secondary font-bold hover:underline transition-colors" href="/register">Create account</Link>
              </p>
            </footer>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-on-surface-variant opacity-70">
          <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
          <span className="w-1 h-1 bg-outline-variant rounded-full my-auto"></span>
          <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
          <span className="w-1 h-1 bg-outline-variant rounded-full my-auto"></span>
          <Link className="hover:text-primary transition-colors" href="#">Cookie Policy</Link>
        </div>
      </div>
    </main>
  );
}
