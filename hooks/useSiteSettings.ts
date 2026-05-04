import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type SiteSettingsRecord = {
  name: string;
  tagline?: string;
  email: string;
  phone: string;
  address: string;
  timezone: string;
  logo?: string | null;
  favicon?: string | null;
  primaryColor: string;
  accentColor: string;
  senderName?: string;
  senderEmail?: string;
  emailFooter?: string;
  stripePublicKey?: string;
  posthogKey?: string;
  googleAnalyticsId?: string;
  sanityProjectId?: string;
  sanityDataset?: string;
  clerkPublishableKey?: string;
  maintenance: boolean;
  maintenanceMessage?: string;
  registration: boolean;
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () => apiGet<SiteSettingsRecord>("/api/settings").then((res) => res.data),
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SiteSettingsRecord) =>
      apiFetch<SiteSettingsRecord>("/api/settings", { method: "PATCH", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });
}
