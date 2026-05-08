import EventReminder from "@/emails/EventReminder";
import PaymentReceipt from "@/emails/PaymentReceipt";
import RegistrationApproved from "@/emails/RegistrationApproved";
import RegistrationConfirmation from "@/emails/RegistrationConfirmation";
import { defaultFromEmail, resend } from "@/lib/resend";

type RegistrationConfirmationInput = {
  parentName: string;
  parentEmail: string;
  childName: string;
  confirmationNumber: string;
  program: string;
  portalSetupUrl: string;
  portalSetupLabel: string;
};

type RegistrationApprovedInput = {
  parentName: string;
  parentEmail: string;
  childName: string;
  startDate: Date;
};

type PaymentReceiptInput = {
  parentName: string;
  parentEmail: string;
  amount: number;
  currency: string;
  description: string;
  transactionId: string;
  receiptUrl?: string;
  date: Date;
};

type EventReminderInput = {
  parentName: string;
  parentEmail: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventTime: string;
};

function appUrl(path = "") {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}${path}`;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export async function sendRegistrationConfirmationEmail(input: RegistrationConfirmationInput) {
  return resend.emails.send({
    from: defaultFromEmail,
    to: input.parentEmail,
    subject: "Registration received - Loving Family Daycare",
    react: RegistrationConfirmation({
      parentName: input.parentName,
      childName: input.childName,
      confirmationNumber: input.confirmationNumber,
      program: input.program,
      portalSetupUrl: input.portalSetupUrl,
      portalSetupLabel: input.portalSetupLabel,
      nextSteps: [
        "Our admissions team will review your application.",
        "Set up your parent portal so payments, messages, and admission updates stay connected to your account.",
        "You will receive an update by email after review.",
        "Keep your confirmation number for follow-up conversations.",
      ],
    }),
  });
}

export async function sendRegistrationApprovedEmail(input: RegistrationApprovedInput) {
  return resend.emails.send({
    from: defaultFromEmail,
    to: input.parentEmail,
    subject: "Registration approved - Loving Family Daycare",
    react: RegistrationApproved({
      parentName: input.parentName,
      childName: input.childName,
      startDate: input.startDate.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      portalLoginUrl: appUrl("/login"),
    }),
  });
}

export async function sendPaymentReceiptEmail(input: PaymentReceiptInput) {
  return resend.emails.send({
    from: defaultFromEmail,
    to: input.parentEmail,
    subject: "Payment receipt - Loving Family Daycare",
    react: PaymentReceipt({
      parentName: input.parentName,
      amount: formatMoney(input.amount, input.currency),
      description: input.description,
      transactionId: input.transactionId,
      date: input.date.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      receiptUrl: input.receiptUrl,
    }),
  });
}

export async function sendEventReminderEmail(input: EventReminderInput) {
  return resend.emails.send({
    from: defaultFromEmail,
    to: input.parentEmail,
    subject: `Reminder: ${input.eventTitle}`,
    react: EventReminder(input),
  });
}
