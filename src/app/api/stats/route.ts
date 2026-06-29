import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalHotels = await prisma.hotel.count();
    const totalBookings = await prisma.booking.count();
    const revenueResult = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
    });
    const totalRevenue = revenueResult._sum.totalPrice || 0;
    
    // For demo, let's just return some dummy active users
    const activeUsers = 15200;

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      include: { hotel: true },
      orderBy: { createdAt: 'desc' },
    });

    const topHotels = await prisma.hotel.findMany({
      take: 2,
      include: {
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: {
        bookings: {
          _count: 'desc'
        }
      }
    });

    // Calculate booking trends for the last 6 months
    const now = new Date();
    const trends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const count = await prisma.booking.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextMonth,
          },
        },
      });
      
      trends.push({
        month: date.toLocaleString('en-US', { month: 'short' }),
        count,
      });
    }

    return NextResponse.json({
      totalHotels,
      totalBookings,
      totalRevenue,
      activeUsers,
      recentBookings,
      topHotels,
      trends
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
