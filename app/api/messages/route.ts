import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { safeNotifyAdmins } from "@/lib/server/notifications";
import { messageCreateSchema } from "@/lib/validations/api";

export async function GET(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    if (!session.userId) return apiError("User record not found", 404);
    const url = new URL(request.url);
    const threadId = url.searchParams.get("threadId");
    const otherUserId = url.searchParams.get("userId");
    const canReadAllThreads = session.role !== "PARENT";

    if (threadId && !canReadAllThreads) {
      const belongsToThread = await prisma.message.findFirst({
        where: {
          threadId,
          OR: [{ senderId: session.userId }, { receiverId: session.userId }],
        },
        select: { id: true },
      });

      if (!belongsToThread) return apiError("Thread not found", 404);
    }

    const messages = await prisma.message.findMany({
      where: threadId
        ? { threadId }
        : otherUserId
          ? {
              OR: [
                { senderId: session.userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: session.userId },
              ],
            }
          : { OR: [{ senderId: session.userId }, { receiverId: session.userId }] },
      include: { sender: true },
      orderBy: { createdAt: "asc" },
    });

    return apiResponse(messages);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    if (!session.userId) return apiError("User record not found", 404);
    const data = await parseJson(request, messageCreateSchema);
    let receiverId = data.receiverId;

    if (!receiverId && data.threadId) {
      const threadMessage = await prisma.message.findFirst({
        where: { threadId: data.threadId },
        orderBy: { createdAt: "desc" },
        select: { senderId: true, receiverId: true },
      });

      if (!threadMessage) return apiError("Thread not found", 404);
      receiverId = threadMessage.senderId === session.userId ? threadMessage.receiverId : threadMessage.senderId;
    }

    if (!receiverId) return apiError("Receiver not found", 404);
    const receiver = await prisma.user.findUnique({ where: { id: receiverId }, select: { id: true, role: true } });
    if (!receiver) return apiError("Receiver not found", 404);

    const threadId = data.threadId ?? [session.userId, receiverId].sort().join(":");
    const message = await prisma.message.create({
      data: { senderId: session.userId, receiverId, content: data.content, threadId },
    });

    const adminRoles = ["ADMIN", "SUPER_ADMIN", "STAFF"];
    if (session.role === "PARENT" && adminRoles.includes(receiver.role)) {
      await safeNotifyAdmins({
        title: "New parent message",
        message: data.content.length > 90 ? `${data.content.slice(0, 90)}...` : data.content,
        type: "message",
        link: "/admin/messages",
        userIds: [receiver.id],
      });
    }

    return apiResponse(message, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
