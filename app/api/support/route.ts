import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { supportCreateSchema } from "@/lib/validations/api";

export async function GET() {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    if (!session.userId) return apiError("User record not found", 404);
    const tickets = await prisma.supportTicket.findMany({
      where: session.role === "PARENT" ? { userId: session.userId } : {},
      include: { user: true, replies: true },
      orderBy: { createdAt: "desc" },
    });

    return apiResponse(tickets);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    if (!session.userId) return apiError("User record not found", 404);
    const data = await parseJson(request, supportCreateSchema);
    const ticket = await prisma.supportTicket.create({ data: { ...data, userId: session.userId } });

    return apiResponse(ticket, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
