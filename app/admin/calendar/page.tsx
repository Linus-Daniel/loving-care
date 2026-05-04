"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEvent, useEvents } from "@/hooks/useEvents";

export default function CalendarManagementPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const { data: events = [] } = useEvents();
  const createEvent = useCreateEvent();

  const handleCreate = () => {
    if (!title || !description || !date) {
      toast.error("Title, description, and date are required");
      return;
    }
    createEvent.mutate(
      { title, description, date, time, location, visibility: "public" },
      {
        onSuccess: () => {
          toast.success("Calendar event created");
          setOpen(false);
          setTitle("");
          setDescription("");
          setDate("");
          setTime("");
          setLocation("");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar Management"
        description="Manage the school calendar, public events, holidays, and schedule changes."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Calendar Event</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={(event) => setTitle(event.target.value)} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(event) => setDescription(event.target.value)} /></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Date</Label><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div>
                  <div className="space-y-2"><Label>Time</Label><Input value={time} onChange={(event) => setTime(event.target.value)} /></div>
                </div>
                <div className="space-y-2"><Label>Location</Label><Input value={location} onChange={(event) => setLocation(event.target.value)} /></div>
                <Button className="w-full" onClick={handleCreate} disabled={createEvent.isPending}>
                  {createEvent.isPending ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable
            selectable
            events={events.map((event) => ({
              id: event.id,
              title: event.title,
              date: event.date,
              backgroundColor: event.visibility === "public" ? "#2A9D8F" : "#0D1F5C",
              borderColor: event.visibility === "public" ? "#2A9D8F" : "#0D1F5C",
            }))}
            dateClick={(info: DateClickArg & { dateStr: string }) => {
              setDate(info.dateStr);
              setOpen(true);
            }}
            eventDrop={() => toast.info("Drag-and-drop UI captured. Save endpoint wiring can persist reschedules.")}
            height="auto"
          />
        </CardContent>
      </Card>
    </div>
  );
}
