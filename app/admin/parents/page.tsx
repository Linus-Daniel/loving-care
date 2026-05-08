"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus } from "lucide-react";
import { useMemo } from "react";

import { DataTable } from "@/components/admin/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useParents, type ParentRecord } from "@/hooks/useParents";

export default function ManageParents() {
  const { data: parents = [], isLoading } = useParents();

  const columns = useMemo<ColumnDef<ParentRecord, unknown>[]>(
    () => [
      {
        header: "Parent",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.avatar ?? undefined} />
              <AvatarFallback>{row.original.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      { header: "Phone", accessorKey: "phone" },
      {
        header: "Children",
        cell: ({ row }) =>
          row.original.children.length > 0
            ? row.original.children.map((child) => `${child.firstName} ${child.lastName}`).join(", ")
            : "None linked",
      },
      {
        header: "Status",
        cell: ({ row }) => {
          const hasActiveChild = row.original.children.some((child) => child.status === "ACTIVE");
          return <StatusBadge status={hasActiveChild ? "ACTIVE" : "PENDING"} />;
        },
      },
      {
        header: "Actions",
        cell: () => (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" aria-label="View parent">
              <Eye className="h-4 w-4" />
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
        title="Manage Parents"
        description="View and manage parent accounts"
        action={
          <Button className="bg-accent text-white hover:bg-accent-400">
            <Plus className="mr-2 h-4 w-4" />
            Add Parent
          </Button>
        }
      />

      <DataTable columns={columns} data={parents} isLoading={isLoading} exportable emptyTitle="No parents found" />
    </div>
  );
}
