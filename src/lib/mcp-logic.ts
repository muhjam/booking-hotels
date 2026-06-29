import prisma from './prisma';

export const PROTECTED_TOOLS = ["get_admin_stats", "get_my_bookings", "book_hotel"];

export async function handleToolCall(name: string, args: any, userId?: string) {
  console.error(`Executing tool: ${name} (User: ${userId || 'Anonymous'})`);
  switch (name) {
    case "get_admin_stats": {
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.role !== 'ADMIN') {
          throw new Error("Unauthorized: Admin role required");
        }
      }
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
          status: 'OPERATIONAL',
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
      });
      return { content: [{ type: "text", text: JSON.stringify(hotels, null, 2) }] };
    }

    case "list_available_hotels": {
      const hotels = await prisma.hotel.findMany({
        where: { status: 'OPERATIONAL' },
        orderBy: { rating: 'desc' }
      });
      return {
        content: [{ type: "text", text: JSON.stringify(hotels, null, 2) }],
      };
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
          userId: userId || null,
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

    case "get_my_bookings": {
      if (!userId) {
        throw new Error("Unauthorized: Login required to see bookings");
      }
      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: { hotel: true },
        orderBy: { createdAt: 'desc' }
      });
      return { content: [{ type: "text", text: JSON.stringify(bookings, null, 2) }] };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export const toolDefinitions = [
  {
    name: "get_admin_stats",
    description: "Get hotel and booking statistics (Admin only)",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "search_hotels",
    description: "Search for hotels by name or location",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "list_available_hotels",
    description: "List all available (operational) hotels",
    inputSchema: { type: "object", properties: {} },
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
  },
  {
    name: "get_my_bookings",
    description: "Get your current bookings (Requires login)",
    inputSchema: { type: "object", properties: {} },
  }
];
