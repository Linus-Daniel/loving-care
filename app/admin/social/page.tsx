"use client";

import { Facebook, Instagram, Save, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSocialSettings, useUpdateSocialSettings, type SocialSettingsRecord } from "@/hooks/useSocialSettings";

const platforms = [
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "twitter", label: "Twitter", icon: Twitter },
] as const;

const fallback: SocialSettingsRecord = {
  platforms: {
    instagram: { enabled: true, url: "" },
    facebook: { enabled: true, url: "" },
    twitter: { enabled: false, url: "" },
  },
  shareButtons: { programs: true, gallery: true, events: true },
};

export default function SocialPage() {
  const { data, isLoading } = useSocialSettings();
  const updateSettings = useUpdateSocialSettings();
  const [settings, setSettings] = useState<SocialSettingsRecord>(fallback);

  useEffect(() => {
    if (data) setSettings(data);
  }, [data]);

  const save = async () => {
    try {
      await updateSettings.mutateAsync(settings);
      toast.success("Social settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save social settings");
    }
  };

  if (isLoading) return <LoadingTable columns={3} rows={4} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Social Media Settings" description="Connect social profiles and configure public sharing behavior." />
      <div className="grid gap-4 lg:grid-cols-3">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const value = settings.platforms[platform.key];
          return (
            <Card key={platform.key}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green/10">
                      <Icon className="h-5 w-5 text-green" />
                    </div>
                    <p className="font-semibold text-green">{platform.label}</p>
                  </div>
                  <Switch
                    checked={value.enabled}
                    onCheckedChange={(enabled) =>
                      setSettings((current) => ({
                        ...current,
                        platforms: { ...current.platforms, [platform.key]: { ...value, enabled } },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profile URL</Label>
                  <Input
                    value={value.url}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        platforms: { ...current.platforms, [platform.key]: { ...value, url: event.target.value } },
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="rounded-lg bg-muted p-2 text-center text-xs text-muted-foreground">
                      Preview {item}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full" onClick={() => toast.info(`${platform.label} preview requires platform API credentials`)}>
                  Fetch latest 3 posts
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="font-semibold text-green">Share buttons</p>
            <p className="text-sm text-muted-foreground">Choose which public pages show share buttons.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {(["programs", "gallery", "events"] as const).map((key) => (
              <div key={key} className="flex items-center justify-between rounded-lg bg-muted p-3">
                <Label className="capitalize">{key}</Label>
                <Switch
                  checked={settings.shareButtons[key]}
                  onCheckedChange={(enabled) =>
                    setSettings((current) => ({ ...current, shareButtons: { ...current.shareButtons, [key]: enabled } }))
                  }
                />
              </div>
            ))}
          </div>
          <Button onClick={save} disabled={updateSettings.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
