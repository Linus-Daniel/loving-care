import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type ChildRecord = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  program: string;
  enrollmentDate: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "GRADUATED";
  photo?: string | null;
  parentId: string;
  parent?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  medicalInfo?: {
    conditions?: string | null;
    medications?: string | null;
    doctorName?: string | null;
    doctorPhone?: string | null;
    allergies?: string | null;
  } | null;
};

export function useChildren(params?: { search?: string; status?: string; program?: string; page?: number }) {
  return useQuery({
    queryKey: ["children", params],
    queryFn: () => apiGet<ChildRecord[]>("/api/children", params).then((res) => res.data ?? []),
  });
}

export function useCreateChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch<ChildRecord>("/api/children", { method: "POST", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
}
