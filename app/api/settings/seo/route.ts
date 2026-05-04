import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { seoSettingsSchema } from "@/lib/validations/api";

const SETTINGS_KEY = "seo";

const defaultSeoSettings = {
  pages: [
    {
      page: "Home",
      path: "/",
      title: "Loving Family Daycare Nursery School in Lagos",
      description: "A caring Nigerian nursery school platform for admissions, programs, parent communication, payments, and events.",
      keyword: "nursery school",
      ogImage: "",
    },
    {
      page: "Programs",
      path: "/programs",
      title: "Nursery Programs for Infants Toddlers and Preschoolers",
      description: "Explore age-appropriate daycare and nursery programs designed for early learning, safety, creativity, and family partnership.",
      keyword: "nursery programs",
      ogImage: "",
    },
    {
      page: "Registration",
      path: "/register",
      title: "Enroll at Loving Family Daycare",
      description: "Submit a daycare registration request for your child and begin the admissions process with Loving Family Daycare.",
      keyword: "daycare registration",
      ogImage: "",
    },
  ],
  robots: "User-agent: *\nAllow: /\nSitemap: /sitemap.xml",
};

export async function GET() {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const setting = await prisma.siteSetting.findUnique({ where: { key: SETTINGS_KEY } });
    return apiResponse(setting?.value ?? defaultSeoSettings);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const data = await parseJson(request, seoSettingsSchema);
    const setting = await prisma.siteSetting.upsert({
      where: { key: SETTINGS_KEY },
      create: { key: SETTINGS_KEY, value: data, updatedBy: session.clerkId },
      update: { value: data, updatedBy: session.clerkId },
    });

    return apiResponse(setting.value);
  } catch (error) {
    return handleRouteError(error);
  }
}
