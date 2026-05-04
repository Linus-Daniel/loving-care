import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";
import type { ChildRecord } from "@/hooks/useChildren";
import type { PaymentRecord } from "@/hooks/usePayments";

export type ParentRecord = {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  phone?: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF" | "PARENT";
  avatar?: string | null;
  createdAt: string;
  children: ChildRecord[];
  payments?: PaymentRecord[];
};

export function useParents(params?: { search?: string; page?: number; pageSize?: number; allRoles?: boolean }) {
  return useQuery({
    queryKey: ["parents", params],
    queryFn: () => apiGet<ParentRecord[]>("/api/parents", params).then((res) => res.data ?? []),
  });
}

export function useUpdateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Pick<ParentRecord, "name" | "phone" | "avatar" | "role">> }) =>
      apiFetch<ParentRecord>(`/api/parents/${id}`, { method: "PATCH", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["parents"] });
    },
  });
}
