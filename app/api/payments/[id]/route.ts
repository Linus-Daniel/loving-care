import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { stripe } from "@/lib/stripe";
import { paymentRefundSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!payment || (session.role === "PARENT" && payment.userId !== session.userId)) {
      return apiError("Payment not found", 404);
    }

    return apiResponse(payment);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const data = await parseJson(request, paymentRefundSchema);
    const payment = await prisma.payment.findUnique({ where: { id } });

    if (!payment) return apiError("Payment not found", 404);
    if (!payment.stripePaymentId) return apiError("Payment is not linked to Stripe", 409);
    if (payment.status === "REFUNDED") return apiError("Payment has already been refunded", 409);

    const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentId);
    const latestCharge =
      typeof paymentIntent.latest_charge === "string" ? paymentIntent.latest_charge : paymentIntent.latest_charge?.id;

    if (!latestCharge) return apiError("Stripe charge not found for payment", 409);

    const refund = await stripe.refunds.create({
      charge: latestCharge,
      amount: data.amount ? Math.round(data.amount * 100) : undefined,
      reason: data.reason,
      metadata: { paymentId: payment.id },
    });

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { status: "REFUNDED" },
      include: { user: true },
    });

    return apiResponse({ payment: updatedPayment, refund });
  } catch (error) {
    return handleRouteError(error);
  }
}
