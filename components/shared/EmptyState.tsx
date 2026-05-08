import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border secondary-50 p-8 text-center">
      <svg width="96" height="72" viewBox="0 0 96 72" fill="none" aria-hidden="true" className="mb-4">
        <rect x="18" y="14" width="60" height="44" rx="8" fill="#E6F4F2" />
        <path d="M30 28h36M30 38h24M30 48h30" stroke="#2A9D8F" strokeWidth="4" strokeLinecap="round" />
        <circle cx="74" cy="18" r="10" fill="#F5C518" />
      </svg>
      <h3 className="font-display text-lg font-bold text-green-500">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function EmptyActionButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} />;
}
