import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(hotels);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const hotel = await prisma.hotel.create({
      data: {
        name: body.name,
        location: body.location,
        description: body.description,
        price: parseFloat(body.price),
        image: body.image,
        status: body.status || 'OPERATIONAL',
        amenities: body.amenities || [],
      },
    });
    return NextResponse.json(hotel);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create hotel' }, { status: 500 });
  }
}
