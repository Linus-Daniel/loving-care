import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

type SeoSettings = {
  robots?: string;
};

export default async function robots(): Promise<MetadataRoute.Robots> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  let value: SeoSettings | null = null;

  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "seo" } });
    value = setting?.value as SeoSettings | null;
  } catch {
    value = null;
  }

  if (!value?.robots) {
    return {
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${appUrl}/sitemap.xml`,
    };
  }

  const disallow = value.robots
    .split("\n")
    .filter((line) => line.toLowerCase().startsWith("disallow:"))
    .map((line) => line.replace(/disallow:/i, "").trim())
    .filter(Boolean);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      ...(disallow.length ? { disallow } : {}),
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
