import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { socialSettingsSchema } from "@/lib/validations/api";

const SETTINGS_KEY = "social";

const defaultSocialSettings = {
  platforms: {
    instagram: { enabled: true, url: "" },
    facebook: { enabled: true, url: "" },
    twitter: { enabled: false, url: "" },
  },
  shareButtons: {
    programs: true,
    gallery: true,
    events: true,
  },
};

export async function GET() {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const setting = await prisma.siteSetting.findUnique({ where: { key: SETTINGS_KEY } });
    return apiResponse(setting?.value ?? defaultSocialSettings);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const data = await parseJson(request, socialSettingsSchema);
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
