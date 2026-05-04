import { prisma } from "@/lib/prisma";
import { updateClerkRole } from "@/lib/clerk";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { parentPatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;

    if (session.role === "PARENT" && session.userId !== id) {
      return apiError("Parent not found", 404);
    }

    const parent = await prisma.user.findUnique({
      where: { id },
      include: {
        children: { include: { medicalInfo: true } },
        payments: { orderBy: { createdAt: "desc" }, take: 20 },
        tickets: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });

    if (!parent) return apiError("Parent not found", 404);
    return apiResponse(parent);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const data = await parseJson(request, parentPatchSchema);

    if (session.role === "PARENT" && session.userId !== id) {
      return apiError("Parent not found", 404);
    }

    if (session.role === "PARENT" && data.role) {
      return apiError("Parents cannot change roles", 403);
    }

    if (data.role === "SUPER_ADMIN" && session.role !== "SUPER_ADMIN") {
      return apiError("Only super admins can assign super admin", 403);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      include: { children: true },
    });

    if (data.role && !user.clerkId.startsWith("pending:")) {
      await updateClerkRole(user.clerkId, data.role);
    }

    return apiResponse(user);
  } catch (error) {
    return handleRouteError(error);
  }
}

