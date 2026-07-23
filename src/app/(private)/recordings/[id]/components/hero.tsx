"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/blocks/dropdown-menu";
import { WaveformAudioPlayer } from "@/components/ui/waveform-audio-player";
import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { useCorporate } from "@/context/corporateContext";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileDown,
  FileVideo2,
  Loader2,
  Mic2,
  Music2,
  RefreshCw,
  Share2,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { LinkContactModal } from "./link-contact-modal";
import { ReanalyzeModal } from "./reanalyze-modal";
import { ShareRecordingModal } from "./share-recording-modal";

moment.locale("pt-br");

/** Gravação online sai como webm de vídeo; presencial/app é áudio. */
function isVideoMedia(url: string): boolean {
  return /\.(webm|mp4|mkv)(\?|$)/i.test(url);
}

/** Nome de arquivo seguro a partir do título da gravação. */
function downloadFilename(recording: RecordingDetailsProps): string {
  const base = (recording.name || "gravacao")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  const ext =
    recording.audioUrl?.match(/\.([a-z0-9]{2,4})(\?|$)/i)?.[1] ?? "webm";
  return `${base || "gravacao"}.${ext}`;
}

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
  const { DownloadAPI } = useApiContext();
  const { profile } = useSession();
  const { hasCompany } = useCorporate();
  const [shareOpen, setShareOpen] = useState(false);
  const [reanalyzeOpen, setReanalyzeOpen] = useState(false);
  const [linkContactOpen, setLinkContactOpen] = useState(false);
  const [downloading, setDownloading] = useState<"video" | "audio" | null>(
    null,
  );

  // Download de verdade (fetch → blob → <a download>): o atributo download é
  // ignorado em URL cross-origin (R2), que era o motivo de abrir noutra aba.
  function saveBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function downloadMedia(rec: RecordingDetailsProps) {
    if (!rec.audioUrl) return;
    setDownloading("video");
    try {
      const response = await fetch(rec.audioUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      saveBlob(await response.blob(), downloadFilename(rec));
    } catch {
      window.open(rec.audioUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(null);
    }
  }

  async function downloadAudioOnly(rec: RecordingDetailsProps) {
    setDownloading("audio");
    const response = await DownloadAPI(
      `/recording/${rec.id}/download-audio`,
      true,
    );
    if (response.status === 200 && response.body instanceof Blob) {
      saveBlob(
        response.body,
        downloadFilename(rec).replace(/\.[^.]+$/, ".mp3"),
      );
    } else {
      toast.error("Não foi possível preparar o áudio para download.");
    }
    setDownloading(null);
  }

  function DownloadButton() {
    if (!recording.audioUrl) return null;

    if (!isVideoMedia(recording.audioUrl)) {
      return (
        <button
          type="button"
          onClick={() => downloadMedia(recording)}
          disabled={downloading !== null}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 text-xs font-semibold text-gray-700 backdrop-blur-sm transition hover:border-gray-300 hover:bg-white disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Download size={13} />
          )}
          Baixar áudio
        </button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={downloading !== null}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 text-xs font-semibold text-gray-700 backdrop-blur-sm transition hover:border-gray-300 hover:bg-white disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            Baixar gravação
            <ChevronDown size={12} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
          <DropdownMenuItem
            onSelect={() => downloadMedia(recording)}
            className="gap-2 rounded-lg px-3 py-2.5 text-xs font-medium"
          >
            <FileVideo2 size={14} />
            Baixar vídeo
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => downloadAudioOnly(recording)}
            className="gap-2 rounded-lg px-3 py-2.5 text-xs font-medium"
          >
            <Music2 size={14} />
            Baixar somente o áudio
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  const status = statusMeta(recording.transcriptionStatus);
  const StatusIcon = status.icon;

  // Fase 2.3: só o dono compartilha; usuário B2C (sem empresa) não vê o botão
  const isOwner = !!profile?.id && recording.userId === profile.id;
  const canShare = isOwner && hasCompany;
  // Re-análise: dono + transcrição concluída + gravação de reunião
  const canReanalyze =
    isOwner &&
    recording.type === "CLIENT" &&
    (recording.transcriptionStatus === "DONE" ||
      recording.transcriptionStatus === "DONE_NO_SUMMARY");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-5"
    >
      <button
        onClick={() => router.push("/recordings")}
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

        <div className="flex shrink-0 items-center gap-2 self-start">
          {(recording.transcriptionStatus === "DONE" ||
            !!recording.summary) && (
            <button
              onClick={() => router.push(`/recordings/${recording.id}/print`)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 text-xs font-semibold text-gray-700 backdrop-blur-sm transition hover:border-gray-300 hover:bg-white"
            >
              <FileDown size={13} />
              Exportar PDF
            </button>
          )}
          {canReanalyze && (
            <button
              onClick={() => setReanalyzeOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 text-xs font-semibold text-gray-700 backdrop-blur-sm transition hover:border-gray-300 hover:bg-white"
            >
              <RefreshCw size={13} />
              Re-analisar
            </button>
          )}
          {canShare && (
            <button
              onClick={() => setShareOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 text-xs font-semibold text-gray-700 backdrop-blur-sm transition hover:border-gray-300 hover:bg-white"
            >
              <Share2 size={13} />
              Compartilhar
            </button>
          )}
          <DownloadButton />
        </div>
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
          label={moment(recording.createdAt).format(
            "DD [de] MMM, YYYY · HH:mm",
          )}
        />
        {/* "Gravar sem vínculo e atribuir contato depois": o chip do contato é
            o ponto de vínculo — clicável só para o dono da gravação. */}
        {recording.client ? (
          isOwner && recording.type === "CLIENT" ? (
            <button
              type="button"
              onClick={() => setLinkContactOpen(true)}
              title="Trocar ou desvincular o contato desta gravação"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-gray-600 backdrop-blur-sm transition hover:border-gray-300 hover:bg-white"
            >
              <UserRound size={11} className="text-gray-400" />
              {recording.client.name}
            </button>
          ) : (
            <InfoChip icon={UserRound} label={recording.client.name} />
          )
        ) : (
          isOwner &&
          recording.type === "CLIENT" && (
            <button
              type="button"
              onClick={() => setLinkContactOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 bg-white/50 px-2.5 py-1 text-[11px] font-semibold text-gray-500 backdrop-blur-sm transition hover:border-gray-400 hover:bg-white hover:text-gray-700"
            >
              <UserRoundPlus size={11} />
              Vincular contato
            </button>
          )
        )}
        {recording.department && (
          <InfoChip icon={Building2} label={recording.department.name} />
        )}
        {!isOwner && recording.user && (
          <InfoChip icon={UserRound} label={`por ${recording.user.name}`} />
        )}
        {typeof recording.transcriptionConfidence === "number" && (
          <ConfidenceChip value={recording.transcriptionConfidence} />
        )}
      </div>

      {canShare && (
        <ShareRecordingModal
          recordingId={recording.id}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      )}
      {isOwner && recording.type === "CLIENT" && (
        <LinkContactModal
          recordingId={recording.id}
          currentClient={
            recording.client
              ? { id: recording.client.id, name: recording.client.name }
              : null
          }
          open={linkContactOpen}
          onClose={() => setLinkContactOpen(false)}
        />
      )}
      {canReanalyze && (
        <ReanalyzeModal
          recordingId={recording.id}
          currentPromptId={(recording as { promptId?: string | null }).promptId}
          open={reanalyzeOpen}
          onClose={() => setReanalyzeOpen(false)}
        />
      )}

      {recording.audioUrl && (
        <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm">
          <WaveformAudioPlayer
            audioUrl={recording.audioUrl}
            videoDuration={recording.duration}
            peaks={recording.waveform}
            barCount={90}
            className="border-transparent bg-transparent shadow-none"
          />
        </div>
      )}
    </motion.div>
  );
}

/** Chip do score de confiança da transcrição (verde/amber/vermelho). */
function ConfidenceChip({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tone =
    pct >= 85
      ? "bg-emerald-50 text-emerald-700"
      : pct >= 70
        ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-600";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone,
      )}
      title="Confiança média da transcrição estimada pelo modelo. Valores baixos podem indicar áudio ruim."
    >
      Confiança {pct}%
    </span>
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
