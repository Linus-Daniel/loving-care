import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { ticketReplyPatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string; replyId: string }> };

async function canManageReply(ticketId: string, replyId: string, sessionUserId: string, isStaff: boolean) {
  const reply = await prisma.ticketReply.findUnique({
    where: { id: replyId },
    include: { ticket: { select: { id: true, userId: true } } },
  });

  if (!reply || reply.ticket.id !== ticketId) return null;
  if (!isStaff && reply.authorId !== sessionUserId) return null;
  return reply;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    if (!session.userId) return apiError("User record not found", 404);

    const { id, replyId } = await params;
    const reply = await canManageReply(id, replyId, session.userId, session.role !== "PARENT");
    if (!reply) return apiError("Reply not found", 404);

    const data = await parseJson(request, ticketReplyPatchSchema);
    const updatedReply = await prisma.ticketReply.update({
      where: { id: replyId },
      data,
    });

    return apiResponse(updatedReply);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id, replyId } = await params;
    const reply = await canManageReply(id, replyId, session.userId ?? "", true);
    if (!reply) return apiError("Reply not found", 404);

    await prisma.ticketReply.delete({ where: { id: replyId } });
    return apiResponse({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
