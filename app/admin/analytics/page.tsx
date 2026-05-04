"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";
import { useChildren } from "@/hooks/useChildren";
import { usePayments } from "@/hooks/usePayments";
import { useRegistrations } from "@/hooks/useRegistrations";

const colors = ["#0D1F5C", "#2A9D8F", "#F5C518", "#2D2D2D", "#DC2626"];

function monthLabel(value: string) {
  return new Intl.DateTimeFormat("en-NG", { month: "short" }).format(new Date(value));
}

function money(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

function byMonth<T extends { createdAt?: string; enrollmentDate?: string; amount?: number }>(
  records: T[],
  dateKey: "createdAt" | "enrollmentDate",
  valueKey?: "amount",
) {
  const map = new Map<string, number>();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return date.toISOString().slice(0, 7);
  });

  months.forEach((month) => map.set(month, 0));

  records.forEach((record) => {
    const rawDate = record[dateKey];
    if (!rawDate) return;
    const key = new Date(rawDate).toISOString().slice(0, 7);
    if (!map.has(key)) return;
    map.set(key, (map.get(key) ?? 0) + (valueKey ? Number(record[valueKey] ?? 0) : 1));
  });

  return months.map((month) => ({
    month: monthLabel(`${month}-01`),
    value: map.get(month) ?? 0,
  }));
}

export default function Analytics() {
  const { data: children = [] } = useChildren();
  const { data: payments = [] } = usePayments({ pageSize: 100 });
  const { data: registrations = [] } = useRegistrations({ pageSize: 100 });
  const { data: attendance = [] } = useAttendance();

  const succeededPayments = payments.filter((payment) => payment.status === "SUCCEEDED");
  const revenueYtd = succeededPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const present = attendance.filter((record) => record.status === "PRESENT").length;
  const attendanceRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const approvedRegistrations = registrations.filter((registration) => registration.status === "APPROVED").length;

  const revenueData = byMonth(succeededPayments, "createdAt", "amount");
  const enrollmentData = byMonth(children, "enrollmentDate");
  const programData = Array.from(
    children.reduce((map, child) => map.set(child.program, (map.get(child.program) ?? 0) + 1), new Map<string, number>()),
  ).map(([name, value], index) => ({ name, value, color: colors[index % colors.length] }));
  const genderData = Array.from(
    children.reduce((map, child) => map.set(child.gender, (map.get(child.gender) ?? 0) + 1), new Map<string, number>()),
  ).map(([name, value], index) => ({ name, value, color: colors[index % colors.length] }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-green lg:text-2xl">Analytics & Reports</h1>
        <p className="text-sm text-muted-foreground">Live enrollment, payment, and attendance insights from backend data.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Children</p><p className="text-2xl font-bold text-green">{children.length}</p><p className="text-xs text-muted-foreground">Active database records</p></CardContent></Card>
        <Card className="shadow-soft"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Revenue (YTD)</p><p className="text-2xl font-bold text-green">{money(revenueYtd)}</p><p className="text-xs text-muted-foreground">Succeeded payments</p></CardContent></Card>
        <Card className="shadow-soft"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Approved Enrollments</p><p className="text-2xl font-bold text-green">{approvedRegistrations}</p><p className="text-xs text-muted-foreground">From registrations API</p></CardContent></Card>
        <Card className="shadow-soft"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg Attendance</p><p className="text-2xl font-bold text-green">{attendanceRate}%</p><p className="text-xs text-muted-foreground">{attendance.length} records</p></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display text-green">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => money(Number(value))} />
                  <Bar dataKey="value" fill="#0D1F5C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display text-green">New Enrollments</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#2A9D8F" fill="#2A9D8F" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display text-green">Enrollment by Program</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={programData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {programData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display text-green">Gender Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {genderData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
