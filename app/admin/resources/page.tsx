"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Download, FileText, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCreateResource, useDeleteResource, useResources, type ResourceRecord } from "@/hooks/useResources";
import { UploadDropzone, uploadedFileUrl, type UploadedClientFile } from "@/lib/uploadthing";

export default function AdminResources() {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", fileUrl: "", fileType: "pdf", category: "Forms", visibility: "parents" });
  const { data: resources = [], isLoading } = useResources();
  const createResource = useCreateResource();
  const deleteResource = useDeleteResource();

  function submit() {
    createResource.mutate(form, {
      onSuccess: () => {
        toast.success("Resource created");
        setOpen(false);
        setForm({ name: "", fileUrl: "", fileType: "pdf", category: "Forms", visibility: "parents" });
      },
      onError: (error) => toast.error(error.message),
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    deleteResource.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Resource deleted");
        setDeleteId(null);
      },
      onError: (error) => toast.error(error.message),
    });
  }

  const columns = useMemo<ColumnDef<ResourceRecord, unknown>[]>(
    () => [
      {
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-green" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      { header: "Category", accessorKey: "category" },
      { header: "Type", cell: ({ row }) => row.original.fileType.toUpperCase() },
      { header: "Visibility", accessorKey: "visibility" },
      { header: "Date", cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-NG") },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="sm" asChild>
              <a href={row.original.fileUrl} target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(row.original.id)}>
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
        title="Resource Management"
        description="Upload and manage downloadable resources"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow font-semibold text-green hover:bg-yellow-400">
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Resource</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <UploadDropzone
                  endpoint="documentUploader"
                  onClientUploadComplete={(files) => {
                    const file = files[0] as UploadedClientFile | undefined;
                    if (!file) return;
                    const url = uploadedFileUrl(file);
                    setForm((current) => ({
                      ...current,
                      name: current.name || file.serverData?.name || file.name,
                      fileUrl: url,
                      fileType: (file.serverData?.name || file.name).split(".").pop()?.toLowerCase() || current.fileType,
                    }));
                    toast.success("File uploaded");
                  }}
                  onUploadError={(error) => {
                    toast.error(error.message);
                  }}
                  appearance={{
                    container: "border-border bg-muted/40",
                    button: "bg-green text-white hover:bg-green/90",
                    label: "text-green",
                  }}
                />
                <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
                <div className="space-y-2"><Label>File URL</Label><Input value={form.fileUrl} onChange={(event) => setForm({ ...form, fileUrl: event.target.value })} /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2"><Label>Type</Label><Input value={form.fileType} onChange={(event) => setForm({ ...form, fileType: event.target.value })} /></div>
                  <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></div>
                  <div className="space-y-2"><Label>Visibility</Label><Input value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value })} /></div>
                </div>
                <Button className="w-full bg-green text-white" disabled={createResource.isPending || !form.name || !form.fileUrl} onClick={submit}>
                  {createResource.isPending ? "Saving..." : "Save Resource"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={columns} data={resources} isLoading={isLoading} exportable emptyTitle="No resources found" />

      <ConfirmModal
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete resource?"
        description="This removes the resource record. The uploaded file may still exist in storage."
        confirmLabel="Delete"
        isLoading={deleteResource.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
