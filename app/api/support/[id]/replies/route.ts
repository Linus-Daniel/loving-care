import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { ticketReplyCreateSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    if (!session.userId) return apiError("User record not found", 404);
    const { id } = await params;
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!ticket || (session.role === "PARENT" && ticket.userId !== session.userId)) {
      return apiError("Ticket not found", 404);
    }

    const data = await parseJson(request, ticketReplyCreateSchema);
    const reply = await prisma.ticketReply.create({
      data: {
        ticketId: id,
        content: data.content,
        authorId: session.userId,
        isStaff: session.role !== "PARENT",
      },
    });

    return apiResponse(reply, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
