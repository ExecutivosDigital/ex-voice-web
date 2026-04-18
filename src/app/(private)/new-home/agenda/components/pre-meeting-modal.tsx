"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  FileText,
  History,
  Lightbulb,
  MapPin,
  MessageCircle,
  Monitor,
  Sparkles,
  Target,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Meeting,
  MeetingType,
  meetingTypeLabel,
  getPastMeetings,
  getAiDirectives,
  PastMeetingSummary,
} from "../use-agenda-store";

const typeAccent: Record<
  MeetingType,
  { icon: typeof Video; ring: string; chip: string; label: string }
> = {
  meet: {
    icon: Video,
    ring: "ring-emerald-200",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    label: "text-emerald-700",
  },
  zoom: {
    icon: Video,
    ring: "ring-sky-200",
    chip: "bg-sky-50 text-sky-700 ring-sky-100",
    label: "text-sky-700",
  },
  teams: {
    icon: Monitor,
    ring: "ring-indigo-200",
    chip: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    label: "text-indigo-700",
  },
  presencial: {
    icon: MapPin,
    ring: "ring-gray-200",
    chip: "bg-gray-100 text-gray-700 ring-gray-200",
    label: "text-gray-700",
  },
};

const sentimentBadge: Record<
  PastMeetingSummary["sentiment"],
  { cls: string; label: string }
> = {
  positivo: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-100", label: "Positivo" },
  neutro: { cls: "bg-gray-100 text-gray-700 ring-gray-200", label: "Neutro" },
  atencao: { cls: "bg-amber-50 text-amber-700 ring-amber-100", label: "Atenção" },
};

function minutesUntil(meeting: Meeting) {
  const target = new Date(`${meeting.date}T${meeting.startTime}:00`);
  const diff = Math.round((target.getTime() - Date.now()) / 60000);
  return diff;
}

function formatCountdown(mins: number) {
  if (mins <= 0) return { label: "Agora", tone: "live" as const };
  if (mins < 60) return { label: `em ${mins} min`, tone: "soon" as const };
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24)
    return {
      label: m ? `em ${h}h${String(m).padStart(2, "0")}` : `em ${h}h`,
      tone: "later" as const,
    };
  const d = Math.floor(h / 24);
  return { label: `em ${d}d`, tone: "later" as const };
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

interface PreMeetingModalProps {
  meeting: Meeting | null;
  onClose: () => void;
  onStartRecording?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
}

export function PreMeetingModal({
  meeting,
  onClose,
  onStartRecording,
  onEdit,
}: PreMeetingModalProps) {
  const [mins, setMins] = useState(() => (meeting ? minutesUntil(meeting) : 0));

  useEffect(() => {
    if (!meeting) return;
    setMins(minutesUntil(meeting));
    const id = setInterval(() => setMins(minutesUntil(meeting)), 30_000);
    return () => clearInterval(id);
  }, [meeting]);

  useEffect(() => {
    if (!meeting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [meeting, onClose]);

  useEffect(() => {
    if (!meeting) return;
    const scrollY = window.scrollY;
    const prev = {
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyPaddingRight: document.body.style.paddingRight,
    };
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prev.bodyOverflow;
      document.documentElement.style.overflow = prev.htmlOverflow;
      document.body.style.paddingRight = prev.bodyPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [meeting]);

  const history = useMemo(
    () => (meeting ? getPastMeetings(meeting.client) : []),
    [meeting],
  );
  const ai = useMemo(
    () => (meeting ? getAiDirectives(meeting) : null),
    [meeting],
  );

  if (!meeting || !ai) return null;

  const accent = typeAccent[meeting.type];
  const Icon = accent.icon;
  const countdown = formatCountdown(mins);
  const isNow = mins <= 15 && mins >= -30;
  const initials = meeting.client
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AnimatePresence>
      {meeting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/50 backdrop-blur-md md:items-center md:justify-center md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.45)] md:h-auto md:max-h-[92vh] md:rounded-3xl"
          >
            <Header
              meeting={meeting}
              initials={initials}
              Icon={Icon}
              countdown={countdown}
              onClose={onClose}
            />

            <div
              className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 md:px-10"
              data-lenis-prevent
            >
              <div className="flex flex-col gap-6 pt-6">
                <ReadinessBar mins={mins} />

                <Section
                  icon={Target}
                  label="Objetivo da conversa"
                  accent="bg-gradient-to-br from-gray-900 to-gray-700 text-white"
                >
                  <p className="text-sm leading-relaxed text-gray-700">
                    {ai.objective}
                  </p>
                  <p className="mt-2 text-[11px] font-medium tracking-wider text-gray-400 uppercase">
                    Tom sugerido · <span className="normal-case">{ai.tone}</span>
                  </p>
                </Section>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Section
                    icon={Sparkles}
                    label="Retome estes pontos"
                    accent="bg-emerald-50 text-emerald-700"
                  >
                    <ul className="flex flex-col gap-2">
                      {ai.resume.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 rounded-xl bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-700"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section
                    icon={AlertTriangle}
                    label="Cuidados"
                    accent="bg-amber-50 text-amber-700"
                  >
                    <ul className="flex flex-col gap-2">
                      {ai.watchouts.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 rounded-xl bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-100"
                        >
                          <AlertTriangle
                            size={12}
                            className="mt-0.5 shrink-0 text-amber-600"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>

                <Section
                  icon={Lightbulb}
                  label="Perguntas poderosas"
                  accent="bg-indigo-50 text-indigo-700"
                  hint="Abra com uma destas se a conversa travar."
                >
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {ai.questions.map((q, i) => (
                      <div
                        key={i}
                        className="group flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <p className="leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                {meeting.notes ? (
                  <Section
                    icon={FileText}
                    label="Suas anotações"
                    accent="bg-gray-100 text-gray-700"
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                      {meeting.notes}
                    </p>
                  </Section>
                ) : null}

                <Section
                  icon={History}
                  label={`Histórico com ${meeting.client}`}
                  accent="bg-gray-900 text-white"
                  hint={
                    history.length === 0
                      ? "Primeira conversa registrada."
                      : `${history.length} sessão${history.length === 1 ? "" : "es"} anterior${history.length === 1 ? "" : "es"}.`
                  }
                >
                  {history.length === 0 ? (
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-5 text-xs text-gray-500">
                      <MessageCircle size={16} />
                      Nenhuma reunião anterior registrada com este cliente.
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {history.map((h) => (
                        <PastMeetingCard key={h.id} item={h} />
                      ))}
                    </ul>
                  )}
                </Section>
              </div>
            </div>

            <Footer
              meeting={meeting}
              isNow={isNow}
              onStartRecording={onStartRecording}
              onEdit={onEdit}
              onClose={onClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header({
  meeting,
  initials,
  Icon,
  countdown,
  onClose,
}: {
  meeting: Meeting;
  initials: string;
  Icon: typeof Video;
  countdown: ReturnType<typeof formatCountdown>;
  onClose: () => void;
}) {
  return (
    <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-br from-gray-900 via-[#111318] to-[#1a1d24] px-6 pt-5 pb-5 text-white md:px-10 md:pt-5 md:pb-6">
      <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
          <Sparkles size={12} className="text-amber-300" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-white/80 uppercase">
            Pre-Meeting · IA EX
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative mt-4 flex items-center gap-4 md:gap-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold ring-1 ring-white/15 backdrop-blur-sm md:h-14 md:w-14 md:text-base",
          )}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-white/50 uppercase">
            {formatDate(meeting.date)}
          </p>
          <h2 className="mt-1 text-balance text-xl leading-tight font-semibold text-white md:text-[24px]">
            {meeting.title}
          </h2>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={11} />
              {meeting.startTime} – {meeting.endTime}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="inline-flex items-center gap-1.5">
              <Icon size={11} />
              {meetingTypeLabel(meeting.type)}
            </span>
            {meeting.location ? (
              <>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={11} />
                  {meeting.location}
                </span>
              </>
            ) : null}
          </p>
          <p className="mt-1 text-[11px] text-white/50">
            Com <span className="font-semibold text-white/80">{meeting.client}</span>
          </p>
        </div>

        <div className="hidden shrink-0 flex-col items-end self-center md:flex">
          <span className="text-[10px] font-semibold tracking-[0.25em] text-white/50 uppercase">
            Inicia
          </span>
          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tabular-nums",
              countdown.tone === "live"
                ? "bg-red-500 text-white"
                : countdown.tone === "soon"
                  ? "bg-amber-400 text-amber-950"
                  : "bg-white/10 text-white ring-1 ring-white/20",
            )}
          >
            {countdown.tone === "live" && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            )}
            {countdown.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReadinessBar({ mins }: { mins: number }) {
  const windowStart = 15;
  const clamped = Math.max(-5, Math.min(windowStart, mins));
  const ratio = (windowStart - clamped) / (windowStart + 5);

  const status =
    mins <= 0
      ? { label: "Hora de começar", tone: "live" as const }
      : mins <= 5
        ? { label: "Já deve estar pronto", tone: "urgent" as const }
        : mins <= 15
          ? { label: "Janela ideal de preparação", tone: "prep" as const }
          : { label: "Revise quando tiver 10–15 min antes", tone: "future" as const };

  const barClass =
    status.tone === "live"
      ? "from-red-500 to-red-600"
      : status.tone === "urgent"
        ? "from-amber-500 to-red-500"
        : status.tone === "prep"
          ? "from-emerald-500 to-gray-900"
          : "from-gray-300 to-gray-500";

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-gray-200/70 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Prontidão
        </p>
        <span
          className={cn(
            "text-[11px] font-semibold",
            status.tone === "live" && "text-red-600",
            status.tone === "urgent" && "text-amber-600",
            status.tone === "prep" && "text-emerald-700",
            status.tone === "future" && "text-gray-500",
          )}
        >
          {status.label}
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(ratio * 100)}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn("h-full rounded-full bg-gradient-to-r", barClass)}
        />
      </div>
      <div className="flex justify-between text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
        <span>15 min antes</span>
        <span>10 min</span>
        <span>5 min</span>
        <span>Agora</span>
      </div>
    </div>
  );
}

function Section({
  icon: IconCmp,
  label,
  accent,
  hint,
  children,
}: {
  icon: typeof Target;
  label: string;
  accent: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-gray-200/70 bg-white p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl",
              accent,
            )}
          >
            <IconCmp size={15} />
          </span>
          <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
        </div>
        {hint ? (
          <span className="text-[11px] text-gray-400">{hint}</span>
        ) : null}
      </div>
      <div>{children}</div>
    </section>
  );
}

function PastMeetingCard({ item }: { item: PastMeetingSummary }) {
  const [open, setOpen] = useState(false);
  const badge = sentimentBadge[item.sentiment];

  return (
    <li className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              {new Date(item.date + "T00:00").toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase ring-1",
                badge.cls,
              )}
            >
              {badge.label}
            </span>
          </div>
          <p className="truncate text-sm font-semibold text-gray-900">
            {item.title}
          </p>
        </div>
        <ArrowRight
          size={14}
          className={cn(
            "mt-1 shrink-0 text-gray-400 transition-transform",
            open && "rotate-90 text-gray-900",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-gray-100 bg-gray-50/60 px-4 py-3"
          >
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                  Destaques
                </p>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {item.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-gray-700"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-500" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                  Next steps
                </p>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {item.nextSteps.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-gray-700"
                    >
                      <ArrowRight
                        size={11}
                        className="mt-0.5 shrink-0 text-gray-400"
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function Footer({
  meeting,
  isNow,
  onStartRecording,
  onEdit,
  onClose,
}: {
  meeting: Meeting;
  isNow: boolean;
  onStartRecording?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10 md:py-5">
      <p className="text-[11px] text-gray-500">
        {isNow
          ? "Tudo pronto. Respire fundo e comece com a primeira pergunta."
          : "Este resumo é gerado pela IA da EX com base em sessões anteriores."}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className="rounded-full px-3.5 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
        >
          Fechar
        </button>
        {onEdit ? (
          <button
            onClick={() => onEdit(meeting)}
            className="rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
          >
            Editar reunião
          </button>
        ) : null}
        {onStartRecording ? (
          <button
            onClick={() => onStartRecording(meeting)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg transition",
              isNow
                ? "bg-red-500 shadow-red-500/30 hover:bg-red-600"
                : "bg-gradient-to-r from-gray-900 to-gray-700 shadow-gray-900/20 hover:scale-[1.02]",
            )}
          >
            <span className="relative flex h-2 w-2">
              {isNow && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            {isNow ? "Iniciar gravação" : "Preparar gravação"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
