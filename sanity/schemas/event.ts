import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "time", type: "string" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "capacity", type: "number" }),
    defineField({
      name: "visibility",
      type: "string",
      options: { list: ["public", "parents", "staff"] },
      initialValue: "public",
    }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["scheduled", "ongoing", "completed", "cancelled"] },
      initialValue: "scheduled",
    }),
    defineField({ name: "isPublic", type: "boolean", initialValue: true }),
  ],
});
