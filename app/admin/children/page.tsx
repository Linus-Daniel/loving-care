"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/admin/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useChildren, type ChildRecord } from "@/hooks/useChildren";
import { apiFetch } from "@/lib/client/api";

function childAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) age -= 1;
  return Math.max(age, 0);
}

export default function ManageChildren() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: children = [], isLoading } = useChildren();

  const deleteChild = useMutation({
    mutationFn: (id: string) => apiFetch<ChildRecord>(`/api/children/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Child marked inactive");
      setDeleteId(null);
      void queryClient.invalidateQueries({ queryKey: ["children"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const columns = useMemo<ColumnDef<ChildRecord, unknown>[]>(
    () => [
      {
        header: "Child",
        cell: ({ row }) => {
          const child = row.original;
          const fullName = `${child.firstName} ${child.lastName}`;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={child.photo ?? undefined} />
                <AvatarFallback>{child.firstName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{fullName}</p>
                <p className="text-xs text-muted-foreground">{child.parent?.name ?? "No parent linked"}</p>
              </div>
            </div>
          );
        },
      },
      {
        header: "Age",
        cell: ({ row }) => `${childAge(row.original.dateOfBirth)} yrs`,
      },
      {
        header: "Class",
        accessorKey: "program",
      },
      {
        header: "Enrolled",
        cell: ({ row }) => new Date(row.original.enrollmentDate).toLocaleDateString("en-NG"),
      },
      {
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="sm" aria-label="View child">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="More actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="Delete child" onClick={() => setDeleteId(row.original.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
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
        title="Manage Children"
        description="View and manage enrolled children"
        action={
          <Button className="bg-accent text-white hover:bg-accent-400">
            <Plus className="mr-2 h-4 w-4" />
            Add Child
          </Button>
        }
      />

      <DataTable columns={columns} data={children} isLoading={isLoading} exportable emptyTitle="No children found" />

      <ConfirmModal
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Mark child inactive?"
        description="This soft deletes the child by setting their enrollment status to inactive."
        confirmLabel="Mark inactive"
        isLoading={deleteChild.isPending}
        onConfirm={() => {
          if (deleteId) deleteChild.mutate(deleteId);
        }}
      />
    </div>
  );
}
