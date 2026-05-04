import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { invoicePatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) return apiError("Invoice not found", 404);
    return apiResponse(invoice);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const data = await parseJson(request, invoicePatchSchema);
    const total = data.items?.reduce((sum, item) => sum + item.amount, 0);

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        parentEmail: data.parentEmail,
        parentName: data.parentName,
        items: data.items,
        total,
        dueDate: data.dueDate,
        status: data.status,
        paidAt: data.paidAt,
        sentAt: data.sendImmediately ? new Date() : undefined,
      },
    });

    return apiResponse(invoice);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return apiResponse(invoice);
  } catch (error) {
    return handleRouteError(error);
  }
}
