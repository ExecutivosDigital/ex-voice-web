"use client";

import { useMediaRecorder } from "@/components/audio-recorder/use-media-recorder";
import { useRecordingUpload } from "@/components/audio-recorder/use-recording-upload";
import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { handleApiError } from "@/utils/error-handler";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Loader2,
  Mic,
  MonitorUp,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Square,
  Volume2,
  Video,
  X,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

type Mode = "presencial" | "online";
type Stage = "intro" | "recording" | "saveForm" | "saving";

interface ImmersiveRecorderProps {
  mode: Mode;
  onClose: () => void;
  preSelectedClientIds?: string[];
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

type BrowserInfo = {
  name: string;
  tabLabel: string;
  supportsTabAudio: boolean;
};

function detectBrowser(): BrowserInfo {
  if (typeof navigator === "undefined") {
    return {
      name: "Chrome",
      tabLabel: "Aba do Chrome",
      supportsTabAudio: true,
    };
  }
  const ua = navigator.userAgent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const brave = (navigator as any).brave;
  if (brave && typeof brave.isBrave === "function") {
    return {
      name: "Brave",
      tabLabel: "Aba do Brave",
      supportsTabAudio: true,
    };
  }
  if (/Edg\//i.test(ua)) {
    return {
      name: "Edge",
      tabLabel: "Aba do Edge",
      supportsTabAudio: true,
    };
  }
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    return {
      name: "Opera",
      tabLabel: "Aba do Opera",
      supportsTabAudio: true,
    };
  }
  if (/Firefox\//i.test(ua)) {
    return {
      name: "Firefox",
      tabLabel: "Janela do Firefox",
      supportsTabAudio: false,
    };
  }
  if (
    /Safari\//i.test(ua) &&
    !/Chrome\//i.test(ua) &&
    !/Chromium\//i.test(ua)
  ) {
    return {
      name: "Safari",
      tabLabel: "Janela do Safari",
      supportsTabAudio: false,
    };
  }
  if (/Chrome\//i.test(ua) || /Chromium\//i.test(ua)) {
    return {
      name: "Chrome",
      tabLabel: "Aba do Chrome",
      supportsTabAudio: true,
    };
  }
  return {
    name: "seu navegador",
    tabLabel: "Aba do navegador",
    supportsTabAudio: true,
  };
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

export function ImmersiveRecorder({
  mode,
  onClose,
  preSelectedClientIds,
}: ImmersiveRecorderProps) {
  const router = useRouter();
  const { PostAPI } = useApiContext();
  const { handleGetAvailableRecording } = useSession();
  const { GetRecordings, GetClients, clients, setClients } = useGeneralContext();
  const { uploadMedia, formatDurationForAPI } = useRecordingUpload();

  const mediaType: "audio" | "video" = mode === "online" ? "video" : "audio";

  const [stage, setStage] = useState<Stage>("intro");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>({
    name: "Chrome",
    tabLabel: "Aba do Chrome",
    supportsTabAudio: true,
  });

  const [title, setTitle] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(
    preSelectedClientIds ?? [],
  );
  const [contactSearch, setContactSearch] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [creatingContact, setCreatingContact] = useState(false);
  const [pendingClientName, setPendingClientName] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!pendingClientName) return;
    const found = clients.find(
      (c) =>
        c.name?.trim().toLowerCase() === pendingClientName.trim().toLowerCase(),
    );
    if (found?.id) {
      setSelectedContactIds((prev) =>
        prev.includes(found.id) ? prev : [...prev, found.id],
      );
      setPendingClientName(null);
    }
  }, [clients, pendingClientName]);

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
    setBrowserInfo(detectBrowser());
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

  const buildDefaultTitle = useCallback(
    () =>
      `Gravação ${mode === "online" ? "online" : "presencial"} - ${moment().format("DD/MM HH:mm")}`,
    [mode],
  );

  const handleSave = useCallback(
    async (
      blob: Blob,
      duration: number,
      overrides?: { title?: string; clientIds?: string[] },
    ) => {
      try {
        setStage("saving");
        const audioUrl = await uploadMedia(blob, mediaType);
        const when = moment().format("DD/MM/YYYY HH:mm");
        const finalTitle = overrides?.title?.trim() || buildDefaultTitle();
        const primaryClientId = overrides?.clientIds?.[0];
        const payload = {
          name: finalTitle,
          description: `Gravação ${mode} realizada em ${when}`,
          duration: formatDurationForAPI(duration),
          seconds: duration,
          audioUrl,
          type: primaryClientId ? "CLIENT" : "OTHER",
          ...(primaryClientId ? { clientId: primaryClientId } : {}),
        };
        const response = await PostAPI("/recording", payload, true);
        if (response?.status >= 400) {
          throw new Error("Não foi possível salvar a gravação.");
        }
        toast.success("Gravação salva!");
        GetRecordings();
        handleGetAvailableRecording();
        recorder.resetRecording();
        router.push("/recordings");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro ao salvar gravação. Tente novamente.";
        setError(message);
        toast.error(message);
        setStage("saveForm");
      }
    },
    [
      PostAPI,
      GetRecordings,
      buildDefaultTitle,
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
    if (stage === "recording" && recorder.mediaBlob && !recorder.isRecording) {
      setTitle((current) => current || buildDefaultTitle());
      setStage("saveForm");
    }
  }, [stage, recorder.mediaBlob, recorder.isRecording, buildDefaultTitle]);

  const filteredContacts = useMemo(() => {
    const query = contactSearch.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(query));
  }, [clients, contactSearch]);

  const toggleContact = useCallback((id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleQuickCreateContact = useCallback(async () => {
    const name = newContactName.trim();
    if (name.length < 2) {
      toast.error("Nome muito curto. Mínimo 2 caracteres.");
      return;
    }
    setCreatingContact(true);
    try {
      const data = await PostAPI("/client", { name }, true);
      if (data?.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawClient = (data.body?.client || data.body) as any;
        const newId = rawClient?.id || rawClient?._id;
        if (newId) {
          const newClient = { ...rawClient, id: newId, name };
          setClients((prev) =>
            prev.some((c) => c.id === newId) ? prev : [newClient, ...prev],
          );
          setSelectedContactIds((prev) =>
            prev.includes(newId) ? prev : [...prev, newId],
          );
        }
        setPendingClientName(name);
        setNewContactName("");
        toast.success(`${name} adicionado.`);
        await GetClients();
      } else {
        toast.error(handleApiError(data, "Falha ao criar contato."));
      }
    } finally {
      setCreatingContact(false);
    }
  }, [PostAPI, newContactName, setClients, GetClients]);

  const handleConfirmSave = useCallback(() => {
    if (!recorder.mediaBlob) {
      toast.error("Gravação indisponível.");
      return;
    }
    if (!title.trim()) {
      toast.error("Informe um título.");
      return;
    }
    handleSave(recorder.mediaBlob, recorder.duration, {
      title,
      clientIds: selectedContactIds,
    });
  }, [
    recorder.mediaBlob,
    recorder.duration,
    title,
    selectedContactIds,
    handleSave,
  ]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "fixed inset-0 z-[99999] overflow-hidden bg-gradient-to-br text-white",
        copy.bgGradient,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-2.5 opacity-90 md:top-6 md:left-6">
        <Image
          src="/logos/logo2.png"
          alt="Executivos"
          width={280}
          height={112}
          priority
          className="h-6 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] md:h-8"
        />
      </div>

      {stage !== "saveForm" && (
        <button
          onClick={handleCancel}
          disabled={stage === "saving"}
          className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition hover:bg-white/20 disabled:opacity-40 md:top-6 md:right-6"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      )}

      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain">
        <div className="flex min-h-full w-full flex-col px-4 pt-16 pb-[max(env(safe-area-inset-bottom),1rem)] md:px-6 md:pt-20 md:pb-6">
          <div
            className={cn(
              "relative z-10 mx-auto my-auto flex w-full flex-col items-center text-center",
              stage === "saveForm"
                ? "max-w-6xl"
                : stage === "intro" && mode === "online"
                  ? "max-w-[1400px]"
                  : "max-w-2xl",
            )}
          >
            <AnimatePresence mode="wait">
          {stage === "intro" && mode === "presencial" && (
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

          {stage === "intro" && mode === "online" && (
            <motion.div
              key="intro-online"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full text-left"
            >
              <div className="grid w-full items-stretch gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] md:gap-6">
                <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-5 md:p-7">
                  <div
                    className={cn(
                      "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 backdrop-blur-md",
                      copy.ring,
                    )}
                  >
                    <Icon size={30} className="text-white" />
                  </div>

                  <p className="text-xs font-medium tracking-[0.3em] text-white/60 uppercase">
                    {copy.label}
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
                    {copy.emphasis}
                  </h1>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                    Siga o passo a passo ao lado. Ao clicar em iniciar, o
                    navegador vai pedir para você escolher a aba da reunião.
                  </p>

                  {error && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-100">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleStart}
                    className="group relative mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_0_0_0_rgba(255,255,255,0.6)] transition hover:scale-105 hover:shadow-[0_0_0_18px_rgba(255,255,255,0.08)]"
                    aria-label="Iniciar gravação"
                  >
                    <span className="absolute inset-0 rounded-full bg-white/20 blur-xl transition group-hover:bg-white/30" />
                    <Play
                      size={26}
                      className="relative ml-1 fill-gray-900 text-gray-900"
                    />
                  </button>
                  <p className="mt-3 text-[10px] tracking-widest text-white/40 uppercase">
                    Toque para iniciar
                  </p>
                </div>

                <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-5 md:p-6">
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold tracking-[0.3em] text-white/50 uppercase">
                      Como compartilhar a reunião
                    </p>
                    <h2 className="mt-1 text-lg font-semibold md:text-xl">
                      Passo a passo rápido
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">
                      Leve menos de 30 segundos. Faça na ordem para capturar o
                      áudio da reunião corretamente.
                    </p>
                  </div>

                  <ol className="flex flex-col gap-2">
                    <li className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-900">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          Abra a reunião em outra aba
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-white/60">
                          Deixe a aba do Google Meet, Zoom ou Teams já aberta
                          antes de iniciar.
                        </p>
                      </div>
                    </li>

                    <li className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-900">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="flex items-center gap-2 text-sm font-semibold text-white">
                          <Play size={13} className="text-emerald-300" />
                          Clique em &quot;Iniciar&quot; aqui ao lado
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-white/60">
                          O navegador vai abrir uma janela pedindo o que você
                          quer compartilhar.
                        </p>
                      </div>
                    </li>

                    <li className="flex gap-3 rounded-xl border border-emerald-300/25 bg-emerald-300/[0.04] p-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-300 text-xs font-bold text-gray-900">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="flex items-center gap-2 text-sm font-semibold text-white">
                          <MonitorUp size={13} className="text-emerald-300" />
                          Escolha a opção &quot;{browserInfo.tabLabel}&quot;
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-white/70">
                          Selecione{" "}
                          <span className="font-semibold text-white">
                            {browserInfo.tabLabel}
                          </span>{" "}
                          (não &quot;Janela&quot; nem &quot;Tela inteira&quot;)
                          e clique na aba da reunião.
                        </p>
                      </div>
                    </li>

                    <li className="flex gap-3 rounded-xl border border-emerald-300/25 bg-emerald-300/[0.04] p-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-300 text-xs font-bold text-gray-900">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="flex items-center gap-2 text-sm font-semibold text-white">
                          <Volume2 size={13} className="text-emerald-300" />
                          Ative &quot;Compartilhar áudio da aba&quot;
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-white/70">
                          Marque a caixinha{" "}
                          <span className="font-semibold text-white">
                            Compartilhar áudio da aba
                          </span>
                          . Sem isso, o áudio não será capturado.
                        </p>
                      </div>
                    </li>

                    <li className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-900">
                        5
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          Clique em &quot;Compartilhar&quot;
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-white/60">
                          A gravação começa automaticamente. Ao final, volte
                          aqui e clique em parar.
                        </p>
                      </div>
                    </li>
                  </ol>

                  {browserInfo.supportsTabAudio ? (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-2 text-[11px] leading-snug text-emerald-100/90">
                      <CheckCircle2
                        size={13}
                        className="mt-0.5 flex-shrink-0 text-emerald-300"
                      />
                      <span>
                        Detectamos que você está usando{" "}
                        <span className="font-semibold">
                          {browserInfo.name}
                        </span>
                        . O passo a passo acima é o que você vai ver na tela.
                      </span>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300/25 bg-amber-300/[0.08] px-3 py-2 text-[11px] leading-snug text-amber-100/90">
                      <AlertCircle
                        size={13}
                        className="mt-0.5 flex-shrink-0 text-amber-300"
                      />
                      <span>
                        <span className="font-semibold">
                          {browserInfo.name} não suporta captura de áudio da
                          aba.
                        </span>{" "}
                        Abra esta página no Google Chrome, Edge, Brave ou Opera.
                      </span>
                    </div>
                  )}
                </div>
              </div>
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
                <span className="font-mono text-7xl font-bold tracking-tight tabular-nums md:text-8xl">
                  {formatTime(recorder.duration)}
                </span>
                <p className="mt-2 text-sm text-white/50">
                  {mode === "online" ? "Áudio da aba + microfone" : "Microfone"}
                </p>
              </div>

              <div className="mt-10 w-full max-w-lg overflow-hidden">
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
                  <Square
                    size={26}
                    className="relative fill-white text-white"
                  />
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

          {stage === "saveForm" && (
            <motion.div
              key="saveForm"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="w-full text-left"
            >
              <div className="grid w-full items-stretch gap-4 sm:gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-8">
                <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-6 md:p-8">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.3em] text-white/50 uppercase">
                        Gravação concluída
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold md:text-3xl">
                        Salvar gravação
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                      <CheckCircle2 size={14} className="text-emerald-300" />
                      {formatTime(recorder.duration)}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/60 uppercase">
                      Título
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Dê um nome para essa gravação"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition placeholder:text-white/30 focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/10 focus:outline-none"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 flex items-center justify-between text-[10px] font-semibold tracking-[0.18em] text-white/60 uppercase">
                      <span>
                        Contatos
                        {selectedContactIds.length > 0 &&
                          ` (${selectedContactIds.length})`}
                      </span>
                      <span className="text-[10px] tracking-normal text-white/40 normal-case">
                        Selecione um ou mais
                      </span>
                    </label>

                    {selectedContactIds.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {selectedContactIds.map((id) => {
                          const c = clients.find((x) => x.id === id);
                          if (!c) return null;
                          return (
                            <span
                              key={id}
                              className="flex max-w-full items-center gap-1.5 rounded-full bg-emerald-300/15 py-1 pr-1.5 pl-3 text-xs font-medium text-emerald-100 ring-1 ring-emerald-300/30"
                            >
                              <span className="truncate">{c.name}</span>
                              <button
                                type="button"
                                onClick={() => toggleContact(id)}
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-emerald-100/70 transition hover:bg-emerald-300/20 hover:text-white"
                                aria-label={`Remover ${c.name}`}
                              >
                                <X size={11} />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="rounded-xl border border-white/10 bg-white/5">
                      <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
                        <Search size={14} className="text-white/40" />
                        <input
                          type="text"
                          value={contactSearch}
                          onChange={(e) => setContactSearch(e.target.value)}
                          placeholder="Buscar contato"
                          className="w-full min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                        />
                      </div>
                      <div className="max-h-44 overflow-y-auto p-1">
                        {filteredContacts.length === 0 ? (
                          <p className="px-3 py-6 text-center text-xs text-white/40">
                            {contactSearch
                              ? "Nenhum contato encontrado."
                              : "Nenhum contato cadastrado ainda."}
                          </p>
                        ) : (
                          filteredContacts.map((c) => {
                            const checked = selectedContactIds.includes(c.id);
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => toggleContact(c.id)}
                                className={cn(
                                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/10",
                                  checked && "bg-white/10 text-white",
                                )}
                              >
                                <span className="flex min-w-0 items-center gap-2">
                                  <span
                                    className={cn(
                                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
                                      checked
                                        ? "border-emerald-300 bg-emerald-300/20"
                                        : "border-white/20 bg-transparent",
                                    )}
                                  >
                                    {checked && (
                                      <Check
                                        size={11}
                                        className="text-emerald-300"
                                        strokeWidth={3}
                                      />
                                    )}
                                  </span>
                                  <span className="truncate">{c.name}</span>
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleQuickCreateContact();
                          }
                        }}
                        placeholder="Cadastrar novo contato"
                        className="w-full min-w-0 flex-1 rounded-xl border border-dashed border-white/15 bg-transparent px-4 py-2.5 text-sm text-white transition placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleQuickCreateContact}
                        disabled={
                          creatingContact || newContactName.trim().length < 2
                        }
                        className={cn(
                          "flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition",
                          newContactName.trim().length >= 2 && !creatingContact
                            ? "bg-white text-gray-900 shadow-[0_4px_18px_-6px_rgba(255,255,255,0.6)] hover:bg-gray-100"
                            : "cursor-not-allowed bg-white/10 text-white/50",
                        )}
                      >
                        {creatingContact ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Plus size={14} />
                        )}
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="mt-auto pt-6">
                    {selectedContactIds.length === 0 && (
                      <p className="mb-3 flex items-center gap-1.5 text-xs text-white/45">
                        <AlertCircle size={12} />
                        Selecione pelo menos um contato para salvar.
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                      >
                        Descartar
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmSave}
                        disabled={
                          !title.trim() || selectedContactIds.length === 0
                        }
                        className={cn(
                          "flex flex-[1.4] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition",
                          title.trim() && selectedContactIds.length > 0
                            ? "bg-white text-gray-900 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.55)] hover:bg-gray-100"
                            : "cursor-not-allowed bg-white/10 text-white/50",
                        )}
                      >
                        <Send size={16} />
                        Salvar gravação
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.3em] text-white/50 uppercase">
                      Pré-visualização
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
                      Revise antes de salvar
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                      {mediaType === "video"
                        ? "Reproduza o vídeo para confirmar que a aba e o áudio ficaram nítidos. Se algo não estiver bom, descarte e grave novamente."
                        : "Reproduza o áudio para confirmar que o microfone capturou tudo com clareza. Se algo não estiver bom, descarte e grave novamente."}
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md">
                    {mediaType === "video" && recorder.mediaUrl ? (
                      <video
                        src={recorder.mediaUrl}
                        controls
                        playsInline
                        className="aspect-video w-full bg-black"
                      />
                    ) : recorder.mediaUrl ? (
                      <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] py-12">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                            <Mic size={28} className="text-white/80" />
                          </div>
                          <p className="mt-4 text-xs tracking-[0.25em] text-white/45 uppercase">
                            Áudio capturado
                          </p>
                        </div>
                        <audio
                          src={recorder.mediaUrl}
                          controls
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center text-sm text-white/40">
                        Pré-visualização indisponível.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                      <CheckCircle2 size={14} className="text-emerald-300" />
                      Duração: {formatTime(recorder.duration)}
                    </span>
                    <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                      {mediaType === "video" ? (
                        <Video size={13} className="text-white/60" />
                      ) : (
                        <Mic size={13} className="text-white/60" />
                      )}
                      {mediaType === "video" ? "Vídeo + áudio" : "Apenas áudio"}
                    </span>
                  </div>
                </div>
              </div>
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
        </div>
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
