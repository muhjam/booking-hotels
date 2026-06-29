'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TopNav from '@/components/layout/top-nav';
import { useBooking } from '@/hooks/use-bookings';
import { formatCurrency, cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: booking, isLoading, error } = useBooking(id as string);

  if (isLoading) {
    return (
      <div className="bg-background text-on-surface min-h-screen">
        <TopNav />
        <main className="pt-24 pb-12">
          <div className="max-w-3xl mx-auto px-4">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 space-y-8">
              <div className="flex gap-6">
                <Skeleton className="h-32 w-48 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">Booking not found</h2>
            <p className="text-on-surface-variant mb-6">The booking you are looking for does not exist or you don't have access.</p>
            <Link href="/my-bookings" className="px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold">
              Back to My Bookings
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <TopNav />
      <main className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-3xl font-bold text-primary">Booking Detail</h1>
            <div className="ml-auto">
              <span className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm",
                booking.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-700" :
                booking.status === 'BOOKED' ? "bg-blue-100 text-blue-700" :
                booking.status === 'PENDING' ? "bg-amber-100 text-amber-700" :
                booking.status === 'EXPIRED' ? "bg-error-container text-on-error-container" :
                "bg-surface-variant text-on-surface-variant"
              )}>
                {booking.status}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            {/* Hotel Info Section */}
            <div className="p-8 border-b border-outline-variant bg-surface-container-low/30">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-56 h-40 rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={booking.hotel.image || ''} 
                    alt={booking.hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-secondary font-semibold text-sm mb-2">
                    <span className="material-symbols-outlined text-[18px]">hotel</span>
                    <span>Hotel Information</span>
                  </div>
                  <h2 className="text-2xl font-bold text-on-surface mb-2">{booking.hotel.name}</h2>
                  <div className="flex items-center text-on-surface-variant gap-1 mb-4">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span>{booking.hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="material-symbols-outlined fill-1 text-[20px]">star</span>
                    <span className="font-bold">{booking.hotel.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details Section */}
            <div className="p-8 space-y-10">
              <div>
                <div className="flex items-center gap-2 text-secondary font-semibold text-sm mb-6 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[18px]">event_available</span>
                  <span>Reservation Details</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Check-in</span>
                    <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Check-out</span>
                    <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Guests</span>
                    <p className="font-semibold">{booking.guests} {booking.guests > 1 ? 'Guests' : 'Guest'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Price</span>
                    <p className="text-xl font-bold text-primary">{formatCurrency(booking.totalPrice)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-outline-variant">
                <div>
                  <div className="flex items-center gap-2 text-secondary font-semibold text-sm mb-6 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span>Guest Details</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-on-surface-variant">Full Name</span>
                      <span className="text-sm font-semibold">{booking.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-on-surface-variant">Email Address</span>
                      <span className="text-sm font-semibold">{booking.guestEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-on-surface-variant">Phone Number</span>
                      <span className="text-sm font-semibold">{booking.guestPhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-secondary font-semibold text-sm mb-6 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Payment Method</span>
                  </div>
                  <div className="bg-surface-container p-4 rounded-xl flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">
                          {booking.paymentMethod === 'CREDIT_CARD' ? 'credit_card' : 'account_balance'}
                        </span>
                      </div>
                      <span className="font-semibold">{booking.paymentMethod.replace('_', ' ')}</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary">
                      {booking.status === 'BOOKED' || booking.status === 'COMPLETED' ? 'check_circle' : 'pending'}
                    </span>
                  </div>

                  {booking.paymentMethod === 'BANK_TRANSFER' && booking.status === 'PENDING' && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Virtual Account Number</span>
                        <p className="text-2xl font-mono font-bold text-primary tracking-widest">{booking.vaNumber}</p>
                      </div>
                      <div className="pt-2">
                        <Link 
                          href="/simulate-payment"
                          className="text-sm text-secondary font-bold hover:underline flex items-center gap-1"
                        >
                          Simulate Payment Now
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {booking.paymentMethod === 'CREDIT_CARD' && booking.cardNumber && (
                    <div className="bg-surface-container-low rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Card Number</span>
                        <span className="font-mono">**** **** **** {booking.cardNumber.slice(-4)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 bg-surface-container-low flex justify-center">
              <Link 
                href="/my-bookings"
                className="px-12 py-3 bg-primary text-on-primary rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all"
              >
                Back to My Bookings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
