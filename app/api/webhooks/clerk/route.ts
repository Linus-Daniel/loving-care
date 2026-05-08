import { Webhook } from "svix";

import { updateClerkRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError } from "@/lib/server/api";
import { normalizeEmail } from "@/lib/server/registrations";

type ClerkUserCreated = {
  id: string;
  email_addresses?: { email_address: string; id: string }[];
  primary_email_address_id?: string;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  public_metadata?: { role?: string };
  unsafe_metadata?: { role?: string };
};

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? "");
    const event = webhook.verify(payload, headers) as { type: string; data: ClerkUserCreated };

    if (event.type === "user.created" || event.type === "user.updated") {
      const primaryEmail =
        event.data.email_addresses?.find((email) => email.id === event.data.primary_email_address_id)
          ?.email_address ?? event.data.email_addresses?.[0]?.email_address;

      if (primaryEmail) {
        const email = normalizeEmail(primaryEmail);
        const role =
          (event.data.public_metadata?.role as "PARENT" | "ADMIN" | "SUPER_ADMIN" | "STAFF" | undefined) ??
          (event.data.unsafe_metadata?.role as "PARENT" | "ADMIN" | "SUPER_ADMIN" | "STAFF" | undefined) ??
          "PARENT";

        await prisma.user.upsert({
          where: { email },
          update: {
            clerkId: event.data.id,
            email,
            name: [event.data.first_name, event.data.last_name].filter(Boolean).join(" ") || email,
            avatar: event.data.image_url,
            role,
          },
          create: {
            clerkId: event.data.id,
            email,
            name: [event.data.first_name, event.data.last_name].filter(Boolean).join(" ") || email,
            avatar: event.data.image_url,
            role,
          },
        });

        if (event.data.public_metadata?.role !== role) {
          await updateClerkRole(event.data.id, role);
        }
      }
    }

    return apiResponse({ received: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
