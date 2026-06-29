import { NextRequest, NextResponse } from "next/server";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { handleToolCall, toolDefinitions } from "@/lib/mcp-logic";
import { getUserIdFromToken } from "@/lib/mcp-auth";

// Global map to store active sessions (Note: In Vercel this only works within the same instance/warm start)
// For a more robust production setup, use Redis or a similar external store for session management
const activeTransports = new Map<string, any>();

export async function GET(req: NextRequest) {
  // Lazy Auth: Allow connection without token. 
  // Token will be checked in tool calls via headers in POST /api/mcp/messages
  const authHeader = req.headers.get("authorization");
  const initialUserId = await getUserIdFromToken(authHeader);

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Create a mock response object that matches what SSEServerTransport expects
  const mockRes: any = {
    writeHead: (status: number, headers: any) => {
      // Status and headers are handled by Next.js Response
    },
    write: (chunk: string) => {
      writer.write(encoder.encode(chunk));
    },
    end: () => {
      writer.close();
    },
    on: (event: string, callback: any) => {
      // Handle events if needed
    }
  };

  const server = new Server(
    { name: "hotels-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request, extra: any) => {
    try {
      // Resolve user ID from the headers of the POST request that triggered this tool call
      const authHeader = extra?.requestInfo?.headers?.authorization;
      const userId = await getUserIdFromToken(authHeader);
      
      return await handleToolCall(request.params.name, request.params.arguments, userId || undefined);
    } catch (error: any) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  });

  const transport = new SSEServerTransport("/api/mcp/messages", mockRes);
  
  // Connect server to transport
  await server.connect(transport);
  
  const sessionId = transport.sessionId;
  // Store the transport and server for message handling
  (global as any).mcpTransports = (global as any).mcpTransports || new Map();
  (global as any).mcpTransports.set(sessionId, transport);

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
