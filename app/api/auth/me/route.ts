import { prisma } from "@/lib/prisma";
import { updateClerkProfileName } from "@/lib/clerk";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { parentPatchSchema } from "@/lib/validations/api";

export async function GET() {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);

    const user = await prisma.user.findUnique({
      where: { clerkId: session.clerkId },
      include: {
        children: { include: { medicalInfo: true } },
        payments: { orderBy: { createdAt: "desc" }, take: 10 },
        tickets: { orderBy: { createdAt: "desc" }, take: 10 },
        notifications: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!user) return apiError("User profile not found", 404);
    return apiResponse(user);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const data = await parseJson(request, parentPatchSchema.omit({ role: true }));

    if (data.name) {
      await updateClerkProfileName(session.clerkId, data.name);
    }

    const user = await prisma.user.update({
      where: { clerkId: session.clerkId },
      data,
      include: {
        children: { include: { medicalInfo: true } },
        payments: { orderBy: { createdAt: "desc" }, take: 10 },
        tickets: { orderBy: { createdAt: "desc" }, take: 10 },
        notifications: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    return apiResponse(user);
  } catch (error) {
    return handleRouteError(error);
  }
}
