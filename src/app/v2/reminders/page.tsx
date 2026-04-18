"use client";

import { Bell, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "../_components/empty-state";
import { ListPage } from "../_components/list-page";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";
import { StatusChip } from "../_components/status-chip";
import { mockReminders } from "../_mocks";

const priorityStyles = {
  alta: "bg-rose-50 text-rose-700",
  "média": "bg-amber-50 text-amber-700",
  baixa: "bg-neutral-100 text-neutral-600",
};

export default function RemindersPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Shell breadcrumbs={[{ label: "Lembretes" }]} onRecordClick={() => setOpen(true)}>
        <ListPage
          title="Lembretes"
          subtitle={`${mockReminders.length} lembretes ativos`}
          searchPlaceholder="Buscar lembrete..."
          action={
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              Novo lembrete
            </button>
          }
        >
          {mockReminders.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Nenhum lembrete"
              description="Grave um áudio rápido pra não esquecer de nada importante."
            />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {mockReminders.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/v2/reminders/${r.id}`}
                    className="group -mx-4 flex items-center gap-4 rounded-lg px-4 py-4 transition hover:bg-neutral-50"
                  >
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priorityStyles[r.priority]}`}
                    >
                      {r.priority}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-neutral-900">{r.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                        <span>{r.due}</span>
                        <span className="text-neutral-300">·</span>
                        <span>{r.duration}</span>
                      </div>
                    </div>
                    <StatusChip status={r.status} />
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
