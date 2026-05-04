import { defineField, defineType } from "sanity";

export const homepageContent = defineType({
  name: "homepageContent",
  title: "Homepage Content",
  type: "document",
  fields: [
    defineField({ name: "heroHeadline", type: "string" }),
    defineField({ name: "heroSubtext", type: "text" }),
    defineField({ name: "stats", type: "array", of: [{ type: "object", fields: [
      { name: "label", type: "string" },
      { name: "value", type: "number" },
      { name: "suffix", type: "string" },
    ] }] }),
    defineField({ name: "whyUsItems", type: "array", of: [{ type: "object", fields: [
      { name: "title", type: "string" },
      { name: "description", type: "text" },
      { name: "icon", type: "string" },
    ] }] }),
    defineField({ name: "testimonials", type: "array", of: [{ type: "object", fields: [
      { name: "parentName", type: "string" },
      { name: "quote", type: "text" },
      { name: "rating", type: "number" },
      { name: "avatar", type: "image" },
    ] }] }),
  ],
});
