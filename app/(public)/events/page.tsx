"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { motion } from "framer-motion";
import { ArrowRight, Clock, LayoutGrid, List, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { useEvents, useRegisterForEvent } from "@/hooks/useEvents";

export default function Events() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const { isSignedIn } = useAuth();
  const { data: events = [], isLoading } = useEvents();
  const registerForEvent = useRegisterForEvent();

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const visibleEvents = events
      .filter((event) => event.visibility === "public" || event.visibility === "parents")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      upcomingEvents: visibleEvents.filter((event) => new Date(event.date) >= now),
      pastEvents: visibleEvents.filter((event) => new Date(event.date) < now).slice(-6).reverse(),
    };
  }, [events]);

  const handleRegister = async (id: string) => {
    if (!isSignedIn) {
      window.location.href = `/login?redirect_url=${encodeURIComponent("/events")}`;
      return;
    }

    try {
      await registerForEvent.mutateAsync({ id, reminder: true });
      toast.success("Event registration saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not register for event");
    }
  };

  return (
    <div>
      <div className="bg-green py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-yellow/20 text-yellow border-yellow/30 mb-4">Events</Badge>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-white mb-3">Upcoming Events</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Join us for activities, workshops, and celebrations published by the school team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "list" ? "yellow-50 shadow-sm text-green" : "text-muted-foreground"}`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "calendar" ? "yellow-50 shadow-sm text-green" : "text-muted-foreground"}`}
            >
              <LayoutGrid className="w-4 h-4" /> Calendar
            </button>
          </div>
        </div>

        {view === "list" ? (
          isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : upcomingEvents.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="yellow-50 rounded-xl p-6 shadow-soft hover:shadow-lift transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="border-teal text-teal">{event.status}</Badge>
                    <div className="text-center bg-green rounded-lg px-3 py-2">
                      <p className="text-yellow font-bold text-sm">
                        {new Date(event.date).toLocaleString("default", { month: "short" })}
                      </p>
                      <p className="text-white text-lg font-bold">{new Date(event.date).getDate()}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-semibold text-green mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                    {event.time ? <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span> : null}
                    {event.location ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span> : null}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-green text-green hover:bg-green hover:text-white"
                    onClick={() => handleRegister(event.id)}
                    disabled={registerForEvent.isPending}
                  >
                    {registerForEvent.isPending ? "Registering..." : "Register"}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState title="No upcoming events" description="Published school events will appear here." />
          )
        ) : (
          <div className="yellow-50 rounded-xl shadow-soft p-4 lg:p-6">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height="auto"
              events={events.map((event) => ({
                id: event.id,
                title: event.title,
                start: event.date,
                backgroundColor: "#0f766e",
                borderColor: "#0f766e",
              }))}
            />
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-xl font-display font-bold text-green mb-6">Past Events</h2>
          {pastEvents.length ? (
            <div className="grid sm:grid-cols-3 gap-4 opacity-70">
              {pastEvents.map((event) => (
                <div key={event.id} className="bg-muted rounded-lg p-4">
                  <Badge variant="outline" className="mb-2 text-xs">{event.status}</Badge>
                  <h3 className="font-medium text-green text-sm">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No past events" description="Past events will be listed once events are completed." />
          )}
        </div>
      </div>
    </div>
  );
}
