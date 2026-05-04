import { sanityClient } from "@/lib/sanity";
import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError } from "@/lib/server/api";

export async function GET() {
  try {
    const now = new Date().toISOString().split('T')[0];
    
    // Fetch events from Sanity (CMS)
    const sanityEvents = await sanityClient.fetch(`*[_type == "event" && (visibility == "public" || visibility == "parents") && date >= $now] | order(date asc){
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
      "imageUrl": image.asset->url
    }`, { now });

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
