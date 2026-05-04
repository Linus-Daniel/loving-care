import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, requireSession } from "@/lib/server/api";
import { sendStripeInvoice } from "@/lib/server/invoices";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) return apiError("Invoice not found", 404);
    if (invoice.status === "CANCELLED") return apiError("Cancelled invoices cannot be sent", 409);

    const stripeInvoice = await sendStripeInvoice(invoice);
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: { sentAt: new Date() },
    });

    return apiResponse({ invoice: updatedInvoice, stripeInvoice });
  } catch (error) {
    return handleRouteError(error);
  }
}
