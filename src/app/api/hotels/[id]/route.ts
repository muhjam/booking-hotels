import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hotel = await prisma.hotel.findUnique({
      where: { id },
    });
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }
    return NextResponse.json(hotel);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        name: body.name,
        location: body.location,
        description: body.description,
        price: body.price ? parseFloat(body.price) : undefined,
        image: body.image,
        status: body.status,
        amenities: body.amenities,
      },
    });
    return NextResponse.json(hotel);
  } catch {
    return NextResponse.json({ error: 'Failed to update hotel' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.hotel.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Hotel deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete hotel' }, { status: 500 });
  }
}
