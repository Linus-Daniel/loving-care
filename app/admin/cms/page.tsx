"use client";

import { BookOpenText, CalendarDays, HelpCircle, ImageIcon, LayoutTemplate } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const documents = [
  { name: "Home", type: "homepageContent", description: "Hero, why-us items, testimonials, and CTA copy", icon: LayoutTemplate },
  { name: "Programs", type: "program", description: "Program names, ages, schedules, features, and images", icon: BookOpenText },
  { name: "FAQ", type: "faqItem", description: "Questions grouped by category", icon: HelpCircle },
  { name: "Gallery", type: "galleryImage", description: "Captioned school images and categories", icon: ImageIcon },
  { name: "Events", type: "event", description: "Public CMS event content and cover images", icon: CalendarDays },
];

export default function CmsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="CMS Content"
        description="Manage public website content directly inside the app."
        action={
          <Button asChild>
            <Link href="/admin/studio">Open Studio</Link>
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((document) => {
          const Icon = document.icon;
          return (
            <Card key={document.type} className="shadow-card">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold text-green-500">{document.name}</p>
                    <p className="font-mono text-xs text-teal">{document.type}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{document.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
