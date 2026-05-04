import { headers } from "next/headers";
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { sendPaymentReceiptEmail } from "@/lib/server/email";
import { apiResponse, handleRouteError } from "@/lib/server/api";
import { stripe } from "@/lib/stripe";

async function receiptUrlForPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  if (!paymentIntent.latest_charge) return null;
  if (typeof paymentIntent.latest_charge !== "string") {
    return paymentIntent.latest_charge.receipt_url;
  }

  const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
  return charge.receipt_url;
}

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

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const receiptUrl = await receiptUrlForPaymentIntent(paymentIntent);
      const payment = await prisma.payment.findUnique({
        where: { stripePaymentId: paymentIntent.id },
        include: { user: true },
      });

      await prisma.payment.updateMany({
        where: { stripePaymentId: paymentIntent.id },
        data: {
          status: "SUCCEEDED",
          receiptUrl,
          paymentMethod: paymentIntent.payment_method ? String(paymentIntent.payment_method) : null,
        },
      });

      if (payment) {
        await sendPaymentReceiptEmail({
          parentName: payment.user.name,
          parentEmail: payment.user.email,
          amount: payment.amount,
          currency: payment.currency,
          description: payment.description,
          transactionId: paymentIntent.id,
          receiptUrl: receiptUrl ?? undefined,
          date: new Date(),
        });
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      await prisma.payment.updateMany({
        where: { stripePaymentId: paymentIntent.id },
        data: { status: "FAILED" },
      });
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      const invoiceId = invoice.metadata?.invoiceId;
      if (invoiceId) {
        await prisma.invoice.updateMany({
          where: { id: invoiceId },
          data: { status: "PAID", paidAt: new Date() },
        });
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      const invoiceId = invoice.metadata?.invoiceId;
      if (invoiceId) {
        await prisma.invoice.updateMany({
          where: { id: invoiceId },
          data: { status: "OVERDUE" },
        });
      }
    }

    return apiResponse({ received: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
