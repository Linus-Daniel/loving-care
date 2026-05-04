import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type InvoiceRecord = {
  id: string;
  invoiceNo: string;
  parentEmail: string;
  parentName: string;
  items: Array<{ description: string; amount: number }>;
  total: number;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  sentAt?: string | null;
  paidAt?: string | null;
  createdAt: string;
};

export function useInvoices(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => apiGet<InvoiceRecord[]>("/api/invoices", params).then((res) => res.data ?? []),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      parentEmail: string;
      parentName: string;
      items: Array<{ description: string; amount: number }>;
      dueDate: string;
      sendImmediately: boolean;
    }) => apiFetch<InvoiceRecord>("/api/stripe/create-invoice", { method: "POST", body }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
