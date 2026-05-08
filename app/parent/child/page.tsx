"use client";

import { Download, FileText, Loader2, Pencil, Pill, Stethoscope, User } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChildren } from "@/hooks/useChildren";
import { useResources } from "@/hooks/useResources";

import { RegisterChildDialog } from "@/components/parent/RegisterChildDialog";

function ageFromDob(dateOfBirth: string) {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

export default function ChildProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: children = [], isLoading } = useChildren();
  const { data: documents = [], isLoading: documentsLoading } = useResources({ category: "Forms" });
  const child = children[0];

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-display font-bold text-green-500 lg:text-2xl">Child Profile</h1>
          <p className="text-sm text-muted-foreground">Enroll your child to view their profile, attendance, and records.</p>
        </div>
        <EmptyState
          title="No child profile found"
          description="You haven't enrolled any children yet. Click the button below to start the enrollment process."
          action={<RegisterChildDialog />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-green-500 lg:text-2xl">Child Profile</h1>
        <p className="text-sm text-muted-foreground">View your child's personal, guardian, medical, and document records.</p>
      </div>

      <Card className="overflow-hidden shadow-soft">
        <div className="bg-green-500 p-6 lg:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-20 w-20 border-4 border-secondary">
              <AvatarImage src={child.photo ?? undefined} />
              <AvatarFallback className="text-2xl">{child.firstName.charAt(0)}{child.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-display font-bold text-white">{child.firstName} {child.lastName}</h2>
              <p className="text-sm text-white/70">
                Age {ageFromDob(child.dateOfBirth)} • {child.program} • Enrolled {new Date(child.enrollmentDate).toLocaleDateString("en-NG")}
              </p>
              <StatusBadge status={child.status} className="mt-2 bg-secondary text-green-500" />
            </div>
            <Button variant="outline" className="border-white/30 text-white hover:secondary-50/10 sm:ml-auto">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-display font-semibold text-green-500">
                  <User className="h-4 w-4 text-teal" />
                  Basic Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Full Name</span><span className="font-medium">{child.firstName} {child.lastName}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Date of Birth</span><span className="font-medium">{new Date(child.dateOfBirth).toLocaleDateString("en-NG")}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Gender</span><span className="font-medium">{child.gender}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Program</span><span className="font-medium">{child.program}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Enrollment Date</span><span className="font-medium">{new Date(child.enrollmentDate).toLocaleDateString("en-NG")}</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-green-500">Guardian Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Primary Guardian</span><span className="font-medium">{child.parent?.name ?? "Not linked"}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Phone</span><span className="font-medium">{child.parent?.phone ?? "Not provided"}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Email</span><span className="font-medium">{child.parent?.email ?? "Not provided"}</span></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-display"><Stethoscope className="h-4 w-4 text-teal" /> Medical Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{child.medicalInfo?.conditions ?? "No known medical conditions."}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-display"><Pill className="h-4 w-4 text-warning" /> Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{child.medicalInfo?.medications ?? "No regular medications."}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-display"><FileText className="h-4 w-4 text-green-500" /> Allergies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{child.medicalInfo?.allergies ?? "No allergies recorded."}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-display"><User className="h-4 w-4 text-success" /> Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{child.medicalInfo?.doctorName ?? "Not provided"}</p>
                  <p className="text-xs text-muted-foreground">{child.medicalInfo?.doctorPhone ?? "No doctor phone recorded"}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            {documentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-lg bg-muted" />)}
              </div>
            ) : documents.length ? (
              <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                      <FileText className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.fileType} • {new Date(doc.createdAt).toLocaleDateString("en-NG")}</p>
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
      </Card>
    </div>
  );
}
