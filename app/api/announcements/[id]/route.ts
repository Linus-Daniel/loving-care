import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { announcementPatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const announcement = await prisma.announcement.findUnique({ where: { id } });

    if (!announcement) return apiError("Announcement not found", 404);
    if (session.role === "PARENT" && (announcement.isDraft || announcement.targetRole !== "PARENT")) {
      return apiError("Announcement not found", 404);
    }

    return apiResponse(announcement);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const data = await parseJson(request, announcementPatchSchema);

    const existing = await prisma.announcement.findUnique({ where: { id }, select: { sentAt: true } });
    if (!existing) return apiError("Announcement not found", 404);
    if (existing.sentAt) return apiError("Sent announcements are read-only", 409);

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        ...data,
        sentAt: data.isDraft || data.scheduledAt ? null : data.isDraft === false ? new Date() : undefined,
      },
    });

    return apiResponse(announcement);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const existing = await prisma.announcement.findUnique({ where: { id }, select: { sentAt: true } });
    if (!existing) return apiError("Announcement not found", 404);
    if (existing.sentAt) return apiError("Sent announcements cannot be deleted", 409);

    await prisma.announcement.delete({ where: { id } });
    return apiResponse({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
