import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type SupportTicketRecord = {
  id: string;
  userId: string;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  replies?: Array<{
    id: string;
    content: string;
    authorId: string;
    isStaff: boolean;
    createdAt: string;
  }>;
};

export function useSupportTickets() {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: () => apiGet<SupportTicketRecord[]>("/api/support").then((res) => res.data ?? []),
  });
}

export function useUpdateSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Pick<SupportTicketRecord, "status" | "priority" | "assignedTo">> }) =>
      apiFetch<SupportTicketRecord>(`/api/support/${id}`, { method: "PATCH", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
}

export function useReplyToSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      apiFetch(`/api/support/${id}/replies`, { method: "POST", body: { content } }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
}
