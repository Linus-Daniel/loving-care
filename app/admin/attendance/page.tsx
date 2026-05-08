"use client";

import { CalendarDays, CheckCircle, Clock, Save, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAttendance, useMarkAttendance, type AttendanceRecord } from "@/hooks/useAttendance";
import { useChildren } from "@/hooks/useChildren";

const statusOptions: Array<{
  value: AttendanceRecord["status"];
  label: string;
  icon: typeof CheckCircle;
}> = [
  { value: "PRESENT", label: "Present", icon: CheckCircle },
  { value: "ABSENT", label: "Absent", icon: XCircle },
  { value: "LATE", label: "Late", icon: Clock },
  { value: "EXCUSED", label: "Excused", icon: Save },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminAttendancePage() {
  const [date, setDate] = useState(today());
  const [program, setProgram] = useState("all");
  const { data: children = [], isLoading: childrenLoading } = useChildren({ program: program === "all" ? undefined : program });
  const { data: attendanceRecords = [], isLoading: attendanceLoading } = useAttendance({ from: date, to: date });
  const markAttendance = useMarkAttendance();

  const attendanceMap = useMemo(() => {
    return attendanceRecords.reduce((acc, record) => {
      acc[record.childId] = record.status;
      return acc;
    }, {} as Record<string, AttendanceRecord["status"]>);
  }, [attendanceRecords]);

  const programs = useMemo(() => Array.from(new Set(children.map((child) => child.program))).filter(Boolean), [children]);

  const setStatus = (childId: string, status: AttendanceRecord["status"]) => {
    markAttendance.mutate(
      { childId, date, status },
      {
        onSuccess: () => toast.success("Attendance saved"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const markAllPresent = () => {
    children.forEach((child) => {
      if (attendanceMap[child.id] !== "PRESENT") {
        setStatus(child.id, "PRESENT");
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance Management" description="Mark daily attendance by child and class with auto-save." />

      <Card className="border-primary/10 bg-white shadow-card">
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 rounded-lg bg-surface/70 px-3 py-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-auto border-none bg-transparent p-0" />
          </div>
          <Select value={program} onValueChange={setProgram}>
            <SelectTrigger className="lg:w-[220px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {programs.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="border-primary/15 text-primary hover:bg-surface/70 lg:ml-auto" 
            onClick={markAllPresent} 
            disabled={
              children.length === 0 || 
              markAttendance.isPending || 
              children.every(child => attendanceMap[child.id] === "PRESENT")
            }
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Present
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {markAttendance.isPending ? "Saving..." : "All changes saved"}
            </span>
            <StatusBadge status={markAttendance.isPending ? "IN_PROGRESS" : "SAVED"} />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-primary/10 bg-white shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10 bg-secondary-50 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Child</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {childrenLoading || attendanceLoading ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-muted-foreground">
                      Loading attendance data...
                    </td>
                  </tr>
                ) : children.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-muted-foreground">
                      No children found for this filter.
                    </td>
                  </tr>
                ) : (
                  children.map((child) => {
                    const currentStatus = attendanceMap[child.id];
                    return (
                      <tr key={child.id} className="border-b border-primary/10 transition-colors last:border-0 hover:bg-surface/40">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={child.photo ?? undefined} />
                              <AvatarFallback>{child.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-primary">{child.firstName} {child.lastName}</p>
                              <p className="text-xs text-muted-foreground">{child.parent?.name ?? "No parent linked"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-muted-foreground">{child.program}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {statusOptions.map((option) => {
                              const Icon = option.icon;
                              const isSelected = currentStatus === option.value;
                              return (
                                <Button
                                  key={option.value}
                                  size="sm"
                                  variant={isSelected ? "default" : "outline"}
                                  onClick={() => setStatus(child.id, option.value)}
                                  disabled={markAttendance.isPending || isSelected}
                                  className={isSelected ? "cursor-not-allowed bg-primary text-white opacity-50" : "border-primary/15 text-primary hover:bg-surface/70"}
                                >
                                  <Icon className="mr-1 h-3 w-3" />
                                  {option.label}
                                </Button>
                                );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
