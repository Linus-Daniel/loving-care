"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";

const statuses = ["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const;

export default function AttendanceReportsPage() {
  const { data: records = [], isLoading } = useAttendance();
  const chartData = statuses.map((status) => ({
    status,
    count: records.filter((record) => record.status === status).length,
  }));

  const exportCsv = () => {
    const csv = ["Date,Child,Program,Status,Notes", ...records.map((record) => [
      new Date(record.date).toLocaleDateString("en-NG"),
      record.child ? `${record.child.firstName} ${record.child.lastName}` : "",
      record.child?.program ?? "",
      record.status,
      record.notes ?? "",
    ].join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      <PageHeader
        title="Attendance Reports"
        description="Analyze attendance totals by status and export the full report."
        action={<Button onClick={exportCsv} disabled={records.length === 0} className="shadow-soft hover:shadow-md transition-all">Export CSV</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {chartData.map((item) => (
          <Card key={item.status} className="shadow-soft border-primary/5 hover:shadow-card transition-all duration-300">
            <CardContent className="p-6">
              <StatusBadge status={item.status} />
              <p className="mt-4 text-4xl font-bold text-primary tracking-tight">{item.count}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Total records</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-soft border-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display font-bold text-primary">Attendance by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis 
                  dataKey="status" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} 
                  allowDecimals={false} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "var(--shadow-card)" }}
                />
                <Bar dataKey="count" fill="var(--color-primary-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft border-primary/5 overflow-hidden">
        <CardHeader className="bg-muted/30 pb-3">
          <CardTitle className="text-lg font-display font-bold text-primary">Detailed Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/10 text-left">
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Child</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Class</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-12 text-center text-muted-foreground font-medium">Loading attendance records...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-muted-foreground font-medium">No records found.</td></tr>
                ) : records.map((record) => (
                  <tr key={record.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{new Date(record.date).toLocaleDateString("en-NG", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{record.child ? `${record.child.firstName} ${record.child.lastName}` : "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">{record.child?.program ?? "-"}</td>
                    <td className="px-6 py-4"><StatusBadge status={record.status} /></td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{record.notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
