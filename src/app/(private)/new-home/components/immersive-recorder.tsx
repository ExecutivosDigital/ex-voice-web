"use client";

import { useMediaRecorder } from "@/components/audio-recorder/use-media-recorder";
import { useRecordingUpload } from "@/components/audio-recorder/use-recording-upload";
import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mic,
  Pause,
  Play,
  Square,
  Video,
  X,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

type Mode = "presencial" | "online";
type Stage = "intro" | "recording" | "saving";

interface ImmersiveRecorderProps {
  mode: Mode;
  onClose: () => void;
}

const INTRO_COUNTDOWN_SECONDS = 0;

const MODE_COPY: Record<
  Mode,
  {
    label: string;
    emphasis: string;
    hint: string;
    icon: typeof Mic;
    bgGradient: string;
    ring: string;
  }
> = {
  presencial: {
    label: "Gravação presencial",
    emphasis: "Microfone pronto.",
    hint: "Fale naturalmente. Vamos capturar a conversa para você.",
    icon: Mic,
    bgGradient: "from-[#0b0c10] via-[#131519] to-[#1e2026]",
    ring: "ring-white/10",
  },
  online: {
    label: "Gravação online",
    emphasis: "Compartilhe a aba da reunião.",
    hint: 'Selecione a aba do Meet/Zoom e marque "Compartilhar áudio da aba".',
    icon: Video,
    bgGradient: "from-[#0b1020] via-[#131a33] to-[#1d2447]",
    ring: "ring-white/10",
  },
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function Waveform({ active }: { active: boolean }) {
  const bars = useMemo(() => Array.from({ length: 56 }), []);
  return (
    <div className="flex h-16 items-center justify-center gap-[3px]">
      {bars.map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-full bg-gradient-to-t from-white/40 to-white",
            active ? "animate-[wave_1.2s_ease-in-out_infinite]" : "h-1",
          )}
          style={
            active
              ? {
                  animationDelay: `${(i % 14) * 70}ms`,
                  height: `${20 + ((i * 13) % 40)}%`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}

export function ImmersiveRecorder({ mode, onClose }: ImmersiveRecorderProps) {
  const router = useRouter();
  const { PostAPI } = useApiContext();
  const { handleGetAvailableRecording } = useSession();
  const { GetRecordings } = useGeneralContext();
  const { uploadMedia, formatDurationForAPI } = useRecordingUpload();

  const mediaType: "audio" | "video" = mode === "online" ? "video" : "audio";

  const [stage, setStage] = useState<Stage>("intro");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const recorder = useMediaRecorder({
    mediaType,
    onError: (err) => {
      const msg =
        err.name === "NotAllowedError"
          ? mode === "online"
            ? "Permissão negada. Autorize o compartilhamento da tela."
            : "Permissão negada. Autorize o acesso ao microfone."
          : err.message || "Não foi possível iniciar a gravação.";
      setError(msg);
      setStage("intro");
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const copy = MODE_COPY[mode];
  const Icon = copy.icon;

  const handleStart = useCallback(async () => {
    setError(null);
    try {
      if (INTRO_COUNTDOWN_SECONDS > 0) {
        // reserved for future countdown; no-op today
      }
      await recorder.startRecording();
      setStage("recording");
    } catch {
      // error already handled in onError
    }
  }, [recorder]);

  const handleStop = useCallback(() => {
    recorder.stopRecording();
  }, [recorder]);

  const handleCancel = useCallback(() => {
    if (recorder.isRecording) {
      recorder.stopRecording();
    }
    recorder.resetRecording();
    onClose();
  }, [recorder, onClose]);

  const handleSave = useCallback(
    async (blob: Blob, duration: number) => {
      try {
        setStage("saving");
        const audioUrl = await uploadMedia(blob, mediaType);
        const when = moment().format("DD/MM/YYYY HH:mm");
        const payload = {
          name: `Gravação ${mode} - ${moment().format("DD/MM HH:mm")}`,
          description: `Gravação ${mode} realizada em ${when}`,
          duration: formatDurationForAPI(duration),
          seconds: duration,
          audioUrl,
          type: "OTHER",
        };
        const response = await PostAPI("/recording", payload, true);
        if (response?.status >= 400) {
          throw new Error("Não foi possível salvar a gravação.");
        }
        toast.success("Gravação salva!");
        GetRecordings();
        handleGetAvailableRecording();
        recorder.resetRecording();
        router.push("/new-home/recordings");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao salvar gravação. Tente novamente.";
        setError(message);
        toast.error(message);
        setStage("intro");
      }
    },
    [
      PostAPI,
      GetRecordings,
      formatDurationForAPI,
      handleGetAvailableRecording,
      mediaType,
      mode,
      recorder,
      router,
      uploadMedia,
    ],
  );

  useEffect(() => {
    if (
      stage === "recording" &&
      recorder.mediaBlob &&
      !recorder.isRecording
    ) {
      handleSave(recorder.mediaBlob, recorder.duration);
    }
  }, [stage, recorder.mediaBlob, recorder.isRecording, recorder.duration, handleSave]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-gradient-to-br text-white",
        copy.bgGradient,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <button
        onClick={handleCancel}
        disabled={stage === "saving"}
        className="absolute top-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition hover:bg-white/20 disabled:opacity-40"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div
                className={cn(
                  "mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 backdrop-blur-md",
                  copy.ring,
                )}
              >
                <Icon size={36} className="text-white" />
              </div>

              <p className="text-sm font-medium tracking-[0.3em] text-white/60 uppercase">
                {copy.label}
              </p>
              <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
                {copy.emphasis}
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                {copy.hint}
              </p>

              {error && (
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <button
                onClick={handleStart}
                className="group relative mt-10 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_0_0_0_rgba(255,255,255,0.6)] transition hover:scale-105 hover:shadow-[0_0_0_18px_rgba(255,255,255,0.08)]"
                aria-label="Iniciar gravação"
              >
                <span className="absolute inset-0 rounded-full bg-white/20 blur-xl transition group-hover:bg-white/30" />
                <Play
                  size={30}
                  className="relative ml-1 fill-gray-900 text-gray-900"
                />
              </button>
              <p className="mt-6 text-xs tracking-widest text-white/40 uppercase">
                Toque para iniciar
              </p>
            </motion.div>
          )}

          {stage === "recording" && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
                <span className="text-xs font-semibold tracking-[0.3em] text-white/80 uppercase">
                  Gravando
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-mono text-7xl font-bold tabular-nums tracking-tight md:text-8xl">
                  {formatTime(recorder.duration)}
                </span>
                <p className="mt-2 text-sm text-white/50">
                  {mode === "online" ? "Áudio da aba + microfone" : "Microfone"}
                </p>
              </div>

              <div className="mt-10 w-full max-w-lg">
                <Waveform active={!recorder.isPaused} />
              </div>

              <div className="mt-10 flex items-center gap-5">
                <button
                  onClick={() =>
                    recorder.isPaused
                      ? recorder.resumeRecording()
                      : recorder.pauseRecording()
                  }
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                  aria-label={recorder.isPaused ? "Continuar" : "Pausar"}
                >
                  {recorder.isPaused ? (
                    <Play size={22} className="ml-0.5" />
                  ) : (
                    <Pause size={22} />
                  )}
                </button>

                <button
                  onClick={handleStop}
                  className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-[0_0_0_0_rgba(248,113,113,0.5)] transition hover:scale-105 hover:bg-red-600 hover:shadow-[0_0_0_16px_rgba(248,113,113,0.15)]"
                  aria-label="Parar gravação"
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
                  <Square size={26} className="relative fill-white text-white" />
                </button>

                <button
                  onClick={handleCancel}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                  aria-label="Cancelar"
                >
                  <X size={22} />
                </button>
              </div>

              <p className="mt-8 text-xs tracking-widest text-white/40 uppercase">
                Toque no quadrado vermelho para finalizar
              </p>
            </motion.div>
          )}

          {stage === "saving" && (
            <motion.div
              key="saving"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 animate-ping rounded-full bg-white/10" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
                  <Loader2 size={32} className="animate-spin text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                Enviando sua gravação
              </h2>
              <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-white/60">
                Estamos processando o áudio e preparando a transcrição. Em
                instantes você verá em Últimas Gravações.
              </p>

              <div className="mt-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                <CheckCircle2 size={14} className="text-emerald-300" />
                Duração capturada: {formatTime(recorder.duration)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.45);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </motion.div>,
    document.body,
  );
}
