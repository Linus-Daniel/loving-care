"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePayments, type PaymentRecord } from "@/hooks/usePayments";

function money(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default function AdminPayments() {
  const { data: payments = [], isLoading } = usePayments({ pageSize: 100 });

  const totalCollected = payments.filter((p) => p.status === "SUCCEEDED").reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments.filter((p) => p.status === "PENDING").reduce((sum, payment) => sum + payment.amount, 0);
  const failed = payments.filter((p) => p.status === "FAILED").reduce((sum, payment) => sum + payment.amount, 0);
  const thisMonth = payments
    .filter((p) => {
      const date = new Date(p.createdAt);
      const now = new Date();
      return p.status === "SUCCEEDED" && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  const revenueData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - index));
      return { key: `${date.getFullYear()}-${date.getMonth()}`, month: date.toLocaleString("default", { month: "short" }), revenue: 0 };
    });

    for (const payment of payments) {
      if (payment.status !== "SUCCEEDED") continue;
      const date = new Date(payment.createdAt);
      const item = months.find((month) => month.key === `${date.getFullYear()}-${date.getMonth()}`);
      if (item) item.revenue += payment.amount;
    }

    return months;
  }, [payments]);

  const columns = useMemo<ColumnDef<PaymentRecord, unknown>[]>(
    () => [
      { header: "Parent", cell: ({ row }) => row.original.user?.name ?? "Unknown" },
      { header: "Description", accessorKey: "description" },
      { header: "Amount", cell: ({ row }) => money(row.original.amount, row.original.currency) },
      { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      { header: "Date", cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-NG") },
      {
        header: "Receipt",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" disabled={!row.original.receiptUrl} asChild={Boolean(row.original.receiptUrl)}>
              {row.original.receiptUrl ? (
                <a href={row.original.receiptUrl} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                </a>
              ) : (
                <span>
                  <Download className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Payments Overview" description="Manage and track all payments" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Collected", money(totalCollected), "bg-surface/45"],
          ["Pending", money(pending), "bg-accent-50"],
          ["Failed", money(failed), "bg-white"],
          ["This Month", money(thisMonth), "bg-secondary-50"],
        ].map(([label, value, tone]) => (
          <Card key={label} className={`border-primary/10 shadow-soft ${tone}`}>
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
              <p className="mt-2 font-display text-2xl font-bold text-primary">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/10 bg-white shadow-card">
        <CardHeader className="pb-2"><CardTitle className="font-display text-xl text-primary">Revenue by Month</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => money(Number(value))} />
                <Bar dataKey="revenue" fill="#EA987B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={payments} isLoading={isLoading} exportable emptyTitle="No payments found" />
    </div>
  );
}
