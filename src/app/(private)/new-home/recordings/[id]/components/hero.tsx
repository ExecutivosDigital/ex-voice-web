"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { WaveformAudioPlayer } from "@/components/ui/waveform-audio-player";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Mic2,
  UserRound,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/navigation";

moment.locale("pt-br");

function statusMeta(status: RecordingDetailsProps["transcriptionStatus"]) {
  switch (status) {
    case "DONE":
      return {
        label: "Transcrita",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        icon: CheckCircle2,
        spin: false,
      };
    case "TRANSCRIBING":
      return {
        label: "Transcrevendo",
        text: "text-amber-700",
        bg: "bg-amber-50",
        icon: Loader2,
        spin: true,
      };
    case "PENDING":
      return {
        label: "Na fila",
        text: "text-sky-700",
        bg: "bg-sky-50",
        icon: Clock,
        spin: false,
      };
    default:
      return {
        label: "Sem transcrição",
        text: "text-gray-600",
        bg: "bg-gray-100",
        icon: Clock,
        spin: false,
      };
  }
}

export function DetailHeader({
  recording,
}: {
  recording: RecordingDetailsProps;
}) {
  const router = useRouter();
  const status = statusMeta(recording.transcriptionStatus);
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-5"
    >
      <button
        onClick={() => router.push("/new-home/recordings")}
        className="group inline-flex w-max items-center gap-2 text-xs font-semibold tracking-[0.28em] text-gray-400 uppercase transition hover:text-gray-900"
      >
        <ArrowLeft
          size={14}
          className="transition-transform group-hover:-translate-x-0.5"
        />
        Últimas gravações
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-sm">
            <Mic2 size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl leading-tight font-semibold text-gray-900 md:text-3xl">
              {recording.name || "Sem título"}
            </h1>
            {recording.description && (
              <p className="mt-1 line-clamp-2 max-w-xl text-sm leading-relaxed text-gray-500">
                {recording.description}
              </p>
            )}
          </div>
        </div>

        {recording.audioUrl && (
          <a
            href={recording.audioUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full border border-gray-200 bg-white/80 px-4 text-xs font-semibold text-gray-700 backdrop-blur-sm transition hover:border-gray-300 hover:bg-white"
          >
            <Download size={13} />
            Baixar áudio
          </a>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
            status.bg,
            status.text,
          )}
        >
          <StatusIcon size={11} className={cn(status.spin && "animate-spin")} />
          {status.label}
        </span>
        <InfoChip icon={Clock} label={recording.duration || "00:00"} />
        <InfoChip
          label={moment(recording.createdAt).format("DD [de] MMM, YYYY · HH:mm")}
        />
        {recording.client && (
          <InfoChip icon={UserRound} label={recording.client.name} />
        )}
      </div>

      {recording.audioUrl && (
        <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm">
          <WaveformAudioPlayer
            audioUrl={recording.audioUrl}
            videoDuration={recording.duration}
            className="border-transparent bg-transparent shadow-none"
          />
        </div>
      )}
    </motion.div>
  );
}

function InfoChip({
  icon: Icon,
  label,
}: {
  icon?: typeof Clock;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-gray-600 backdrop-blur-sm">
      {Icon && <Icon size={11} className="text-gray-400" />}
      {label}
    </span>
  );
}
