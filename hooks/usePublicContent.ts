import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/client/api";

export type PublicProgram = {
  _id?: string;
  name: string;
  ageRange?: string | null;
  description?: string | null;
  features?: string[];
  weeklySchedule?: { day?: string; activity?: string }[];
  imageUrl?: string | null;
};

export type PublicGalleryImage = {
  _id?: string;
  caption?: string | null;
  category?: string | null;
  imageUrl?: string | null;
};

export type PublicFaqItem = {
  _id: string;
  question: string;
  answer: string;
  category?: string | null;
  order?: number | null;
};

export type PublicAboutContent = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImageUrl?: string | null;
  missionTitle?: string | null;
  missionBody?: string | null;
  visionTitle?: string | null;
  visionBody?: string | null;
  timeline?: { year?: string; title?: string; description?: string; icon?: string }[];
  values?: { title?: string; description?: string; icon?: string }[];
  awards?: string[];
} | null;

export type PublicEvent = {
  _id?: string;
  id?: string;
  title: string;
  date: string;
  time?: string | null;
  location?: string | null;
  description?: string | null;
  capacity?: number | null;
  imageUrl?: string | null;
  visibility?: string;
  status?: string;
};

export type PublicHomeContent = {
  home?: {
    heroHeadline?: string | null;
    heroSubtext?: string | null;
    stats?: { label?: string; value?: number; suffix?: string }[];
    whyUsItems?: { title?: string; description?: string; icon?: string }[];
    testimonials?: { parentName?: string; quote?: string; rating?: number; avatarUrl?: string | null }[];
  } | null;
  programs: PublicProgram[];
  gallery: PublicGalleryImage[];
  events: PublicEvent[];
};

export function usePublicHomeContent() {
  return useQuery({
    queryKey: ["public-home-content"],
    queryFn: () => apiGet<PublicHomeContent>("/api/public/home").then((res) => res.data),
  });
}

export function usePublicPrograms() {
  return useQuery({
    queryKey: ["public-programs"],
    queryFn: () => apiGet<PublicProgram[]>("/api/public/programs").then((res) => res.data ?? []),
  });
}

export function usePublicGallery() {
  return useQuery({
    queryKey: ["public-gallery"],
    queryFn: () => apiGet<PublicGalleryImage[]>("/api/public/gallery").then((res) => res.data ?? []),
  });
}

export function usePublicFaq() {
  return useQuery({
    queryKey: ["public-faq"],
    queryFn: () => apiGet<PublicFaqItem[]>("/api/public/faq").then((res) => res.data ?? []),
  });
}

export function usePublicAbout() {
  return useQuery({
    queryKey: ["public-about"],
    queryFn: () => apiGet<PublicAboutContent>("/api/public/about").then((res) => res.data),
  });
}



export function usePublicEvents() {
  return useQuery({
    queryKey: ["public-events"],
    queryFn: () => apiGet<PublicEvent[]>("/api/public/events").then((res) => res.data ?? []),
  });
}
