'use client';

import Sidebar from '@/components/layout/sidebar';
import TopNav from '@/components/layout/top-nav';
import { useStats } from '@/hooks/use-bookings';
import { formatCurrency } from '@/lib/utils';
import { DashboardSkeleton } from '@/components/ui/page-skeletons';

import { Booking, Hotel } from '@/types';

interface Stats {
  totalHotels: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  recentBookings: (Booking & { hotel: Hotel })[];
  topHotels: (Hotel & { _count: { bookings: number } })[];
  trends: { month: string; count: number }[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="md:ml-64 min-h-screen">
          <TopNav isAdmin />
          <div className="px-4 md:px-16 py-12 max-w-7xl mx-auto">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  const statsData = stats as Stats;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 min-h-screen">
        <TopNav isAdmin />
        <div className="px-4 md:px-16 py-12 max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-on-background">System Overview</h2>
              <p className="text-lg text-on-surface-variant">Real-time performance monitoring and booking data.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-primary text-primary text-sm flex items-center gap-1 hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-sm">download</span> Export Reports
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm flex items-center gap-1 hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined text-sm">add</span> New Hotel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="TOTAL HOTELS"
              value={stats?.totalHotels || 0}
              icon="apartment"
              trend="+12%"
              trendColor="text-secondary"
            />
            <StatCard
              title="TOTAL BOOKINGS"
              value={stats?.totalBookings || 0}
              icon="event_available"
              trend="+8.4%"
              trendColor="text-secondary"
            />
            <StatCard
              title="REVENUE"
              value={formatCurrency(stats?.totalRevenue || 0)}
              icon="payments"
              trend="-2.1%"
              trendColor="text-error"
            />
            <StatCard
              title="ACTIVE USERS"
              value="15.2k"
              icon="person"
              trend="+18%"
              trendColor="text-secondary"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h4 className="text-xl font-semibold text-on-background">Booking Trends</h4>
                  <p className="text-sm text-on-surface-variant">Average monthly volume for the current fiscal year</p>
                </div>
                <select className="bg-surface-container-low border-outline-variant rounded-lg text-sm px-4 py-2 focus:ring-1 focus:ring-primary">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 pt-4 px-2">
                {(statsData.trends || []).map((trend, i) => {
                  const maxCount = Math.max(...(statsData.trends || []).map(t => t.count), 1);
                  const height = (trend.count / maxCount) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full flex flex-col items-center justify-end h-48">
                        <div
                          className={cn(
                            "w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out group-hover:bg-secondary",
                            i === (statsData.trends || []).length - 1 
                              ? "bg-primary" 
                              : "bg-primary opacity-30"
                          )}
                          style={{ height: `${Math.max(height, 8)}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-background text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 whitespace-nowrap">
                            {trend.count} Bookings
                          </div>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider transition-colors mt-2", 
                        i === (statsData.trends || []).length - 1 ? "text-primary" : "text-on-surface-variant"
                      )}>
                        {trend.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant flex flex-col">
              <h4 className="text-xl font-semibold text-on-background mb-4">Recent Activity</h4>
              <div className="space-y-6 flex-grow overflow-y-auto max-h-[300px]">
                {statsData.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-secondary">book</span>
                    </div>
                    <div>
                      <p className="text-sm text-on-surface">
                        <span className="font-bold">{booking.hotel.name}</span> received a new booking.
                      </p>
                      <p className="text-[11px] text-on-surface-variant">Just now</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-2 border-t border-outline-variant text-[12px] font-semibold uppercase tracking-wider text-secondary hover:text-primary transition-colors text-center">
                VIEW ALL LOGS
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendColor }: { title: string; value: string | number; icon: string; trend: string; trendColor: string }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={cn(trendColor, "text-[12px] font-semibold uppercase tracking-wider bg-current/10 px-2 py-1 rounded")}>
          {trend}
        </span>
      </div>
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">{title}</h3>
      <p className="text-3xl font-bold text-on-background">{value}</p>
    </div>
  );
}

import { cn } from '@/lib/utils';
