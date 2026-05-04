import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";
import { isSupabaseBrowserConfigured, supabaseBrowser } from "@/lib/client/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export type MessageRecord = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  threadId: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
};

export function useMessageThreads() {
  return useQuery({
    queryKey: ["message-threads"],
    queryFn: () => apiGet<MessageRecord[]>("/api/messages/threads").then((res) => res.data ?? []),
  });
}

export function useMessages(params?: { threadId?: string; userId?: string }) {
  return useQuery({
    queryKey: ["messages", params],
    enabled: Boolean(params?.threadId || params?.userId),
    queryFn: () => apiGet<MessageRecord[]>("/api/messages", params).then((res) => res.data ?? []),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { receiverId?: string; content: string; threadId?: string }) =>
      apiFetch<MessageRecord>("/api/messages", { method: "POST", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["message-threads"] });
      void queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

function invalidateMessageQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["message-threads"] });
  void queryClient.invalidateQueries({ queryKey: ["messages"] });
}

export function useRealtimeMessages(params?: { threadId?: string; enabled?: boolean }) {
  const queryClient = useQueryClient();
  const enabled = params?.enabled ?? true;
  const threadId = params?.threadId;

  useEffect(() => {
    if (!enabled || !threadId || !isSupabaseBrowserConfigured) return;

    const channel = supabaseBrowser
      .channel(`messages:thread:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
          filter: `threadId=eq.${threadId}`,
        },
        () => invalidateMessageQueries(queryClient),
      )
      .subscribe();

    return () => {
      void supabaseBrowser.removeChannel(channel);
    };
  }, [enabled, queryClient, threadId]);
}

export function useRealtimeMessageThreads() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (!currentUser || !isSupabaseBrowserConfigured) return;

    const role = currentUser.role;
    const canReadAllThreads = role === "ADMIN" || role === "SUPER_ADMIN" || role === "STAFF";
    const channels = canReadAllThreads
      ? [
          supabaseBrowser
            .channel("messages:threads:all")
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "Message" },
              () => invalidateMessageQueries(queryClient),
            )
            .subscribe(),
        ]
      : [
          supabaseBrowser
            .channel(`messages:threads:sender:${currentUser.id}`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "Message", filter: `senderId=eq.${currentUser.id}` },
              () => invalidateMessageQueries(queryClient),
            )
            .subscribe(),
          supabaseBrowser
            .channel(`messages:threads:receiver:${currentUser.id}`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "Message", filter: `receiverId=eq.${currentUser.id}` },
              () => invalidateMessageQueries(queryClient),
            )
            .subscribe(),
        ];

    return () => {
      channels.forEach((channel) => {
        void supabaseBrowser.removeChannel(channel);
      });
    };
  }, [currentUser, queryClient]);
}
