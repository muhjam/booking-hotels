import prisma from "./prisma";

export async function getUserIdFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  
  const tokenRecord = await prisma.oAuthToken.findUnique({
    where: { accessToken: token },
    select: { userId: true, expiresAt: true },
  });

  if (!tokenRecord || (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date())) {
    return null;
  }

  return tokenRecord.userId;
}
