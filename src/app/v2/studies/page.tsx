"use client";

import { ChevronRight, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "../_components/empty-state";
import { ListPage } from "../_components/list-page";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";
import { StatusChip } from "../_components/status-chip";
import { mockStudies } from "../_mocks";

export default function StudiesPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Shell breadcrumbs={[{ label: "Estudos" }]} onRecordClick={() => setOpen(true)}>
        <ListPage
          title="Estudos"
          subtitle="Gravações de aulas, leituras e materiais de estudo"
          searchPlaceholder="Buscar estudo..."
          action={
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              Novo estudo
            </button>
          }
        >
          {mockStudies.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nenhum estudo ainda"
              description="Grave o conteúdo da aula ou livro e receba um resumo estruturado."
            />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {mockStudies.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/v2/studies/${s.id}`}
                    className="group -mx-4 flex items-center gap-4 rounded-lg px-4 py-4 transition hover:bg-neutral-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-neutral-900">
                          {s.title}
                        </span>
                        <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-600">
                          {s.topic}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                        <span>{s.date}</span>
                        <span className="text-neutral-300">·</span>
                        <span>{s.duration}</span>
                      </div>
                    </div>
                    <StatusChip status={s.status} />
                    <ChevronRight className="h-4 w-4 text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-600" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ListPage>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
