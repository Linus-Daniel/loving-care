"use client";

import { Download, FileText, Loader2, Pill, Stethoscope, UserRound } from "lucide-react";
import { useState } from "react";

import { RegisterChildDialog } from "@/components/parent/RegisterChildDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChildren } from "@/hooks/useChildren";
import { useResources } from "@/hooks/useResources";

function ageFromDob(dateOfBirth: string) {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ChildProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const { data: children = [], isLoading } = useChildren();
  const { data: documents = [], isLoading: documentsLoading } = useResources({ category: "Forms" });
  const child = children.find((item) => item.id === selectedChildId) ?? children[0];

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-card sm:p-8">
          <h1 className="font-display text-3xl font-bold text-primary">Child Profile</h1>
          <p className="mt-2 text-muted-foreground">Enroll your child to view their profile, attendance, and records.</p>
        </section>
        <EmptyState
          title="No child profile found"
          description="You haven't enrolled any children yet. Start the enrollment process to connect a child profile to your account."
          action={<RegisterChildDialog />}
        />
      </div>
    );
  }

  const infoItems = [
    ["Full Name", `${child.firstName} ${child.lastName}`],
    ["Date of Birth", formatDate(child.dateOfBirth)],
    ["Gender", child.gender],
    ["Program", child.program],
    ["Enrollment Date", formatDate(child.enrollmentDate)],
  ];

  const guardianItems = [
    ["Primary Guardian", child.parent?.name ?? "Not linked"],
    ["Phone", child.parent?.phone ?? "Not provided"],
    ["Email", child.parent?.email ?? "Not provided"],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24 border-4 border-secondary-50 shadow-soft">
                <AvatarImage src={child.photo ?? undefined} />
                <AvatarFallback className="bg-secondary-100 text-2xl font-bold text-primary">
                  {child.firstName.charAt(0)}
                  {child.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Child Profile</p>
                <h1 className="mt-2 font-display text-3xl font-bold text-primary sm:text-4xl">
                  {child.firstName} {child.lastName}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Age {ageFromDob(child.dateOfBirth)} • {child.program} • Enrolled {formatDate(child.enrollmentDate)}
                </p>
                <StatusBadge status={child.status} className="mt-3" />
              </div>
            </div>
          </div>

          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Children</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {children.map((item) => {
                const active = item.id === child.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedChildId(item.id)}
                    className={`rounded-2xl px-4 py-2 text-sm font-bold transition-colors ${
                      active ? "bg-accent text-white shadow-soft" : "bg-white text-primary hover:bg-secondary-100"
                    }`}
                  >
                    {item.firstName}
                  </button>
                );
              })}
            </div>
            <div className="mt-5">
              <RegisterChildDialog />
            </div>
          </div>
        </div>
      </section>

      <Card className="border-primary/10 bg-white shadow-card">
        <CardContent className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="h-auto flex-wrap rounded-2xl bg-secondary-50 p-1">
              <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
              <TabsTrigger value="medical" className="rounded-xl">Medical</TabsTrigger>
              <TabsTrigger value="documents" className="rounded-xl">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid gap-5 lg:grid-cols-2">
                <InfoPanel title="Basic Information" icon={UserRound} items={infoItems} />
                <InfoPanel title="Guardian Information" icon={UserRound} items={guardianItems} />
              </div>
            </TabsContent>

            <TabsContent value="medical" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <MedicalCard
                  title="Medical Conditions"
                  icon={Stethoscope}
                  value={child.medicalInfo?.conditions ?? "No known medical conditions."}
                />
                <MedicalCard title="Medications" icon={Pill} value={child.medicalInfo?.medications ?? "No regular medications."} />
                <MedicalCard title="Allergies" icon={FileText} value={child.medicalInfo?.allergies ?? "No allergies recorded."} />
                <Card className="border-primary/10 bg-[#FFF9F0] shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 font-display text-base text-primary">
                      <UserRound className="h-4 w-4 text-accent" />
                      Doctor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-bold text-primary">{child.medicalInfo?.doctorName ?? "Not provided"}</p>
                    <p className="text-sm text-muted-foreground">{child.medicalInfo?.doctorPhone ?? "No doctor phone recorded"}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              {documentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-20 animate-pulse rounded-3xl bg-secondary-50" />
                  ))}
                </div>
              ) : documents.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-3 rounded-3xl border border-primary/10 bg-[#FFF9F0] p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-50">
                          <FileText className="h-5 w-5 text-accent" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-primary">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.fileType} • {new Date(doc.createdAt).toLocaleDateString("en-NG")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" aria-label={`Download ${doc.name}`}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No documents available" description="Forms and child documents shared by the school will appear here." />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoPanel({
  icon: Icon,
  items,
  title,
}: {
  icon: typeof UserRound;
  items: string[][];
  title: string;
}) {
  return (
    <Card className="border-primary/10 bg-[#FFF9F0] shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg text-primary">
          <Icon className="h-5 w-5 text-accent" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-bold text-primary">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function MedicalCard({ icon: Icon, title, value }: { icon: typeof Stethoscope; title: string; value: string }) {
  return (
    <Card className="border-primary/10 bg-[#FFF9F0] shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-base text-primary">
          <Icon className="h-4 w-4 text-accent" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
