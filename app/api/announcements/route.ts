import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { announcementCreateSchema } from "@/lib/validations/api";

export async function GET(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const url = new URL(request.url);
    const role = url.searchParams.get("role") ?? session.role;
    const announcements = await prisma.announcement.findMany({
      where: {
        isDraft: false,
        OR: [{ targetRole: role as "PARENT" | "ADMIN" | "SUPER_ADMIN" | "STAFF" }, { targetRole: "PARENT" }],
      },
      orderBy: { createdAt: "desc" },
    });

    return apiResponse(announcements);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const data = await parseJson(request, announcementCreateSchema);
    const announcement = await prisma.announcement.create({
      data: { ...data, createdBy: session.clerkId, sentAt: data.isDraft || data.scheduledAt ? null : new Date() },
    });

    if (!announcement.isDraft && !announcement.scheduledAt) {
      const users = await prisma.user.findMany({
        where: { role: announcement.targetRole },
        select: { id: true },
      });

      if (users.length > 0) {
        await prisma.notification.createMany({
          data: users.map((user) => ({
            userId: user.id,
            title: announcement.title,
            message: announcement.body,
            type: "announcement",
            link: "/parent/messages",
          })),
        });
      }
    }

    return apiResponse(announcement, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
