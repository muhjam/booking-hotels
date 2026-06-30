import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const clientId = "mcp-default-client";

        return NextResponse.json({
            client_id: clientId,
            client_name: body.client_name || "ChatGPT MCP",
            redirect_uris: body.redirect_uris || [],
            grant_types: ["authorization_code", "refresh_token"],
            response_types: ["code"],
            token_endpoint_auth_method: "none"
        });
    } catch (error) {
        console.error("OAuth Register Error:", error);
        return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
}
