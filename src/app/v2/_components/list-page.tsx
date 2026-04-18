"use client";

import { Search } from "lucide-react";
import type { ReactNode } from "react";

export function ListPage({
  title,
  subtitle,
  filters,
  searchPlaceholder,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  filters?: ReactNode;
  searchPlaceholder?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
        {action}
      </div>

      {/* Filters + Search */}
      {(filters || searchPlaceholder) && (
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
          {searchPlaceholder && (
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
              />
            </div>
          )}
        </div>
      )}

      {/* Items */}
      <div>{children}</div>
    </div>
  );
}

export function FilterChip({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
      }`}
    >
      {label}
      {typeof count === "number" && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] ${
            active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
