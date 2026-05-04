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
    <div className="space-y-6">
      <PageHeader
        title="Attendance Reports"
        description="Analyze attendance totals by status and export the full report."
        action={<Button onClick={exportCsv} disabled={records.length === 0}>Export CSV</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {chartData.map((item) => (
          <Card key={item.status}>
            <CardContent className="p-4">
              <StatusBadge status={item.status} />
              <p className="mt-3 text-3xl font-bold text-green">{item.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2A9D8F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Child</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Loading attendance...</td></tr>
              ) : records.map((record) => (
                <tr key={record.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{new Date(record.date).toLocaleDateString("en-NG")}</td>
                  <td className="px-4 py-3">{record.child ? `${record.child.firstName} ${record.child.lastName}` : "Unknown"}</td>
                  <td className="px-4 py-3">{record.child?.program ?? "-"}</td>
                  <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{record.notes ?? "No notes"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
