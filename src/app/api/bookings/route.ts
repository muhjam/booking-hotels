import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { hotel: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate VA number if bank transfer
    let vaNumber = null;
    if (body.paymentMethod === 'BANK_TRANSFER') {
      vaNumber = '88' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }

    const booking = await prisma.booking.create({
      data: {
        hotelId: body.hotelId,
        userId: body.userId,
        checkIn: new Date(body.checkIn),
        checkOut: new Date(body.checkOut),
        guests: parseInt(body.guests),
        totalPrice: parseFloat(body.totalPrice),
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
        paymentMethod: body.paymentMethod,
        cardNumber: body.cardNumber,
        expiryDate: body.expiryDate,
        cvc: body.cvc,
        vaNumber: vaNumber,
        status: body.paymentMethod === 'CREDIT_CARD' ? 'BOOKED' : 'PENDING',
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
