import { NextRequest, NextResponse } from "next/server";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { handleToolCall, toolDefinitions, PROTECTED_TOOLS } from "@/lib/mcp-logic";
import { getUserIdFromToken } from "@/lib/mcp-auth";

// export const runtime = "edge"; // Prisma standard client doesn't support Edge runtime

// Global map to store active sessions (Note: In Vercel Edge this is even more volatile)
// For a more robust production setup, use Redis or a similar external store for session management
const activeServers = new Map<string, Server>();

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const userId = await getUserIdFromToken(authHeader);

  // 1. Use Stateless Transport (sessionIdGenerator: undefined)
  // This is CRITICAL for Vercel/Serverless to avoid "Server not initialized" errors
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  const server = new Server(
    { name: "hotels-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const toolName = request.params.name;
      
      if (PROTECTED_TOOLS.includes(toolName) && !userId) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://booking-hotels-three.vercel.app";
        // Return a clear error message that triggers the UI to show login
        throw new Error(`UNAUTHORIZED: Please login at ${baseUrl}/oauth/authorize`);
      }

      return await handleToolCall(toolName, request.params.arguments, userId || undefined);
    } catch (error: any) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  });

  await server.connect(transport);

  // 2. Handle the request
  const response = await transport.handleRequest(req);
  
  // Add headers to prevent buffering in Node.js runtime on Vercel/Nginx
  response.headers.set("X-Accel-Buffering", "no");
  
  return response;
}

export async function GET(req: NextRequest) {
  const accept = req.headers.get("accept") || "";
  
  if (!accept.includes("text/event-stream")) {
    return new NextResponse("Hotels MCP Server (Stateless) is active.", {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  
  const response = await transport.handleRequest(req);
  response.headers.set("X-Accel-Buffering", "no");
  return response;
}
