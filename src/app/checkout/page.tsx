'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense, useMemo } from 'react';
import TopNav from '@/components/layout/top-nav';
import { useHotel } from '@/hooks/use-hotels';
import { useCreateBooking, useBookings } from '@/hooks/use-bookings';
import { formatCurrency, cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/use-auth-store';
import { CheckoutSkeleton } from '@/components/ui/page-skeletons';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('hotelId');
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: hotel, isLoading } = useHotel(hotelId as string);
  const { data: allBookings } = useBookings();
  const createBookingMutation = useCreateBooking();

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    paymentMethod: 'CREDIT_CARD',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [showAutoFillModal, setShowAutoFillModal] = useState(false);

  // Get the most recent booking for this user
  const lastBooking = useMemo(() => {
    if (!allBookings || !user) return null;
    const userBookings = allBookings
      .filter((b: any) => b.guestEmail === user.email)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return userBookings.length > 0 ? userBookings[0] : null;
  }, [allBookings, user]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        guestName: user.name || '',
        guestEmail: user.email,
      }));

      // If user has a previous booking, show the auto-fill modal
      if (lastBooking) {
        setShowAutoFillModal(true);
      }
    }
  }, [user, lastBooking]);

  const handleAutoFill = () => {
    if (lastBooking) {
      setFormData({
        guestName: lastBooking.guestName,
        guestEmail: lastBooking.guestEmail,
        guestPhone: lastBooking.guestPhone,
        paymentMethod: lastBooking.paymentMethod,
        cardNumber: lastBooking.cardNumber || '',
        expiryDate: lastBooking.expiryDate || '',
        cvc: lastBooking.cvc || '',
      });
    }
    setShowAutoFillModal(false);
  };

  const nights = 3;
  const guests = 2;
  const serviceFee = 45;
  const taxes = 112.5;
  const totalPrice = hotel ? (hotel.price * nights) + serviceFee + taxes : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel) return;

    try {
      const result = await createBookingMutation.mutateAsync({
        hotelId: hotel.id,
        userId: user?.id,
        checkIn: new Date('2024-10-12'),
        checkOut: new Date('2024-10-15'),
        guests,
        totalPrice,
        ...formData,
      });
      
      alert('Booking confirmed!');
      
      // Redirect to detail page for payment/confirmation
      router.push(`/my-bookings/${result.id}`);
    } catch (error) {
      alert('Failed to confirm booking');
    }
  };

  if (isLoading) return <CheckoutSkeleton />;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <>
      {/* Auto-fill Modal */}
      {showAutoFillModal && lastBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="w-16 h-16 bg-secondary-container/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="material-symbols-outlined text-secondary text-[32px]">person_check</span>
              </div>
              <h2 className="text-2xl font-bold text-center text-on-surface mb-2">Reuse recent identity?</h2>
              <p className="text-on-surface-variant text-center text-sm mb-8">
                We found your recent booking information. Would you like to auto-fill the form with those details?
              </p>
              
              <div className="bg-surface-container-low rounded-xl p-4 mb-8 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Name</span>
                  <span className="font-semibold">{lastBooking.guestName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Phone</span>
                  <span className="font-semibold">{lastBooking.guestPhone}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Payment</span>
                  <span className="font-semibold">{lastBooking.paymentMethod}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShowAutoFillModal(false)}
                  className="py-3 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors"
                >
                  No, thanks
                </button>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="py-3 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-md hover:opacity-90 active:scale-95 transition-all"
                >
                  Yes, fill it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Confirm and Pay</h1>
        
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">person</span>
            <h2 className="text-xl font-semibold">Guest Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-on-surface-variant">Full Name</label>
              <input
                required
                className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-sm"
                placeholder="John Doe"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-on-surface-variant">Email Address</label>
              <input
                required
                type="email"
                className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-sm"
                placeholder="john@example.com"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-bold text-on-surface-variant">Phone Number</label>
              <input
                required
                className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-sm"
                placeholder="+1 (555) 000-0000"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <h2 className="text-xl font-semibold">Payment Method</h2>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="radio"
                id="credit_card"
                name="payment"
                className="peer hidden"
                checked={formData.paymentMethod === 'CREDIT_CARD'}
                onChange={() => setFormData({ ...formData, paymentMethod: 'CREDIT_CARD' })}
              />
              <label htmlFor="credit_card" className="flex items-center justify-between p-4 border border-outline-variant rounded-xl cursor-pointer peer-checked:border-secondary peer-checked:bg-secondary-container/10 transition-all">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                  <span className="text-lg font-semibold">Credit Card</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">payments</span>
              </label>
            </div>
            
            {formData.paymentMethod === 'CREDIT_CARD' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-bold text-on-surface-variant">Card Number</label>
                  <input
                    required
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface focus:border-secondary outline-none text-sm"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-on-surface-variant">Expiry Date</label>
                  <input
                    required
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface focus:border-secondary outline-none text-sm"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-on-surface-variant">CVC</label>
                  <input
                    required
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface focus:border-secondary outline-none text-sm"
                    placeholder="***"
                    type="password"
                    value={formData.cvc}
                    onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <input
                type="radio"
                id="bank_transfer"
                name="payment"
                className="peer hidden"
                checked={formData.paymentMethod === 'BANK_TRANSFER'}
                onChange={() => setFormData({ ...formData, paymentMethod: 'BANK_TRANSFER' })}
              />
              <label htmlFor="bank_transfer" className="flex items-center justify-between p-4 border border-outline-variant rounded-xl cursor-pointer peer-checked:border-secondary peer-checked:bg-secondary-container/10 transition-all">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
                  <span className="text-lg font-semibold">Bank Transfer</span>
                </div>
              </label>
            </div>
          </div>
        </section>
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-24 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="h-48 relative">
              <img className="w-full h-full object-cover" src={hotel.image || ''} alt={hotel.name} />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/80 to-transparent">
                <h3 className="text-xl font-semibold text-white">{hotel.name}</h3>
                <p className="text-sm text-surface-variant">{hotel.location}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Check-in</span>
                  <p className="text-base font-bold text-on-surface">Oct 12, 2024</p>
                </div>
                <span className="material-symbols-outlined text-outline-variant">arrow_forward</span>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Check-out</span>
                  <p className="text-base font-bold text-on-surface">Oct 15, 2024</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">{nights} Nights, {guests} Guests</span>
                  <span className="text-on-surface">{formatCurrency(hotel.price * nights)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Service Fee</span>
                  <span className="text-on-surface">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Taxes</span>
                  <span className="text-on-surface">{formatCurrency(taxes)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-base font-bold text-on-surface">Total Price</p>
                  <p className="text-sm text-on-surface-variant">(All inclusive)</p>
                </div>
                <p className="text-3xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={createBookingMutation.isPending}
            className="w-full py-4 bg-primary-container text-white text-lg font-bold rounded-xl hover:bg-primary transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {createBookingMutation.isPending ? 'Confirming...' : 'Confirm Booking'}
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </button>
          <p className="text-center text-sm text-on-surface-variant px-4">
            By clicking 'Confirm Booking', you agree to our <Link className="text-secondary underline" href="#">Terms of Service</Link> and <Link className="text-secondary underline" href="#">Cancellation Policy</Link>.
          </p>
        </div>
      </aside>
      </form>
    </>
  );
}

export default function Checkout() {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <TopNav />
      <main className="pt-24 pb-12 px-4 md:px-16 max-w-7xl mx-auto">
        <Suspense fallback={<div>Loading checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>
    </div>
  );
}
