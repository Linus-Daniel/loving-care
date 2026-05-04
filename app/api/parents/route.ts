import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, paginationParams, requireSession } from "@/lib/server/api";

export async function GET(request: Request) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const url = new URL(request.url);
    const { page, pageSize, skip } = paginationParams(url);
    const search = url.searchParams.get("search") ?? undefined;
    const allRoles = url.searchParams.get("allRoles") === "true";
    const where = {
      ...(allRoles && ["ADMIN", "SUPER_ADMIN"].includes(session.role) ? {} : { role: "PARENT" as const }),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [parents, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { children: true, payments: { orderBy: { createdAt: "desc" }, take: 5 } },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return apiResponse(parents, { meta: { page, pageSize, total } });
  } catch (error) {
    return handleRouteError(error);
  }
}
