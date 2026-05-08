import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-primary/15 bg-white p-8 text-center shadow-soft">
      <svg width="96" height="72" viewBox="0 0 96 72" fill="none" aria-hidden="true" className="mb-4">
        <rect x="18" y="14" width="60" height="44" rx="12" fill="#B9D6DC" fillOpacity="0.45" />
        <path d="M30 28h36M30 38h24M30 48h30" stroke="#21445E" strokeWidth="4" strokeLinecap="round" />
        <circle cx="74" cy="18" r="10" fill="#EA987B" />
      </svg>
      <h3 className="font-display text-lg font-bold text-primary">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function EmptyActionButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} />;
}
