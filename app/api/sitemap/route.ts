import { apiResponse, handleRouteError, requireSession } from "@/lib/server/api";

export async function POST() {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    return apiResponse({ regenerated: true, message: "Sitemap regeneration is queued for the next build." });
  } catch (error) {
    return handleRouteError(error);
  }
}
