"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarPlus,
  Clock,
  Loader2,
  Mic,
  Sparkles,
  UserCheck,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { GooglePreMeetingModal } from "../agenda/components/google-pre-meeting-modal";
import { GoogleEvent, useGoogleCalendar } from "../agenda/use-google-calendar";

/**
 * "Próximas reuniões" da home — eventos REAIS do Google Agenda do usuário
 * (era mock atrás do "Em breve" até 21/07). Sem conexão, convida a conectar.
 */

function formatDayLabel(iso: string) {
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

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UpcomingMeetings({
  google,
  onGravar,
}: {
  google: ReturnType<typeof useGoogleCalendar>;
  onGravar: (evento: GoogleEvent) => void;
}) {
  const router = useRouter();
  const [preMeetingDe, setPreMeetingDe] = useState<GoogleEvent | null>(null);

  const proximos = useMemo(() => google.eventos.slice(0, 3), [google.eventos]);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
            Agenda
          </p>
          <h2 className="mt-1 text-xl font-semibold whitespace-nowrap text-gray-900 md:text-2xl">
            Próximas reuniões
          </h2>
        </div>
        <button
          onClick={() => router.push("/agenda")}
          className="group flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          Ver agenda
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {google.carregando || (google.conectado && google.eventosCarregando && proximos.length === 0) ? (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 px-6 py-8 text-sm text-gray-500">
          <Loader2 size={14} className="animate-spin" />
          Carregando sua agenda...
        </div>
      ) : !google.conectado ? (
        <ConnectCta onConnect={() => router.push("/agenda")} />
      ) : proximos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
            <CalendarPlus size={20} className="text-gray-500" />
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-800">
            Agenda livre nos próximos 14 dias
          </p>
          <p className="mt-1 max-w-xs text-xs text-gray-500">
            Nenhum compromisso no seu Google Agenda por enquanto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {proximos.map((evento, i) => (
            <EventCard
              key={evento.id}
              evento={evento}
              index={i}
              onPreMeeting={() => setPreMeetingDe(evento)}
              onGravar={() => onGravar(evento)}
            />
          ))}
        </div>
      )}

      <GooglePreMeetingModal
        evento={preMeetingDe}
        onClose={() => setPreMeetingDe(null)}
        onGravar={(evento) => {
          setPreMeetingDe(null);
          onGravar(evento);
        }}
      />
    </section>
  );
}

function ConnectCta({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
        <CalendarPlus size={20} className="text-gray-500" />
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-800">
        Conecte seu Google Agenda
      </p>
      <p className="mt-1 max-w-xs text-xs text-gray-500">
        Seus compromissos aparecem aqui prontos pra gravar, com os contatos já
        reconhecidos.
      </p>
      <button
        onClick={onConnect}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
      >
        Conectar na Agenda
        <ArrowRight size={13} />
      </button>
    </div>
  );
}

function EventCard({
  evento,
  index,
  onPreMeeting,
  onGravar,
}: {
  evento: GoogleEvent;
  index: number;
  onPreMeeting: () => void;
  onGravar: () => void;
}) {
  const temContato = evento.attendees.some((c) => c.contactId);
  const convidados = evento.attendees.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 text-left transition",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-900 capitalize">
          {evento.start ? formatDayLabel(evento.start) : "—"}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-gray-500 tabular-nums">
          <Clock size={10} />
          {evento.allDay
            ? "Dia inteiro"
            : evento.start
              ? formatHora(evento.start)
              : "—"}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold text-gray-900">
            {evento.title}
          </p>
          {evento.meetLink && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-emerald-700 uppercase ring-1 ring-emerald-100">
              <Video size={9} />
              Meet
            </span>
          )}
        </div>
        {convidados.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {/* LGPD (João, 21/07): e-mail de convidado nunca aparece na UI */}
            {convidados.map((convidado, i) => (
              <span
                key={`${evento.id}-${i}`}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  convidado.contactId
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {convidado.contactId && <UserCheck size={9} />}
                {convidado.contactName ?? convidado.name ?? "Convidado"}
              </span>
            ))}
            {evento.attendees.length > 3 && (
              <span className="text-[10px] text-gray-400">
                +{evento.attendees.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center gap-1.5">
        {temContato && (
          <button
            onClick={onPreMeeting}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[10px] font-semibold tracking-wider text-gray-700 uppercase transition hover:border-gray-300 hover:text-gray-900"
          >
            <Sparkles size={11} />
            Pre-meeting
          </button>
        )}
        <button
          onClick={onGravar}
          className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full bg-gray-900 px-3 text-[10px] font-semibold tracking-wider text-white uppercase transition hover:bg-gray-700"
        >
          <Mic size={11} />
          Gravar
        </button>
      </div>
    </motion.div>
  );
}
