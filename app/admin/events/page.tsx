"use client";

import { Calendar, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCreateEvent, useDeleteEvent, useEvents } from "@/hooks/useEvents";

export default function AdminEvents() {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "", description: "", capacity: "" });
  const { data: events = [], isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  function submit() {
    createEvent.mutate(
      {
        title: form.title,
        date: form.date,
        time: form.time,
        location: form.location,
        description: form.description,
        capacity: form.capacity ? Number(form.capacity) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Event created");
          setOpen(false);
          setForm({ title: "", date: "", time: "", location: "", description: "", capacity: "" });
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  function confirmDelete() {
    if (!deleteId) return;
    deleteEvent.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Event deleted");
        setDeleteId(null);
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Management"
        description="Create and manage school events"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary font-semibold text-green-500 hover:bg-secondary-400">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Event</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Event Title</Label><Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></div>
                  <div className="space-y-2"><Label>Time</Label><Input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></div>
                <div className="space-y-2"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
                <Button className="w-full bg-green-500 text-white" disabled={createEvent.isPending || !form.title || !form.date || !form.description} onClick={submit}>
                  {createEvent.isPending ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <LoadingTable columns={3} />
      ) : events.length === 0 ? (
        <EmptyState title="No events found" description="Create events to publish them to parents and public pages." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id} className="shadow-card">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <Badge variant="outline" className="border-teal text-teal">{event.visibility}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(event.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <h3 className="mb-2 font-display font-semibold text-green-500">{event.title}</h3>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(event.date).toLocaleDateString("en-NG")}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time ?? "All day"}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location ?? "TBC"}</span>
                </div>
                <p className="text-xs text-muted-foreground">{event.registrations.length}/{event.capacity ?? "∞"} registered</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete event?"
        description="This permanently removes the event and its registrations."
        confirmLabel="Delete"
        isLoading={deleteEvent.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
