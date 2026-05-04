import { sanityClient } from "@/lib/sanity";
import { apiResponse, handleRouteError } from "@/lib/server/api";

export async function GET() {
  try {
    const about = await sanityClient.fetch(`*[_type == "aboutContent"][0]{
      heroTitle,
      heroSubtitle,
      "heroImageUrl": heroImage.asset->url,
      missionTitle,
      missionBody,
      visionTitle,
      visionBody,
      timeline,
      values,
      awards
    }`);

    return apiResponse(about);
  } catch (error) {
    return handleRouteError(error);
  }
}
