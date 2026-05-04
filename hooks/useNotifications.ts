import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  link?: string | null;
  createdAt: string;
};

export function useNotifications(params?: { unreadOnly?: boolean }) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => apiGet<NotificationRecord[]>("/api/notifications", params).then((res) => res.data ?? []),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiFetch<{ updated: number }>("/api/notifications", { method: "PATCH", body: { isRead: true } }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
