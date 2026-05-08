import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  PENDING: "border-warning/30 text-warning bg-warning/10",
  APPROVED: "border-success/30 text-success bg-success/10",
  REJECTED: "border-destructive/30 text-destructive bg-destructive/10",
  ACTIVE: "border-primary/30 text-primary bg-primary/10",
  INACTIVE: "border-muted-foreground/30 text-muted-foreground bg-muted",
  ABSENT: "border-destructive/30 text-destructive bg-destructive/10",
  PRESENT: "border-success/30 text-success bg-success/10",
  LATE: "border-warning/30 text-warning bg-warning/10",
  EXCUSED: "border-primary/30 text-primary bg-surface/70",
  SUCCEEDED: "border-success/30 text-success bg-success/10",
  FAILED: "border-destructive/30 text-destructive bg-destructive/10",
  REFUNDED: "border-muted-foreground/30 text-muted-foreground bg-muted",
  OPEN: "border-success/30 text-success bg-success/10",
  IN_PROGRESS: "border-warning/30 text-warning bg-warning/10",
  CLOSED: "border-muted-foreground/30 text-muted-foreground bg-muted",
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", statusClasses[normalized] ?? "", className)}>
      {normalized.replaceAll("_", " ")}
    </Badge>
  );
}
