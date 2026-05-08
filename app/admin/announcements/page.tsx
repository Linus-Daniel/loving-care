"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Megaphone, Plus, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAnnouncements, useCreateAnnouncement, type AnnouncementRecord } from "@/hooks/useAnnouncements";

function statusFor(announcement: AnnouncementRecord) {
  if (announcement.isDraft) return "DRAFT";
  if (announcement.scheduledAt && !announcement.sentAt) return "SCHEDULED";
  return "SENT";
}

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-NG", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function AnnouncementsPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetRole, setTargetRole] = useState<AnnouncementRecord["targetRole"]>("PARENT");
  const [targetClass, setTargetClass] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const { data: announcements = [], isLoading } = useAnnouncements({ role: "PARENT" });
  const createAnnouncement = useCreateAnnouncement();

  const columns = useMemo<ColumnDef<AnnouncementRecord, unknown>[]>(
    () => [
      { header: "Title", accessorKey: "title" },
      {
        header: "Target",
        cell: ({ row }) => row.original.targetClass ?? row.original.targetRole,
      },
      {
        header: "Status",
        cell: ({ row }) => <StatusBadge status={statusFor(row.original)} />,
      },
      {
        header: "Scheduled",
        cell: ({ row }) => formatDate(row.original.scheduledAt),
      },
      {
        header: "Created",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
    ],
    [],
  );

  const handleCreate = () => {
    if (!title || !body) {
      toast.error("Title and body are required");
      return;
    }

    createAnnouncement.mutate(
      {
        title,
        body,
        targetRole,
        targetClass: targetClass || undefined,
        isDraft,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      },
      {
        onSuccess: () => {
          toast.success(isDraft ? "Announcement saved as draft" : "Announcement queued");
          setOpen(false);
          setTitle("");
          setBody("");
          setTargetClass("");
          setScheduledAt("");
          setIsDraft(false);
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Publish, schedule, and target in-app announcements for parents and staff."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Target role</Label>
                    <Select value={targetRole} onValueChange={(value) => setTargetRole(value as AnnouncementRecord["targetRole"])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PARENT">Parents</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                        <SelectItem value="ADMIN">Admins</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Class target</Label>
                    <Input value={targetClass} onChange={(event) => setTargetClass(event.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea rows={5} value={body} onChange={(event) => setBody(event.target.value)} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Schedule</Label>
                    <Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">Save as draft</p>
                      <p className="text-xs text-muted-foreground">Drafts are hidden from recipients.</p>
                    </div>
                    <Switch checked={isDraft} onCheckedChange={setIsDraft} />
                  </div>
                </div>
                <Button className="w-full" onClick={handleCreate} disabled={createAnnouncement.isPending}>
                  <Send className="mr-2 h-4 w-4" />
                  {createAnnouncement.isPending ? "Saving..." : "Publish Announcement"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-2xl border border-primary/10 bg-secondary-50 p-4 text-sm text-primary">
        <Megaphone className="mr-2 inline h-4 w-4" />
        Published announcements also create in-app notifications for the selected role.
      </div>

      <DataTable columns={columns} data={announcements} isLoading={isLoading} exportable emptyTitle="No announcements yet" />
    </div>
  );
}
