import assert from "node:assert/strict";
import test from "node:test";

import {
  createPaymentIntentRecord,
  stringifyMetadata,
  stripeAmountFromMajorUnit,
} from "../lib/server/stripe-payments.ts";

test("converts naira major units to Stripe minor units", () => {
  assert.equal(stripeAmountFromMajorUnit(60000), 6000000);
  assert.equal(stripeAmountFromMajorUnit(1000.5), 100050);
});

test("stringifies metadata and removes empty values", () => {
  assert.deepEqual(
    stringifyMetadata({
      childId: "child_123",
      duration: 3,
      paid: true,
      empty: null,
      missing: undefined,
    }),
    {
      childId: "child_123",
      duration: "3",
      paid: "true",
    },
  );
});

test("creates a Stripe payment intent and local pending payment record", async () => {
  const stripeCalls: unknown[] = [];
  const prismaCalls: unknown[] = [];

  const stripe = {
    paymentIntents: {
      async create(input: unknown) {
        stripeCalls.push(input);
        return { id: "pi_test_123", client_secret: "pi_test_123_secret_abc" };
      },
    },
  };

  const prisma = {
    payment: {
      async create(input: unknown) {
        prismaCalls.push(input);
        return { id: "payment_123" };
      },
    },
  };

  const result = await createPaymentIntentRecord({
    input: {
      amount: 60000,
      currency: "ngn",
      description: "Tuition for 1 month",
      metadata: { childId: "child_123", duration: 1 },
    },
    prisma,
    session: { userId: "user_123" },
    stripe,
  });

  assert.equal(result.clientSecret, "pi_test_123_secret_abc");
  assert.deepEqual(stripeCalls[0], {
    amount: 6000000,
    currency: "ngn",
    description: "Tuition for 1 month",
    metadata: { userId: "user_123", childId: "child_123", duration: "1" },
    automatic_payment_methods: { enabled: true },
  });
  assert.deepEqual(prismaCalls[0], {
    data: {
      userId: "user_123",
      stripePaymentId: "pi_test_123",
      amount: 60000,
      currency: "NGN",
      status: "PENDING",
      description: "Tuition for 1 month",
    },
  });
});

test("fails before calling Stripe when no local user is linked", async () => {
  const stripe = {
    paymentIntents: {
      async create() {
        throw new Error("Stripe should not be called");
      },
    },
  };

  const prisma = {
    payment: {
      async create() {
        throw new Error("Prisma should not be called");
      },
    },
  };

  await assert.rejects(
    createPaymentIntentRecord({
      input: { amount: 60000, currency: "ngn", description: "Tuition" },
      prisma,
      session: {},
      stripe,
    }),
    (error) => error instanceof Response && error.status === 404,
  );
});

test("fails clearly when Stripe does not return a client secret", async () => {
  const stripe = {
    paymentIntents: {
      async create() {
        return { id: "pi_test_missing_secret", client_secret: null };
      },
    },
  };

  const prisma = {
    payment: {
      async create() {
        throw new Error("Prisma should not be called");
      },
    },
  };

  await assert.rejects(
    createPaymentIntentRecord({
      input: { amount: 60000, currency: "ngn", description: "Tuition" },
      prisma,
      session: { userId: "user_123" },
      stripe,
    }),
    /Stripe did not return a client secret/,
  );
});
