import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomBytes } from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId;
    const clientId = body.clientId || "mcp-default-client";
    const { codeChallenge, codeChallengeMethod } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a secure random code
    const code = randomBytes(24).toString('hex');

    // Store the code with an expiry (e.g., 10 minutes)
    await prisma.oAuthToken.create({
      data: {
        userId,
        code,
        codeChallenge: codeChallenge || null,
        codeChallengeMethod: codeChallengeMethod || null,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json({ code });
  } catch (error) {
    console.error("OAuth Authorize Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
