import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type AttendanceRecord = {
  id: string;
  childId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  notes?: string | null;
  child?: {
    id: string;
    firstName: string;
    lastName: string;
    program: string;
    photo?: string | null;
  };
};

export function useAttendance(params?: { childId?: string; from?: string; to?: string }) {
  return useQuery({
    queryKey: ["attendance", params],
    queryFn: () => apiGet<AttendanceRecord[]>("/api/attendance", params).then((res) => res.data ?? []),
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      childId: string;
      date: string;
      status: AttendanceRecord["status"];
      notes?: string;
    }) => apiFetch<AttendanceRecord>("/api/attendance", { method: "POST", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
