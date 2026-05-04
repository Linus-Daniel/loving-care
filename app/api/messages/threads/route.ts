import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, requireSession } from "@/lib/server/api";

export async function GET() {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    if (!session.userId) return apiError("User record not found", 404);

    const messages = await prisma.message.findMany({
      where: session.role === "PARENT" ? { OR: [{ senderId: session.userId }, { receiverId: session.userId }] } : {},
      include: { sender: true },
      orderBy: { createdAt: "desc" },
    });

    const threads = Array.from(new Map(messages.map((message) => [message.threadId, message])).values());
    return apiResponse(threads);
  } catch (error) {
    return handleRouteError(error);
  }
}
