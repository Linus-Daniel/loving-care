"use client";

import { Bell, CalendarDays, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEvents, useRegisterForEvent, useUnregisterFromEvent } from "@/hooks/useEvents";

export default function ParentEvents() {
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const { data: currentUser } = useCurrentUser();
  const { data: events = [], isLoading } = useEvents();
  const register = useRegisterForEvent();
  const unregister = useUnregisterFromEvent();

  const upcoming = events.filter((event) => new Date(event.date) >= new Date()).length;

  function toggleRegister(eventId: string, isRegistered: boolean) {
    setPendingEventId(eventId);

    if (isRegistered) {
      unregister.mutate(eventId, {
        onSuccess: () => toast.success("Unregistered from event"),
        onError: (error) => toast.error(error.message),
        onSettled: () => setPendingEventId(null),
      });
      return;
    }

    register.mutate(
      { id: eventId, reminder: reminders[eventId] ?? true },
      {
        onSuccess: () => toast.success("Registered for event"),
        onError: (error) => toast.error(error.message),
        onSettled: () => setPendingEventId(null),
      },
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">Events Calendar</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Register for school events, turn reminders on, and keep family plans in sync.
            </p>
          </div>
          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Upcoming</p>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{upcoming}</p>
            <p className="text-sm text-muted-foreground">scheduled event{upcoming === 1 ? "" : "s"}</p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <LoadingTable columns={2} />
      ) : events.length === 0 ? (
        <EmptyState title="No events available" description="Upcoming school events will appear here." />
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const registered = event.registrations.some((registration) => registration.userId === currentUser?.id);
            const isMutating = pendingEventId === event.id;
            const date = new Date(event.date);

            return (
              <Card
                key={event.id}
                className={`overflow-hidden border-primary/10 bg-white shadow-card transition-all hover:-translate-y-1 ${
                  registered ? "ring-2 ring-accent/35" : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between gap-4 bg-secondary-50 p-5">
                    <Badge className={registered ? "border-0 bg-accent text-white" : "border-0 bg-white text-primary"}>
                      {registered ? "Registered" : "Available"}
                    </Badge>
                    <div className="rounded-2xl bg-white px-4 py-2 text-center text-primary shadow-xs">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em]">
                        {date.toLocaleString("default", { month: "short" })}
                      </p>
                      <p className="font-display text-2xl font-bold">{date.getDate()}</p>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="font-display text-xl font-bold text-primary">{event.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{event.description}</p>
                    </div>

                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-accent" />
                        {event.time ?? "All day"}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        {event.location ?? "TBC"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-primary/10 pt-4">
                      <Button
                        variant={registered ? "outline" : "default"}
                        className={registered ? "border-destructive text-destructive hover:bg-destructive/5" : "bg-accent-300 text-white hover:bg-accent-400"}
                        size="sm"
                        disabled={isMutating}
                        onClick={() => toggleRegister(event.id, registered)}
                      >
                        {isMutating ? "Saving..." : registered ? "Unregister" : "Register"}
                      </Button>
                      <div className="flex items-center gap-2 rounded-full bg-[#FFF9F0] px-3 py-2">
                        <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                        <Switch
                          className="data-[state=checked]:bg-accent-300 data-[state=unchecked]:bg-muted"
                          checked={reminders[event.id] ?? true}
                          onCheckedChange={(checked) => setReminders({ ...reminders, [event.id]: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
}
