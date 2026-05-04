"use client";

import { Baby, Calendar, CalendarDays, ClipboardList, CreditCard, HelpCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { KPICard } from "@/components/admin/KPICard";
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
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
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
  const currentMonth = now.toISOString().slice(0, 7);
  const newRegistrations = registrations.filter((item) => item.createdAt.startsWith(currentMonth)).length;
  const monthlyRevenue = payments
    .filter((payment) => payment.status === "SUCCEEDED" && payment.createdAt.startsWith(currentMonth))
    .reduce((sum, payment) => sum + payment.amount, 0);
  const openTickets = tickets.filter((ticket) => ticket.status !== "CLOSED").length;
  const presentToday = attendance.filter((record) => record.date.slice(0, 10) === now.toISOString().slice(0, 10) && record.status === "PRESENT").length;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-green lg:text-2xl">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Today is {new Intl.DateTimeFormat("en-NG", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(now)}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard title="Total Children" value={children.length} trend="Live" trendDirection="up" icon={Baby} color="text-green" />
        <KPICard title="New Registrations" value={newRegistrations} trend="This month" trendDirection="up" icon={ClipboardList} color="text-teal" />
        <KPICard title="Revenue" value={money(monthlyRevenue)} trend="This month" trendDirection="up" icon={CreditCard} color="text-success" />
        <KPICard title="Open Tickets" value={openTickets} trend="Needs review" trendDirection={openTickets ? "down" : "up"} icon={HelpCircle} color="text-warning" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard title="Staff Count" value={staff.length} trend="Active staff" trendDirection="up" icon={Users} color="text-green" />
        <KPICard title="Today Attendance" value={`${todayAttendanceRate}%`} trend={`${presentToday}/${children.length} present`} trendDirection="up" icon={CalendarDays} color="text-success" />
        <KPICard title="Upcoming Events" value={upcomingEvents} trend="Scheduled" trendDirection="up" icon={Calendar} color="text-teal" />
        <KPICard title="Pending Approvals" value={pendingApprovals} trend="Registrations" trendDirection={pendingApprovals ? "down" : "up"} icon={ClipboardList} color="text-warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display text-green">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => money(Number(value))} />
                  <Area type="monotone" dataKey="revenue" stroke="#0D1F5C" fill="#0D1F5C" fillOpacity={0.12} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display text-green">Monthly Enrollments</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="enrollments" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-display text-green">Recent Registrations</CardTitle>
            <Button variant="ghost" className="h-auto p-0 text-sm text-teal" onClick={() => router.push("/admin/registrations")}>View All</Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="px-2 py-2 text-left text-muted-foreground">Child</th><th className="px-2 py-2 text-left text-muted-foreground">Program</th><th className="px-2 py-2 text-left text-muted-foreground">Status</th></tr></thead>
              <tbody>
                {recentRegistrations.map((registration) => (
                  <tr key={registration.id} className="border-b border-border/50">
                    <td className="px-2 py-2.5"><p className="font-medium">{registration.childFirstName} {registration.childLastName}</p><p className="text-[10px] text-muted-foreground">{registration.parentName}</p></td>
                    <td className="px-2 py-2.5 text-xs">{registration.program}</td>
                    <td className="px-2 py-2.5"><StatusBadge status={registration.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-display text-green">Recent Transactions</CardTitle>
            <Button variant="ghost" className="h-auto p-0 text-sm text-teal" onClick={() => router.push("/admin/payments")}>View All</Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="px-2 py-2 text-left text-muted-foreground">Parent</th><th className="px-2 py-2 text-right text-muted-foreground">Amount</th><th className="px-2 py-2 text-left text-muted-foreground">Status</th></tr></thead>
              <tbody>
                {recentTransactions.map((payment) => (
                  <tr key={payment.id} className="border-b border-border/50">
                    <td className="px-2 py-2.5"><p className="font-medium">{payment.user?.name ?? "Unknown parent"}</p><p className="text-[10px] text-muted-foreground">{payment.description}</p></td>
                    <td className="px-2 py-2.5 text-right font-medium">{money(payment.amount)}</td>
                    <td className="px-2 py-2.5"><StatusBadge status={payment.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
