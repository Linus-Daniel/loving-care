"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useReplyToSupportTicket,
  useSupportTickets,
  useUpdateSupportTicket,
  type SupportTicketRecord,
} from "@/hooks/useSupportTickets";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function AdminSupportPage() {
  const [selected, setSelected] = useState<SupportTicketRecord | null>(null);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState<SupportTicketRecord["status"]>("OPEN");
  const { data: tickets = [], isLoading } = useSupportTickets();
  const updateTicket = useUpdateSupportTicket();
  const replyToTicket = useReplyToSupportTicket();

  const columns = useMemo<ColumnDef<SupportTicketRecord, unknown>[]>(
    () => [
      {
        header: "Ticket",
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.slice(-8).toUpperCase()}</span>,
      },
      { header: "Subject", accessorKey: "subject" },
      {
        header: "Parent",
        cell: ({ row }) => row.original.user?.name ?? "Unknown parent",
      },
      {
        header: "Priority",
        cell: ({ row }) => <StatusBadge status={row.original.priority} />,
      },
      {
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        header: "Date",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelected(row.original);
              setStatus(row.original.status);
            }}
          >
            View
          </Button>
        ),
      },
    ],
    [],
  );

  const handleReply = () => {
    if (!selected || !reply.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    replyToTicket.mutate(
      { id: selected.id, content: reply },
      {
        onSuccess: () => {
          toast.success("Reply sent");
          setReply("");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const handleStatus = () => {
    if (!selected) return;
    updateTicket.mutate(
      { id: selected.id, body: { status } },
      {
        onSuccess: () => toast.success("Ticket updated"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Support Tickets" description="Review parent requests, reply to threads, and manage ticket status." />

      <DataTable columns={columns} data={tickets} isLoading={isLoading} exportable emptyTitle="No support tickets" />

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground">Parent</p>
                    <p className="font-medium">{selected.user?.name ?? "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Priority</p>
                    <StatusBadge status={selected.priority} />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-4 text-sm">{selected.description}</div>
                <div className="max-h-64 space-y-3 overflow-y-auto">
                  {(selected.replies ?? []).map((ticketReply) => (
                    <div key={ticketReply.id} className={`rounded-lg p-3 text-sm ${ticketReply.isStaff ? "bg-green text-white" : "bg-teal/10"}`}>
                      <p>{ticketReply.content}</p>
                      <p className="mt-1 text-xs opacity-70">{formatDate(ticketReply.createdAt)}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as SupportTicketRecord["status"])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="self-end" variant="outline" onClick={handleStatus} disabled={updateTicket.isPending}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Update
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Reply</Label>
                  <Textarea rows={4} value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Type a staff reply..." />
                </div>
                <Button onClick={handleReply} disabled={replyToTicket.isPending}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {replyToTicket.isPending ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
