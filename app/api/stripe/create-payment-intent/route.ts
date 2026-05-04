import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { stripe } from "@/lib/stripe";
import { paymentIntentSchema } from "@/lib/validations/api";

export async function POST(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN"]);
    const userId = session.userId;
    if (!userId) return apiError("User record not found", 404);

    const data = await parseJson(request, paymentIntentSchema);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: data.currency.toLowerCase(),
      description: data.description,
      metadata: { userId },
      automatic_payment_methods: { enabled: true },
    });

    const payment = await prisma.payment.create({
      data: {
        userId,
        stripePaymentId: paymentIntent.id,
        amount: data.amount,
        currency: data.currency.toUpperCase(),
        status: "PENDING",
        description: data.description,
      },
    });

    return apiResponse({ clientSecret: paymentIntent.client_secret, payment });
  } catch (error) {
    return handleRouteError(error);
  }
}
