import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { resourcePatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const resource = await prisma.resource.findUnique({ where: { id } });

    if (!resource) return apiError("Resource not found", 404);
    if (session.role === "PARENT" && !["parents", "public"].includes(resource.visibility)) {
      return apiError("Resource not found", 404);
    }

    return apiResponse(resource);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const data = await parseJson(request, resourcePatchSchema);
    const resource = await prisma.resource.update({ where: { id }, data });

    return apiResponse(resource);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    await prisma.resource.delete({ where: { id } });

    return apiResponse({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
