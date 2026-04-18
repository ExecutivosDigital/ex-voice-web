"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { FileText, Loader2, Mic2 } from "lucide-react";
import { useMemo } from "react";
import { Placeholder } from "./placeholder";

function formatTimestamp(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function TranscriptionTab({
  recording,
}: {
  recording: RecordingDetailsProps;
}) {
  const speakerMap = useMemo(() => {
    const map: Record<string, { name: string; isProfessional?: boolean }> = {};
    recording.speakers?.forEach((s) => {
      map[s.id] = { name: s.name, isProfessional: s.isProfessional };
    });
    return map;
  }, [recording.speakers]);

  const hasSpeeches = (recording.speeches?.length ?? 0) > 0;

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-gray-200/70 bg-white/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-7"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
          <Mic2 size={15} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Transcrição
          {hasSpeeches && (
            <span className="ml-1 text-sm font-normal text-gray-400">
              · {recording.speakers?.length || 0} locutor(es)
            </span>
          )}
        </h2>
      </div>

      {hasSpeeches ? (
        <div className="flex flex-col gap-3">
          {recording.speeches.map((speech, i) => {
            const speaker = speakerMap[speech.speakerId] || {
              name: "Locutor",
            };
            const isProfessional = speaker.isProfessional;
            return (
              <motion.div
                key={`${speech.speakerId}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.2) }}
                className={cn(
                  "flex gap-3 rounded-2xl px-4 py-3",
                  isProfessional
                    ? "bg-gradient-to-r from-gray-900/5 to-gray-900/0 ring-1 ring-gray-900/10"
                    : "bg-gray-50/60 ring-1 ring-gray-100",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    isProfessional
                      ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white"
                      : "bg-white text-gray-700 ring-1 ring-gray-200",
                  )}
                >
                  {(speaker.name[0] || "?").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-gray-900">
                      {speaker.name}
                    </span>
                    <span className="text-[10px] tabular-nums text-gray-400">
                      {formatTimestamp(speech.startTime)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                    {speech.transcription}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
          {recording.transcription}
        </p>
      )}
    </motion.section>
  );
}
