import { defaultFromEmail, resend } from "@/lib/resend";
import { apiResponse, handleRouteError, parseJson } from "@/lib/server/api";
import { contactSchema } from "@/lib/validations/api";

export async function POST(request: Request) {
  try {
    const data = await parseJson(request, contactSchema);
    const to = process.env.CONTACT_TO_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? "admin@lovingfamilydaycare.ng";

    await resend.emails.send({
      from: defaultFromEmail,
      to,
      replyTo: data.email,
      subject: `Contact form: ${data.subject}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone ?? "Not provided"}`,
        "",
        data.message,
      ].join("\n"),
    });

    return apiResponse({ sent: true }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
