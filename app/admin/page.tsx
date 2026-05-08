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
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary lg:text-3xl tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back. Today is {new Intl.DateTimeFormat("en-NG", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(now)}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 border-primary/20 hover:bg-primary/5">Download Report</Button>
          <Button size="sm" className="h-9 px-4 shadow-soft hover:shadow-md transition-all">New Registration</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard title="Total Children" value={children.length} trend="Live" trendDirection="up" icon={Baby} color="text-primary" />
        <KPICard title="New Registrations" value={newRegistrations} trend="This month" trendDirection="up" icon={ClipboardList} color="text-teal" />
        <KPICard title="Revenue" value={money(monthlyRevenue)} trend="This month" trendDirection="up" icon={CreditCard} color="text-success" />
        <KPICard title="Open Tickets" value={openTickets} trend="Needs review" trendDirection={openTickets ? "down" : "up"} icon={HelpCircle} color="text-warning" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard title="Staff Count" value={staff.length} trend="Active staff" trendDirection="up" icon={Users} color="text-primary" />
        <KPICard title="Today Attendance" value={`${todayAttendanceRate}%`} trend={`${presentToday}/${children.length} present`} trendDirection="up" icon={CalendarDays} color="text-success" />
        <KPICard title="Upcoming Events" value={upcomingEvents} trend="Scheduled" trendDirection="up" icon={Calendar} color="text-teal" />
        <KPICard title="Pending Approvals" value={pendingApprovals} trend="Registrations" trendDirection={pendingApprovals ? "down" : "up"} icon={ClipboardList} color="text-warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft border-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display font-bold text-primary">Revenue Trend</CardTitle>
              <div className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Last 12 Months</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "var(--shadow-card)" }}
                    formatter={(value) => [money(Number(value)), "Revenue"]} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary-500)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display font-bold text-primary">Monthly Enrollments</CardTitle>
              <div className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">New Signups</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} 
                    allowDecimals={false} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "var(--shadow-card)" }}
                  />
                  <Bar dataKey="enrollments" fill="var(--color-secondary-500)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft border-primary/5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/30">
            <CardTitle className="text-base font-display font-bold text-primary">Recent Registrations</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-primary font-bold hover:bg-primary/5" onClick={() => router.push("/admin/registrations")}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/10 text-left">
                    <th className="px-6 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Child</th>
                    <th className="px-6 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Program</th>
                    <th className="px-6 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground leading-tight">{registration.childFirstName} {registration.childLastName}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{registration.parentName}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{registration.program}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={registration.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-primary/5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/30">
            <CardTitle className="text-base font-display font-bold text-primary">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-primary font-bold hover:bg-primary/5" onClick={() => router.push("/admin/payments")}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/10 text-left">
                    <th className="px-6 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Parent</th>
                    <th className="px-6 py-3 font-semibold text-right text-muted-foreground uppercase text-[10px] tracking-wider">Amount</th>
                    <th className="px-6 py-3 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentTransactions.map((payment) => (
                    <tr key={payment.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground leading-tight">{payment.user?.name ?? "Unknown parent"}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{payment.description}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary">{money(payment.amount)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
