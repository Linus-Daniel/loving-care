import { createClient } from "@sanity/client";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "iefousm2";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_TOKEN in environment or .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-02",
  token,
  useCdn: false,
});

const whyUsItems = [
  {
    _key: "safe-nurturing-care",
    title: "Safe, Nurturing Care",
    description:
      "Children are welcomed into a calm, supervised environment with caring teachers, clear routines, and age-appropriate safety practices.",
    icon: "shield",
  },
  {
    _key: "play-based-learning",
    title: "Play-Based Learning",
    description:
      "Our daily activities blend guided discovery, early literacy, numeracy, art, music, and outdoor play so children learn with confidence.",
    icon: "graduation",
  },
  {
    _key: "family-partnership",
    title: "Family Partnership",
    description:
      "Parents receive regular updates, open communication, and support from a team that works with each family as children grow.",
    icon: "heart",
  },
];

const testimonials = [
  {
    _key: "testimonial-amaka-okafor",
    parentName: "Amaka Okafor",
    quote:
      "Loving Family has been a second home for our daughter. She comes home excited, confident, and always ready to tell us what she learned.",
    rating: 5,
  },
  {
    _key: "testimonial-tunde-adebayo",
    parentName: "Tunde Adebayo",
    quote:
      "The teachers are patient, attentive, and genuinely invested in the children. The parent updates give us real peace of mind.",
    rating: 5,
  },
  {
    _key: "testimonial-chinwe-nnamdi",
    parentName: "Chinwe Nnamdi",
    quote:
      "We noticed a big improvement in our son's speech, social confidence, and independence within a few months of joining.",
    rating: 5,
  },
];

const fallbackHomeContent = {
  _type: "homepageContent",
  heroHeadline: "Where Little Minds Grow & Families Thrive",
  heroSubtext:
    "A warm, safe, and stimulating environment where your child can explore, learn, and develop to their fullest potential.",
  stats: [
    { _key: "happy-families", label: "Happy Families", value: 200, suffix: "+" },
    { _key: "years-experience", label: "Years Experience", value: 10, suffix: "+" },
    { _key: "qualified-staff", label: "Qualified Staff", value: 30, suffix: "+" },
    { _key: "programs-offered", label: "Programs Offered", value: 6, suffix: "" },
  ],
};

async function main() {
  const existing = await client.fetch(`*[_type == "homepageContent"][0]{_id}`);
  const documentId = existing?._id ?? "homepageContent";

  if (existing?._id) {
    await client
      .patch(documentId)
      .set({
        whyUsItems,
        testimonials,
      })
      .commit();
  } else {
    await client.createIfNotExists({
      _id: documentId,
      ...fallbackHomeContent,
      whyUsItems,
      testimonials,
    });
  }

  const seeded = await client.fetch(`*[_type == "homepageContent" && _id == $id][0]{
    _id,
    "whyUsCount": count(whyUsItems),
    "testimonialCount": count(testimonials)
  }`, { id: documentId });

  console.log(
    `Seeded ${seeded.whyUsCount} why-us items and ${seeded.testimonialCount} testimonials into ${seeded._id}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
