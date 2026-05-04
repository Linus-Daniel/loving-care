import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, breadcrumb, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumb ? <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{breadcrumb}</p> : null}
        <h1 className="text-xl font-display font-bold text-green lg:text-2xl">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
