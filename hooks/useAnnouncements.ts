import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type AnnouncementRecord = {
  id: string;
  title: string;
  body: string;
  targetRole: "SUPER_ADMIN" | "ADMIN" | "STAFF" | "PARENT";
  targetClass?: string | null;
  isDraft: boolean;
  scheduledAt?: string | null;
  sentAt?: string | null;
  createdBy: string;
  createdAt: string;
};

export function useAnnouncements(params?: { role?: string }) {
  return useQuery({
    queryKey: ["announcements", params],
    queryFn: () => apiGet<AnnouncementRecord[]>("/api/announcements", params).then((res) => res.data ?? []),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      title: string;
      body: string;
      targetRole: AnnouncementRecord["targetRole"];
      targetClass?: string;
      isDraft: boolean;
      scheduledAt?: string | null;
    }) => apiFetch<AnnouncementRecord>("/api/announcements", { method: "POST", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
