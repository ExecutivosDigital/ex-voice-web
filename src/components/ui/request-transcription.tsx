"use client";

import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { handleApiError } from "@/utils/error-handler";
import { PromptIcon } from "@/utils/prompt-icon";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Globe2,
  Loader2,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

interface PromptOption {
  id: string;
  name: string;
  content: string;
  type: string;
  source: "USER" | "COMPANY" | "GLOBAL";
  icon?: string;
}

export function RequestTranscription() {
  const { selectedRecording, setSelectedRecording } = useGeneralContext();
  const { PutAPI, GetAPI } = useApiContext();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompts, setPrompts] = useState<PromptOption[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<
    PromptOption | "default" | null
  >(null);

  useEffect(() => {
    if (isModalOpen) {
      if (prompts.length === 0) {
        fetchAvailablePrompts();
      }
    } else {
      setSearchQuery("");
      setSelectedPrompt(null);
    }
  }, [isModalOpen]);

  async function fetchAvailablePrompts() {
    setIsLoadingPrompts(true);
    try {
      const response = await GetAPI(`/prompts/available`, true);
      const list = (response.status === 200 ? response.body : null) || [];
      const recordingType = selectedRecording?.type;
      const filtered =
        recordingType != null
          ? list.filter((p: PromptOption) => p.type === recordingType)
          : list;
      setPrompts(filtered);
      if (response.status !== 200) {
        console.error("Erro ao buscar prompts:", response.status);
        const errorMessage = handleApiError(
          response,
          "Não foi possível carregar os prompts.",
        );
        toast.error(errorMessage);
        setPrompts([]);
      }
    } catch (error) {
      console.error("Erro ao buscar prompts:", error);
      toast.error("Erro ao buscar prompts. Tente novamente.");
      setPrompts([]);
    } finally {
      setIsLoadingPrompts(false);
    }
  }

  async function handleSolicitarTranscriptionClick() {
    if (!selectedRecording?.type) return;
    setIsLoadingPrompts(true);
    try {
      const response = await GetAPI(`/prompts/available`, true);
      const list = (response.status === 200 ? response.body : null) || [];
      const filtered = list.filter(
        (p: PromptOption) => p.type === selectedRecording.type,
      );
      if (filtered.length === 0) {
        await HandleRequestTranscription();
      } else {
        setPrompts(filtered);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Erro ao buscar prompts:", error);
      setPrompts([]);
      toast.error("Erro ao verificar prompts. Tente novamente.");
    } finally {
      setIsLoadingPrompts(false);
    }
  }

  async function HandleRequestTranscription(promptId?: string) {
    if (!selectedRecording) {
      return;
    }
    setIsRequesting(true);
    const request = await PutAPI(
      `/recording/${selectedRecording?.id}`,
      {
        status: "PENDING",
        ...(promptId && { promptId }),
      },
      true,
    );
    if (request.status === 200) {
      toast.success("Solicitação enviada com sucesso!");
      setSelectedRecording({
        ...selectedRecording,
        transcriptionStatus: "PENDING",
      });
      setIsModalOpen(false);
      setIsRequesting(false);
      return;
    }
    const errorMessage = handleApiError(
      request,
      "Erro ao solicitar transcrição. Tente novamente.",
    );
    toast.error(errorMessage);
    setIsRequesting(false);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedPrompt(null);
  }

  function handleSelectPrompt(prompt: PromptOption | "default") {
    setSelectedPrompt(prompt);
  }

  function handleConfirmSelection() {
    if (selectedPrompt === "default") {
      HandleRequestTranscription(undefined);
    } else if (selectedPrompt) {
      HandleRequestTranscription(selectedPrompt.id);
    }
  }

  function getSourceLabel(source: string) {
    switch (source) {
      case "USER":
        return "Pessoal";
      case "COMPANY":
        return "Empresa";
      case "GLOBAL":
        return "Global";
      default:
        return source;
    }
  }

  function getSourceChip(source: string) {
    switch (source) {
      case "USER":
        return "bg-indigo-50 text-indigo-700 ring-indigo-100";
      case "COMPANY":
        return "bg-gray-100 text-gray-700 ring-gray-200";
      case "GLOBAL":
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";
      default:
        return "bg-gray-100 text-gray-700 ring-gray-200";
    }
  }

  function getSourceIcon(source: string) {
    switch (source) {
      case "USER":
        return UserRound;
      case "COMPANY":
        return Building2;
      case "GLOBAL":
        return Globe2;
      default:
        return Sparkles;
    }
  }

  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) return prompts;
    const query = searchQuery.toLowerCase();
    return prompts.filter((prompt) =>
      prompt.name.toLowerCase().includes(query),
    );
  }, [prompts, searchQuery]);

  const transcriptionStatus = selectedRecording?.transcriptionStatus;
  const canRequestTranscription = transcriptionStatus === "NOT_REQUESTED";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;
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
  }, [isModalOpen]);

  return (
    <>
      {canRequestTranscription && (
      <button
        onClick={handleSolicitarTranscriptionClick}
        disabled={isRequesting || isLoadingPrompts}
        className={cn(
          "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 ease-out",
          "bg-gradient-to-r from-neutral-700 via-neutral-600 to-neutral-700 hover:shadow-2xl hover:shadow-neutral-500/25",
          "hover:scale-[1.02] active:scale-[0.98]",
          "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
          isLoadingPrompts &&
            "cursor-wait from-amber-500 via-amber-400 to-amber-500 opacity-80 hover:scale-100 hover:shadow-amber-500/20",
        )}
      >
        {isRequesting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Transcrevendo...</span>
          </>
        ) : isLoadingPrompts ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span>Solicitar Transcrição</span>
          </>
        )}
      </button>
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[60] flex items-stretch justify-center bg-black/50 backdrop-blur-md md:items-center md:p-6"
                onClick={handleCloseModal}
              >
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="relative flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.45)] md:h-auto md:max-h-[90vh] md:rounded-3xl"
                >
                  {/* Header escuro estilo new-home */}
                  <div className="relative shrink-0 border-b border-gray-100 bg-gradient-to-br from-gray-900 via-[#111318] to-[#1a1d24] px-6 pt-7 pb-6 text-white md:px-10 md:pt-8 md:pb-6">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
                      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
                    </div>

                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
                        <Sparkles size={12} className="text-amber-300" />
                        <span className="text-[10px] font-bold tracking-[0.25em] text-white/80 uppercase">
                          IA · Transcrição
                        </span>
                      </div>
                      <button
                        onClick={handleCloseModal}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
                        aria-label="Fechar"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="relative mt-5">
                      <h2 className="text-balance text-xl leading-tight font-semibold text-white md:text-[22px]">
                        Escolha a IA que vai transcrever.
                      </h2>
                      <p className="mt-1.5 max-w-xl text-[12px] leading-relaxed text-white/60">
                        Selecione um prompt personalizado ou use a IA padrão. A
                        escolha afeta resumos, insights e tom do resultado.
                      </p>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="shrink-0 border-b border-gray-100 bg-white px-5 py-4 md:px-10">
                    <div className="relative">
                      <Search
                        size={15}
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Buscar IA por nome..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 w-full rounded-full border border-gray-200 bg-white/70 pr-4 pl-11 text-sm text-gray-800 shadow-sm backdrop-blur-sm outline-none transition focus:border-gray-400 focus:bg-white focus:shadow-md"
                      />
                    </div>
                  </div>

                  {/* Lista */}
                  <div
                    className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-10"
                    data-lenis-prevent
                  >
                    {isLoadingPrompts ? (
                      <SkeletonList />
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {/* IA Padrão */}
                        <PromptRow
                          selected={selectedPrompt === "default"}
                          disabled={isRequesting}
                          onClick={() => handleSelectPrompt("default")}
                          icon={
                            <Sparkles size={18} className="text-gray-700" />
                          }
                          iconWrapCls="bg-gray-100 ring-1 ring-gray-200"
                          title="IA Padrão"
                          chipLabel="Recomendada"
                          chipCls="bg-amber-50 text-amber-800 ring-amber-100"
                        />

                        {filteredPrompts.length === 0 && !searchQuery ? null : filteredPrompts.length ===
                          0 ? (
                          <EmptySearch />
                        ) : (
                          filteredPrompts.map((prompt, i) => {
                            const SourceIcon = getSourceIcon(prompt.source);
                            const isSelected =
                              selectedPrompt !== null &&
                              selectedPrompt !== "default" &&
                              selectedPrompt.id === prompt.id;
                            return (
                              <PromptRow
                                key={prompt.id}
                                index={i}
                                selected={isSelected}
                                disabled={isRequesting}
                                onClick={() => handleSelectPrompt(prompt)}
                                icon={
                                  <PromptIcon
                                    icon={prompt.icon}
                                    size={18}
                                    className="text-white"
                                  />
                                }
                                iconWrapCls="bg-gradient-to-br from-gray-900 to-gray-700 text-white"
                                title={prompt.name}
                                chipLabel={getSourceLabel(prompt.source)}
                                chipCls={getSourceChip(prompt.source)}
                                chipIcon={
                                  <SourceIcon
                                    size={10}
                                    className="shrink-0"
                                  />
                                }
                              />
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-10 md:py-5">
                    <p className="flex items-center gap-2 text-[11px] text-gray-500">
                      <Sparkles size={12} className="text-amber-500" />
                      {selectedPrompt
                        ? selectedPrompt === "default"
                          ? "IA padrão selecionada."
                          : `Selecionada: ${selectedPrompt.name}`
                        : "Selecione uma IA para continuar."}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="rounded-full px-3.5 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmSelection}
                        disabled={!selectedPrompt || isRequesting}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition",
                          !selectedPrompt || isRequesting
                            ? "cursor-not-allowed bg-gray-300 shadow-none"
                            : "bg-gradient-to-r from-gray-900 to-gray-700 shadow-gray-900/20 hover:scale-[1.02]",
                        )}
                      >
                        {isRequesting ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            Solicitando...
                          </>
                        ) : (
                          <>
                            <Check size={13} />
                            Confirmar transcrição
                            <ArrowRight size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function PromptRow({
  icon,
  iconWrapCls,
  title,
  subtitle,
  chipLabel,
  chipCls,
  chipIcon,
  selected,
  disabled,
  onClick,
  index = 0,
}: {
  icon: React.ReactNode;
  iconWrapCls: string;
  title: string;
  subtitle?: string;
  chipLabel: string;
  chipCls: string;
  chipIcon?: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  index?: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.18) }}
      whileHover={!disabled ? { y: -1 } : undefined}
      className={cn(
        "group relative flex items-start gap-3 overflow-hidden rounded-2xl border p-3 text-left transition md:gap-4 md:p-4",
        selected
          ? "border-gray-900 bg-white shadow-[0_12px_30px_-18px_rgba(15,23,42,0.4)]"
          : "border-gray-200/70 bg-white hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.2)]",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {selected && (
        <span
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900"
          aria-hidden
        />
      )}
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          iconWrapCls,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {title}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase ring-1",
              chipCls,
            )}
          >
            {chipIcon}
            {chipLabel}
          </span>
        </div>
        {subtitle ? (
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-gray-500">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center pt-1">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition",
            selected
              ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white"
              : "border border-gray-200 bg-white text-gray-300 group-hover:border-gray-300",
          )}
        >
          <Check size={12} strokeWidth={3} className={selected ? "" : "opacity-0"} />
        </span>
      </div>
    </motion.button>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-2xl border border-gray-200/60 bg-white p-4"
        >
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-gray-100" />
            <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-gray-100" />
          </div>
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function EmptySearch() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-12 text-center backdrop-blur-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
        <Search size={18} />
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-900">
        Nenhuma IA encontrada
      </p>
      <p className="mt-1 max-w-xs text-xs text-gray-500">
        Tente buscar por outro nome ou limpe o campo.
      </p>
    </div>
  );
}
