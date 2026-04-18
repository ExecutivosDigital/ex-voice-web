"use client";

import {
  Bell,
  BellOff,
  CheckCircle2,
  CreditCard,
  FileCheck,
  Mic,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "../_components/empty-state";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";
import { mockNotifications } from "../_mocks";

const typeIconMap = {
  transcription: FileCheck,
  recording: Mic,
  plan: CreditCard,
  reminder: Bell,
  system: Sparkles,
};

const typeToneMap: Record<string, string> = {
  transcription: "bg-emerald-100 text-emerald-700",
  recording: "bg-neutral-100 text-neutral-700",
  plan: "bg-amber-100 text-amber-700",
  reminder: "bg-rose-100 text-rose-700",
  system: "bg-blue-100 text-blue-700",
};

const groupLabels = {
  hoje: "Hoje",
  ontem: "Ontem",
  semana: "Esta semana",
};

export default function NotificationsPage() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(mockNotifications);

  const grouped = (["hoje", "ontem", "semana"] as const).map((g) => ({
    key: g,
    label: groupLabels[g],
    items: items.filter((n) => n.group === g),
  }));

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <>
      <Shell breadcrumbs={[{ label: "Notificações" }]} onRecordClick={() => setOpen(true)}>
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                Notificações
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {unreadCount > 0
                  ? `Você tem ${unreadCount} novas notificações`
                  : "Você está em dia com tudo"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setItems(items.map((n) => ({ ...n, unread: false })))}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Marcar todas como lidas
              </button>
              <button
                aria-label="Preferências"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </header>

          {items.length === 0 ? (
            <EmptyState
              icon={BellOff}
              title="Nenhuma notificação"
              description="Quando algo acontecer, você vai ver aqui."
            />
          ) : (
            <div className="space-y-8">
              {grouped.map(
                (g) =>
                  g.items.length > 0 && (
                    <section key={g.key}>
                      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        {g.label}
                      </h2>
                      <ul className="divide-y divide-neutral-100">
                        {g.items.map((n) => {
                          const Icon = typeIconMap[n.type];
                          return (
                            <li key={n.id}>
                              <Link
                                href={n.href ?? "#"}
                                className={`group -mx-4 flex items-start gap-4 rounded-lg px-4 py-3.5 transition hover:bg-neutral-50 ${
                                  n.unread ? "bg-neutral-50/50" : ""
                                }`}
                              >
                                <div
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeToneMap[n.type]}`}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-neutral-900">
                                      {n.title}
                                    </span>
                                    {n.unread && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                    )}
                                  </div>
                                  <p className="mt-0.5 text-sm text-neutral-600">
                                    {n.description}
                                  </p>
                                  <div className="mt-1 text-[11px] text-neutral-400">
                                    {n.time}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ),
              )}
            </div>
          )}
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
