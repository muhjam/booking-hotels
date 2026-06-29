import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  const transport = (global as any).mcpTransports?.get(sessionId);

  if (transport) {
    try {
      const body = await req.json();
      // Mock Express request/response for handlePostMessage
      const mockReq: any = {
        body,
        query: { sessionId }
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
