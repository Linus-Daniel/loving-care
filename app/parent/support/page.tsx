"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HelpCircle, MessageSquare, Plus, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const openTickets = tickets.filter((ticket) => ticket.status !== "CLOSED").length;

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
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">Support & Help Tickets</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Ask questions, report concerns, and keep track of replies from the school team.
            </p>
          </div>
          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Open Tickets</p>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{openTickets}</p>
            <p className="text-sm text-muted-foreground">active conversation{openTickets === 1 ? "" : "s"}</p>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-white hover:bg-accent-400">
              <Plus className="h-4 w-4" />
              Open Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display text-primary">Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Brief description" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                />
              </div>
              <Button
                className="w-full bg-accent text-white hover:bg-accent-400"
                onClick={() => createTicket.mutate()}
                disabled={createTicket.isPending || !subject || !description}
              >
                {createTicket.isPending ? "Submitting..." : "Submit Ticket"}
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-primary/10 bg-white shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-xl text-primary">Your Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable />
          ) : tickets.length === 0 ? (
            <EmptyState title="No tickets yet" description="Open a ticket when you need help from the school team." />
          ) : (
            <div className="grid gap-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="grid gap-4 rounded-3xl border border-primary/10 bg-[#FFF9F0] p-4 md:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-2 py-1 font-mono text-[10px] font-bold text-muted-foreground">
                        #{ticket.id.slice(0, 8)}
                      </span>
                      <StatusBadge status={ticket.priority} />
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="mt-3 font-display text-lg font-bold text-primary">{ticket.subject}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{ticket.description}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Opened {new Date(ticket.createdAt).toLocaleDateString("en-NG")}
                    </p>
                  </div>
                  <div className="flex items-center md:justify-end">
                    <Button variant="outline" className="bg-white">
                      <MessageSquare className="h-4 w-4" />
                      {ticket.replies.length} replies
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
