"use client";

import { useEffect, useState } from "react";
import { Globe, Image, Mail, Save, Settings, Wrench } from "lucide-react";
import { toast } from "sonner";

import { LoadingTable } from "@/components/shared/LoadingTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteSettings, useUpdateSiteSettings, type SiteSettingsRecord } from "@/hooks/useSiteSettings";
import { UploadButton, uploadedFileUrl, type UploadedClientFile } from "@/lib/uploadthing";

const fallbackSettings: SiteSettingsRecord = {
  name: "",
  tagline: "",
  email: "",
  phone: "",
  address: "",
  timezone: "Africa/Lagos",
  logo: null,
  favicon: null,
  primaryColor: "#0D1F5C",
  accentColor: "#F5C518",
  senderName: "",
  senderEmail: "",
  emailFooter: "",
  stripePublicKey: "",
  posthogKey: "",
  googleAnalyticsId: "",
  sanityProjectId: "",
  sanityDataset: "production",
  clerkPublishableKey: "",
  maintenance: false,
  maintenanceMessage: "",
  registration: true,
};

export default function SiteSettings() {
  const { data, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [settings, setSettings] = useState<SiteSettingsRecord>(fallbackSettings);

  useEffect(() => {
    if (data) setSettings(data);
  }, [data]);

  const setValue = <K extends keyof SiteSettingsRecord>(key: K, value: SiteSettingsRecord[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    try {
      await updateSettings.mutateAsync(settings);
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save settings");
    }
  };

  if (isLoading) {
    return <LoadingTable columns={3} rows={6} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-display font-bold text-green-500">Site Settings</h1>
        <p className="text-sm text-muted-foreground">Persist system-wide configuration for the school platform.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap justify-start bg-muted">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base font-display text-green-500"><Settings className="h-4 w-4" /> General</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>School Name</Label><Input value={settings.name} onChange={(event) => setValue("name", event.target.value)} /></div>
              <div className="space-y-2"><Label>Tagline</Label><Input value={settings.tagline ?? ""} onChange={(event) => setValue("tagline", event.target.value)} /></div>
              <div className="space-y-2"><Label>Contact Email</Label><Input value={settings.email} onChange={(event) => setValue("email", event.target.value)} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={settings.phone} onChange={(event) => setValue("phone", event.target.value)} /></div>
              <div className="space-y-2"><Label>Timezone</Label><Input value={settings.timezone} onChange={(event) => setValue("timezone", event.target.value)} /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={settings.address} onChange={(event) => setValue("address", event.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base font-display text-green-500"><Image className="h-4 w-4" /> Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-green-500">
                  {settings.logo ? <img src={settings.logo} alt="Logo" className="h-full w-full object-cover" /> : <span className="text-xl font-bold text-secondary">L</span>}
                </div>
                <div>
                  <p className="text-sm font-medium">Logo</p>
                  <p className="text-xs text-muted-foreground">UploadThing image upload</p>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(files) => {
                      const file = files[0] as UploadedClientFile | undefined;
                      if (!file) return;
                      setValue("logo", uploadedFileUrl(file));
                      toast.success("Logo uploaded");
                    }}
                    onUploadError={(error) => {
                      toast.error(error.message);
                    }}
                    appearance={{ button: "bg-green-500 text-white h-8 w-32 text-xs", allowedContent: "text-xs text-muted-foreground" }}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Primary Color</Label><Input type="color" value={settings.primaryColor} onChange={(event) => setValue("primaryColor", event.target.value)} /></div>
                <div className="space-y-2"><Label>Accent Color</Label><Input type="color" value={settings.accentColor} onChange={(event) => setValue("accentColor", event.target.value)} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base font-display text-green-500"><Mail className="h-4 w-4" /> Email</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Sender Name</Label><Input value={settings.senderName ?? ""} onChange={(event) => setValue("senderName", event.target.value)} /></div>
              <div className="space-y-2"><Label>Sender Email</Label><Input value={settings.senderEmail ?? ""} onChange={(event) => setValue("senderEmail", event.target.value)} /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Email Footer</Label><Textarea value={settings.emailFooter ?? ""} onChange={(event) => setValue("emailFooter", event.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base font-display text-green-500"><Globe className="h-4 w-4" /> Integrations</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Stripe Public Key</Label><Input value={settings.stripePublicKey ?? ""} onChange={(event) => setValue("stripePublicKey", event.target.value)} /></div>
              <div className="space-y-2"><Label>PostHog Key</Label><Input value={settings.posthogKey ?? ""} onChange={(event) => setValue("posthogKey", event.target.value)} /></div>
              <div className="space-y-2"><Label>Google Analytics ID</Label><Input value={settings.googleAnalyticsId ?? ""} onChange={(event) => setValue("googleAnalyticsId", event.target.value)} /></div>
              <div className="space-y-2"><Label>Clerk Publishable Key</Label><Input value={settings.clerkPublishableKey ?? ""} onChange={(event) => setValue("clerkPublishableKey", event.target.value)} /></div>
              <div className="space-y-2"><Label>Sanity Project ID</Label><Input value={settings.sanityProjectId ?? ""} onChange={(event) => setValue("sanityProjectId", event.target.value)} /></div>
              <div className="space-y-2"><Label>Sanity Dataset</Label><Input value={settings.sanityDataset ?? ""} onChange={(event) => setValue("sanityDataset", event.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base font-display text-green-500"><Wrench className="h-4 w-4" /> Maintenance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div><p className="text-sm font-medium">Maintenance Mode</p><p className="text-xs text-muted-foreground">Show maintenance content to non-admins.</p></div>
                <Switch checked={settings.maintenance} onCheckedChange={(value) => setValue("maintenance", value)} />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div><p className="text-sm font-medium">Allow New Registrations</p><p className="text-xs text-muted-foreground">Accept public enrollment applications.</p></div>
                <Switch checked={settings.registration} onCheckedChange={(value) => setValue("registration", value)} />
              </div>
              <div className="space-y-2"><Label>Maintenance Message</Label><Textarea value={settings.maintenanceMessage ?? ""} onChange={(event) => setValue("maintenanceMessage", event.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button className="bg-secondary font-semibold text-green-500 hover:bg-secondary/90" onClick={save} disabled={updateSettings.isPending}>
        <Save className="mr-2 h-4 w-4" />
        {updateSettings.isPending ? "Saving..." : "Save All Settings"}
      </Button>
    </div>
  );
}
