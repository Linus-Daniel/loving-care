import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { sendPaymentReceiptEmail } from "@/lib/server/email";
import { safeNotifyAdmins } from "@/lib/server/notifications";
import { apiResponse, handleRouteError } from "@/lib/server/api";
import { handleStripeWebhookEvent } from "@/lib/server/stripe-webhook-events";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");
    if (!signature) throw new Error("Missing Stripe signature");

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );

    await handleStripeWebhookEvent({
      event,
      notifyAdmins: safeNotifyAdmins,
      prisma,
      sendReceiptEmail: sendPaymentReceiptEmail,
      stripe,
    });

    return apiResponse({ received: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
