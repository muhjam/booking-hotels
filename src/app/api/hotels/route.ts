import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');

    const where: Prisma.HotelWhereInput = {
      status: 'OPERATIONAL',
    };

    // Full-text search across name, location, description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by location (city keyword)
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Minimum rating filter
    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: { rating: 'desc' },
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
