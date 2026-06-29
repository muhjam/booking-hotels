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

  // Pre-check for protected tools before passing to SDK
  // This is needed to return a real HTTP 401 which triggers ChatGPT's OAuth flow
  try {
    const body = await req.clone().json();
    if (body.method === "tools/call") {
      const toolName = body.params?.name;
      if (PROTECTED_TOOLS.includes(toolName) && !userId) {
        const url = new URL(req.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        
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
  const authHeader = req.headers.get("authorization");
  
  // If accessed via browser (not asking for event-stream), return a friendly message
  if (!accept.includes("text/event-stream")) {
    return new NextResponse("Hotels MCP Server (Stateless) is active.", {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }

  // Discovery: If no token is provided, return 401 with discovery info
  if (!authHeader) {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Bearer resource_metadata="${baseUrl}/.well-known/oauth-protected-resource"`,
      },
    });
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  
  const response = await transport.handleRequest(req);
  response.headers.set("X-Accel-Buffering", "no");
  return response;
}
