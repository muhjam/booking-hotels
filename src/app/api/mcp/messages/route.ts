import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_TOOLS } from "@/lib/mcp-logic";
import { getUserIdFromToken } from "@/lib/mcp-auth";

export async function POST(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  const transport = (global as any).mcpTransports?.get(sessionId);

  if (transport) {
    try {
      const body = await req.json();
      const authHeader = req.headers.get("authorization");

      // Check if this is a tool call and if it's protected
      if (body.method === "tools/call") {
        const toolName = body.params?.name;
        if (PROTECTED_TOOLS.includes(toolName)) {
          const userId = await getUserIdFromToken(authHeader);
          if (!userId) {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://booking-hotels-three.vercel.app";
            return new NextResponse("Unauthorized", {
              status: 401,
              headers: {
                "WWW-Authenticate": `Bearer resource_metadata="${baseUrl}/.well-known/oauth-protected-resource"`,
              },
            });
          }
        }
      }

      // Mock Express request/response for handlePostMessage
      const mockReq: any = {
        body,
        query: { sessionId },
        headers: {
          authorization: authHeader
        }
      };
      const mockRes: any = {
        status: (code: number) => ({
          send: (msg: string) => {
            // Handled by NextResponse
          },
          end: () => {}
        }),
        end: () => {}
      };

      await transport.handlePostMessage(mockReq, mockRes);
      return new NextResponse(null, { status: 202 });
    } catch (error) {
      console.error("Error handling MCP message:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: `No active session: ${sessionId}` }, { status: 400 });
  }
}
