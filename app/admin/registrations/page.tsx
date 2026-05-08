"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useRegistrations, useUpdateRegistration, type RegistrationRecord } from "@/hooks/useRegistrations";

const filters = ["All", "Pending", "Approved", "Rejected", "Waitlisted"];

export default function Registrations() {
  const [filter, setFilter] = useState("All");
  const status = filter === "All" ? undefined : filter.toUpperCase();
  const { data: registrations = [], isLoading } = useRegistrations({ status });
  const updateRegistration = useUpdateRegistration();

  const updateStatus = useCallback((id: string, nextStatus: RegistrationRecord["status"]) => {
    updateRegistration.mutate(
      { id, body: { status: nextStatus } },
      {
        onSuccess: () => toast.success(`Registration ${nextStatus.toLowerCase()}`),
        onError: (error) => toast.error(error.message),
      },
    );
  }, [updateRegistration]);

  const columns = useMemo<ColumnDef<RegistrationRecord, unknown>[]>(
    () => [
      {
        header: "Child",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.childFirstName} {row.original.childLastName}</p>
            <p className="text-xs text-muted-foreground">{row.original.gender}</p>
          </div>
        ),
      },
      {
        header: "Parent",
        cell: ({ row }) => (
          <div>
            <p>{row.original.parentName}</p>
            <p className="text-xs text-muted-foreground">{row.original.parentEmail}</p>
          </div>
        ),
      },
      { header: "Program", accessorKey: "program" },
      {
        header: "Date Submitted",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-NG"),
      },
      {
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="sm" aria-label="View registration">
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={`h-8 border-success text-success transition-all ${
                row.original.status === "APPROVED" 
                ? "opacity-50 cursor-not-allowed bg-muted grayscale border-muted text-muted-foreground" 
                : "hover:bg-success hover:text-white"
              }`}
              disabled={updateRegistration.isPending || row.original.status === "APPROVED"}
              onClick={() => updateStatus(row.original.id, "APPROVED")}
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={`h-8 border-destructive text-destructive transition-all ${
                row.original.status === "REJECTED" 
                ? "opacity-50 cursor-not-allowed bg-muted grayscale border-muted text-muted-foreground" 
                : "hover:bg-destructive hover:text-white"
              }`}
              disabled={updateRegistration.isPending || row.original.status === "REJECTED"}
              onClick={() => updateStatus(row.original.id, "REJECTED")}
            >
              <XCircle className="mr-1 h-3 w-3" />
              Reject
            </Button>
          </div>
        ),
      },
    ],
    [updateRegistration.isPending, updateStatus],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Registration Requests" description="Review and process enrollment applications" />

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === item ? "bg-secondary text-green-500" : "bg-muted text-muted-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={registrations} isLoading={isLoading} exportable emptyTitle="No registrations found" />
    </div>
  );
}
