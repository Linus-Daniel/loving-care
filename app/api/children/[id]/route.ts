import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { childPatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

async function canAccessChild(id: string, sessionUserId?: string, isAdmin = false) {
  const child = await prisma.child.findUnique({ where: { id }, include: { parent: true, medicalInfo: true } });
  if (!child) return null;
  if (!isAdmin && child.parentId !== sessionUserId) return null;
  return child;
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const child = await canAccessChild(id, session.userId, session.role !== "PARENT");

    if (!child) return apiError("Child not found", 404);
    return apiResponse(child);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const { medicalInfo, ...data } = await parseJson(request, childPatchSchema);
    const child = await prisma.child.update({
      where: { id },
      data: {
        ...data,
        ...(medicalInfo
          ? {
              medicalInfo: {
                upsert: { create: medicalInfo, update: medicalInfo },
              },
            }
          : {}),
      },
      include: { medicalInfo: true },
    });

    return apiResponse(child);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const child = await prisma.child.update({ where: { id }, data: { status: "INACTIVE" } });

    return apiResponse(child);
  } catch (error) {
    return handleRouteError(error);
  }
}
