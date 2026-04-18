"use client";

import { Bell, FileText, Folder, Headphones, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "../_components/empty-state";
import { FilterChip, ListPage } from "../_components/list-page";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";
import { StatusChip } from "../_components/status-chip";
import { mockRecordings } from "../_mocks";

const typeIconMap = {
  Consulta: Headphones,
  Lembrete: Bell,
  Estudo: FileText,
  Outro: Folder,
};

export default function RecordingsPage() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("Todas");

  const filtered =
    filter === "Todas" ? mockRecordings : mockRecordings.filter((r) => r.type === filter);

  const filters = [
    { label: "Todas", count: mockRecordings.length },
    { label: "Consulta", count: mockRecordings.filter((r) => r.type === "Consulta").length },
    { label: "Lembrete", count: mockRecordings.filter((r) => r.type === "Lembrete").length },
    { label: "Estudo", count: mockRecordings.filter((r) => r.type === "Estudo").length },
    { label: "Outro", count: mockRecordings.filter((r) => r.type === "Outro").length },
  ];

  return (
    <>
      <Shell
        breadcrumbs={[{ label: "Gravações" }]}
        onRecordClick={() => setOpen(true)}
      >
        <ListPage
          title="Suas gravações"
          subtitle={`${mockRecordings.length} gravações no total`}
          searchPlaceholder="Buscar por título, contato..."
          filters={filters.map((f) => (
            <FilterChip
              key={f.label}
              label={f.label}
              count={f.count}
              active={filter === f.label}
              onClick={() => setFilter(f.label)}
            />
          ))}
        >
          {filtered.length === 0 ? (
            <EmptyState
              title="Nenhuma gravação neste filtro"
              description="Tente outro tipo ou faça uma nova gravação agora."
            />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {filtered.map((r) => {
                const TypeIcon = typeIconMap[r.type];
                const href = r.clientId
                  ? `/v2/clients/${r.clientId}/${r.id}`
                  : r.type === "Estudo"
                    ? `/v2/studies/${r.id}`
                    : r.type === "Lembrete"
                      ? `/v2/reminders/${r.id}`
                      : `/v2/others/${r.id}`;
                return (
                  <li key={r.id}>
                    <Link
                      href={href}
                      className="group -mx-4 flex items-center gap-4 rounded-lg px-4 py-3.5 transition hover:bg-neutral-50"
                    >
                      <button
                        onClick={(e) => e.preventDefault()}
                        aria-label="Reproduzir"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition group-hover:bg-gradient-to-br group-hover:from-neutral-500 group-hover:to-neutral-900 group-hover:text-white"
                      >
                        <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                            <TypeIcon className="h-2.5 w-2.5" />
                            {r.type}
                          </span>
                          <span className="truncate text-sm font-medium text-neutral-900">
                            {r.title}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                          <span>{r.date}</span>
                          <span className="text-neutral-300">·</span>
                          <span>{r.duration}</span>
                          {r.client && (
                            <>
                              <span className="text-neutral-300">·</span>
                              <span className="truncate">{r.client}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <StatusChip status={r.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </ListPage>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
