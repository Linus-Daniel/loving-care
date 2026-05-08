type PaymentIntentLike = {
  id: string;
  latest_charge?: string | { receipt_url?: string | null } | null;
  payment_method?: string | null;
};

type InvoiceLike = {
  metadata?: { invoiceId?: string | null } | null;
};

type StripeEventLike =
  | { type: "payment_intent.succeeded"; data: { object: PaymentIntentLike } }
  | { type: "payment_intent.payment_failed"; data: { object: PaymentIntentLike } }
  | { type: "invoice.paid"; data: { object: InvoiceLike } }
  | { type: "invoice.payment_failed"; data: { object: InvoiceLike } }
  | { type: string; data: { object: unknown } };

type PaymentWithUser = {
  id: string;
  amount: number;
  currency: string;
  description: string;
  user: {
    name: string;
    email: string;
  };
};

type StripeWebhookPrismaClient = {
  payment: {
    findUnique(input: {
      where: { stripePaymentId: string };
      include: { user: true };
    }): Promise<PaymentWithUser | null>;
    updateMany(input: {
      where: { stripePaymentId: string };
      data: Record<string, unknown>;
    }): Promise<unknown>;
  };
  invoice: {
    updateMany(input: {
      where: { id: string };
      data: Record<string, unknown>;
    }): Promise<unknown>;
  };
};

type StripeChargeClient = {
  charges: {
    retrieve(chargeId: string): Promise<{ receipt_url?: string | null }>;
  };
};

async function receiptUrlForPaymentIntent(paymentIntent: PaymentIntentLike, stripe: StripeChargeClient) {
  if (!paymentIntent.latest_charge) return null;
  if (typeof paymentIntent.latest_charge !== "string") {
    return paymentIntent.latest_charge.receipt_url ?? null;
  }

  const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
  return charge.receipt_url ?? null;
}

export async function handleStripeWebhookEvent({
  event,
  notifyAdmins,
  prisma,
  sendReceiptEmail,
  stripe,
}: {
  event: StripeEventLike;
  notifyAdmins: (input: { title: string; message: string; type: string; link: string }) => Promise<unknown>;
  prisma: StripeWebhookPrismaClient;
  sendReceiptEmail: (input: {
    parentName: string;
    parentEmail: string;
    amount: number;
    currency: string;
    description: string;
    transactionId: string;
    receiptUrl?: string;
    date: Date;
  }) => Promise<unknown>;
  stripe: StripeChargeClient;
}) {
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const receiptUrl = await receiptUrlForPaymentIntent(paymentIntent, stripe);
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
      await notifyAdmins({
        title: "Payment received",
        message: `${payment.user.name} paid ${payment.currency} ${payment.amount.toLocaleString()} for ${payment.description}.`,
        type: "payment",
        link: `/admin/payments/${payment.id}`,
      });
      await sendReceiptEmail({
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
}
