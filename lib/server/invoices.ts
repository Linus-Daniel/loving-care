import type { Invoice } from "@prisma/client";

import { defaultFromEmail, resend } from "@/lib/resend";
import { stripe } from "@/lib/stripe";

type InvoiceItem = {
  description: string;
  amount: number;
};

function invoiceItems(invoice: Invoice): InvoiceItem[] {
  if (!Array.isArray(invoice.items)) return [];
  return invoice.items.filter(
    (item): item is InvoiceItem =>
      typeof item === "object" &&
      item !== null &&
      "description" in item &&
      "amount" in item &&
      typeof item.description === "string" &&
      typeof item.amount === "number",
  );
}

export async function sendStripeInvoice(invoice: Invoice) {
  const customer = await stripe.customers.create({
    email: invoice.parentEmail,
    name: invoice.parentName,
    metadata: { invoiceId: invoice.id, invoiceNo: invoice.invoiceNo },
  });

  await Promise.all(
    invoiceItems(invoice).map((item) =>
      stripe.invoiceItems.create({
        customer: customer.id,
        currency: "ngn",
        amount: Math.round(item.amount * 100),
        description: item.description,
      }),
    ),
  );

  const stripeInvoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: "send_invoice",
    days_until_due: Math.max(
      Math.ceil((invoice.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      1,
    ),
    metadata: { invoiceId: invoice.id, invoiceNo: invoice.invoiceNo },
  });

  await stripe.invoices.sendInvoice(stripeInvoice.id);
  await resend.emails.send({
    from: defaultFromEmail,
    to: invoice.parentEmail,
    subject: `Invoice ${invoice.invoiceNo} from Loving Family Daycare`,
    text: `Dear ${invoice.parentName}, your invoice ${invoice.invoiceNo} for NGN ${invoice.total.toLocaleString(
      "en-NG",
    )} is due on ${invoice.dueDate.toLocaleDateString("en-NG")}.`,
  });

  return stripeInvoice;
}
