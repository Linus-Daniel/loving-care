import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY ?? "re_missing_key");

export const defaultFromEmail =
  process.env.RESEND_FROM_EMAIL ?? "Loving Family Daycare <noreply@lovingfamilydaycare.ng>";
