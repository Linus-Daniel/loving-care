import { prisma } from "@/lib/prisma";
import { sendRegistrationConfirmationEmail } from "@/lib/server/email";
import { approveRegistration, sendApprovalEmail } from "@/lib/server/registrations";
import { apiResponse, handleRouteError, paginationParams, parseJson, requireSession } from "@/lib/server/api";
import { registrationBulkPatchSchema, registrationCreateSchema } from "@/lib/validations/api";

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
    const data = await parseJson(request, registrationCreateSchema);
    const registration = await prisma.registration.create({ data });
    await sendRegistrationConfirmationEmail({
      parentName: registration.parentName,
      parentEmail: registration.parentEmail,
      childName: `${registration.childFirstName} ${registration.childLastName}`,
      confirmationNumber: registration.id,
      program: registration.program,
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
