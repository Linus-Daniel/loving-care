"use client";

import { Bell, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { useEvents, useRegisterForEvent, useUnregisterFromEvent } from "@/hooks/useEvents";

export default function ParentEvents() {
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const { data: events = [], isLoading } = useEvents();
  const register = useRegisterForEvent();
  const unregister = useUnregisterFromEvent();

  function toggleRegister(eventId: string, isRegistered: boolean) {
    if (isRegistered) {
      unregister.mutate(eventId, {
        onSuccess: () => toast.success("Unregistered from event"),
        onError: (error) => toast.error(error.message),
      });
      return;
    }

    register.mutate(
      { id: eventId, reminder: reminders[eventId] ?? true },
      {
        onSuccess: () => toast.success("Registered for event"),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Events Calendar" description="School events and activities" />

      {isLoading ? (
        <LoadingTable columns={2} />
      ) : events.length === 0 ? (
        <EmptyState title="No events available" description="Upcoming school events will appear here." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => {
            const registered = event.registrations.length > 0;
            const date = new Date(event.date);

            return (
              <Card key={event.id} className={`shadow-card ${registered ? "ring-1 ring-teal" : ""}`}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <Badge variant="outline" className="border-teal text-teal">{registered ? "My Registered Event" : "All Event"}</Badge>
                    <div className="rounded-lg bg-green-500 px-3 py-1.5 text-center">
                      <p className="text-xs font-bold text-secondary">{date.toLocaleString("default", { month: "short" })}</p>
                      <p className="text-lg font-bold text-white">{date.getDate()}</p>
                    </div>
                  </div>
                  <h3 className="mb-1 font-display font-semibold text-green-500">{event.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{event.description}</p>
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time ?? "All day"}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location ?? "TBC"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      variant={registered ? "outline" : "default"}
                      className={registered ? "border-destructive text-destructive" : "bg-secondary text-green-500 hover:bg-secondary-400"}
                      size="sm"
                      disabled={register.isPending || unregister.isPending}
                      onClick={() => toggleRegister(event.id, registered)}
                    >
                      {registered ? "Unregister" : "Register"}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Bell className="h-3 w-3 text-muted-foreground" />
                      <Switch checked={reminders[event.id] ?? true} onCheckedChange={(checked) => setReminders({ ...reminders, [event.id]: checked })} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
