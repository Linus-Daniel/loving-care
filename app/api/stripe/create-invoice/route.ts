import { prisma } from "@/lib/prisma";
import { sendStripeInvoice } from "@/lib/server/invoices";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { invoiceCreateSchema } from "@/lib/validations/api";

function invoiceNumber() {
  return `LFD-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const data = await parseJson(request, invoiceCreateSchema);
    const total = data.items.reduce((sum, item) => sum + item.amount, 0);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: invoiceNumber(),
        parentEmail: data.parentEmail,
        parentName: data.parentName,
        items: data.items,
        total,
        dueDate: data.dueDate,
        sentAt: data.sendImmediately ? new Date() : null,
      },
    });

    if (data.sendImmediately) {
      await sendStripeInvoice(invoice);
    }

    return apiResponse(invoice, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
