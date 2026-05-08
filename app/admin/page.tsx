"use client";

import {
  Baby,
  Calendar,
  CalendarDays,
  ClipboardList,
  CreditCard,
  HelpCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";
import { useChildren } from "@/hooks/useChildren";
import { useEvents } from "@/hooks/useEvents";
import { usePayments } from "@/hooks/usePayments";
import { useRegistrations } from "@/hooks/useRegistrations";
import { useStaff } from "@/hooks/useStaff";
import { useSupportTickets } from "@/hooks/useSupportTickets";

function money(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function recentMonths() {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - index));
    return date.toISOString().slice(0, 7);
  });
}

function monthLabel(month: string) {
  return new Intl.DateTimeFormat("en-NG", { month: "short" }).format(new Date(`${month}-01`));
}

export default function AdminOverview() {
  const router = useRouter();
  const { data: children = [] } = useChildren();
  const { data: registrations = [] } = useRegistrations({ pageSize: 100 });
  const { data: payments = [] } = usePayments({ pageSize: 100 });
  const { data: staff = [] } = useStaff();
  const { data: events = [] } = useEvents();
  const { data: attendance = [] } = useAttendance();
  const { data: tickets = [] } = useSupportTickets();

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const currentMonth = now.toISOString().slice(0, 7);
  const newRegistrations = registrations.filter((item) => item.createdAt.startsWith(currentMonth)).length;
  const monthlyRevenue = payments
    .filter((payment) => payment.status === "SUCCEEDED" && payment.createdAt.startsWith(currentMonth))
    .reduce((sum, payment) => sum + payment.amount, 0);
  const openTickets = tickets.filter((ticket) => ticket.status !== "CLOSED").length;
  const presentToday = attendance.filter((record) => record.date.slice(0, 10) === todayKey && record.status === "PRESENT").length;
  const todayAttendanceRate = children.length ? Math.round((presentToday / children.length) * 100) : 0;
  const upcomingEvents = events.filter((event) => new Date(event.date) >= now).length;
  const pendingApprovals = registrations.filter((item) => item.status === "PENDING").length;

  const revenueData = recentMonths().map((month) => ({
    month: monthLabel(month),
    revenue: payments
      .filter((payment) => payment.status === "SUCCEEDED" && payment.createdAt.startsWith(month))
      .reduce((sum, payment) => sum + payment.amount, 0),
  }));
  const enrollmentData = recentMonths().map((month) => ({
    month: monthLabel(month),
    enrollments: children.filter((child) => child.enrollmentDate.startsWith(month)).length,
  }));

  const recentRegistrations = registrations.slice(0, 5);
  const recentTransactions = payments.slice(0, 5);

  const kpis = [
    { label: "Children", value: children.length, note: "Total enrolled profiles", icon: Baby, tone: "bg-secondary-50" },
    { label: "Registrations", value: newRegistrations, note: "Submitted this month", icon: ClipboardList, tone: "bg-accent-50" },
    { label: "Revenue", value: money(monthlyRevenue), note: "Collected this month", icon: CreditCard, tone: "bg-surface/45" },
    { label: "Open Tickets", value: openTickets, note: "Needs review", icon: HelpCircle, tone: "bg-white" },
  ];

  const operational = [
    { label: "Staff Count", value: staff.length, note: "Active team members", icon: Users },
    { label: "Attendance", value: `${todayAttendanceRate}%`, note: `${presentToday}/${children.length} present today`, icon: CalendarDays },
    { label: "Events", value: upcomingEvents, note: "Upcoming events", icon: Calendar },
    { label: "Approvals", value: pendingApprovals, note: "Pending applications", icon: ClipboardList },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-12">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">Dashboard Overview</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Monitor enrollment, payments, attendance, events, and parent support activity from one workspace.
            </p>
          </div>
          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 xl:border-l xl:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Today</p>
            <p className="mt-3 font-display text-2xl font-bold text-primary">
              {new Intl.DateTimeFormat("en-NG", { weekday: "long", month: "long", day: "numeric" }).format(now)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="bg-accent text-white hover:bg-accent-400" onClick={() => router.push("/admin/registrations")}>
                Review registrations
              </Button>
              <Button variant="outline" className="bg-white" onClick={() => router.push("/admin/payments")}>
                Payments
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className={`border-primary/10 shadow-soft ${item.tone}`}>
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-primary">{item.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {operational.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border-primary/10 bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-50 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-display text-2xl font-bold text-primary">{item.value}</p>
                <p className="mt-1 text-sm font-bold text-primary">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="border-primary/10 bg-white shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-xl text-primary">Revenue Trend</CardTitle>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Last 12 Months</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA987B" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#EA987B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                  <Tooltip contentStyle={{ borderRadius: "18px", border: "none", boxShadow: "var(--shadow-card)" }} formatter={(value) => [money(Number(value)), "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#EA987B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-white shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-xl text-primary">Monthly Enrollments</CardTitle>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">New signups</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: "18px", border: "none", boxShadow: "var(--shadow-card)" }} />
                  <Bar dataKey="enrollments" fill="#B9D6DC" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminTableCard title="Recent Registrations" actionLabel="View all" onAction={() => router.push("/admin/registrations")}>
          <thead className="bg-secondary-50">
            <tr className="text-left text-muted-foreground">
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em]">Child</th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em]">Program</th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em]">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentRegistrations.map((registration) => (
              <tr key={registration.id} className="border-t border-primary/10">
                <td className="px-5 py-4">
                  <p className="font-bold text-primary">
                    {registration.childFirstName} {registration.childLastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{registration.parentName}</p>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{registration.program}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={registration.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTableCard>

        <AdminTableCard title="Recent Transactions" actionLabel="View all" onAction={() => router.push("/admin/payments")}>
          <thead className="bg-secondary-50">
            <tr className="text-left text-muted-foreground">
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em]">Parent</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.16em]">Amount</th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em]">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((payment) => (
              <tr key={payment.id} className="border-t border-primary/10">
                <td className="px-5 py-4">
                  <p className="font-bold text-primary">{payment.user?.name ?? "Unknown parent"}</p>
                  <p className="text-xs text-muted-foreground">{payment.description}</p>
                </td>
                <td className="px-5 py-4 text-right font-bold text-primary">{money(payment.amount)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={payment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTableCard>
      </section>
    </div>
  );
}

function AdminTableCard({
  actionLabel,
  children,
  onAction,
  title,
}: {
  actionLabel: string;
  children: React.ReactNode;
  onAction: () => void;
  title: string;
}) {
  return (
    <Card className="overflow-hidden border-primary/10 bg-white shadow-card">
      <CardHeader className="flex flex-row items-center justify-between bg-white pb-3">
        <CardTitle className="font-display text-xl text-primary">{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">{children}</table>
        </div>
      </CardContent>
    </Card>
  );
}
