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

  // Pre-check for protected tools before passing to SDK
  try {
    const body = await req.clone().json();
    if (body.method === "tools/call") {
      const toolName = body.params?.name;
      if (PROTECTED_TOOLS.includes(toolName) && !userId) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://booking-hotels-three.vercel.app";
        return new NextResponse(JSON.stringify({
          jsonrpc: "2.0",
          id: body.id,
          error: {
            code: 401,
            message: "Unauthorized",
            data: { login_url: `${baseUrl}/oauth/authorize` }
          }
        }), {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate": `Bearer resource_metadata="${baseUrl}/.well-known/oauth-protected-resource"`,
          },
        });
      }
    }
  } catch (e) {
    // Ignore parse errors, let SDK handle it
  }
  
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
        throw new Error(`UNAUTHORIZED: Please login`);
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
  const accept = req.headers.get("accept") || "";
  
  // If accessed via browser (not asking for event-stream), return a friendly message
  if (!accept.includes("text/event-stream")) {
    return new NextResponse("Hotels MCP Server (Streamable HTTP) is active. Please use an MCP client to connect.", {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });
  return transport.handleRequest(req);
}
