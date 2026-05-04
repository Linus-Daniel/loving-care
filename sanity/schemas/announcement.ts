import { defineField, defineType } from "sanity";

export const announcement = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "publishedAt", type: "datetime" }),
  ],
});
