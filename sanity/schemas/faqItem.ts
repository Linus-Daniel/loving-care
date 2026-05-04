import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "answer", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});
