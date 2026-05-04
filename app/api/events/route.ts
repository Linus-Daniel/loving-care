import { sanityClient } from "@/lib/sanity";
import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { eventCreateSchema } from "@/lib/validations/api";

export async function GET() {
  try {
    // Fetch events from Sanity (CMS)
    const sanityEvents = await sanityClient.fetch(`*[_type == "event"] | order(date asc){
      "_id": _id,
      "id": _id,
      title,
      description,
      date,
      time,
      location,
      capacity,
      visibility,
      status,
      "coverPhoto": image.asset->url
    }`);

    // Fetch all registrations from Prisma to merge
    const registrations = await prisma.eventRegistration.findMany();

    // Merge registrations into Sanity events
    const events = sanityEvents.map((event: any) => ({
      ...event,
      registrations: registrations.filter((r) => r.eventId === event.id),
    }));

    return apiResponse(events);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const data = await parseJson(request, eventCreateSchema);
    
    // For now, continue writing to Prisma as a backup or if the user wants to keep the internal admin flow
    // But ideally, this should write to Sanity if it's "CMS managed"
    const event = await prisma.event.create({ data: { ...data, createdBy: session.clerkId } });

    return apiResponse(event, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
