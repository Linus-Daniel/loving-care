"use client";

import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { User, Lock, Bell, Shield, Camera, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useCurrentUser, useUpdateCurrentUser } from '@/hooks/useCurrentUser';
import { LoadingTable } from '@/components/shared/LoadingTable';
import { UploadButton, uploadedFileUrl, type UploadedClientFile } from '@/lib/uploadthing';

export default function Settings() {
  const { user } = useUser();
  const { data: currentUser, isLoading } = useCurrentUser();
  const updateProfile = useUpdateCurrentUser();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notifications, setNotifications] = useState({
    emailPayments: true,
    inAppPayments: true,
    emailEvents: true,
    inAppEvents: true,
    emailMessages: true,
    inAppMessages: true,
  });

  const displayName = currentUser?.name ?? user?.fullName ?? '';
  const email = currentUser?.email ?? user?.primaryEmailAddress?.emailAddress ?? '';
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
      phone: currentUser?.phone ?? user?.primaryPhoneNumber?.phoneNumber ?? '',
    });
    setAvatarUrl(currentUser?.avatar ?? user?.imageUrl ?? '');
  }, [currentUser?.avatar, currentUser?.phone, displayName, email, user?.imageUrl, user?.primaryPhoneNumber?.phoneNumber]);

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        name: profile.name,
        phone: profile.phone || null,
        avatar: avatarUrl || currentUser?.avatar || null,
      });
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update profile');
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-display font-bold text-green-500">Account Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, security, and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="profile"><User className="w-3 h-3 mr-1" /> Profile</TabsTrigger>
          <TabsTrigger value="security"><Lock className="w-3 h-3 mr-1" /> Security</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-3 h-3 mr-1" /> Notifications</TabsTrigger>
          <TabsTrigger value="privacy"><Shield className="w-3 h-3 mr-1" /> Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-soft">
            <CardHeader className="pb-3"><CardTitle className="text-base font-display text-green-500">Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <LoadingTable columns={3} rows={3} />
              ) : (
                <>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16"><AvatarImage src={avatar} /><AvatarFallback>{initials}</AvatarFallback></Avatar>
                  <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center"><Camera className="w-3 h-3" /></button>
                </div>
                <div>
                  <p className="font-medium">Profile Photo</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 2MB</p>
                  <div className="mt-2">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(files) => {
                        const file = files[0] as UploadedClientFile | undefined;
                        if (!file) return;
                        setAvatarUrl(uploadedFileUrl(file));
                        toast.success('Avatar uploaded');
                      }}
                      onUploadError={(error) => {
                        toast.error(error.message);
                      }}
                      appearance={{
                        button: "bg-green-500 text-white h-8 w-32 text-xs",
                        allowedContent: "text-xs text-muted-foreground",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={profile.email} readOnly className="bg-muted" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
              </div>
              <Button className="bg-green-500 text-white" onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-soft">
            <CardHeader className="pb-3"><CardTitle className="text-base font-display text-green-500">Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Managed securely by Clerk</p></div>
                <Switch checked={user?.totpEnabled ?? false} disabled />
              </div>
              <Button className="bg-green-500 text-white" asChild>
                <a href="/user-profile">Manage Security</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-soft">
            <CardHeader className="pb-3"><CardTitle className="text-base font-display text-green-500">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Payment Reminders', email: 'emailPayments', inApp: 'inAppPayments' },
                { label: 'Event Updates', email: 'emailEvents', inApp: 'inAppEvents' },
                { label: 'Message Alerts', email: 'emailMessages', inApp: 'inAppMessages' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{item.label}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2"><Switch checked={notifications[item.email as keyof typeof notifications]} onCheckedChange={() => toggleNotif(item.email as keyof typeof notifications)} /><span className="text-xs text-muted-foreground">Email</span></div>
                    <div className="flex items-center gap-2"><Switch checked={notifications[item.inApp as keyof typeof notifications]} onCheckedChange={() => toggleNotif(item.inApp as keyof typeof notifications)} /><span className="text-xs text-muted-foreground">In-app</span></div>
                  </div>
                </div>
              ))}
              <Button className="bg-green-500 text-white" onClick={() => toast.success('Preferences saved')}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="shadow-soft">
            <CardHeader className="pb-3"><CardTitle className="text-base font-display text-green-500">Privacy Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Download Your Data</p>
                <p className="text-xs text-muted-foreground mb-2">Request a copy of all your personal data stored in our system.</p>
                <Button variant="outline" size="sm" onClick={handleExportData} disabled={!currentUser}>
                  <Download className="w-3 h-3 mr-1" />
                  Download JSON
                </Button>
              </div>
              <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <p className="text-sm font-medium text-destructive mb-1">Delete Account</p>
                <p className="text-xs text-muted-foreground mb-2">This action cannot be undone. All your data will be permanently removed.</p>
                <Button variant="destructive" size="sm" onClick={() => toast.error('Account deletion requires admin approval')}>Request Account Deletion</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
