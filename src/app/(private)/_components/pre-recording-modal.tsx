"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  Compass,
  HelpCircle,
  ListChecks,
  MapPin,
  Mic,
  Monitor,
  Plus,
  Sparkles,
  Target,
  Video,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Meeting,
  MeetingType,
  MeetingPrepContext,
  meetingTypeLabel,
  useAgendaStore,
} from "../agenda/use-agenda-store";

const typeAccent: Record<MeetingType, { icon: typeof Video; label: string }> = {
  meet: { icon: Video, label: "Google Meet" },
  zoom: { icon: Video, label: "Zoom" },
  teams: { icon: Monitor, label: "Teams" },
  presencial: { icon: MapPin, label: "Presencial" },
};

const TONE_OPTIONS: { value: string; label: string; hint: string }[] = [
  { value: "Acolhedor", label: "Acolhedor", hint: "Escuta ativa, sem pressa." },
  {
    value: "Consultivo",
    label: "Consultivo",
    hint: "Confiante, guiado por valor.",
  },
  { value: "Direto", label: "Direto", hint: "Objetivo, foco em ação." },
  {
    value: "Investigativo",
    label: "Investigativo",
    hint: "Curioso, aprofunda dor.",
  },
  { value: "Neutro", label: "Neutro", hint: "Equilibrado, sem vieses." },
];

function minutesUntil(meeting: Meeting) {
  const target = new Date(`${meeting.date}T${meeting.startTime}:00`);
  return Math.round((target.getTime() - Date.now()) / 60000);
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

interface PreRecordingModalProps {
  meeting: Meeting | null;
  onClose: () => void;
  onStartRecording?: (meeting: Meeting, context: MeetingPrepContext) => void;
}

export function PreRecordingModal({
  meeting,
  onClose,
  onStartRecording,
}: PreRecordingModalProps) {
  const storedContext = useAgendaStore((s) =>
    meeting ? s.prepContexts[meeting.id] : undefined,
  );
  const setPrepContext = useAgendaStore((s) => s.setPrepContext);

  const [draft, setDraft] = useState<MeetingPrepContext>({});
  const [mins, setMins] = useState(() => (meeting ? minutesUntil(meeting) : 0));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (meeting) {
      setDraft({
        objective: storedContext?.objective ?? "",
        background: storedContext?.background ?? "",
        topics: storedContext?.topics ?? [],
        questions: storedContext?.questions ?? [],
        tone: storedContext?.tone ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting?.id]);

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

  const filledCount = useMemo(() => {
    let c = 0;
    if (draft.objective?.trim()) c++;
    if (draft.background?.trim()) c++;
    if ((draft.topics ?? []).some((t) => t.trim())) c++;
    if ((draft.questions ?? []).some((q) => q.trim())) c++;
    if (draft.tone) c++;
    return c;
  }, [draft]);

  const totalFields = 5;
  const completion = Math.round((filledCount / totalFields) * 100);

  if (!meeting || !mounted) return null;

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

  const update = (patch: Partial<MeetingPrepContext>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setPrepContext(meeting.id, patch);
  };

  const handleStart = () => {
    onStartRecording?.(meeting, draft);
  };

  return createPortal(
    <AnimatePresence>
      {meeting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-stretch justify-center bg-black/50 backdrop-blur-md md:items-center md:p-6"
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
            className="relative flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden bg-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.45)] md:h-auto md:max-h-[92vh] md:rounded-3xl"
          >
            <Header
              meeting={meeting}
              initials={initials}
              Icon={Icon}
              typeLabel={accent.label}
              countdown={countdown}
              completion={completion}
              filledCount={filledCount}
              totalFields={totalFields}
              onClose={onClose}
            />

            <div
              className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 md:px-10"
              data-lenis-prevent
            >
              <div className="flex flex-col gap-5 pt-6">
                <FieldCard
                  icon={Target}
                  accent="bg-gradient-to-br from-gray-900 to-gray-700 text-white"
                  label="Objetivo da conversa"
                  hint="O que você quer sair desta reunião?"
                >
                  <textarea
                    value={draft.objective ?? ""}
                    onChange={(e) => update({ objective: e.target.value })}
                    rows={2}
                    placeholder="Ex: Fechar próximo passo claro sobre a proposta e tirar a dúvida do time técnico dele."
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-900/5 focus:outline-none"
                  />
                </FieldCard>

                <FieldCard
                  icon={Compass}
                  accent="bg-indigo-50 text-indigo-700"
                  label="Contexto rápido"
                  hint="Qualquer coisa importante que a IA precisa saber."
                >
                  <textarea
                    value={draft.background ?? ""}
                    onChange={(e) => update({ background: e.target.value })}
                    rows={3}
                    placeholder="Ex: É nossa 3ª conversa. Ficou inseguro sobre preço na última. Evitar falar em prazo curto."
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-900/5 focus:outline-none"
                  />
                </FieldCard>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldCard
                    icon={ListChecks}
                    accent="bg-emerald-50 text-emerald-700"
                    label="Tópicos que quero cobrir"
                  >
                    <ChipList
                      values={draft.topics ?? []}
                      placeholder="Ex: Revisar proposta técnica"
                      onChange={(topics) => update({ topics })}
                      tone="emerald"
                    />
                  </FieldCard>

                  <FieldCard
                    icon={HelpCircle}
                    accent="bg-sky-50 text-sky-700"
                    label="Perguntas-chave"
                  >
                    <ChipList
                      values={draft.questions ?? []}
                      placeholder="Ex: O que te faria decidir por sim?"
                      onChange={(questions) => update({ questions })}
                      tone="sky"
                    />
                  </FieldCard>
                </div>

                <FieldCard
                  icon={Waves}
                  accent="bg-amber-50 text-amber-700"
                  label="Tom da conversa"
                >
                  <div className="flex flex-wrap gap-2">
                    {TONE_OPTIONS.map((opt) => {
                      const active = draft.tone === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            update({ tone: active ? "" : opt.value })
                          }
                          className={cn(
                            "group flex flex-col items-start rounded-2xl border px-3.5 py-2 text-left transition",
                            active
                              ? "border-gray-900 bg-gray-900 text-white shadow-[0_8px_20px_-10px_rgba(17,24,39,0.45)]"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                          )}
                        >
                          <span className="text-[11px] font-semibold">
                            {opt.label}
                          </span>
                          <span
                            className={cn(
                              "text-[10px]",
                              active ? "text-white/60" : "text-gray-400",
                            )}
                          >
                            {opt.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </FieldCard>

                <div className="flex items-start gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-3 text-[11px] text-gray-500">
                  <Sparkles
                    size={12}
                    className="mt-0.5 shrink-0 text-amber-500"
                  />
                  <p className="leading-relaxed">
                    Quanto mais contexto, mais preciso o resumo e as sugestões
                    da IA depois da reunião. Você pode preencher só o que fizer
                    sentido agora.
                  </p>
                </div>
              </div>
            </div>

            <Footer
              meeting={meeting}
              isNow={isNow}
              completion={completion}
              onClose={onClose}
              onStart={handleStart}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Header({
  meeting,
  initials,
  Icon,
  typeLabel,
  countdown,
  completion,
  filledCount,
  totalFields,
  onClose,
}: {
  meeting: Meeting;
  initials: string;
  Icon: typeof Video;
  typeLabel: string;
  countdown: ReturnType<typeof formatCountdown>;
  completion: number;
  filledCount: number;
  totalFields: number;
  onClose: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-100 bg-gradient-to-br from-gray-900 via-[#111318] to-[#1a1d24] px-5 pt-7 pb-6 text-white md:px-10 md:pt-8 md:pb-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
          <Mic size={12} className="text-amber-300" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-white/80 uppercase">
            Pré-gravação
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

      <div className="relative mt-4 flex items-start gap-4 md:gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold ring-1 ring-white/15 backdrop-blur-sm md:h-14 md:w-14 md:text-base">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-white/50 uppercase">
            {formatDate(meeting.date)}
          </p>
          <h2 className="mt-1 text-xl leading-tight font-semibold text-balance text-white md:text-[22px]">
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
              {typeLabel}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-white/50">
            Com{" "}
            <span className="font-semibold text-white/80">
              {meeting.client}
            </span>
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
            {countdown.label}
          </span>
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.22em] text-white/50 uppercase">
            <span>Contexto da IA</span>
            <span>
              {filledCount}/{totalFields} · {completion}%
            </span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldCard({
  icon: IconCmp,
  accent,
  label,
  hint,
  children,
}: {
  icon: typeof Target;
  accent: string;
  label: string;
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

function ChipList({
  values,
  placeholder,
  onChange,
  tone,
}: {
  values: string[];
  placeholder: string;
  onChange: (next: string[]) => void;
  tone: "emerald" | "sky";
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (!v) return;
    onChange([...values, v]);
    setInput("");
  };

  const removeAt = (i: number) => {
    onChange(values.filter((_, idx) => idx !== i));
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  const chipCls =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : "bg-sky-50 text-sky-800 ring-sky-100";
  const removeCls =
    tone === "emerald"
      ? "text-emerald-600 hover:bg-emerald-100"
      : "text-sky-600 hover:bg-sky-100";

  return (
    <div className="flex flex-col gap-2.5">
      {values.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <li
              key={`${i}-${v}`}
              className={cn(
                "inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] ring-1",
                chipCls,
              )}
            >
              <Check size={10} strokeWidth={3} className="shrink-0" />
              <span className="truncate">{v}</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                  removeCls,
                )}
                aria-label="Remover"
              >
                <X size={9} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-1.5 focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-gray-900/5">
        <Plus size={13} className="shrink-0 text-gray-400" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="w-full bg-transparent py-1 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />
        {input.trim() && (
          <button
            type="button"
            onClick={add}
            className="shrink-0 rounded-full bg-gray-900 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white uppercase transition hover:bg-gray-700"
          >
            Adicionar
          </button>
        )}
      </div>
    </div>
  );
}

function Footer({
  meeting,
  isNow,
  completion,
  onClose,
  onStart,
}: {
  meeting: Meeting;
  isNow: boolean;
  completion: number;
  onClose: () => void;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-10 md:py-5">
      <div className="flex items-start gap-2 text-[11px] text-gray-500">
        {completion >= 60 ? (
          <Check size={13} className="mt-0.5 text-emerald-600" />
        ) : (
          <AlertTriangle size={13} className="mt-0.5 text-amber-500" />
        )}
        <p className="leading-relaxed">
          {completion >= 60
            ? "Contexto excelente. A IA vai te ajudar com resumos mais precisos."
            : completion === 0
              ? "Sem contexto também funciona, mas com 1-2 campos o resumo fica bem melhor."
              : "Um pouco mais de contexto e a IA vai entregar insights ainda melhores."}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          type="button"
          className="rounded-full px-3.5 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
        >
          Fechar
        </button>
        <button
          onClick={onStart}
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition",
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
          {isNow ? "Iniciar gravação" : "Iniciar gravação com contexto"}
          <ArrowRight size={13} />
        </button>
      </div>
      {meeting.location && (
        <span className="sr-only">Local: {meeting.location}</span>
      )}
    </div>
  );
}
