import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type ResourceRecord = {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  category: string;
  visibility: string;
  uploadedBy: string;
  createdAt: string;
};

export function useResources(params?: { category?: string }) {
  return useQuery({
    queryKey: ["resources", params],
    queryFn: () => apiGet<ResourceRecord[]>("/api/resources", params).then((res) => res.data ?? []),
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Pick<ResourceRecord, "name" | "fileUrl" | "fileType" | "category" | "visibility">) =>
      apiFetch<ResourceRecord>("/api/resources", { method: "POST", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiFetch<{ deleted: boolean }>(`/api/resources/${id}`, { method: "DELETE" }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}
