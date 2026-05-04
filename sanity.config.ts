import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { announcement } from "./sanity/schemas/announcement";
import { aboutContent } from "./sanity/schemas/aboutContent";
import { event } from "./sanity/schemas/event";
import { faqItem } from "./sanity/schemas/faqItem";
import { galleryImage } from "./sanity/schemas/galleryImage";
import { homepageContent } from "./sanity/schemas/homepageContent";
import { program } from "./sanity/schemas/program";
import { staffMember } from "./sanity/schemas/staffMember";
export default defineConfig({
  name: "loving-family-daycare",
  title: "Loving Family Daycare",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "iefousm2",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/admin/studio",
  plugins: [structureTool()],
  schema: {
    types: [program, event, staffMember, galleryImage, faqItem, announcement, homepageContent, aboutContent],
  },
});
