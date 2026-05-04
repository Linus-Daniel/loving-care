import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, paginationParams, requireSession } from "@/lib/server/api";

export async function GET(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const url = new URL(request.url);
    const { page, pageSize, skip } = paginationParams(url);
    const status = url.searchParams.get("status") ?? undefined;

    const where = {
      ...(session.role === "PARENT" ? { userId: session.userId } : {}),
      ...(status ? { status: status as "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED" } : {}),
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where, include: { user: true }, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
      prisma.payment.count({ where }),
    ]);

    return apiResponse(payments, { meta: { page, pageSize, total } });
  } catch (error) {
    return handleRouteError(error);
  }
}
