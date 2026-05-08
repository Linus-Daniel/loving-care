type PaymentIntentInput = {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

type PaymentSession = {
  userId?: string;
};

type StripePaymentIntent = {
  id: string;
  client_secret: string | null;
};

type StripeClient = {
  paymentIntents: {
    create(input: {
      amount: number;
      currency: string;
      description: string;
      metadata: Record<string, string>;
      automatic_payment_methods: { enabled: true };
    }): Promise<StripePaymentIntent>;
  };
};

type PrismaPaymentClient = {
  payment: {
    create(input: {
      data: {
        userId: string;
        stripePaymentId: string;
        amount: number;
        currency: string;
        status: "PENDING";
        description: string;
        paymentMethod?: string | null;
      };
    }): Promise<unknown>;
  };
};

export function stripeAmountFromMajorUnit(amount: number) {
  return Math.round(amount * 100);
}

export function stringifyMetadata(metadata?: PaymentIntentInput["metadata"]) {
  return Object.fromEntries(
    Object.entries(metadata ?? {})
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );
}

export async function createPaymentIntentRecord({
  input,
  prisma,
  session,
  stripe,
}: {
  input: PaymentIntentInput;
  prisma: PrismaPaymentClient;
  session: PaymentSession;
  stripe: StripeClient;
}) {
  if (!session.userId) {
    throw new Response("User record not found", { status: 404 });
  }

  const currency = input.currency.toLowerCase();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: stripeAmountFromMajorUnit(input.amount),
    currency,
    description: input.description,
    metadata: {
      userId: session.userId,
      ...stringifyMetadata(input.metadata),
    },
    automatic_payment_methods: { enabled: true },
  });

  if (!paymentIntent.client_secret) {
    throw new Error("Stripe did not return a client secret");
  }

  const payment = await prisma.payment.create({
    data: {
      userId: session.userId,
      stripePaymentId: paymentIntent.id,
      amount: input.amount,
      currency: currency.toUpperCase(),
      status: "PENDING",
      description: input.description,
    },
  });

  return { clientSecret: paymentIntent.client_secret, payment };
}
