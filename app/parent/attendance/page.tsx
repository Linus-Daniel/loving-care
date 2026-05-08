"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { CalendarCheck2, FileDown } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";

const statusColors = {
  PRESENT: "#C5D2B2",
  ABSENT: "#dc2626",
  LATE: "#EA987B",
  EXCUSED: "#B9D6DC",
} as const;

const statuses = ["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const;

function monthRange(date = new Date()) {
  const from = new Date(date.getFullYear(), date.getMonth(), 1);
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function ParentAttendancePage() {
  const range = monthRange();
  const { data: records = [], isLoading } = useAttendance(range);

  const counts = statuses.map((status) => ({
    status,
    count: records.filter((record) => record.status === status).length,
  }));

  const present = counts.find((item) => item.status === "PRESENT")?.count ?? 0;
  const attendanceRate = records.length ? Math.round((present / records.length) * 100) : 0;

  const calendarEvents = records.map((record) => ({
    id: record.id,
    title: record.status.toLowerCase(),
    date: record.date,
    backgroundColor: statusColors[record.status],
    borderColor: statusColors[record.status],
    textColor: record.status === "PRESENT" || record.status === "EXCUSED" ? "#21445E" : "#ffffff",
  }));

  const handleExport = () => {
    const csv = [
      "Date,Status,Notes",
      ...records.map((record) => [formatDate(record.date), record.status, (record.notes ?? "").replaceAll(",", " ")].join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance-records.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Attendance export downloaded");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">Attendance Records</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Track your child's daily attendance history and monthly attendance patterns.
            </p>
          </div>
          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Monthly Rate</p>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{attendanceRate}%</p>
            <Button className="mt-5 bg-accent text-white hover:bg-accent-400" onClick={handleExport} disabled={records.length === 0}>
              <FileDown className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.status} className="border-primary/10 bg-white shadow-soft">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {item.status.toLowerCase()}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-display text-3xl font-bold text-primary">{item.count}</span>
                <StatusBadge status={item.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-primary/10 bg-white shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl text-primary">Monthly Calendar</CardTitle>
        </CardHeader>
        <CardContent className="parent-calendar">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
          />
        </CardContent>
      </Card>

      <Card className="border-primary/10 bg-white shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl text-primary">Daily Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable columns={4} rows={6} />
          ) : records.length === 0 ? (
            <EmptyState title="No attendance records" description="Attendance entries will appear here once marked by staff." />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-primary/10">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary-50">
                    <tr className="text-left text-muted-foreground">
                      <th className="px-4 py-3 font-bold">Date</th>
                      <th className="px-4 py-3 font-bold">Child</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-t border-primary/10 bg-white">
                        <td className="px-4 py-4">{formatDate(record.date)}</td>
                        <td className="px-4 py-4 font-medium text-primary">
                          {record.child ? `${record.child.firstName} ${record.child.lastName}` : "My child"}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">{record.notes ?? "No notes"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
