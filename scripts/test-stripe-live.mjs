import fs from "node:fs";
import path from "node:path";
import Stripe from "stripe";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");
    process.env[key] ??= value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const secretKey = process.env.STRIPE_SECRET_KEY;
const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const currency = (process.env.STRIPE_TEST_CURRENCY ?? "ngn").toLowerCase();

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY. Add your Stripe test secret key to .env.local.");
}

if (!secretKey.startsWith("sk_test_")) {
  throw new Error("STRIPE_SECRET_KEY is not a test key. Use an sk_test_ key for this script.");
}

if (!publicKey) {
  console.warn("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is missing. The server test can run, but the browser card form will not load.");
} else if (!publicKey.startsWith("pk_test_")) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not a test key. Use a pk_test_ key for browser testing.");
}

const stripe = new Stripe(secretKey, { apiVersion: "2026-02-25.clover" });

console.log(`Testing Stripe with ${currency.toUpperCase()} in test mode...`);

const succeeded = await stripe.paymentIntents.create({
  amount: 1000,
  currency,
  description: "Loving Family Daycare test success",
  payment_method: "pm_card_visa",
  confirm: true,
  automatic_payment_methods: {
    enabled: true,
    allow_redirects: "never",
  },
  metadata: {
    test: "stripe-live-script",
  },
});

if (succeeded.status !== "succeeded") {
  throw new Error(`Expected test payment to succeed, got status: ${succeeded.status}`);
}

console.log(`Success flow ok: ${succeeded.id}`);

try {
  await stripe.paymentIntents.create({
    amount: 1000,
    currency,
    description: "Loving Family Daycare test decline",
    payment_method: "pm_card_chargeDeclined",
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });
  throw new Error("Expected declined test card to fail, but it succeeded.");
} catch (error) {
  if (error?.type !== "StripeCardError") {
    throw error;
  }
  console.log(`Failure flow ok: ${error.code ?? "card_declined"}`);
}

if (webhookSecret) {
  const payload = JSON.stringify({
    id: "evt_test_webhook",
    object: "event",
    type: "payment_intent.succeeded",
    data: { object: succeeded },
  });
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: webhookSecret,
  });
  stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  console.log("Webhook signature flow ok");
} else {
  console.warn("STRIPE_WEBHOOK_SECRET is missing. Skipping webhook signature verification.");
}

console.log("Stripe live test completed.");
