import { sanityClient } from "@/lib/sanity";
import { apiResponse, handleRouteError } from "@/lib/server/api";

export async function GET() {
  try {
    const [home, programs, gallery, events] = await Promise.all([
      sanityClient.fetch(`*[_type == "homepageContent"][0]{
        heroHeadline,
        heroSubtext,
        stats,
        whyUsItems,
        testimonials[]{parentName, quote, rating, "avatarUrl": avatar.asset->url}
      }`),
      sanityClient.fetch(`*[_type == "program" && isActive == true] | order(name asc)[0...3]{
        name,
        ageRange,
        description,
        "imageUrl": image.asset->url
      }`),
      sanityClient.fetch(`*[_type == "galleryImage"] | order(order asc)[0...6]{
        caption,
        category,
        "imageUrl": image.asset->url
      }`),
      sanityClient.fetch(`*[_type == "event" && (visibility == "public" || visibility == "parents") && date >= $now] | order(date asc)[0...3]{
        title,
        date,
        time,
        location,
        description,
        capacity,
        "imageUrl": image.asset->url
      }`, { now: new Date().toISOString().split('T')[0] }),
    ]);

    return apiResponse({ home, programs, gallery, events });
  } catch (error) {
    return handleRouteError(error);
  }
}
