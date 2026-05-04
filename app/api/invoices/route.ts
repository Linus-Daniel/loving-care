import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, paginationParams, requireSession } from "@/lib/server/api";

export async function GET(request: Request) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const url = new URL(request.url);
    const { page, pageSize, skip } = paginationParams(url);
    const status = url.searchParams.get("status") ?? undefined;
    const where = status ? { status: status as "PENDING" | "PAID" | "OVERDUE" | "CANCELLED" } : {};

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
      prisma.invoice.count({ where }),
    ]);

    return apiResponse(invoices, { meta: { page, pageSize, total } });
  } catch (error) {
    return handleRouteError(error);
  }
}
