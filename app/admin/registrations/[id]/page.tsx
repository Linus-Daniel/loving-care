"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, apiGet } from "@/lib/client/api";
import type { RegistrationRecord } from "@/hooks/useRegistrations";

export default function RegistrationDetailPage() {
  const params = useParams<{ id: string }>();
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();
  const { data: registration, isLoading } = useQuery({
    queryKey: ["registration", params.id],
    queryFn: () => apiGet<RegistrationRecord>(`/api/registrations/${params.id}`).then((res) => res.data),
  });
  const update = useMutation({
    mutationFn: (status: RegistrationRecord["status"]) =>
      apiFetch<RegistrationRecord>(`/api/registrations/${params.id}`, { method: "PATCH", body: { status, adminNotes: notes } }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["registration", params.id] });
      void queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast.success("Registration updated");
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading registration...</p>;
  if (!registration) return <EmptyState title="Registration not found" description="The requested registration could not be loaded." />;

  const sections = [
    { title: "Child", rows: [["Name", `${registration.childFirstName} ${registration.childLastName}`], ["Date of birth", new Date(registration.dateOfBirth).toLocaleDateString("en-NG")], ["Gender", registration.gender], ["Program", registration.program]] },
    { title: "Parent", rows: [["Name", registration.parentName], ["Email", registration.parentEmail], ["Phone", registration.parentPhone], ["Address", `${registration.streetAddress}, ${registration.city}, ${registration.state}`]] },
    { title: "Emergency", rows: [["Name", registration.emergencyName], ["Phone", registration.emergencyPhone], ["Relationship", registration.emergencyRel]] },
    { title: "Medical", rows: [["Info", registration.medicalInfo ?? "None"], ["Medications", registration.medications ?? "None"], ["Doctor", registration.doctorContact ?? "None"]] },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Registration Detail" description="Review application data, add notes, and update approval status." />
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold text-green">{registration.childFirstName} {registration.childLastName}</p>
            <p className="text-sm text-muted-foreground">Submitted by {registration.parentName} on {new Date(registration.createdAt).toLocaleDateString("en-NG")}</p>
          </div>
          <StatusBadge status={registration.status} />
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {section.rows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Admin Notes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={notes || registration.adminNotes || ""} onChange={(event) => setNotes(event.target.value)} rows={4} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => update.mutate("APPROVED")} disabled={update.isPending}>Approve</Button>
            <Button variant="outline" onClick={() => update.mutate("WAITLISTED")} disabled={update.isPending}>Waitlist</Button>
            <Button variant="destructive" onClick={() => update.mutate("REJECTED")} disabled={update.isPending}>Reject</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
