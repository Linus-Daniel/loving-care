import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";
import type { ParentRecord } from "@/hooks/useParents";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => apiGet<ParentRecord>("/api/auth/me").then((res) => res.data),
  });
}

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<Pick<ParentRecord, "name" | "phone" | "avatar">>) =>
      apiFetch<ParentRecord>("/api/auth/me", { method: "PATCH", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["current-user"] });
      void queryClient.invalidateQueries({ queryKey: ["parents"] });
    },
  });
}
