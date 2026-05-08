"use client";

import { useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  MessageSquare,
  Send,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";
import { useChildren } from "@/hooks/useChildren";
import { useEvents } from "@/hooks/useEvents";
import { useMessageThreads } from "@/hooks/useMessages";
import { usePayments } from "@/hooks/usePayments";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function daysThisWeek() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));

  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

function dayKey(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
}

export default function ParentDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const { data: children = [], isLoading: childrenLoading } = useChildren();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const { data: payments = [] } = usePayments();
  const { data: events = [] } = useEvents();
  const { data: threads = [] } = useMessageThreads();
  const { data: attendance = [] } = useAttendance(selectedChildId ? { childId: selectedChildId } : undefined);

  const selectedChild = children.find((child) => child.id === selectedChildId) ?? children[0];

  useEffect(() => {
    if (!childrenLoading && children.length === 0) {
      router.push("/parent/child");
    }
  }, [childrenLoading, children.length, router]);

  const presentCount = attendance.filter((record) => record.status === "PRESENT").length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
  const outstanding = payments
    .filter((payment) => payment.status === "PENDING" || payment.status === "FAILED")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const latestPayment = payments
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const unreadMessages = threads.filter((message) => !message.isRead).length;
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const weekDays = useMemo(() => daysThisWeek(), []);
  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "Parent";

  const overview = [
    {
      label: "Attendance",
      value: attendance.length ? `${attendanceRate}%` : "No records",
      note: `${presentCount} present record${presentCount === 1 ? "" : "s"}`,
      icon: CalendarDays,
      className: "bg-secondary-50 text-primary",
    },
    {
      label: "Balance",
      value: money(outstanding),
      note: outstanding > 0 ? "Payment attention needed" : "No outstanding balance",
      icon: CreditCard,
      className: outstanding > 0 ? "bg-accent-50 text-accent-700" : "bg-surface/45 text-primary",
    },
    {
      label: "Messages",
      value: String(unreadMessages),
      note: unreadMessages === 1 ? "Unread message" : "Unread messages",
      icon: MessageSquare,
      className: "bg-white text-primary",
    },
    {
      label: "Events",
      value: String(upcomingEvents.length),
      note: "Coming up soon",
      icon: Sparkles,
      className: "bg-secondary-50 text-primary",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.45fr_0.9fr]">
          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,152,123,0.16),transparent_38%)]" />
            <div className="relative">
              <Badge className="mb-4 border-0 bg-secondary-100 text-primary hover:bg-secondary-100">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Parent Portal
              </Badge>
              <h1 className="font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">
                {greeting()}, {firstName}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                A calm place to check care updates, attendance, upcoming events, payments, and school messages.
              </p>

              {children.length > 1 ? (
                <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                  {children.map((child) => {
                    const active = selectedChild?.id === child.id;

                    return (
                      <button
                        key={child.id}
                        onClick={() => setSelectedChildId(child.id)}
                        className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold transition-all ${
                          active
                            ? "border-accent bg-accent text-white shadow-soft"
                            : "border-primary/10 bg-[#FFF9F0] text-primary hover:border-accent/60"
                        }`}
                      >
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={child.photo ?? undefined} />
                          <AvatarFallback className="bg-secondary-100 text-[10px] text-primary">
                            {child.firstName[0]}
                            {child.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {child.firstName}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-primary/10 bg-secondary-50 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Today's Focus</p>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => router.push(outstanding > 0 ? "/parent/payments/pay" : "/parent/messages")}
                className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-left shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <span>
                  <span className="block font-display text-lg font-bold text-primary">
                    {outstanding > 0 ? "Settle outstanding payment" : "Check school messages"}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {outstanding > 0 ? `${money(outstanding)} pending on your account` : "Stay current with classroom updates"}
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-accent" />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <Button className="h-12 bg-accent text-white hover:bg-accent-400" onClick={() => router.push("/parent/messages")}>
                  <Send className="h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" className="h-12 bg-white" onClick={() => router.push("/parent/child")}>
                  <UserRound className="h-4 w-4" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overview.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label} className={`overflow-hidden border-primary/10 shadow-soft ${item.className}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-70">{item.label}</p>
                    <p className="mt-2 font-display text-2xl font-bold">{item.value}</p>
                    <p className="mt-1 text-sm opacity-75">{item.note}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/75">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-primary/10 bg-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="font-display text-xl text-primary">Child Snapshot</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Profile, attendance, and enrollment details.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/parent/child")}>
              View
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {childrenLoading ? (
              <div className="rounded-3xl bg-secondary-50 p-5 text-sm font-semibold text-muted-foreground">
                Loading child profile...
              </div>
            ) : selectedChild ? (
              <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-3xl border border-primary/10 bg-[#FFF9F0] p-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-soft">
                      <AvatarImage src={selectedChild.photo ?? undefined} />
                      <AvatarFallback className="bg-secondary-100 text-lg font-bold text-primary">
                        {selectedChild.firstName.charAt(0)}
                        {selectedChild.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-display text-xl font-bold text-primary">
                        {selectedChild.firstName} {selectedChild.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedChild.program}</p>
                      <StatusBadge status={selectedChild.status} className="mt-2 text-[10px]" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Enrolled</p>
                      <p className="mt-1 font-bold text-primary">{formatDate(selectedChild.enrollmentDate)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Rate</p>
                      <p className="mt-1 font-bold text-primary">{attendance.length ? `${attendanceRate}%` : "New"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-primary/10 bg-secondary-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-lg font-bold text-primary">This Week</p>
                      <p className="text-sm text-muted-foreground">Attendance at a glance.</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white" onClick={() => router.push("/parent/attendance")}>
                      Details
                    </Button>
                  </div>

                  <div className="mt-5 grid grid-cols-5 gap-2">
                    {weekDays.map((date) => {
                      const record = attendance.find((item) => dayKey(item.date) === dayKey(date));
                      const status = record?.status;
                      const Icon =
                        status === "PRESENT"
                          ? CheckCircle2
                          : status === "LATE"
                            ? Clock3
                            : status === "ABSENT"
                              ? XCircle
                              : CalendarDays;

                      return (
                        <div key={date.toISOString()} className="rounded-2xl bg-white p-2 text-center shadow-xs">
                          <div
                            className={`mx-auto flex h-10 w-10 items-center justify-center rounded-2xl ${
                              status === "PRESENT"
                                ? "bg-surface/60 text-primary"
                                : status === "LATE"
                                  ? "bg-accent-50 text-accent-700"
                                  : status === "ABSENT"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-secondary-50 text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="mt-2 text-xs font-bold text-primary">
                            {date.toLocaleDateString("en-NG", { weekday: "short" })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState title="No child profile" description="Your child's profile will appear after enrollment approval." />
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-primary/10 bg-white shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-display text-xl text-primary">Payments</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/parent/payments")}>
                View all
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl bg-accent-50 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-700">Outstanding</p>
                <p className="mt-2 font-display text-3xl font-bold text-primary">{money(outstanding)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {latestPayment ? `Last activity: ${formatDate(latestPayment.createdAt)}` : "No payment activity yet."}
                </p>
              </div>
              <Button className="w-full bg-accent text-white hover:bg-accent-400" onClick={() => router.push("/parent/payments/pay")}>
                <CreditCard className="h-4 w-4" />
                Make a payment
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/10 bg-white shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-display text-xl text-primary">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "Resources", icon: FileText, href: "/parent/resources" },
                { label: "Events", icon: CalendarDays, href: "/parent/events" },
                { label: "Support", icon: MessageSquare, href: "/parent/support" },
                { label: "Messages", icon: Send, href: "/parent/messages" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className="flex min-h-24 flex-col items-start justify-between rounded-3xl border border-primary/10 bg-[#FFF9F0] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent-50"
                  >
                    <Icon className="h-5 w-5 text-accent" />
                    <span className="font-bold text-primary">{item.label}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/10 bg-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-xl text-primary">Upcoming Events</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/parent/events")}>
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <EmptyState title="No upcoming events" description="School events will appear here." />
            ) : (
              upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => router.push("/parent/events")}
                  className="flex w-full items-center gap-4 rounded-3xl border border-primary/10 bg-secondary-50 p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-secondary-100"
                >
                  <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-white text-primary shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                      {new Date(event.date).toLocaleDateString("en-NG", { month: "short" })}
                    </span>
                    <span className="font-display text-xl font-bold">{new Date(event.date).getDate()}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-primary">{event.title}</span>
                    <span className="mt-1 block truncate text-sm text-muted-foreground">{event.location ?? "School"}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-accent" />
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-xl text-primary">Recent Messages</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/parent/messages")}>
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {threads.slice(0, 3).length === 0 ? (
              <EmptyState title="No messages" description="Messages from staff and admin will appear here." />
            ) : (
              threads.slice(0, 3).map((message) => (
                <button
                  key={message.id}
                  onClick={() => router.push("/parent/messages")}
                  className="flex w-full items-start gap-3 rounded-3xl border border-primary/10 bg-[#FFF9F0] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent/60"
                >
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={message.sender?.avatar ?? undefined} />
                    <AvatarFallback className="bg-secondary-100 font-bold text-primary">
                      {message.sender?.name?.charAt(0) ?? "S"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-bold text-primary">{message.sender?.name ?? "School"}</span>
                      {!message.isRead ? <span className="h-2.5 w-2.5 rounded-full bg-accent" /> : null}
                    </span>
                    <span className="mt-1 block truncate text-sm text-muted-foreground">{message.content}</span>
                  </span>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
