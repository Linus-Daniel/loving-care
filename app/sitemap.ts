import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

type SeoSettings = {
  pages?: Array<{ path: string }>;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  let value: SeoSettings | null = null;

  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "seo" } });
    value = setting?.value as SeoSettings | null;
  } catch {
    value = null;
  }

  const paths = value?.pages?.length
    ? value.pages.map((page) => page.path)
    : ["/", "/about", "/programs", "/gallery", "/events", "/contact", "/register", "/faq", "/privacy-policy", "/terms"];

  return paths.map((path) => ({
    url: `${appUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
