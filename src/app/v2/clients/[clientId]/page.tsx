"use client";

import {
  Calendar,
  ChevronLeft,
  MessageCircle,
  Phone,
  Play,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "../../_components/empty-state";
import { RecorderModal } from "../../_components/recorder-modal";
import { Shell } from "../../_components/shell";
import { StatusChip } from "../../_components/status-chip";
import { allClients, clientHistory } from "../../_mocks";

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = (params?.clientId as string) ?? "c1";
  const client = allClients.find((c) => c.id === clientId) ?? allClients[0];
  const [open, setOpen] = useState(false);

  return (
    <>
      <Shell
        breadcrumbs={[
          { label: "Contatos", href: "/v2/clients" },
          { label: client.name },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-4xl space-y-10">
          <Link
            href="/v2/clients"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Todos os contatos
          </Link>

          {/* Client header */}
          <header className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-xl font-semibold text-neutral-700">
                {client.initials}
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  {client.name}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
                  <span>
                    <strong className="font-semibold text-neutral-700">
                      {client.sessions}
                    </strong>{" "}
                    gravações
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span>Última sessão {client.lastSession}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50">
                <MessageCircle className="h-3.5 w-3.5" />
                Mensagem
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50">
                <Phone className="h-3.5 w-3.5" />
                Ligar
              </button>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova gravação
              </button>
            </div>
          </header>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoCard label="Primeira sessão" value="22 mar 2026" />
            <InfoCard label="Tempo total gravado" value="3h 48m" />
            <InfoCard label="Próxima consulta" value="Hoje, 17:00" highlight />
          </div>

          {/* History */}
          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Histórico de gravações
              </h2>
              <span className="text-xs text-neutral-500">
                {clientHistory.length} gravações
              </span>
            </div>

            {clientHistory.length === 0 ? (
              <EmptyState
                title="Nenhuma gravação ainda"
                description="Grave a primeira sessão com este contato."
              />
            ) : (
              <ul className="divide-y divide-neutral-100">
                {clientHistory.map((h) => (
                  <li key={h.id}>
                    <Link
                      href={`/v2/clients/${clientId}/${h.id}`}
                      className="group -mx-4 flex items-center gap-4 rounded-lg px-4 py-3.5 transition hover:bg-neutral-50"
                    >
                      <button
                        onClick={(e) => e.preventDefault()}
                        aria-label="Reproduzir"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition group-hover:bg-gradient-to-br group-hover:from-neutral-500 group-hover:to-neutral-900 group-hover:text-white"
                      >
                        <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-neutral-900">
                            {h.title}
                          </span>
                          {h.current && (
                            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                              Atual
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                          <Calendar className="h-3 w-3" />
                          <span>{h.date}</span>
                          <span className="text-neutral-300">·</span>
                          <span>{h.duration}</span>
                        </div>
                      </div>
                      <StatusChip status={h.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function InfoCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${
        highlight
          ? "bg-gradient-to-br from-neutral-50 to-neutral-100/50 ring-1 ring-neutral-200/70"
          : "bg-neutral-50"
      }`}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-neutral-900">{value}</div>
    </div>
  );
}
