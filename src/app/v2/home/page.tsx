"use client";

import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Loader2,
  Mic,
  Play,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  mockProfile,
  mockRecordings,
  nextAppointments,
  pendingReviewCount,
  stats,
} from "../_mocks";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";

export default function HomeV2() {
  const [open, setOpen] = useState(false);
  const next = nextAppointments[0];

  return (
    <>
      <Shell breadcrumbs={[{ label: "Início" }]} onRecordClick={() => setOpen(true)}>
        <div className="mx-auto max-w-4xl space-y-14">
          {/* Greeting */}
          <div>
            <div className="text-sm text-neutral-500">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
              Boa tarde, {mockProfile.firstName}.
            </h1>
            <p className="mt-2 text-neutral-500">
              Você tem {nextAppointments.length} consultas hoje e{" "}
              <span className="font-medium text-neutral-900">
                {pendingReviewCount} resumos
              </span>{" "}
              esperando sua revisão.
            </p>
          </div>

          {/* Hero — Next appointment */}
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Próxima consulta
              </h2>
              <Link
                href="#"
                className="text-xs text-neutral-500 transition hover:text-neutral-900"
              >
                Ver agenda
              </Link>
            </div>
            <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100/50 p-7 md:flex-row md:items-center">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Hoje
                  </span>
                  <span className="text-lg font-bold text-neutral-900">{next.time}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {next.client}
                    </h3>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      {next.in}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-neutral-600">
                    {next.type} · {next.duration}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]"
              >
                <Mic className="h-4 w-4" />
                Iniciar gravação
              </button>
            </div>
          </section>

          {/* Pending review */}
          {pendingReviewCount > 0 && (
            <section>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Aguardando sua revisão
                </h2>
                <Link
                  href="#"
                  className="text-xs text-neutral-500 transition hover:text-neutral-900"
                >
                  Ver todos
                </Link>
              </div>
              <ul className="space-y-1.5">
                {mockRecordings
                  .filter((r) => r.status === "PRONTO")
                  .slice(0, 2)
                  .map((r) => (
                    <li key={r.id}>
                      <Link
                        href="#"
                        className="group flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-neutral-50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 text-xs font-semibold text-neutral-700">
                          {r.clientInitials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-neutral-900">
                            {r.title}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                            <span>{r.date}</span>
                            <span className="text-neutral-300">·</span>
                            <span>{r.duration}</span>
                            <span className="text-neutral-300">·</span>
                            <span className="inline-flex items-center gap-1 text-emerald-700">
                              <Check className="h-3 w-3" strokeWidth={3} />
                              Resumo pronto
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-neutral-500 opacity-0 transition group-hover:opacity-100">
                          Revisar
                        </span>
                        <ChevronRight className="h-4 w-4 text-neutral-300 transition group-hover:text-neutral-600" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {/* Recent recordings */}
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Suas últimas gravações
              </h2>
              <Link
                href="/v2/recordings"
                className="flex items-center gap-1 text-xs text-neutral-500 transition hover:text-neutral-900"
              >
                Ver todas
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="divide-y divide-neutral-100">
              {mockRecordings.slice(0, 4).map((r) => (
                <li key={r.id}>
                  <Link
                    href="#"
                    className="group flex items-center gap-4 py-3.5 transition hover:bg-neutral-50 -mx-4 px-4 rounded-lg"
                  >
                    <button
                      aria-label="Reproduzir"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition group-hover:bg-gradient-to-br group-hover:from-neutral-500 group-hover:to-neutral-900 group-hover:text-white"
                    >
                      <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-neutral-900">
                        {r.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                        <span>{r.date}</span>
                        <span className="text-neutral-300">·</span>
                        <span>{r.duration}</span>
                      </div>
                    </div>
                    <StatusChip status={r.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Footer stats — quiet */}
          <footer className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-neutral-100 pt-8 text-xs text-neutral-500">
            <span>
              <strong className="font-semibold text-neutral-900">
                {stats.thisMonth}
              </strong>{" "}
              gravações este mês
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {stats.hours} totais
            </span>
            <span>
              <strong className="font-semibold text-neutral-900">{stats.contacts}</strong>{" "}
              contatos atendidos
            </span>
            {stats.thisMonthTrend.isPositive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                <span className="text-[10px] font-semibold">
                  ↗ {stats.thisMonthTrend.value}% vs. mês passado
                </span>
              </span>
            )}
          </footer>
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function StatusChip({ status }: { status: string }) {
  if (status === "PRONTO") {
    return (
      <span className="flex items-center gap-1 text-[11px] text-emerald-700">
        <Check className="h-3 w-3" strokeWidth={3} />
        Pronto
      </span>
    );
  }
  if (status === "TRANSCRIBING") {
    return (
      <span className="flex items-center gap-1 text-[11px] text-neutral-500">
        <Loader2 className="h-3 w-3 animate-spin" />
        Transcrevendo
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="flex items-center gap-1 text-[11px] text-amber-700">
        <Clock className="h-3 w-3" />
        Pendente
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[11px] text-neutral-400">
      <Sparkles className="h-3 w-3" />
      Solicitar
    </span>
  );
}
