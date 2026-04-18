"use client";

import Link from "next/link";

export type TabDef = { key: string; label: string; href: string };

export function RecordingTabs({
  tabs,
  active,
}: {
  tabs: TabDef[];
  active: string;
}) {
  return (
    <nav className="flex items-center gap-1 border-b border-neutral-100">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`relative px-4 py-3 text-sm font-medium transition ${
            t.key === active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          {t.label}
          {t.key === active && (
            <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-neutral-900" />
          )}
        </Link>
      ))}
    </nav>
  );
}
