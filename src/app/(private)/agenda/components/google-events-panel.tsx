"use client";

import { cn } from "@/utils/cn";
import {
  Clock,
  Loader2,
  Mic,
  RefreshCw,
  Sparkles,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleEvent, urlDeGravacao } from "../use-google-calendar";
import { GooglePreMeetingModal } from "./google-pre-meeting-modal";

/**
 * Eventos reais do Google Agenda (próximos 14 dias), com os convidados já
 * casados aos contatos do usuário por e-mail — é a ponte convite → contato →
 * histórico que o pre-meeting vai usar.
 */

function formatarDia(iso: string) {
  const d = new Date(iso);
  const hoje = new Date();
  const amanha = new Date();
  amanha.setDate(hoje.getDate() + 1);
  const mesmoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (mesmoDia(d, hoje)) return "Hoje";
  if (mesmoDia(d, amanha)) return "Amanhã";
  return d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GoogleEventsPanel({
  eventos,
  carregando,
  onRecarregar,
}: {
  eventos: GoogleEvent[];
  carregando: boolean;
  onRecarregar: () => void;
}) {
  const router = useRouter();
  const [preMeetingDe, setPreMeetingDe] = useState<GoogleEvent | null>(null);

  // Abre o gravador na home com título e contatos do evento já preenchidos
  const gravarEvento = (evento: GoogleEvent) => {
    router.push(urlDeGravacao(evento));
  };

  return (
    <section className="rounded-3xl border border-gray-200/70 bg-white/80 p-5 backdrop-blur-sm md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
            Google Agenda
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900">
            Próximos 14 dias
          </h3>
        </div>
        <button
          onClick={onRecarregar}
          disabled={carregando}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[10px] font-semibold tracking-wider text-gray-600 uppercase transition hover:border-gray-300 hover:text-gray-900 disabled:opacity-60"
        >
          {carregando ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <RefreshCw size={11} />
          )}
          Atualizar
        </button>
      </div>

      {carregando && eventos.length === 0 ? (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-sm text-gray-500">
          <Loader2 size={14} className="animate-spin" />
          Buscando seus compromissos no Google...
        </div>
      ) : eventos.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-center text-sm text-gray-500">
          Nenhum compromisso no Google Agenda para os próximos 14 dias.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="flex flex-col gap-2 rounded-2xl border border-gray-200/70 bg-white p-3 md:flex-row md:items-center md:gap-4"
            >
              <div className="flex shrink-0 items-center gap-2 md:w-40 md:flex-col md:items-start md:gap-0.5">
                <span className="text-xs font-semibold text-gray-900 capitalize">
                  {evento.start ? formatarDia(evento.start) : "—"}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-500 tabular-nums">
                  <Clock size={10} />
                  {evento.allDay
                    ? "Dia inteiro"
                    : evento.start
                      ? `${formatarHora(evento.start)}${evento.end ? ` – ${formatarHora(evento.end)}` : ""}`
                      : "—"}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {evento.title}
                  </p>
                  {evento.meetLink && (
                    <a
                      href={evento.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-emerald-700 uppercase ring-1 ring-emerald-100 transition hover:bg-emerald-100"
                    >
                      <Video size={9} />
                      Meet
                    </a>
                  )}
                </div>
                {evento.attendees.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <Users size={10} className="text-gray-400" />
                    {evento.attendees.map((convidado, i) => {
                      const rotulo =
                        convidado.contactName ??
                        convidado.name ??
                        convidado.email ??
                        "convidado";
                      return (
                        <span
                          key={`${evento.id}-${convidado.email ?? i}`}
                          title={convidado.email ?? undefined}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                            convidado.contactId
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                              : "bg-gray-100 text-gray-500",
                          )}
                        >
                          {convidado.contactId && <UserCheck size={9} />}
                          {rotulo}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5 md:pl-2">
                {evento.attendees.some((c) => c.contactId) && (
                  <button
                    onClick={() => setPreMeetingDe(evento)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[10px] font-semibold tracking-wider text-gray-700 uppercase transition hover:border-gray-300 hover:text-gray-900"
                  >
                    <Sparkles size={11} />
                    Pre-meeting
                  </button>
                )}
                <button
                  onClick={() => gravarEvento(evento)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-gray-900 px-3 text-[10px] font-semibold tracking-wider text-white uppercase transition hover:bg-gray-700"
                >
                  <Mic size={11} />
                  Gravar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-[11px] text-gray-400">
        Convidados destacados em verde já são seus contatos (reconhecidos pelo
        e-mail) — o Pre-meeting usa o histórico deles e a gravação já nasce
        vinculada.
      </p>

      <GooglePreMeetingModal
        evento={preMeetingDe}
        onClose={() => setPreMeetingDe(null)}
        onGravar={(evento) => {
          setPreMeetingDe(null);
          gravarEvento(evento);
        }}
      />
    </section>
  );
}
