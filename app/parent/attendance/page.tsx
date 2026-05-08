"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { FileDown } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendance } from "@/hooks/useAttendance";

const statusColors = {
  PRESENT: "#16a34a",
  ABSENT: "#dc2626",
  LATE: "#f59e0b",
  EXCUSED: "#0f766e",
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

  const calendarEvents = records.map((record) => ({
    id: record.id,
    title: record.status.toLowerCase(),
    date: record.date,
    backgroundColor: statusColors[record.status],
    borderColor: statusColors[record.status],
    textColor: "#ffffff",
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
    <div className="space-y-6">
      <PageHeader
        title="Attendance Records"
        description="Track your child's attendance history and monthly patterns."
        action={
          <Button onClick={handleExport} disabled={records.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map((item) => (
          <Card key={item.status}>
            <CardContent className="p-5">
              <p className="text-sm capitalize text-muted-foreground">{item.status.toLowerCase()}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-3xl font-bold text-green-500">{item.count}</span>
                <StatusBadge status={item.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Calendar</CardTitle>
        </CardHeader>
        <CardContent>
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

      <Card>
        <CardHeader>
          <CardTitle>Daily Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable columns={4} rows={6} />
          ) : records.length === 0 ? (
            <EmptyState title="No attendance records" description="Attendance entries will appear here once marked by staff." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Child</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">{formatDate(record.date)}</td>
                      <td className="py-3 pr-4">
                        {record.child ? `${record.child.firstName} ${record.child.lastName}` : "My child"}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="py-3 text-muted-foreground">{record.notes ?? "No notes"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
