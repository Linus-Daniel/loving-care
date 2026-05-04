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

export function KPICard({ title, value, trend, trendDirection = "neutral", icon: Icon, color = "text-green" }: KPICardProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted", color)}>
            <Icon className="h-5 w-5" />
          </div>
          {trend ? (
            <span
              className={cn(
                "text-xs font-semibold",
                trendDirection === "up" && "text-success",
                trendDirection === "down" && "text-destructive",
                trendDirection === "neutral" && "text-muted-foreground",
              )}
            >
              {trend}
            </span>
          ) : null}
        </div>
        <p className="font-display text-2xl font-bold text-green">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}
