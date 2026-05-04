import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type StaffRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  class?: string | null;
  photo?: string | null;
  bio?: string | null;
  isActive: boolean;
  createdAt: string;
};

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () => apiGet<StaffRecord[]>("/api/staff").then((res) => res.data ?? []),
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Omit<StaffRecord, "id" | "createdAt">) =>
      apiFetch<StaffRecord>("/api/staff", { method: "POST", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useDeactivateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiFetch<StaffRecord>(`/api/staff/${id}`, { method: "DELETE" }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
