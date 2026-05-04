import { sanityClient } from "@/lib/sanity";
import { prisma } from "@/lib/prisma";
import { apiError, apiResponse, handleRouteError, requireSession } from "@/lib/server/api";
import { eventRegistrationSchema } from "@/lib/validations/api";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN"]);
    if (!session.userId) return apiError("User record not found", 404);
    const { id } = await params;
    const body = await request.text();
    const data = body ? eventRegistrationSchema.parse(JSON.parse(body)) : { reminder: true };

    const event = await sanityClient.fetch(`*[_type == "event" && _id == $id][0]{
      _id,
      capacity,
      "registrationsCount": count(*[_type == "eventRegistration" && eventId == $id])
    }`, { id });

    if (!event) return apiError("Event not found", 404);
    
    // We also need to check registrations from Prisma to enforce capacity correctly
    const registrations = await prisma.eventRegistration.findMany({ where: { eventId: id } });
    const existingRegistration = registrations.some(
      (registration) => registration.userId === session.userId,
    );
    if (event.capacity && !existingRegistration && registrations.length >= event.capacity) {
      return apiError("Event capacity reached", 409);
    }

    const registration = await prisma.eventRegistration.upsert({
      where: { eventId_userId: { eventId: id, userId: session.userId } },
      update: { reminder: data.reminder },
      create: { eventId: id, userId: session.userId, reminder: data.reminder },
    });

    return apiResponse(registration, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN"]);
    if (!session.userId) return apiError("User record not found", 404);
    const { id } = await params;

    await prisma.eventRegistration.deleteMany({ where: { eventId: id, userId: session.userId } });
    return apiResponse({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
