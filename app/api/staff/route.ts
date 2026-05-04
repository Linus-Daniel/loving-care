import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { staffCreateSchema } from "@/lib/validations/api";

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({ orderBy: { createdAt: "desc" } });
    return apiResponse(staff);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const data = await parseJson(request, staffCreateSchema);
    const staff = await prisma.staff.create({ data });

    return apiResponse(staff, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
