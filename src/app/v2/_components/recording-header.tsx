import { Calendar, Clock, User } from "lucide-react";
import type { ReactNode } from "react";

export function RecordingHeader({
  eyebrow,
  title,
  client,
  date,
  duration,
  actions,
}: {
  eyebrow?: string;
  title: string;
  client?: string;
  date: string;
  duration: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
          {title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-neutral-500">
          {client && (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {client}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {duration}
          </span>
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
