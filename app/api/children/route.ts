import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, paginationParams, parseJson, requireSession } from "@/lib/server/api";
import { childCreateSchema } from "@/lib/validations/api";

export async function GET(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const url = new URL(request.url);
    const { page, pageSize, skip } = paginationParams(url);
    const status = url.searchParams.get("status") ?? undefined;
    const program = url.searchParams.get("program") ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;

    const where = {
      ...(session.role === "PARENT" ? { parentId: session.userId } : {}),
      ...(status ? { status: status as "PENDING" | "ACTIVE" | "INACTIVE" | "GRADUATED" } : {}),
      ...(program ? { program } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [children, total] = await Promise.all([
      prisma.child.findMany({
        where,
        include: { parent: true, medicalInfo: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.child.count({ where }),
    ]);

    return apiResponse(children, { meta: { page, pageSize, total } });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const data = await parseJson(request, childCreateSchema);
    const child = await prisma.child.create({ data });

    return apiResponse(child, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
