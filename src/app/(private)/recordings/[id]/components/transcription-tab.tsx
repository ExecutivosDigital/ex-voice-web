"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  FileText,
  Loader2,
  Mic2,
  Search,
  Settings2,
  Star,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EditSpeakersModal } from "./edit-speakers-modal";
import { Placeholder } from "./placeholder";
import {
  PROFESSIONAL_STYLE,
  SpeakerStyle,
  buildSpeakerStyleMap,
  getSpeakerInitial,
} from "./speaker-palette";

function formatTimestamp(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  try {
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${safe})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          className="rounded-sm bg-yellow-200/70 px-0.5 text-gray-900"
        >
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  } catch {
    return text;
  }
}

export function TranscriptionTab({
  recording,
}: {
  recording: RecordingDetailsProps;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);

  const speakerMap = useMemo(() => {
    const styles = buildSpeakerStyleMap(recording.speakers);
    const map: Record<
      string,
      { name: string; isProfessional?: boolean; style: SpeakerStyle }
    > = {};
    recording.speakers?.forEach((s) => {
      map[s.id] = {
        name: s.name,
        isProfessional: s.isProfessional,
        style: styles[s.id] || PROFESSIONAL_STYLE,
      };
    });
    return map;
  }, [recording.speakers]);

  const hasSpeeches = (recording.speeches?.length ?? 0) > 0;
  const hasSpeakers = (recording.speakers?.length ?? 0) > 0;

  // Agrupa falas consecutivas do mesmo locutor
  const grouped = useMemo(() => {
    if (!hasSpeeches) return [];
    const q = query.trim().toLowerCase();
    type Group = {
      speakerId: string;
      startTime: number;
      endTime: number;
      segments: { text: string; startTime: number }[];
    };
    const out: Group[] = [];
    for (const sp of recording.speeches) {
      if (activeSpeakerId && sp.speakerId !== activeSpeakerId) continue;
      if (q && !sp.transcription.toLowerCase().includes(q)) continue;
      const last = out[out.length - 1];
      if (last && last.speakerId === sp.speakerId) {
        last.segments.push({
          text: sp.transcription,
          startTime: sp.startTime,
        });
        last.endTime = sp.endTime;
      } else {
        out.push({
          speakerId: sp.speakerId,
          startTime: sp.startTime,
          endTime: sp.endTime,
          segments: [{ text: sp.transcription, startTime: sp.startTime }],
        });
      }
    }
    return out;
  }, [recording.speeches, query, activeSpeakerId, hasSpeeches]);

  if (recording.transcriptionStatus === "TRANSCRIBING") {
    return (
      <Placeholder
        icon={<Loader2 size={22} className="animate-spin" />}
        title="Transcrevendo sua gravação"
        description="Assim que finalizar, a transcrição aparece aqui, organizada por locutor."
      />
    );
  }

  if (recording.transcriptionStatus === "PENDING") {
    return (
      <Placeholder
        icon={<Loader2 size={22} className="animate-spin" />}
        title="Aguardando processamento"
        description="Sua gravação está na fila. Em instantes ela será transcrita."
      />
    );
  }

  if (!hasSpeeches && !recording.transcription) {
    return (
      <Placeholder
        icon={<FileText size={22} />}
        title="Sem transcrição"
        description="Essa gravação ainda não possui transcrição disponível."
      />
    );
  }

  const speakers = recording.speakers || [];
  const totalSpeeches = recording.speeches?.length ?? 0;
  const visibleCount = grouped.reduce((n, g) => n + g.segments.length, 0);
  const hasFilter = !!query.trim() || !!activeSpeakerId;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex max-h-[85vh] flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        {/* Header (fixo no topo) */}
        <div className="flex shrink-0 flex-col gap-4 border-b border-gray-100 px-5 py-5 md:px-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-sm">
                <Mic2 size={16} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 md:text-lg">
                  Transcrição
                </h2>
                {hasSpeakers && (
                  <p className="text-[11px] text-gray-500">
                    {speakers.length} locutor{speakers.length > 1 ? "es" : ""}{" "}
                    · {totalSpeeches} fala{totalSpeeches === 1 ? "" : "s"}
                  </p>
                )}
              </div>
            </div>

            {hasSpeakers && (
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              >
                <Settings2 size={13} />
                <span className="hidden sm:inline">Editar locutores</span>
              </button>
            )}
          </div>

          {/* Search */}
          {hasSpeeches && (
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar na transcrição..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pr-10 pl-10 text-sm text-gray-800 outline-none transition focus:border-gray-400 focus:bg-white focus:shadow-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Limpar busca"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Filtros de speaker */}
          {hasSpeakers && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveSpeakerId(null)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition",
                  activeSpeakerId === null
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                Todos
              </button>
              {speakers.map((s) => {
                const style = speakerMap[s.id]?.style || PROFESSIONAL_STYLE;
                const isActive = activeSpeakerId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() =>
                      setActiveSpeakerId(isActive ? null : s.id)
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition",
                      isActive
                        ? cn(style.bg, style.ring, style.text, "shadow-sm")
                        : cn(
                            "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50",
                          ),
                    )}
                  >
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", style.dot)}
                    />
                    {s.name || "Locutor"}
                    {s.isProfessional && (
                      <Star
                        size={11}
                        strokeWidth={2.4}
                        className="fill-current"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Contador de resultados quando filtrado */}
          {hasFilter && hasSpeeches && (
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>
                {visibleCount} de {totalSpeeches} fala
                {totalSpeeches === 1 ? "" : "s"}
              </span>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveSpeakerId(null);
                }}
                className="font-semibold text-gray-700 hover:text-gray-900"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* Corpo (scroll interno) */}
        <div
          className="flex-1 overflow-y-auto px-5 py-6 md:px-7"
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
        >
          {hasSpeeches ? (
            <AnimatePresence mode="popLayout">
              {grouped.length === 0 ? (
                <motion.div
                  key="empty-filter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-2 py-12 text-center"
                >
                  <Search size={22} className="text-gray-300" />
                  <p className="text-sm font-medium text-gray-600">
                    Nenhuma fala encontrada
                  </p>
                  <p className="text-xs text-gray-400">
                    Ajuste os filtros ou o termo de busca
                  </p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-6">
                  {grouped.map((group, gi) => {
                    const entry = speakerMap[group.speakerId];
                    const style = entry?.style || PROFESSIONAL_STYLE;
                    const name = entry?.name || "Locutor";
                    const isProfessional = entry?.isProfessional;
                    const text = group.segments
                      .map((s) => s.text)
                      .join("\n\n");
                    return (
                      <SpeechGroup
                        key={`${group.speakerId}-${gi}`}
                        index={gi}
                        name={name}
                        isProfessional={isProfessional}
                        style={style}
                        startTime={group.startTime}
                        segments={group.segments}
                        fullText={text}
                        query={query}
                      />
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          ) : (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-700">
              {recording.transcription}
            </p>
          )}
        </div>
      </motion.section>

      <EditSpeakersModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        recording={recording}
      />
    </>
  );
}

function SpeechGroup({
  index,
  name,
  isProfessional,
  style,
  startTime,
  segments,
  fullText,
  query,
}: {
  index: number;
  name: string;
  isProfessional?: boolean;
  style: SpeakerStyle;
  startTime: number;
  segments: { text: string; startTime: number }[];
  fullText: string;
  query: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.2) }}
      className={cn(
        "group flex gap-3 md:gap-4",
        isProfessional ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Coluna do locutor */}
      <div className="flex w-[84px] shrink-0 flex-col items-center gap-2 md:w-[108px]">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-sm ring-2 ring-white",
            style.avatar,
          )}
        >
          {getSpeakerInitial(name)}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span
            className={cn(
              "line-clamp-1 text-center text-xs font-semibold",
              isProfessional ? "text-gray-900" : style.text,
            )}
          >
            {name}
          </span>
          {isProfessional && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-900/5 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-gray-700 uppercase">
              <Star size={8} strokeWidth={2.4} className="fill-current" />
              Pro
            </span>
          )}
          <span className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-gray-600">
            {formatTimestamp(startTime)}
          </span>
        </div>
      </div>

      {/* Bloco de fala */}
      <div
        className={cn(
          "relative flex min-w-0 flex-1 flex-col",
          isProfessional ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "relative max-w-[88%] rounded-2xl px-5 py-4 transition-colors",
            isProfessional
              ? "rounded-tr-sm bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-[0_4px_14px_-6px_rgba(17,24,39,0.35)]"
              : cn(
                  "rounded-tl-sm border border-transparent",
                  style.bg,
                ),
          )}
        >
          {segments.map((seg, si) => (
            <p
              key={si}
              className={cn(
                "text-[15px] leading-relaxed whitespace-pre-wrap",
                isProfessional ? "text-white" : "text-gray-800",
                si > 0 && "mt-3",
              )}
            >
              {highlight(seg.text, query)}
            </p>
          ))}

          {/* Copy button */}
          <button
            onClick={copy}
            className={cn(
              "absolute top-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium opacity-0 shadow-sm backdrop-blur-sm transition group-hover:opacity-100",
              isProfessional
                ? "left-2 border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                : "right-2 border border-gray-200 bg-white/90 text-gray-600 hover:border-gray-300 hover:text-gray-900",
              copied &&
                (isProfessional
                  ? "border-emerald-300/50 text-emerald-200 opacity-100"
                  : "border-emerald-200 text-emerald-700 opacity-100"),
            )}
            aria-label="Copiar fala"
          >
            {copied ? (
              <>
                <Check size={11} /> copiado
              </>
            ) : (
              <>
                <Copy size={11} /> copiar
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
