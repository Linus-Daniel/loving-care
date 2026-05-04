"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { FileText, Plus, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateInvoice, useInvoices, type InvoiceRecord } from "@/hooks/useInvoices";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

function date(value: string) {
  return new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function InvoicesPage() {
  const [open, setOpen] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [description, setDescription] = useState("Monthly tuition");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sendImmediately, setSendImmediately] = useState(true);
  const { data: invoices = [], isLoading } = useInvoices();
  const createInvoice = useCreateInvoice();

  const columns = useMemo<ColumnDef<InvoiceRecord, unknown>[]>(
    () => [
      {
        header: "Invoice #",
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.invoiceNo}</span>,
      },
      { header: "Parent", accessorKey: "parentName" },
      {
        header: "Items",
        cell: ({ row }) => row.original.items.map((item) => item.description).join(", "),
      },
      {
        header: "Amount",
        cell: ({ row }) => <span className="font-semibold">{money(row.original.total)}</span>,
      },
      {
        header: "Due Date",
        cell: ({ row }) => date(row.original.dueDate),
      },
      {
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        header: "Delivery",
        cell: ({ row }) => (row.original.sentAt ? "Sent" : "Draft"),
      },
    ],
    [],
  );

  const handleCreate = () => {
    const parsedAmount = Number(amount);
    if (!parentName || !parentEmail || !description || !dueDate || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Complete the invoice fields with a valid amount");
      return;
    }

    createInvoice.mutate(
      {
        parentName,
        parentEmail,
        items: [{ description, amount: parsedAmount }],
        dueDate,
        sendImmediately,
      },
      {
        onSuccess: () => {
          toast.success(sendImmediately ? "Invoice created and sent" : "Invoice draft created");
          setOpen(false);
          setParentName("");
          setParentEmail("");
          setAmount("");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices & Billing"
        description="Create tuition invoices, track due dates, and monitor payment status."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Parent name</Label>
                    <Input value={parentName} onChange={(event) => setParentName(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Parent email</Label>
                    <Input type="email" value={parentEmail} onChange={(event) => setParentEmail(event.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="60000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Due date</Label>
                    <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Send immediately</p>
                    <p className="text-xs text-muted-foreground">Email the invoice through Resend after creation.</p>
                  </div>
                  <Switch checked={sendImmediately} onCheckedChange={setSendImmediately} />
                </div>
                <Button className="w-full" onClick={handleCreate} disabled={createInvoice.isPending}>
                  {sendImmediately ? <Send className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
                  {createInvoice.isPending ? "Creating..." : "Create Invoice"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={columns} data={invoices} isLoading={isLoading} exportable emptyTitle="No invoices yet" />
    </div>
  );
}
