import prisma from "./prisma";

export async function getUserIdFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  
  // First, check if it's an OAuth access token
  const tokenRecord = await prisma.oAuthToken.findUnique({
    where: { accessToken: token },
    select: { userId: true, expiresAt: true },
  });

  if (tokenRecord && (!tokenRecord.expiresAt || tokenRecord.expiresAt > new Date())) {
    return tokenRecord.userId;
  }

  // If not an OAuth token, check if it's a direct API Key
  const user = await prisma.user.findUnique({
    where: { apiKey: token },
    select: { id: true },
  });

  return user?.id || null;
}
