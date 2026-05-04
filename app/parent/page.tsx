"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowRight, CalendarDays, CheckCircle, Clock, CreditCard, MessageSquare, XCircle } from "lucide-react";
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
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
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

export default function ParentDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const { data: children = [], isLoading: childrenLoading } = useChildren();
  const { data: payments = [] } = usePayments();
  const { data: events = [] } = useEvents();
  const { data: threads = [] } = useMessageThreads();
  const { data: attendance = [] } = useAttendance();
  const child = children[0];

  const presentCount = attendance.filter((record) => record.status === "PRESENT").length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
  const outstanding = payments
    .filter((payment) => payment.status === "PENDING" || payment.status === "FAILED")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const unreadMessages = threads.filter((message) => !message.isRead).length;
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const stats = [
    { label: "Attendance", value: attendance.length ? `${attendanceRate}%` : "0%", icon: CalendarDays, color: "text-success", bg: "bg-success/10" },
    { label: "Upcoming Events", value: String(upcomingEvents.length), icon: CalendarDays, color: "text-green", bg: "bg-green/10" },
    { label: "Outstanding Balance", value: money(outstanding), icon: CreditCard, color: "text-warning", bg: "bg-warning/10" },
    { label: "Unread Messages", value: String(unreadMessages), icon: MessageSquare, color: "text-teal", bg: "bg-teal/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-green lg:text-2xl">
          {greeting()}, {user?.firstName ?? user?.fullName ?? "Parent"}
        </h1>
        <p className="text-sm text-muted-foreground">Your child, payments, events, and messages at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-soft">
            <CardContent className="p-4">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xl font-display font-bold text-green lg:text-2xl">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display text-green">My Child</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {childrenLoading ? (
              <p className="text-sm text-muted-foreground">Loading child profile...</p>
            ) : child ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={child.photo ?? undefined} />
                    <AvatarFallback>{child.firstName.charAt(0)}{child.lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-green">{child.firstName} {child.lastName}</p>
                    <p className="text-xs text-muted-foreground">{child.program}</p>
                    <StatusBadge status={child.status} className="mt-1 text-[10px]" />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teacher</span>
                    <span className="font-medium">Assigned staff</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enrolled</span>
                    <span className="font-medium">{new Date(child.enrollmentDate).toLocaleDateString("en-NG")}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => router.push("/parent/child")}>
                  View Profile <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </>
            ) : (
              <EmptyState title="No child profile" description="Your child's profile will appear after enrollment approval." />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display text-green">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2">
              {daysThisWeek().map((date) => {
                const record = attendance.find((item) => dayKey(item.date) === dayKey(date));
                const status = record?.status;
                const Icon = status === "PRESENT" ? CheckCircle : status === "LATE" ? Clock : status === "ABSENT" ? XCircle : CalendarDays;
                return (
                  <div key={date.toISOString()} className="flex flex-col items-center gap-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${status === "PRESENT" ? "bg-success/10" : status === "LATE" ? "bg-warning/10" : status === "ABSENT" ? "bg-destructive/10" : "bg-muted"}`}>
                      <Icon className={`h-5 w-5 ${status === "PRESENT" ? "text-success" : status === "LATE" ? "text-warning" : status === "ABSENT" ? "text-destructive" : "text-muted-foreground"}`} />
                    </div>
                    <span className="text-xs font-medium">{date.toLocaleDateString("en-NG", { weekday: "short" })}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display text-green">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-between bg-yellow text-green hover:bg-yellow-400" onClick={() => router.push("/parent/payments/pay")}>
              Pay Now <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => router.push("/parent/events")}>
              View Calendar <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => router.push("/parent/messages")}>
              Message Teacher <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-display text-green">Upcoming Events</CardTitle>
            <Button variant="ghost" className="h-auto p-0 text-sm text-teal" onClick={() => router.push("/parent/events")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <EmptyState title="No upcoming events" description="School events will appear here." />
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-green text-white">
                    <span className="text-[10px] uppercase">{new Date(event.date).toLocaleDateString("en-NG", { month: "short" })}</span>
                    <span className="text-sm font-bold">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{event.title}</p>
                    <Badge variant="outline" className="border-teal text-[10px] text-teal">{event.location ?? "School"}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-display text-green">Recent Messages</CardTitle>
            <Button variant="ghost" className="h-auto p-0 text-sm text-teal" onClick={() => router.push("/parent/messages")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {threads.slice(0, 2).length === 0 ? (
              <EmptyState title="No messages" description="Messages from staff and admin will appear here." />
            ) : (
              threads.slice(0, 2).map((message) => (
                <div key={message.id} className="flex items-start gap-3 rounded-lg bg-muted p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={message.sender?.avatar ?? undefined} />
                    <AvatarFallback>{message.sender?.name?.charAt(0) ?? "S"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{message.sender?.name ?? "School"}</p>
                      {!message.isRead ? <span className="h-2.5 w-2.5 rounded-full bg-destructive" /> : null}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
