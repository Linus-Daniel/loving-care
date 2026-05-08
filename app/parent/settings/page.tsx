"use client";

import { useUser } from "@clerk/nextjs";
import { Bell, Camera, Download, Lock, Shield, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { LoadingTable } from "@/components/shared/LoadingTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser, useUpdateCurrentUser } from "@/hooks/useCurrentUser";
import { UploadButton, uploadedFileUrl, type UploadedClientFile } from "@/lib/uploadthing";

export default function Settings() {
  const { user } = useUser();
  const { data: currentUser, isLoading } = useCurrentUser();
  const updateProfile = useUpdateCurrentUser();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [notifications, setNotifications] = useState({
    emailPayments: true,
    inAppPayments: true,
    emailEvents: true,
    inAppEvents: true,
    emailMessages: true,
    inAppMessages: true,
  });

  const displayName = currentUser?.name ?? user?.fullName ?? "";
  const email = currentUser?.email ?? user?.primaryEmailAddress?.emailAddress ?? "";
  const avatar = avatarUrl || currentUser?.avatar || user?.imageUrl;
  const initials = useMemo(
    () =>
      (displayName || email || "Parent")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [displayName, email],
  );

  useEffect(() => {
    setProfile({
      name: displayName,
      email,
      phone: currentUser?.phone ?? user?.primaryPhoneNumber?.phoneNumber ?? "",
    });
    setAvatarUrl(currentUser?.avatar ?? user?.imageUrl ?? "");
  }, [currentUser?.avatar, currentUser?.phone, displayName, email, user?.imageUrl, user?.primaryPhoneNumber?.phoneNumber]);

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        name: profile.name,
        phone: profile.phone || null,
        avatar: avatarUrl || currentUser?.avatar || null,
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update profile");
    }
  };

  const handleExportData = () => {
    const payload = JSON.stringify(currentUser ?? {}, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "loving-family-data-export.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
              <User className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">Account Settings</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Manage your profile, notification preferences, privacy export, and account security.
            </p>
          </div>
          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Signed in as</p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="h-14 w-14 border-4 border-white shadow-soft">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-secondary-100 font-bold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-display text-xl font-bold text-primary">{displayName || "Parent"}</p>
                <p className="truncate text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="h-auto flex-wrap rounded-2xl bg-secondary-50 p-1">
          <TabsTrigger value="profile" className="rounded-xl">
            <User className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl">
            <Lock className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl">
            <Bell className="h-3.5 w-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-xl">
            <Shield className="h-3.5 w-3.5" /> Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-primary/10 bg-white shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl text-primary">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <LoadingTable columns={3} rows={3} />
              ) : (
                <>
                  <div className="flex flex-col gap-4 rounded-3xl bg-[#FFF9F0] p-4 sm:flex-row sm:items-center">
                    <div className="relative">
                      <Avatar className="h-20 w-20 border-4 border-white shadow-soft">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="bg-secondary-100 font-bold text-primary">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white">
                        <Camera className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-primary">Profile Photo</p>
                      <p className="text-sm text-muted-foreground">JPG or PNG image for your parent portal account.</p>
                      <div className="mt-3">
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(files) => {
                            const file = files[0] as UploadedClientFile | undefined;
                            if (!file) return;
                            setAvatarUrl(uploadedFileUrl(file));
                            toast.success("Avatar uploaded");
                          }}
                          onUploadError={(error) => {
                            toast.error(error.message);
                          }}
                          appearance={{
                            button: "bg-accent text-white h-9 w-36 text-xs",
                            allowedContent: "text-xs text-muted-foreground",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={profile.email} readOnly className="bg-secondary-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
                    </div>
                  </div>
                  <Button className="bg-accent text-white hover:bg-accent-400" onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-primary/10 bg-white shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl text-primary">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-3xl bg-[#FFF9F0] p-4">
                <div>
                  <p className="font-bold text-primary">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Managed securely by Clerk.</p>
                </div>
                <Switch checked={user?.totpEnabled ?? false} disabled />
              </div>
              <Button className="bg-accent text-white hover:bg-accent-400" asChild>
                <a href="/user-profile">Manage Security</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-primary/10 bg-white shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl text-primary">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Payment Reminders", email: "emailPayments", inApp: "inAppPayments" },
                { label: "Event Updates", email: "emailEvents", inApp: "inAppEvents" },
                { label: "Message Alerts", email: "emailMessages", inApp: "inAppMessages" },
              ].map((item) => (
                <div key={item.label} className="grid gap-4 rounded-3xl bg-[#FFF9F0] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <p className="font-bold text-primary">{item.label}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={notifications[item.email as keyof typeof notifications]} onCheckedChange={() => toggleNotif(item.email as keyof typeof notifications)} />
                      <span className="text-sm text-muted-foreground">Email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={notifications[item.inApp as keyof typeof notifications]} onCheckedChange={() => toggleNotif(item.inApp as keyof typeof notifications)} />
                      <span className="text-sm text-muted-foreground">In-app</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button className="bg-accent text-white hover:bg-accent-400" onClick={() => toast.success("Preferences saved")}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="border-primary/10 bg-white shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl text-primary">Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-[#FFF9F0] p-4">
                <p className="mb-1 font-bold text-primary">Download Your Data</p>
                <p className="mb-3 text-sm text-muted-foreground">Export a copy of your current profile data.</p>
                <Button variant="outline" size="sm" className="bg-white" onClick={handleExportData} disabled={!currentUser}>
                  <Download className="h-3.5 w-3.5" />
                  Download JSON
                </Button>
              </div>
              <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-4">
                <p className="mb-1 font-bold text-destructive">Delete Account</p>
                <p className="mb-3 text-sm text-muted-foreground">Account deletion requires school admin approval.</p>
                <Button variant="destructive" size="sm" onClick={() => toast.error("Account deletion requires admin approval")}>
                  Request Account Deletion
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
