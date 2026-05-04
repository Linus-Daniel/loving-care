import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { supportPatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: { user: true, replies: { orderBy: { createdAt: "asc" } } },
    });

    if (!ticket || (session.role === "PARENT" && ticket.userId !== session.userId)) {
      return apiError("Ticket not found", 404);
    }

    return apiResponse(ticket);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const data = await parseJson(request, supportPatchSchema);
    const ticket = await prisma.supportTicket.update({ where: { id }, data });

    return apiResponse(ticket);
  } catch (error) {
    return handleRouteError(error);
  }
}
