import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { siteSettingsSchema } from "@/lib/validations/api";

const SETTINGS_KEY = "site";

const defaultSettings = {
  name: "Loving Family Daycare",
  tagline: "Nurturing young minds",
  email: "info@lovingfamily.ng",
  phone: "+234 801 234 5678",
  address: "12 Unity Avenue, Ikeja, Lagos, Nigeria",
  timezone: "Africa/Lagos",
  logo: null,
  favicon: null,
  primaryColor: "#0D1F5C",
  accentColor: "#F5C518",
  senderName: "Loving Family Daycare",
  senderEmail: "info@lovingfamily.ng",
  emailFooter: "Loving Family Daycare, Lagos, Nigeria",
  stripePublicKey: "",
  posthogKey: "",
  googleAnalyticsId: "",
  sanityProjectId: "",
  sanityDataset: "production",
  clerkPublishableKey: "",
  maintenance: false,
  maintenanceMessage: "We are performing scheduled maintenance.",
  registration: true,
};

export async function GET() {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const setting = await prisma.siteSetting.findUnique({ where: { key: SETTINGS_KEY } });
    return apiResponse(setting?.value ?? defaultSettings);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const data = await parseJson(request, siteSettingsSchema);

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
