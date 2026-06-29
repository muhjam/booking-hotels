import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

/**
 * Handle tool execution logic
 */
async function handleToolCall(name: string, args: any) {
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

// --- SSE ENDPOINTS ---
const transports = new Map<string, SSEServerTransport>();

app.get("/sse", async (req, res) => {
  console.error("New SSE connection attempt");
  
  // Create a fresh server instance for every connection to avoid "Already connected" error
  const server = new Server(
    { name: "hotels-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
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
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      return await handleToolCall(request.params.name, request.params.arguments);
    } catch (error: any) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  });

  // Use a relative path for the messages endpoint
  const transport = new SSEServerTransport("/api/mcp/messages", res);
  
  try {
    await server.connect(transport);
    const sessionId = transport.sessionId;
    transports.set(sessionId, transport);
    console.error(`Session connected: ${sessionId}`);

    res.on("close", () => {
      console.error(`Session closed: ${sessionId}`);
      transports.delete(sessionId);
      server.close().catch(err => console.error("Error closing server:", err));
    });
  } catch (error) {
    console.error("Failed to connect transport:", error);
    res.status(500).send("Failed to establish MCP connection");
  }
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    res.status(400).send("Session ID is required");
    return;
  }

  const transport = transports.get(sessionId);
  if (transport) {
    try {
      await transport.handlePostMessage(req, res);
    } catch (error) {
      console.error("Error handling message:", error);
      res.status(500).send("Error handling message");
    }
  } else {
    res.status(400).send(`No active SSE transport for session: ${sessionId}`);
  }
});

const PORT = process.env.MCP_PORT || 3001;
app.listen(PORT, () => {
  console.error(`MCP Server (SSE) listening on port ${PORT}`);
}).on('error', (err) => {
  console.error("Express server error:", err);
});
