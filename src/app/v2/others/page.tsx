"use client";

import { ChevronRight, Folder, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "../_components/empty-state";
import { ListPage } from "../_components/list-page";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";
import { StatusChip } from "../_components/status-chip";
import { mockOthers } from "../_mocks";

export default function OthersPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Shell breadcrumbs={[{ label: "Outros" }]} onRecordClick={() => setOpen(true)}>
        <ListPage
          title="Outros"
          subtitle="Gravações que não se encaixam nas outras categorias"
          searchPlaceholder="Buscar..."
          action={
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              Nova gravação
            </button>
          }
        >
          {mockOthers.length === 0 ? (
            <EmptyState
              icon={Folder}
              title="Nenhum item por aqui"
              description="Qualquer gravação solta vai aparecer nesta seção."
            />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {mockOthers.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/v2/others/${o.id}`}
                    className="group -mx-4 flex items-center gap-4 rounded-lg px-4 py-4 transition hover:bg-neutral-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                      <Folder className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-neutral-900">
                        {o.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                        <span>{o.date}</span>
                        <span className="text-neutral-300">·</span>
                        <span>{o.duration}</span>
                      </div>
                    </div>
                    <StatusChip status={o.status} />
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
