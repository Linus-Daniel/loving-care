import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type RegistrationRecord = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "WAITLISTED";
  childFirstName: string;
  childLastName: string;
  dateOfBirth: string;
  gender: string;
  program: string;
  preferredStart?: string | null;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRel: string;
  medicalInfo?: string | null;
  medications?: string | null;
  doctorContact?: string | null;
  previousSchool?: string | null;
  gradeLevel?: string | null;
  referralSource?: string | null;
  comments?: string | null;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  parentalConsent: boolean;
  paymentMethod?: string | null;
  adminNotes?: string | null;
  reviewedBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export function useRegistrations(params?: { status?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["registrations", params],
    queryFn: () => apiGet<RegistrationRecord[]>("/api/registrations", params).then((res) => res.data ?? []),
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Pick<RegistrationRecord, "status" | "adminNotes">> }) =>
      apiFetch<RegistrationRecord>(`/api/registrations/${id}`, { method: "PATCH", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["registrations"] });
      void queryClient.invalidateQueries({ queryKey: ["children"] });
      void queryClient.invalidateQueries({ queryKey: ["parents"] });
    },
  });
}
