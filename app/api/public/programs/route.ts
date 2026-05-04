import { sanityClient } from "@/lib/sanity";
import { apiResponse, handleRouteError } from "@/lib/server/api";

export async function GET() {
  try {
    const programs = await sanityClient.fetch(`*[_type == "program" && isActive == true] | order(name asc){
      _id,
      name,
      ageRange,
      description,
      features,
      weeklySchedule,
      "imageUrl": image.asset->url
    }`);

    return apiResponse(programs);
  } catch (error) {
    return handleRouteError(error);
  }
}
