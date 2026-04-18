import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
          <Icon className="h-5 w-5 text-neutral-500" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
