import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "category", type: "string", options: { list: ["Classroom", "Outdoor", "Events", "Art & Craft"] } }),
    defineField({ name: "order", type: "number" }),
  ],
});
