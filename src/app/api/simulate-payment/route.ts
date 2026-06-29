import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { vaNumber } = await request.json();

    if (!vaNumber) {
      return NextResponse.json({ error: 'VA Number is required' }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { vaNumber },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found with this VA Number' }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'BOOKED',
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment confirmed successfully',
      bookingId: updatedBooking.id 
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
