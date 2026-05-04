"use client";

import { useQuery } from "@tanstack/react-query";
import { FileDown, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch, apiGet } from "@/lib/client/api";
import type { PaymentRecord } from "@/hooks/usePayments";

function money(value: number, currency: string) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(value);
}

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const [refundOpen, setRefundOpen] = useState(false);
  const { data: payment, isLoading } = useQuery({
    queryKey: ["payment", params.id],
    queryFn: () => apiGet<PaymentRecord>(`/api/payments/${params.id}`).then((res) => res.data),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading payment...</p>;
  if (!payment) return <EmptyState title="Payment not found" description="The selected transaction could not be loaded." />;

  return (
    <div className="space-y-6">
      <PageHeader title="Payment Detail" description="Inspect transaction metadata and payment status." />
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-bold text-green">{money(payment.amount, payment.currency)}</p>
            <p className="text-sm text-muted-foreground">{payment.description}</p>
          </div>
          <StatusBadge status={payment.status} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Transaction Metadata</CardTitle></CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <div><p className="text-muted-foreground">Parent</p><p className="font-medium">{payment.user?.name ?? "Unknown"}</p></div>
          <div><p className="text-muted-foreground">Email</p><p className="font-medium">{payment.user?.email ?? "Unknown"}</p></div>
          <div><p className="text-muted-foreground">Stripe Payment ID</p><p className="font-mono text-xs">{payment.stripePaymentId ?? "Not available"}</p></div>
          <div><p className="text-muted-foreground">Method</p><p className="font-medium">{payment.paymentMethod ?? "Card"}</p></div>
          <div><p className="text-muted-foreground">Processed</p><p className="font-medium">{new Date(payment.createdAt).toLocaleString("en-NG")}</p></div>
          <div><p className="text-muted-foreground">Receipt</p><p className="font-medium">{payment.receiptUrl ? "Available" : "Not generated"}</p></div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast.info("Receipt PDF generation queued")}><FileDown className="mr-2 h-4 w-4" /> Download Receipt</Button>
        <Button variant="destructive" onClick={() => setRefundOpen(true)} disabled={payment.status === "REFUNDED"}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Issue Refund
        </Button>
      </div>
      <ConfirmModal
        open={refundOpen}
        onOpenChange={setRefundOpen}
        title="Issue refund?"
        description="This will call Stripe and mark the payment as refunded if Stripe accepts the request."
        isLoading={false}
        onConfirm={async () => {
          try {
            await apiFetch(`/api/payments/${payment.id}`, { method: "PATCH", body: { reason: "requested_by_customer" } });
            toast.success("Refund issued");
            setRefundOpen(false);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Refund failed");
          }
        }}
      />
    </div>
  );
}
