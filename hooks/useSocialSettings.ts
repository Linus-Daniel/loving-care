import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type SocialSettingsRecord = {
  platforms: {
    instagram: { enabled: boolean; url: string };
    facebook: { enabled: boolean; url: string };
    twitter: { enabled: boolean; url: string };
  };
  shareButtons: {
    programs: boolean;
    gallery: boolean;
    events: boolean;
  };
};

export function useSocialSettings() {
  return useQuery({
    queryKey: ["social-settings"],
    queryFn: () => apiGet<SocialSettingsRecord>("/api/settings/social").then((res) => res.data),
  });
}

export function useUpdateSocialSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SocialSettingsRecord) =>
      apiFetch<SocialSettingsRecord>("/api/settings/social", { method: "PATCH", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["social-settings"] });
    },
  });
}
