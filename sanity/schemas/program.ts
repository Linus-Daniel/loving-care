import { defineField, defineType } from "sanity";

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "ageRange", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "features", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "weeklySchedule", type: "array", of: [{ type: "object", fields: [
      { name: "day", type: "string" },
      { name: "activity", type: "string" },
    ] }] }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "isActive", type: "boolean", initialValue: true }),
  ],
});
