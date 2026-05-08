import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, breadcrumb, action }: PageHeaderProps) {
  return (
    <div className="rounded-[2rem] border border-primary/10 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumb ? <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{breadcrumb}</p> : null}
        <h1 className="font-display text-2xl font-bold text-primary lg:text-3xl">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
