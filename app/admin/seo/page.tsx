"use client";

import { RefreshCw, Save, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSeoSettings, useUpdateSeoSettings, type SeoPageSetting, type SeoSettingsRecord } from "@/hooks/useSeoSettings";
import { UploadButton, uploadedFileUrl, type UploadedClientFile } from "@/lib/uploadthing";

function score(row: SeoPageSetting) {
  let value = 0;
  if (row.title.length >= 50 && row.title.length <= 60) value += 35;
  if (row.description.length >= 150 && row.description.length <= 160) value += 35;
  if (row.keyword && `${row.title} ${row.description}`.toLowerCase().includes(row.keyword.toLowerCase())) value += 30;
  return value;
}

const fallback: SeoSettingsRecord = {
  pages: [],
  robots: "User-agent: *\nAllow: /\nSitemap: /sitemap.xml",
};

export default function SeoPage() {
  const { data, isLoading } = useSeoSettings();
  const updateSettings = useUpdateSeoSettings();
  const [settings, setSettings] = useState<SeoSettingsRecord>(fallback);
  const rowsWithScores = useMemo(() => settings.pages.map((row) => ({ ...row, score: score(row) })), [settings.pages]);

  useEffect(() => {
    if (data) setSettings(data);
  }, [data]);

  const updateRow = (index: number, patch: Partial<SeoPageSetting>) => {
    setSettings((current) => ({
      ...current,
      pages: current.pages.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)),
    }));
  };

  const save = async () => {
    try {
      await updateSettings.mutateAsync(settings);
      toast.success("SEO settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save SEO settings");
    }
  };

  if (isLoading) return <LoadingTable columns={4} rows={5} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO Settings"
        description="Tune page metadata, OG images, basic SEO scoring, and robots directives."
        action={
          <Button onClick={() => toast.success("Sitemap regeneration requested")}>
            <RefreshCw className="mr-2 h-4 w-4" /> Regenerate Sitemap
          </Button>
        }
      />
      <div className="space-y-4">
        {rowsWithScores.map((row, index) => (
          <Card key={row.path}>
            <CardContent className="grid gap-4 p-4 lg:grid-cols-[150px_1fr_1fr_170px]">
              <div>
                <p className="font-semibold text-green-500">{row.page}</p>
                <p className="text-xs text-muted-foreground">{row.path}</p>
                <StatusBadge status={row.score >= 70 ? "ACTIVE" : row.score >= 40 ? "PENDING" : "REJECTED"} />
                <p className="mt-2 text-xs text-muted-foreground">Score: {row.score}/100</p>
              </div>
              <div className="space-y-2">
                <Label>Meta title</Label>
                <Input value={row.title} onChange={(event) => updateRow(index, { title: event.target.value })} />
                <p className="text-xs text-muted-foreground">{row.title.length} chars, target 50-60</p>
              </div>
              <div className="space-y-2">
                <Label>Meta description</Label>
                <Textarea value={row.description} onChange={(event) => updateRow(index, { description: event.target.value })} />
                <p className="text-xs text-muted-foreground">{row.description.length} chars, target 150-160</p>
              </div>
              <div className="space-y-2">
                <Label>Focus keyword</Label>
                <Input value={row.keyword} onChange={(event) => updateRow(index, { keyword: event.target.value })} />
                <Label>OG Image</Label>
                <div className="flex items-center gap-2">
                  <Input value={row.ogImage ?? ""} onChange={(event) => updateRow(index, { ogImage: event.target.value })} />
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(files) => {
                      const file = files[0] as UploadedClientFile | undefined;
                      if (!file) return;
                      updateRow(index, { ogImage: uploadedFileUrl(file) });
                      toast.success("OG image uploaded");
                    }}
                    onUploadError={(error) => {
                      toast.error(error.message);
                    }}
                    content={{ button: <Upload className="h-4 w-4" />, allowedContent: "" }}
                    appearance={{ button: "bg-green-500 text-white h-9 w-10", allowedContent: "hidden" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="space-y-3 p-4">
          <Label>Robots.txt</Label>
          <Textarea
            rows={6}
            value={settings.robots}
            onChange={(event) => setSettings((current) => ({ ...current, robots: event.target.value }))}
            className="font-mono"
          />
          <Button onClick={save} disabled={updateSettings.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateSettings.isPending ? "Saving..." : "Save SEO Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
