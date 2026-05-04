import { prisma } from "@/lib/prisma";
import { approveRegistration, sendApprovalEmail } from "@/lib/server/registrations";
import { apiError, apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { registrationPatchSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const { id } = await params;
    const registration = await prisma.registration.findUnique({ where: { id } });

    if (!registration) {
      return apiError("Registration not found", 404);
    }

    return apiResponse(registration);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const data = await parseJson(request, registrationPatchSchema);

    const registration = await prisma.registration.update({
      where: { id },
      data: { ...data, reviewedBy: data.reviewedBy ?? session.clerkId },
    });

    if (data.status === "APPROVED") {
      await prisma.$transaction(async (tx) => {
        await approveRegistration(tx, registration);
      });
      await sendApprovalEmail(registration);
    }

    return apiResponse(registration);
  } catch (error) {
    return handleRouteError(error);
  }
}
