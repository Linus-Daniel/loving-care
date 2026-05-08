"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock, LayoutGrid, List, MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { useEvents, useRegisterForEvent } from "@/hooks/useEvents";

function PulseBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

function EventListSkeletonCard() {
  return (
    <div className="group bg-card rounded-3xl p-8 shadow-soft border border-primary/5">
      <div className="mb-6 flex items-start justify-between">
        <PulseBlock className="h-7 w-20 rounded-full" />
        <PulseBlock className="h-[58px] w-[68px] rounded-2xl" />
      </div>
      <PulseBlock className="mb-3 h-6 w-4/5" />
      <div className="mb-6 space-y-2">
        <PulseBlock className="h-4 w-full" />
        <PulseBlock className="h-4 w-11/12" />
        <PulseBlock className="h-4 w-2/3" />
      </div>
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2.5">
          <PulseBlock className="h-7 w-7 rounded-lg" />
          <PulseBlock className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2.5">
          <PulseBlock className="h-7 w-7 rounded-lg" />
          <PulseBlock className="h-4 w-32" />
        </div>
      </div>
      <PulseBlock className="h-12 w-full rounded-2xl" />
    </div>
  );
}

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
    <div className="bg-background pb-24">
      <section className="relative min-h-[68vh] overflow-hidden border-b border-border bg-background flex items-center">
        <Image
          src="/images/event-hero.png"
          alt="Children and teacher during daycare activities"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/15" />
        <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="absolute -left-20 -top-24 h-64 w-80 rounded-[45%_55%_62%_38%/48%_42%_58%_52%] bg-surface/85" />
        <div className="absolute -bottom-28 -left-16 h-72 w-96 rounded-[58%_42%_45%_55%/42%_48%_52%_58%] bg-secondary/80" />

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-28">
            <motion.div
              className="max-w-[620px]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <Badge className="bg-background/80 text-primary border-border px-4 py-1.5 mb-6 backdrop-blur-sm shadow-sm">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-accent" />
                School Calendar
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 tracking-tight leading-[1.08]">
                <span className="block text-[#2C4D63]">Events that bring</span>
                <span className="block text-[#E28E6B]">our families</span>
                <span className="block text-[#A0AE9A]">together</span>
              </h1>
              <p className="text-[#343A40] max-w-xl text-lg leading-relaxed">
                Stay connected with our community. Discover workshops, celebrations, and important school activities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-20">
        <div className="flex items-center justify-between mb-10 bg-card/80 backdrop-blur-md p-2 rounded-2xl shadow-soft border border-border/50">
          <div className="flex p-1 gap-1">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === "list" ? "bg-accent text-primary-900 shadow-md" : "text-muted-foreground hover:bg-secondary-50"}`}
            >
              <List className="w-4 h-4" /> List View
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === "calendar" ? "bg-accent text-primary-900 shadow-md" : "text-muted-foreground hover:bg-secondary-50"}`}
            >
              <LayoutGrid className="w-4 h-4" /> Calendar View
            </button>
          </div>
        </div>

        {view === "list" ? (
          isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <EventListSkeletonCard key={index} />
              ))}
            </div>
          ) : upcomingEvents.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-card rounded-3xl p-8 shadow-soft border border-primary/5 hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <Badge variant="outline" className="border-accent/40 text-accent-700 bg-accent-50 px-3 py-1 font-bold text-[10px] uppercase tracking-wider">{event.status}</Badge>
                    <div className="text-center bg-secondary rounded-2xl px-4 py-2.5 shadow-md text-primary">
                      <p className="text-primary/70 font-bold text-[10px] uppercase tracking-tighter leading-none mb-1">
                        {new Date(event.date).toLocaleString("default", { month: "short" })}
                      </p>
                      <p className="text-primary text-xl font-bold leading-none">{new Date(event.date).getDate()}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-bold text-primary mb-3 group-hover:text-primary-600 transition-colors">{event.title}</h3>
                  <p className="text-sm text-muted-foreground/90 mb-6 line-clamp-3 leading-relaxed">{event.description}</p>
                  <div className="space-y-3 mb-8">
                    {event.time ? (
                      <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
                        <div className="p-1.5 rounded-lg bg-muted/50"><Clock className="w-3.5 h-3.5" /></div>
                        {event.time}
                      </div>
                    ) : null}
                    {event.location ? (
                      <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
                        <div className="p-1.5 rounded-lg bg-muted/50"><MapPin className="w-3.5 h-3.5" /></div>
                        {event.location}
                      </div>
                    ) : null}
                  </div>
                  <Button
                    className="w-full h-12 rounded-2xl bg-accent text-primary-900 border border-accent/20 hover:bg-accent-200 shadow-none hover:shadow-lg transition-all duration-300 font-bold"
                    onClick={() => handleRegister(event.id)}
                    disabled={registerForEvent.isPending}
                  >
                    {registerForEvent.isPending ? "Registering..." : "Register Now"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState title="No upcoming events" description="Published school events will appear here soon." />
          )
        ) : (
          <div className="bg-card rounded-3xl shadow-soft p-6 lg:p-10 border border-primary/5">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height="auto"
              events={events.map((event) => ({
                id: event.id,
                title: event.title,
                start: event.date,
                backgroundColor: "var(--color-accent-DEFAULT)",
                borderColor: "var(--color-accent-DEFAULT)",
              }))}
            />
          </div>
        )}

        <div className="mt-24">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-display font-bold text-primary tracking-tight">Past Events</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          {pastEvents.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
              {pastEvents.map((event) => (
                <div key={event.id} className="bg-card rounded-2xl p-6 border border-border/50 hover:bg-secondary-50 transition-colors">
                  <Badge variant="outline" className="mb-3 text-[10px] uppercase font-bold tracking-widest">{event.status}</Badge>
                  <h3 className="font-bold text-primary text-base mb-1">{event.title}</h3>
                  <p className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-accent" />
                    {new Date(event.date).toLocaleDateString("en-NG", { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
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
