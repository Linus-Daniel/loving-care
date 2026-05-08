import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KPICardProps = {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: string;
};

export function KPICard({ title, value, trend, trendDirection = "neutral", icon: Icon, color = "text-primary" }: KPICardProps) {
  return (
    <Card className="border-primary/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
      <CardContent className="p-4 lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 transition-colors", color)}>
            <Icon className="h-6 w-6" />
          </div>
          {trend ? (
            <div
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                trendDirection === "up" && "border-surface bg-surface/35 text-primary",
                trendDirection === "down" && "border-accent/30 bg-accent-50 text-accent-700",
                trendDirection === "neutral" && "border-primary/10 bg-secondary-50 text-muted-foreground",
              )}
            >
              {trend}
            </div>
          ) : null}
        </div>
        <p className="font-display text-2xl font-bold tracking-tight text-primary lg:text-3xl">{value}</p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}
