import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomBytes } from "node:crypto";

export async function GET(req: NextRequest) {
  // In a real app, you'd get the user ID from the session/cookie
  // For this demo, we'll use a simplified approach or expect a header
  // But since we use useAuthStore on the client, we should ideally have a session
  
  // For now, let's try to get it from a header or just return 401 if not found
  // In this simple app, we don't have complex session management yet
  // Let's assume the client sends the userId for now (not secure, but fits the "simple" demo)
  const userId = req.headers.get("x-user-id"); 

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { apiKey: true }
  });

  return NextResponse.json({ apiKey: user?.apiKey });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = "hk_" + randomBytes(16).toString('hex');

  const user = await prisma.user.update({
    where: { id: userId },
    data: { apiKey }
  });

  return NextResponse.json({ apiKey: user.apiKey });
}
