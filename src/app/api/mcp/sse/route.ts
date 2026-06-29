import { NextRequest, NextResponse } from "next/server";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { handleToolCall, toolDefinitions, PROTECTED_TOOLS } from "@/lib/mcp-logic";
import { getUserIdFromToken } from "@/lib/mcp-auth";

export const runtime = "edge";

// Global map to store active sessions (Note: In Vercel Edge this is even more volatile)
// For a more robust production setup, use Redis or a similar external store for session management
const activeServers = new Map<string, Server>();

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const userId = await getUserIdFromToken(authHeader);
  
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });

  const server = new Server(
    { name: "hotels-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDefinitions,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request, extra: any) => {
    try {
      const toolName = request.params.name;
      const currentAuthHeader = extra?.requestInfo?.headers?.authorization || authHeader;
      const currentUserId = await getUserIdFromToken(currentAuthHeader);

      if (PROTECTED_TOOLS.includes(toolName) && !currentUserId) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://booking-hotels-three.vercel.app";
        throw new Error(`UNAUTHORIZED: Please login at ${baseUrl}/oauth/authorize`);
      }

      return await handleToolCall(toolName, request.params.arguments, currentUserId || undefined);
    } catch (error: any) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  });

  await server.connect(transport);

  return transport.handleRequest(req);
}

export async function GET(req: NextRequest) {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });
  return transport.handleRequest(req);
}
