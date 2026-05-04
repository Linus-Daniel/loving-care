import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type SeoPageSetting = {
  page: string;
  path: string;
  title: string;
  description: string;
  keyword: string;
  ogImage?: string;
};

export type SeoSettingsRecord = {
  pages: SeoPageSetting[];
  robots: string;
};

export function useSeoSettings() {
  return useQuery({
    queryKey: ["seo-settings"],
    queryFn: () => apiGet<SeoSettingsRecord>("/api/settings/seo").then((res) => res.data),
  });
}

export function useUpdateSeoSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SeoSettingsRecord) =>
      apiFetch<SeoSettingsRecord>("/api/settings/seo", { method: "PATCH", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["seo-settings"] });
    },
  });
}
