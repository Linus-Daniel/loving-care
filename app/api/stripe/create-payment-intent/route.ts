import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { createPaymentIntentRecord } from "@/lib/server/stripe-payments";
import { stripe } from "@/lib/stripe";
import { paymentIntentSchema } from "@/lib/validations/api";

export async function POST(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN"]);
    const data = await parseJson(request, paymentIntentSchema);
    const result = await createPaymentIntentRecord({
      input: data,
      prisma,
      session,
      stripe,
    });

    return apiResponse(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
