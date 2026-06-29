'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import TopNav from '@/components/layout/top-nav';
import { useBookings } from '@/hooks/use-bookings';
import { useAuthStore } from '@/hooks/use-auth-store';
import { formatCurrency, cn } from '@/lib/utils';
import { Booking, Hotel } from '@/types';
import { BookingsSkeleton } from '@/components/ui/page-skeletons';
import { Skeleton } from '@/components/ui/skeleton';

type BookingWithHotel = Booking & { hotel: Hotel };

export default function MyBookings() {
  const { user } = useAuthStore();
  const { data: bookings, isLoading } = useBookings();

  // Filter bookings for current user
  const filteredBookings = useMemo(() => {
    return bookings?.filter((b: any) => b.guestEmail === user?.email) || [];
  }, [bookings, user?.email]);

  if (isLoading) {
    return (
      <div className="bg-background text-on-surface min-h-screen">
        <TopNav />
        <main className="pt-24 pb-12 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 md:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <BookingsSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <TopNav />
      <main className="pt-24 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1">My Bookings</h1>
              <p className="text-on-surface-variant text-sm">Manage your stays and view your travel history.</p>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-outline text-[48px]">event_busy</span>
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-1">No bookings found</h3>
              <p className="text-on-surface-variant text-sm mb-6">You haven't made any reservations yet.</p>
              <Link href="/" className="px-8 py-3 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-sm hover:opacity-90">
                Browse Hotels
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking: any) => (
                <div key={booking.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-full transition-all hover:-translate-y-1">
                  <div className="h-48 relative">
                    <img
                      className="absolute inset-0 w-full h-full object-cover"
                      src={booking.hotel.image || ''}
                      alt={booking.hotel.name}
                    />
                    <div className="absolute top-4 right-4">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm",
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
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-on-surface mb-1">{booking.hotel.name}</h3>
                      <div className="flex items-center text-on-surface-variant gap-1">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="text-sm">{booking.hotel.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-6 border-y border-outline-variant py-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">CHECK-IN</span>
                        <span className="text-sm font-semibold">{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">CHECK-OUT</span>
                        <span className="text-sm font-semibold">{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Link 
                        href={`/my-bookings/${booking.id}`}
                        className="block w-full py-3 bg-primary text-on-primary text-center rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="w-full py-12 bg-on-background border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-16 max-w-7xl mx-auto gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-xl font-bold text-surface">Hotels</span>
            <span className="text-sm text-surface-variant opacity-80">© 2024 Hotels Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link className="text-sm text-surface-variant hover:text-primary-fixed-dim transition-colors" href="#">Privacy Policy</Link>
            <Link className="text-sm text-surface-variant hover:text-primary-fixed-dim transition-colors" href="#">Terms of Service</Link>
            <Link className="text-sm text-surface-variant hover:text-primary-fixed-dim transition-colors" href="#">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
