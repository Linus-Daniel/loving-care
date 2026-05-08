import { defineField, defineType } from "sanity";

export const aboutContent = defineType({
  name: "aboutContent",
  title: "About Page Content",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", type: "string" }),
    defineField({ name: "heroSubtitle", type: "text" }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "missionTitle", type: "string" }),
    defineField({ name: "missionBody", type: "text" }),
    defineField({ name: "visionTitle", type: "string" }),
    defineField({ name: "visionBody", type: "text" }),
    defineField({
      name: "timeline",
      type: "array",
      of: [{ type: "object", fields: [
        { name: "year", type: "string" },
        { name: "title", type: "string" },
        { name: "description", type: "text" },
        { name: "icon", type: "string" },
      ] }],
    }),
    defineField({
      name: "values",
      type: "array",
      of: [{ type: "object", fields: [
        { name: "title", type: "string" },
        { name: "description", type: "text" },
        { name: "icon", type: "string" },
      ] }],
    }),
    defineField({ name: "awards", type: "array", of: [{ type: "string" }] }),
  ],
});
