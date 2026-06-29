'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopNav from '@/components/layout/top-nav';

export default function SimulatePayment() {
  const [vaNumber, setVaNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Payment successful! Your booking is now BOOKED.' });
        setTimeout(() => {
          router.push('/my-bookings');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Payment failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred during payment simulation' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <TopNav />
      <main className="pt-32 pb-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="material-symbols-outlined text-primary text-[40px]">account_balance</span>
            </div>
            <h1 className="text-3xl font-bold text-primary">Simulate Payment</h1>
            <p className="text-on-surface-variant mt-2">Enter your Virtual Account number to confirm payment.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Virtual Account Number</label>
                <input
                  required
                  type="text"
                  className="w-full h-14 px-6 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xl font-mono tracking-widest text-center"
                  placeholder="88XXXXXXXXXX"
                  value={vaNumber}
                  onChange={(e) => setVaNumber(e.target.value)}
                />
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className="material-symbols-outlined">
                    {message.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold text-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Confirm Payment'}
                <span className="material-symbols-outlined">payments</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant text-center">
              <Link href="/my-bookings" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
                Back to My Bookings
              </Link>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-surface-variant/30 rounded-xl border border-outline-variant/50">
            <p className="text-xs text-on-surface-variant text-center leading-relaxed">
              <strong>Demo Note:</strong> In a real application, this page would be part of the bank's system. 
              We use it here to simulate the asynchronous payment process for Bank Transfers.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
