import { useMutation, useQuery } from "@tanstack/react-query";

import { apiFetch, apiGet } from "@/lib/client/api";

export type PaymentRecord = {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
  description: string;
  receiptUrl?: string | null;
  paymentMethod?: string | null;
  stripePaymentId?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export function usePayments(params?: { status?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => apiGet<PaymentRecord[]>("/api/payments", params).then((res) => res.data ?? []),
  });
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (body: {
      amount: number;
      currency?: string;
      description: string;
      metadata?: Record<string, string | number | boolean | null>;
    }) =>
      apiFetch<{ clientSecret: string; payment: PaymentRecord }>("/api/stripe/create-payment-intent", {
        method: "POST",
        body,
      }).then((res) => res.data),
  });
}
