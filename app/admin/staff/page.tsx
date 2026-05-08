"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Grid3X3, List, Plus, Power } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useDeactivateStaff, useStaff, type StaffRecord } from "@/hooks/useStaff";

export default function ManageStaff() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const { data: staff = [], isLoading } = useStaff();
  const deactivateStaff = useDeactivateStaff();

  function deactivate() {
    if (!deactivateId) return;
    deactivateStaff.mutate(deactivateId, {
      onSuccess: () => {
        toast.success("Staff member deactivated");
        setDeactivateId(null);
      },
      onError: (error) => toast.error(error.message),
    });
  }

  const columns = useMemo<ColumnDef<StaffRecord, unknown>[]>(
    () => [
      {
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.photo ?? undefined} />
              <AvatarFallback>{row.original.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      { header: "Role", accessorKey: "role" },
      { header: "Class", accessorKey: "class" },
      { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.isActive ? "ACTIVE" : "INACTIVE"} /> },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" disabled={!row.original.isActive} onClick={() => setDeactivateId(row.original.id)}>
              <Power className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Staff"
        description="View and manage staff members"
        action={
          <Button className="bg-secondary font-semibold text-green-500 hover:bg-secondary-400">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        }
      />

      <div className="flex justify-end gap-2">
        <Button variant={view === "grid" ? "default" : "outline"} size="icon" onClick={() => setView("grid")}>
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button variant={view === "list" ? "default" : "outline"} size="icon" onClick={() => setView("list")}>
          <List className="h-4 w-4" />
        </Button>
      </div>

      {view === "list" ? (
        <DataTable columns={columns} data={staff} isLoading={isLoading} exportable emptyTitle="No staff found" />
      ) : isLoading ? (
        <LoadingTable columns={3} />
      ) : staff.length === 0 ? (
        <EmptyState title="No staff found" description="Create staff profiles to see them here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <Card key={member.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.photo ?? undefined} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-teal">{member.role}</p>
                  </div>
                </div>
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Class: {member.class ?? "All"}</span>
                  <StatusBadge status={member.isActive ? "ACTIVE" : "INACTIVE"} />
                </div>
                <Button variant="outline" size="sm" disabled={!member.isActive} onClick={() => setDeactivateId(member.id)} className="w-full">
                  Deactivate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deactivateId)}
        onOpenChange={(open) => !open && setDeactivateId(null)}
        title="Deactivate staff member?"
        description="This keeps the staff record but marks it inactive."
        confirmLabel="Deactivate"
        isLoading={deactivateStaff.isPending}
        onConfirm={deactivate}
      />
    </div>
  );
}
