"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { FileText, Loader2, Mic2, Settings2, Star } from "lucide-react";
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

export function TranscriptionTab({
  recording,
}: {
  recording: RecordingDetailsProps;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

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

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl border border-gray-200/70 bg-white/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-7"
      >
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-500 to-neutral-900 text-white">
              <Mic2 size={15} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Transcrição
              {hasSpeakers && (
                <span className="ml-1 text-sm font-normal text-gray-400">
                  · {speakers.length} locutor(es)
                </span>
              )}
            </h2>
          </div>

          {hasSpeakers && (
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 md:self-auto"
            >
              <Settings2 size={13} />
              Editar Locutores
            </button>
          )}
        </div>

        {hasSpeakers && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {speakers.map((s) => {
              const style = speakerMap[s.id]?.style || PROFESSIONAL_STYLE;
              return (
                <span
                  key={s.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                    style.bg,
                    style.ring,
                    style.text,
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      style.dot,
                    )}
                  />
                  {s.name || "Locutor"}
                  {s.isProfessional && (
                    <Star
                      size={11}
                      strokeWidth={2.4}
                      className="fill-current"
                    />
                  )}
                </span>
              );
            })}
          </div>
        )}

        {hasSpeeches ? (
          <div className="flex flex-col gap-3">
            {recording.speeches.map((speech, i) => {
              const entry = speakerMap[speech.speakerId];
              const style = entry?.style || PROFESSIONAL_STYLE;
              const name = entry?.name || "Locutor";
              const isProfessional = entry?.isProfessional;
              return (
                <motion.div
                  key={`${speech.speakerId}-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(i * 0.02, 0.2),
                  }}
                  className={cn(
                    "flex gap-3 rounded-2xl px-4 py-3 ring-1",
                    isProfessional
                      ? "bg-gradient-to-r from-gray-900/5 to-gray-900/0 ring-gray-900/10"
                      : cn(style.bg, style.ring),
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white shadow-sm",
                      style.avatar,
                    )}
                  >
                    {getSpeakerInitial(name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isProfessional ? "text-gray-900" : style.text,
                        )}
                      >
                        {name}
                      </span>
                      {isProfessional && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-900/5 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-gray-700 uppercase">
                          <Star
                            size={9}
                            strokeWidth={2.4}
                            className="fill-current"
                          />
                          Profissional
                        </span>
                      )}
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

      <EditSpeakersModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        recording={recording}
      />
    </>
  );
}
