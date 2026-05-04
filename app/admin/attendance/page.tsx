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
import { useMarkAttendance, type AttendanceRecord } from "@/hooks/useAttendance";
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
  const [localAttendance, setLocalAttendance] = useState<Record<string, AttendanceRecord["status"]>>({});
  const { data: children = [], isLoading } = useChildren({ program: program === "all" ? undefined : program });
  const markAttendance = useMarkAttendance();

  const programs = useMemo(() => Array.from(new Set(children.map((child) => child.program))).filter(Boolean), [children]);

  const setStatus = (childId: string, status: AttendanceRecord["status"]) => {
    setLocalAttendance((current) => ({ ...current, [childId]: status }));
    markAttendance.mutate(
      { childId, date, status },
      {
        onSuccess: () => toast.success("Attendance saved"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const markAllPresent = () => {
    children.forEach((child) => setStatus(child.id, "PRESENT"));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance Management" description="Mark daily attendance by child and class with auto-save." />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <CalendarDays className="h-4 w-4 text-green" />
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
          <Button variant="outline" className="lg:ml-auto" onClick={markAllPresent} disabled={children.length === 0 || markAttendance.isPending}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Present
          </Button>
          <StatusBadge status={markAttendance.isPending ? "IN_PROGRESS" : "SAVED"} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Child</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-muted-foreground">
                      Loading children...
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
                    const selected = localAttendance[child.id];
                    return (
                      <tr key={child.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={child.photo ?? undefined} />
                              <AvatarFallback>{child.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{child.firstName} {child.lastName}</p>
                              <p className="text-xs text-muted-foreground">{child.parent?.name ?? "No parent linked"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{child.program}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {statusOptions.map((option) => {
                              const Icon = option.icon;
                              return (
                                <Button
                                  key={option.value}
                                  size="sm"
                                  variant={selected === option.value ? "default" : "outline"}
                                  onClick={() => setStatus(child.id, option.value)}
                                  disabled={markAttendance.isPending}
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
