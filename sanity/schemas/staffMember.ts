import { defineField, defineType } from "sanity";

export const staffMember = defineType({
  name: "staffMember",
  title: "Staff Member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "class", type: "string" }),
    defineField({ name: "bio", type: "text" }),
    defineField({ name: "photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", type: "number" }),
  ],
});
