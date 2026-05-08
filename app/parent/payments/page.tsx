"use client";

import { CreditCard, Download, ReceiptText, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayments } from "@/hooks/usePayments";

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Payments() {
  const router = useRouter();
  const { data: payments = [], isLoading } = usePayments();

  const currentYear = new Date().getFullYear();
  const totalPaid = payments
    .filter((payment) => payment.status === "SUCCEEDED" && new Date(payment.createdAt).getFullYear() === currentYear)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = payments
    .filter((payment) => payment.status === "PENDING" || payment.status === "FAILED")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const lastPayment = payments
    .filter((payment) => payment.status === "SUCCEEDED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const stats = [
    { label: `Paid in ${currentYear}`, value: money(totalPaid, "NGN"), icon: WalletCards, tone: "bg-surface/45" },
    { label: "Outstanding", value: money(outstanding, "NGN"), icon: CreditCard, tone: "bg-accent-50" },
    {
      label: "Last Payment",
      value: lastPayment ? new Date(lastPayment.createdAt).toLocaleDateString("en-NG") : "None yet",
      icon: ReceiptText,
      tone: "bg-secondary-50",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
              <CreditCard className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">Payment History</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Review tuition payments, download receipts, and make secure card or bank-transfer payments.
            </p>
          </div>
          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Quick Action</p>
            <p className="mt-3 font-display text-2xl font-bold text-primary">Ready to pay?</p>
            <Button className="mt-5 bg-accent text-white hover:bg-accent-400" onClick={() => router.push("/parent/payments/pay")}>
              <CreditCard className="h-4 w-4" />
              Make Payment
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`border-primary/10 shadow-soft ${stat.tone}`}>
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-primary">{stat.value}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="border-primary/10 bg-white shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-xl text-primary">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable />
          ) : payments.length === 0 ? (
            <EmptyState title="No payments yet" description="Completed and pending payments will appear here." />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-primary/10">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary-50">
                    <tr className="text-left text-muted-foreground">
                      <th className="px-4 py-3 font-bold">Date</th>
                      <th className="px-4 py-3 font-bold">Description</th>
                      <th className="px-4 py-3 text-right font-bold">Amount</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 text-right font-bold">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-t border-primary/10 bg-white">
                        <td className="px-4 py-4">{new Date(payment.createdAt).toLocaleDateString("en-NG")}</td>
                        <td className="px-4 py-4 font-medium text-primary">{payment.description}</td>
                        <td className="px-4 py-4 text-right font-bold text-primary">{money(payment.amount, payment.currency)}</td>
                        <td className="px-4 py-4">
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button variant="ghost" size="sm" disabled={!payment.receiptUrl} asChild={Boolean(payment.receiptUrl)}>
                            {payment.receiptUrl ? (
                              <a href={payment.receiptUrl} target="_blank" rel="noreferrer" aria-label="Download receipt">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
