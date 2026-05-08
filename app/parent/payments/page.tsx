"use client";

import { CreditCard, Download } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePayments } from "@/hooks/usePayments";

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(amount);
}

export default function Payments() {
  const router = useRouter();
  const { data: payments = [], isLoading } = usePayments();

  const totalPaid = payments
    .filter((payment) => payment.status === "SUCCEEDED" && new Date(payment.createdAt).getFullYear() === new Date().getFullYear())
    .reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = payments.filter((payment) => payment.status === "PENDING").reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment History"
        description="View and manage your payment records"
        action={
          <Button className="bg-secondary font-semibold text-green-500 hover:bg-secondary-400" onClick={() => router.push("/parent/payments/pay")}>
            <CreditCard className="mr-2 h-4 w-4" />
            Make Payment
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Total Paid ({new Date().getFullYear()})</p>
            <p className="text-2xl font-bold text-green-500">{money(totalPaid, "NGN")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Outstanding Balance</p>
            <p className="text-2xl font-bold text-warning">{money(outstanding, "NGN")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="mb-1 text-xs text-muted-foreground">Next Due Date</p>
            <p className="text-2xl font-bold text-teal">Monthly</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base text-green-500">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable />
          ) : payments.length === 0 ? (
            <EmptyState title="No payments yet" description="Completed and pending payments will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Amount</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border/50">
                      <td className="px-3 py-3">{new Date(payment.createdAt).toLocaleDateString("en-NG")}</td>
                      <td className="px-3 py-3">{payment.description}</td>
                      <td className="px-3 py-3 text-right font-medium">{money(payment.amount, payment.currency)}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Button variant="ghost" size="sm" disabled={!payment.receiptUrl} asChild={Boolean(payment.receiptUrl)}>
                          {payment.receiptUrl ? (
                            <a href={payment.receiptUrl} target="_blank" rel="noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          ) : (
                            <span>
                              <Download className="h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
