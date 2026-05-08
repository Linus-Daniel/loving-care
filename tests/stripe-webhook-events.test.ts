import assert from "node:assert/strict";
import test from "node:test";

import { handleStripeWebhookEvent } from "../lib/server/stripe-webhook-events.ts";

function createHarness() {
  const paymentUpdates: unknown[] = [];
  const invoiceUpdates: unknown[] = [];
  const notifications: unknown[] = [];
  const receipts: unknown[] = [];
  const retrievedCharges: string[] = [];

  const prisma = {
    payment: {
      async findUnique() {
        return {
          id: "payment_123",
          amount: 60000,
          currency: "NGN",
          description: "Tuition for 1 month",
          user: { name: "Parent One", email: "parent@example.com" },
        };
      },
      async updateMany(input: unknown) {
        paymentUpdates.push(input);
      },
    },
    invoice: {
      async updateMany(input: unknown) {
        invoiceUpdates.push(input);
      },
    },
  };

  const stripe = {
    charges: {
      async retrieve(chargeId: string) {
        retrievedCharges.push(chargeId);
        return { receipt_url: `https://pay.stripe.test/receipts/${chargeId}` };
      },
    },
  };

  return {
    invoiceUpdates,
    notifications,
    paymentUpdates,
    receipts,
    retrievedCharges,
    prisma,
    stripe,
    notifyAdmins: async (input: unknown) => {
      notifications.push(input);
    },
    sendReceiptEmail: async (input: unknown) => {
      receipts.push(input);
    },
  };
}

test("marks payment intent as succeeded and sends admin/parent notifications", async () => {
  const harness = createHarness();

  await handleStripeWebhookEvent({
    event: {
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_test_123",
          latest_charge: "ch_test_123",
          payment_method: "pm_card_visa",
        },
      },
    },
    notifyAdmins: harness.notifyAdmins,
    prisma: harness.prisma,
    sendReceiptEmail: harness.sendReceiptEmail,
    stripe: harness.stripe,
  });

  assert.deepEqual(harness.retrievedCharges, ["ch_test_123"]);
  assert.deepEqual(harness.paymentUpdates[0], {
    where: { stripePaymentId: "pi_test_123" },
    data: {
      status: "SUCCEEDED",
      receiptUrl: "https://pay.stripe.test/receipts/ch_test_123",
      paymentMethod: "pm_card_visa",
    },
  });
  assert.equal(harness.notifications.length, 1);
  assert.equal(harness.receipts.length, 1);
  assert.match(String((harness.notifications[0] as { message: string }).message), /Parent One paid NGN 60,000/);
});

test("marks payment intent as failed", async () => {
  const harness = createHarness();

  await handleStripeWebhookEvent({
    event: {
      type: "payment_intent.payment_failed",
      data: { object: { id: "pi_test_failed" } },
    },
    notifyAdmins: harness.notifyAdmins,
    prisma: harness.prisma,
    sendReceiptEmail: harness.sendReceiptEmail,
    stripe: harness.stripe,
  });

  assert.deepEqual(harness.paymentUpdates[0], {
    where: { stripePaymentId: "pi_test_failed" },
    data: { status: "FAILED" },
  });
});

test("marks invoice as paid or overdue from Stripe invoice metadata", async () => {
  const harness = createHarness();

  await handleStripeWebhookEvent({
    event: { type: "invoice.paid", data: { object: { metadata: { invoiceId: "invoice_123" } } } },
    notifyAdmins: harness.notifyAdmins,
    prisma: harness.prisma,
    sendReceiptEmail: harness.sendReceiptEmail,
    stripe: harness.stripe,
  });

  await handleStripeWebhookEvent({
    event: { type: "invoice.payment_failed", data: { object: { metadata: { invoiceId: "invoice_456" } } } },
    notifyAdmins: harness.notifyAdmins,
    prisma: harness.prisma,
    sendReceiptEmail: harness.sendReceiptEmail,
    stripe: harness.stripe,
  });

  assert.equal((harness.invoiceUpdates[0] as { where: { id: string }; data: { status: string } }).where.id, "invoice_123");
  assert.equal((harness.invoiceUpdates[0] as { where: { id: string }; data: { status: string } }).data.status, "PAID");
  assert.ok((harness.invoiceUpdates[0] as { data: { paidAt: Date } }).data.paidAt instanceof Date);
  assert.deepEqual(harness.invoiceUpdates[1], {
    where: { id: "invoice_456" },
    data: { status: "OVERDUE" },
  });
});
