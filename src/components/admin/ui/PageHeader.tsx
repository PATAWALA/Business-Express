// src/components/admin/ui/PageHeader.tsx
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}