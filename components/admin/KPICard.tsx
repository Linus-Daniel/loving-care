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
    <Card className="shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 border-primary/5">
      <CardContent className="p-4 lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20", color)}>
            <Icon className="h-6 w-6" />
          </div>
          {trend ? (
            <div
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                trendDirection === "up" && "bg-success/10 text-success border border-success/20",
                trendDirection === "down" && "bg-destructive/10 text-destructive border border-destructive/20",
                trendDirection === "neutral" && "bg-muted text-muted-foreground border border-border/50",
              )}
            >
              {trend}
            </div>
          ) : null}
        </div>
        <p className="font-display text-2xl lg:text-3xl font-bold text-primary tracking-tight">{value}</p>
        <p className="text-sm font-medium text-muted-foreground/80 mt-1">{title}</p>
      </CardContent>
    </Card>
  );
}
