import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  PENDING: "border-yellow text-yellow-700 bg-yellow-50",
  APPROVED: "border-success text-success bg-success/10",
  REJECTED: "border-destructive text-destructive bg-destructive/10",
  ACTIVE: "border-teal text-teal bg-teal/10",
  INACTIVE: "border-muted-foreground text-muted-foreground bg-muted",
  ABSENT: "border-destructive text-destructive bg-destructive/10",
  PRESENT: "border-success text-success bg-success/10",
  LATE: "border-yellow text-yellow-700 bg-yellow-50",
  EXCUSED: "border-green text-green bg-green/10",
  SUCCEEDED: "border-success text-success bg-success/10",
  FAILED: "border-destructive text-destructive bg-destructive/10",
  REFUNDED: "border-muted-foreground text-muted-foreground bg-muted",
  OPEN: "border-success text-success bg-success/10",
  IN_PROGRESS: "border-yellow text-yellow-700 bg-yellow-50",
  CLOSED: "border-muted-foreground text-muted-foreground bg-muted",
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
