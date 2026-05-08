import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";
import { isSupabaseBrowserConfigured, supabaseBrowser } from "@/lib/client/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
    mutationFn: (type?: string) =>
      apiFetch<{ updated: number }>("/api/notifications", {
        method: "PATCH",
        body: { isRead: true, type },
      }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useRealtimeNotifications() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (!currentUser || !isSupabaseBrowserConfigured) return;

    const channel = supabaseBrowser
      .channel(`notifications:user:${currentUser.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Notification", filter: `userId=eq.${currentUser.id}` },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
      )
      .subscribe();

    return () => {
      void supabaseBrowser.removeChannel(channel);
    };
  }, [currentUser, queryClient]);
}
