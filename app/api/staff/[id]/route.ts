import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { staffPatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) return apiError("Staff member not found", 404);
    return apiResponse(staff);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const data = await parseJson(request, staffPatchSchema);
    const staff = await prisma.staff.update({ where: { id }, data });

    return apiResponse(staff);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const staff = await prisma.staff.update({ where: { id }, data: { isActive: false } });

    return apiResponse(staff);
  } catch (error) {
    return handleRouteError(error);
  }
}
