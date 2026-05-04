"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { apiFetch, apiGet } from "@/lib/client/api";

type TicketRecord = {
  id: string;
  subject: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  createdAt: string;
  replies: { id: string }[];
};

export default function Support() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: () => apiGet<TicketRecord[]>("/api/support").then((res) => res.data ?? []),
  });

  const createTicket = useMutation({
    mutationFn: () =>
      apiFetch<TicketRecord>("/api/support", {
        method: "POST",
        body: { subject, description, priority: "MEDIUM" },
      }),
    onSuccess: () => {
      toast.success("Support ticket created");
      setOpen(false);
      setSubject("");
      setDescription("");
      void queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Help Tickets"
        description="Get help with any questions or concerns"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow font-semibold text-green hover:bg-yellow-400">
                <Plus className="mr-2 h-4 w-4" />
                Open Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Brief description" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe your issue in detail..." rows={4} />
                </div>
                <Button className="w-full bg-green text-white" onClick={() => createTicket.mutate()} disabled={createTicket.isPending || !subject || !description}>
                  {createTicket.isPending ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base text-green">Your Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable />
          ) : tickets.length === 0 ? (
            <EmptyState title="No tickets yet" description="Open a ticket when you need help from the school team." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">ID</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Subject</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Priority</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Replies</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-border/50">
                      <td className="px-3 py-3 font-mono text-xs">{ticket.id.slice(0, 8)}</td>
                      <td className="px-3 py-3">{ticket.subject}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={ticket.priority} />
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString("en-NG")}</td>
                      <td className="px-3 py-3 text-right">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="mr-1 h-4 w-4" />
                          {ticket.replies.length}
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
