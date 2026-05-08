import { prisma } from "@/lib/prisma";
import { createParentInvitation } from "@/lib/clerk";
import { sendRegistrationConfirmationEmail } from "@/lib/server/email";
import { safeNotifyAdmins } from "@/lib/server/notifications";
import {
  approveRegistration,
  ensureParentAccountForRegistration,
  normalizeEmail,
  sendApprovalEmail,
} from "@/lib/server/registrations";
import { apiResponse, handleRouteError, paginationParams, parseJson, requireSession } from "@/lib/server/api";
import { registrationBulkPatchSchema, registrationCreateSchema } from "@/lib/validations/api";

function appUrl(path = "") {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}${path}`;
}

async function getParentSetupUrl(email: string, hasActiveAccount: boolean) {
  if (hasActiveAccount) return appUrl("/login");

  try {
    const invitation = await createParentInvitation(email, appUrl("/parent"));
    return invitation.url ?? appUrl("/signup");
  } catch (error) {
    console.warn("Unable to create Clerk parent invitation", error);
    return appUrl("/signup");
  }
}

export async function GET(request: Request) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? undefined;
    const { page, pageSize, skip } = paginationParams(url);

    const where = status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" | "WAITLISTED" } : {};
    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
      prisma.registration.count({ where }),
    ]);

    return apiResponse(registrations, { meta: { page, pageSize, total } });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await parseJson(request, registrationCreateSchema);
    const data = { ...parsed, parentEmail: normalizeEmail(parsed.parentEmail) };
    const { registration, parentAccount } = await prisma.$transaction(async (tx) => {
      const registration = await tx.registration.create({ data });
      const parentAccount = await ensureParentAccountForRegistration(tx, registration);

      return { registration, parentAccount };
    });
    const hasActiveAccount = !parentAccount.clerkId.startsWith("pending:");
    const portalSetupUrl = await getParentSetupUrl(registration.parentEmail, hasActiveAccount);

    await safeNotifyAdmins({
      title: "New registration submitted",
      message: `${registration.parentName} submitted ${registration.childFirstName} ${registration.childLastName} for ${registration.program}.`,
      type: "registration",
      link: `/admin/registrations/${registration.id}`,
    });
    await sendRegistrationConfirmationEmail({
      parentName: registration.parentName,
      parentEmail: registration.parentEmail,
      childName: `${registration.childFirstName} ${registration.childLastName}`,
      confirmationNumber: registration.id,
      program: registration.program,
      portalSetupUrl,
      portalSetupLabel: hasActiveAccount ? "Sign in to your parent portal" : "Set up your parent portal",
    });

    return apiResponse(registration, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const data = await parseJson(request, registrationBulkPatchSchema);
    const updatedRegistrations = await prisma.$transaction(async (tx) => {
      const registrations = await tx.registration.findMany({ where: { id: { in: data.ids } } });

      for (const registration of registrations) {
        const updated = await tx.registration.update({
          where: { id: registration.id },
          data: {
            status: data.status,
            adminNotes: data.adminNotes,
            reviewedBy: session.clerkId,
          },
        });

        if (data.status === "APPROVED") {
          await approveRegistration(tx, updated);
        }
      }

      return registrations;
    });

    if (data.status === "APPROVED") {
      await Promise.all(updatedRegistrations.map((registration) => sendApprovalEmail(registration)));
    }

    return apiResponse({ updated: updatedRegistrations.length });
  } catch (error) {
    return handleRouteError(error);
  }
}
