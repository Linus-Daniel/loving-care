import { sanityClient } from "@/lib/sanity";
import { apiResponse, handleRouteError } from "@/lib/server/api";

export async function GET() {
  try {
    const faqItems = await sanityClient.fetch(`*[_type == "faqItem"] | order(category asc, order asc){
      _id,
      question,
      answer,
      category,
      order
    }`);

    return apiResponse(faqItems);
  } catch (error) {
    return handleRouteError(error);
  }
}
