"use client";

import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { useGeneralContext } from "@/context/GeneralContext";
import { useRecordingUpload } from "@/components/audio-recorder/use-recording-upload";
import { cn } from "@/utils/cn";
import { handleApiError } from "@/utils/error-handler";
import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash.debounce";
import {
  AlertCircle,
  Check,
  FileAudio,
  FileVideo,
  Loader2,
  Plus,
  Search,
  Send,
  Trash2,
  Upload,
  UploadCloud,
  X,
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

type DetectedMode = "presencial" | "online";

interface PickedFile {
  file: File;
  mode: DetectedMode;
  mediaType: "audio" | "video";
  duration: number;
  previewUrl: string;
}

function detectMode(file: File): {
  mode: DetectedMode;
  mediaType: "audio" | "video";
} {
  if (file.type.startsWith("video/")) {
    return { mode: "online", mediaType: "video" };
  }
  return { mode: "presencial", mediaType: "audio" };
}

async function readMediaDuration(
  file: File,
  mediaType: "audio" | "video",
): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement(mediaType);
    el.preload = "metadata";
    const cleanup = () => URL.revokeObjectURL(url);
    el.onloadedmetadata = () => {
      const secs = Number.isFinite(el.duration) ? Math.round(el.duration) : 0;
      cleanup();
      resolve(secs);
    };
    el.onerror = () => {
      cleanup();
      resolve(0);
    };
    el.src = url;
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDurationLabel(seconds: number) {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function UploadRecordingCta() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        whileTap={{ scale: 0.995 }}
        aria-label="Subir gravação já feita"
        className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white/60 px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-white hover:shadow-sm focus-visible:ring-4 focus-visible:ring-gray-900/15 focus-visible:outline-none"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-900 group-hover:text-white">
          <Upload size={16} strokeWidth={2} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-semibold text-gray-900">
            Subir gravação já feita
          </span>
          <span className="truncate text-xs text-gray-500">
            Envie um áudio ou vídeo do seu dispositivo
          </span>
        </span>
        <span className="hidden shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-gray-600 uppercase sm:inline-flex">
          upload
        </span>
      </motion.button>

      <AnimatePresence>
        {open && <UploadDialog onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function UploadDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { PostAPI, GetAPI } = useApiContext();
  const { handleGetAvailableRecording } = useSession();
  const {
    GetRecordings,
    clients,
    setClients,
    clientsFilters,
    setClientsFilters,
    clientsTotalPages,
    isGettingClients,
  } = useGeneralContext();
  const { uploadMedia, formatDurationForAPI } = useRecordingUpload();

  const [mounted, setMounted] = useState(false);
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [creatingContact, setCreatingContact] = useState(false);
  const [pendingClientName, setPendingClientName] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loadedPage, setLoadedPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, isSaving]);

  useEffect(() => {
    setContactSearch("");
    setLoadedPage(1);
    setClientsFilters({ page: 1 });
    return () => {
      setClientsFilters({ page: 1 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    return () => {
      if (picked?.previewUrl) URL.revokeObjectURL(picked.previewUrl);
    };
  }, [picked?.previewUrl]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setLoadedPage(1);
        setClientsFilters((prev) => ({
          ...prev,
          query: value || undefined,
          page: 1,
        }));
      }, 500),
    [setClientsFilters],
  );

  const handleContactSearchChange = useCallback(
    (value: string) => {
      setContactSearch(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleLoadMoreContacts = useCallback(async () => {
    const nextPage = loadedPage + 1;
    setIsLoadingMore(true);
    try {
      const params = new URLSearchParams();
      params.append("page", nextPage.toString());
      const currentQuery = clientsFilters.query?.trim();
      if (currentQuery) params.append("query", currentQuery);
      const response = await GetAPI(`/client?${params.toString()}`, true);
      if (response?.status === 200) {
        const newClients = response.body?.clients || [];
        setClients((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const merged = newClients.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (c: any) => c?.id && !existingIds.has(c.id),
          );
          return [...prev, ...merged];
        });
        setLoadedPage(nextPage);
      } else {
        toast.error(
          handleApiError(response, "Não foi possível carregar mais contatos."),
        );
      }
    } catch {
      toast.error("Erro ao carregar mais contatos.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [GetAPI, clientsFilters.query, loadedPage, setClients]);

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
        setContactSearch("");
        toast.success(`${name} adicionado.`);
        setLoadedPage(1);
        setClientsFilters({ page: 1, query: undefined });
      } else {
        toast.error(handleApiError(data, "Falha ao criar contato."));
      }
    } finally {
      setCreatingContact(false);
    }
  }, [PostAPI, newContactName, setClients, setClientsFilters]);

  const buildDefaultTitle = useCallback(
    (mode: DetectedMode) =>
      `Gravação ${mode} - ${moment().format("DD/MM HH:mm")}`,
    [],
  );

  const acceptFile = useCallback(
    async (file: File) => {
      setError(null);
      const isAudio = file.type.startsWith("audio/");
      const isVideo = file.type.startsWith("video/");
      if (!isAudio && !isVideo) {
        setError("Arquivo não suportado. Envie um áudio ou vídeo.");
        return;
      }
      setLoadingFile(true);
      const { mode, mediaType } = detectMode(file);
      const duration = await readMediaDuration(file, mediaType);
      const previewUrl = URL.createObjectURL(file);
      setPicked({ file, mode, mediaType, duration, previewUrl });
      setTitle((current) => current || buildDefaultTitle(mode));
      setLoadingFile(false);
    },
    [buildDefaultTitle],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) acceptFile(file);
  };

  const removeFile = () => {
    if (picked?.previewUrl) URL.revokeObjectURL(picked.previewUrl);
    setPicked(null);
    setTitle("");
  };

  const handleConfirm = useCallback(async () => {
    if (!picked) {
      toast.error("Escolha um arquivo primeiro.");
      return;
    }
    if (!title.trim()) {
      toast.error("Informe um título.");
      return;
    }
    if (selectedContactIds.length === 0) {
      toast.error("Selecione pelo menos um contato.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const audioUrl = await uploadMedia(picked.file, picked.mediaType);
      const when = moment().format("DD/MM/YYYY HH:mm");
      const primaryClientId = selectedContactIds[0];
      const payload = {
        name: title.trim(),
        description: `Gravação ${picked.mode} (upload) realizada em ${when}`,
        duration: formatDurationForAPI(picked.duration),
        seconds: picked.duration,
        audioUrl,
        type: primaryClientId ? "CLIENT" : "OTHER",
        ...(primaryClientId ? { clientId: primaryClientId } : {}),
      };
      const response = await PostAPI("/recording", payload, true);
      if (response?.status >= 400) {
        throw new Error("Não foi possível salvar a gravação.");
      }
      toast.success("Gravação enviada!");
      GetRecordings();
      handleGetAvailableRecording();
      onClose();
      router.push("/recordings");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao enviar. Tente novamente.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [
    picked,
    title,
    selectedContactIds,
    uploadMedia,
    formatDurationForAPI,
    PostAPI,
    GetRecordings,
    handleGetAvailableRecording,
    onClose,
    router,
  ]);

  if (!mounted) return null;

  const canSubmit =
    !!picked && !!title.trim() && selectedContactIds.length > 0 && !isSaving;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: "100dvh" }}
      className="fixed inset-x-0 top-0 z-[99999] flex items-end justify-center overflow-hidden bg-black/55 backdrop-blur-md sm:items-center sm:p-6"
      onClick={() => !isSaving && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[100dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.55)] sm:max-h-[90dvh] sm:rounded-3xl"
      >
        <div className="flex-shrink-0 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-sm">
                <UploadCloud size={18} strokeWidth={2} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Subir gravação
                </h2>
                <p className="text-xs text-gray-500">
                  Envie um áudio ou vídeo e anexe a um contato
                </p>
              </div>
            </div>
            <button
              onClick={() => !isSaving && onClose()}
              disabled={isSaving}
              aria-label="Fechar"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6"
          data-lenis-prevent
        >
          {!picked ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition",
                isDragging
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50",
              )}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                {loadingFile ? (
                  <Loader2
                    size={22}
                    className="animate-spin text-gray-600"
                    strokeWidth={2}
                  />
                ) : (
                  <UploadCloud
                    size={22}
                    className="text-gray-700"
                    strokeWidth={2}
                  />
                )}
              </span>
              <p className="mt-4 text-sm font-semibold text-gray-900">
                {loadingFile
                  ? "Lendo arquivo..."
                  : "Arraste um arquivo ou clique para escolher"}
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-500">
                Áudio salva como{" "}
                <span className="font-semibold text-gray-700">presencial</span>.
                Vídeo salva como{" "}
                <span className="font-semibold text-gray-700">online</span>.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-gray-600 uppercase ring-1 ring-gray-200">
                  <FileAudio size={10} /> mp3 · wav · m4a
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-gray-600 uppercase ring-1 ring-gray-200">
                  <FileVideo size={10} /> mp4 · webm · mov
                </span>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="audio/*,video/*"
                className="hidden"
                onChange={onInputChange}
              />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/80 p-3">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
                    picked.mediaType === "video"
                      ? "bg-gradient-to-br from-indigo-600 to-indigo-500"
                      : "bg-gradient-to-br from-gray-900 to-gray-700",
                  )}
                >
                  {picked.mediaType === "video" ? (
                    <FileVideo size={18} strokeWidth={2} />
                  ) : (
                    <FileAudio size={18} strokeWidth={2} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {picked.file.name}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-500">
                    <span>{formatBytes(picked.file.size)}</span>
                    <span className="text-gray-300">·</span>
                    <span>{formatDurationLabel(picked.duration)}</span>
                    <span className="text-gray-300">·</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.18em] uppercase",
                        picked.mode === "online"
                          ? "bg-indigo-50 text-indigo-700"
                          : "bg-emerald-50 text-emerald-700",
                      )}
                    >
                      {picked.mode}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={isSaving}
                  aria-label="Remover arquivo"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-white hover:text-red-500 disabled:opacity-40"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold tracking-[0.18em] text-gray-500 uppercase">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Dê um nome para essa gravação"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center justify-between text-[10px] font-semibold tracking-[0.18em] text-gray-500 uppercase">
                  <span>
                    Contato
                    {selectedContactIds.length > 0 &&
                      ` (${selectedContactIds.length})`}
                  </span>
                  <span className="text-[10px] tracking-normal text-gray-400 normal-case">
                    Selecione pelo menos um
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
                          className="flex max-w-full items-center gap-1.5 rounded-full bg-emerald-50 py-1 pr-1.5 pl-3 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200"
                        >
                          <span className="truncate">{c.name}</span>
                          <button
                            type="button"
                            onClick={() => toggleContact(id)}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-emerald-700/70 transition hover:bg-emerald-100 hover:text-emerald-900"
                            aria-label={`Remover ${c.name}`}
                          >
                            <X size={11} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
                    <Search size={14} className="text-gray-400" />
                    <input
                      type="text"
                      value={contactSearch}
                      onChange={(e) =>
                        handleContactSearchChange(e.target.value)
                      }
                      placeholder="Buscar contato"
                      className="w-full min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    />
                    {isGettingClients && (
                      <Loader2
                        size={14}
                        className="animate-spin text-gray-400"
                      />
                    )}
                  </div>
                  <div className="max-h-40 overflow-y-auto p-1">
                    {isGettingClients && clients.length === 0 ? (
                      <div className="flex items-center justify-center px-3 py-6 text-xs text-gray-400">
                        <Loader2 size={14} className="mr-2 animate-spin" />
                        Buscando contatos...
                      </div>
                    ) : clients.length === 0 ? (
                      <p className="px-3 py-6 text-center text-xs text-gray-400">
                        {contactSearch
                          ? "Nenhum contato encontrado."
                          : "Nenhum contato cadastrado ainda."}
                      </p>
                    ) : (
                      <>
                        {clients.map((c) => {
                          const checked = selectedContactIds.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => toggleContact(c.id)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50",
                                checked && "bg-gray-50 text-gray-900",
                              )}
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <span
                                  className={cn(
                                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
                                    checked
                                      ? "border-emerald-500 bg-emerald-50"
                                      : "border-gray-300 bg-white",
                                  )}
                                >
                                  {checked && (
                                    <Check
                                      size={11}
                                      className="text-emerald-600"
                                      strokeWidth={3}
                                    />
                                  )}
                                </span>
                                <span className="truncate">{c.name}</span>
                              </span>
                            </button>
                          );
                        })}
                        {loadedPage < clientsTotalPages && (
                          <button
                            type="button"
                            onClick={handleLoadMoreContacts}
                            disabled={isLoadingMore}
                            className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-60"
                          >
                            {isLoadingMore ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />
                                Carregando...
                              </>
                            ) : (
                              <>Carregar mais</>
                            )}
                          </button>
                        )}
                      </>
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
                    className="w-full min-w-0 flex-1 rounded-xl border border-dashed border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
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
                        ? "bg-gray-900 text-white hover:bg-black"
                        : "cursor-not-allowed bg-gray-100 text-gray-400",
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
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] sm:px-6 sm:pt-4 sm:pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => !isSaving && onClose()}
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canSubmit}
              className={cn(
                "flex flex-[1.4] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition",
                canSubmit
                  ? "bg-gray-900 text-white shadow-[0_10px_30px_-10px_rgba(17,24,39,0.45)] hover:bg-black"
                  : "cursor-not-allowed bg-gray-100 text-gray-400",
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Enviar gravação
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
