import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function handleToolCall(name: string, args: any) {
  console.error(`Executing tool: ${name}`);
  switch (name) {
    case "get_admin_stats": {
      const totalHotels = await prisma.hotel.count();
      const totalBookings = await prisma.booking.count();
      const revenue = await prisma.booking.aggregate({ _sum: { totalPrice: true } });
      return {
        content: [{ type: "text", text: JSON.stringify({
          totalHotels,
          totalBookings,
          totalRevenue: revenue._sum.totalPrice || 0,
        }, null, 2) }],
      };
    }

    case "search_hotels": {
      const { query } = args;
      const hotels = await prisma.hotel.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
      });
      return { content: [{ type: "text", text: JSON.stringify(hotels, null, 2) }] };
    }

    case "book_hotel": {
      const { hotelId, email, paymentMethod, guestName, guestPhone } = args;
      const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
      if (!hotel) throw new Error("Hotel not found");

      let vaNumber = null;
      if (paymentMethod === 'BANK_TRANSFER') {
        vaNumber = '88' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
      }

      const booking = await prisma.booking.create({
        data: {
          hotelId,
          guestEmail: email,
          guestName: guestName || "Guest",
          guestPhone: guestPhone || "000",
          paymentMethod,
          vaNumber,
          checkIn: new Date(),
          checkOut: new Date(Date.now() + 86400000),
          guests: 1,
          totalPrice: hotel.price,
          status: paymentMethod === 'CREDIT_CARD' ? 'BOOKED' : 'PENDING'
        } as any
      });

      return { content: [{ type: "text", text: `Booking success! ID: ${booking.id}. VA: ${vaNumber || 'N/A'}` }] };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export const toolDefinitions = [
  {
    name: "get_admin_stats",
    description: "Get hotel and booking statistics",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "search_hotels",
    description: "Search for hotels",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "book_hotel",
    description: "Book a hotel",
    inputSchema: {
      type: "object",
      properties: {
        hotelId: { type: "string" },
        email: { type: "string" },
        paymentMethod: { type: "string", enum: ["CREDIT_CARD", "BANK_TRANSFER"] },
      },
      required: ["hotelId", "email", "paymentMethod"],
    },
  }
];
