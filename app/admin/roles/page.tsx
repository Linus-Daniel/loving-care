"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParents, useUpdateParent, type ParentRecord } from "@/hooks/useParents";

const roleCards = [
  { name: "SUPER_ADMIN", label: "Super Admin", description: "Full access to system settings, roles, billing, and all records." },
  { name: "ADMIN", label: "Admin", description: "Manage school operations, people, attendance, finance, and content." },
  { name: "STAFF", label: "Staff", description: "Operational access for attendance, messages, resources, and support workflows." },
  { name: "PARENT", label: "Parent", description: "Parent portal access for child profile, attendance, payments, events, and support." },
] as const;

export default function RolesPage() {
  const { data: users = [], isLoading } = useParents({ pageSize: 100, allRoles: true });
  const updateParent = useUpdateParent();

  const counts = useMemo(
    () =>
      roleCards.map((role) => ({
        ...role,
        users: users.filter((user) => user.role === role.name).length,
      })),
    [users],
  );

  const columns = useMemo<ColumnDef<ParentRecord, unknown>[]>(
    () => [
      {
        header: "User",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      },
      {
        header: "Current Role",
        cell: ({ row }) => <StatusBadge status={row.original.role} />,
      },
      {
        header: "Children",
        cell: ({ row }) => row.original.children?.length ?? 0,
      },
      {
        header: "Change Role",
        cell: ({ row }) => (
          <Select
            value={row.original.role}
            onValueChange={(role) => {
              updateParent.mutate(
                { id: row.original.id, body: { role: role as ParentRecord["role"] } },
                {
                  onSuccess: () => toast.success("Role updated in DB and Clerk"),
                  onError: (error) => toast.error(error.message),
                },
              );
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PARENT">Parent</SelectItem>
              <SelectItem value="STAFF">Staff</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
    ],
    [updateParent],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" description="Manage real user roles. Updates sync to Prisma and Clerk public metadata." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {counts.map((role) => (
          <Card key={role.name} className="shadow-soft">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{role.label}</p>
                  <p className="text-xs text-muted-foreground">{role.users} users</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable columns={columns} data={users} isLoading={isLoading} searchable exportable emptyTitle="No users found" />
    </div>
  );
}
