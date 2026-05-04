import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string | null;
  location?: string | null;
  capacity?: number | null;
  coverPhoto?: string | null;
  visibility: string;
  status: string;
  createdAt: string;
  registrations: { id: string; userId: string; reminder: boolean }[];
};

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => apiGet<EventRecord[]>("/api/events").then((res) => res.data ?? []),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      title: string;
      description: string;
      date: string;
      time?: string;
      location?: string;
      capacity?: number;
      visibility?: string;
    }) => apiFetch<EventRecord>("/api/events", { method: "POST", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiFetch<{ deleted: boolean }>(`/api/events/${id}`, { method: "DELETE" }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reminder = true }: { id: string; reminder?: boolean }) =>
      apiFetch<{ id: string }>(`/api/events/${id}/register`, { method: "POST", body: { reminder } }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUnregisterFromEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiFetch<{ deleted: boolean }>(`/api/events/${id}/register`, { method: "DELETE" }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
