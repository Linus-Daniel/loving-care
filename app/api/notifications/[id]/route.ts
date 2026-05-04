import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { notificationPatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    if (!session.userId) return apiError("User record not found", 404);

    const { id } = await params;
    const data = await parseJson(request, notificationPatchSchema);
    const existing = await prisma.notification.findUnique({ where: { id }, select: { userId: true } });
    if (!existing || existing.userId !== session.userId) return apiError("Notification not found", 404);

    const notification = await prisma.notification.update({ where: { id }, data });
    return apiResponse(notification);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    if (!session.userId) return apiError("User record not found", 404);

    const { id } = await params;
    const existing = await prisma.notification.findUnique({ where: { id }, select: { userId: true } });
    if (!existing || existing.userId !== session.userId) return apiError("Notification not found", 404);

    await prisma.notification.delete({ where: { id } });
    return apiResponse({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
