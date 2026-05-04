import { sanityClient } from "@/lib/sanity";
import { apiResponse, handleRouteError } from "@/lib/server/api";

export async function GET() {
  try {
    const images = await sanityClient.fetch(`*[_type == "galleryImage"] | order(order asc){
      _id,
      caption,
      category,
      "imageUrl": image.asset->url
    }`);

    return apiResponse(images);
  } catch (error) {
    return handleRouteError(error);
  }
}
