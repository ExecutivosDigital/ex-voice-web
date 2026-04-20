"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mic2, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import {
  PROFESSIONAL_STYLE,
  SPEAKER_PALETTE,
  getSpeakerInitial,
} from "./speaker-palette";

type Draft = {
  id: string;
  name: string;
  isProfessional: boolean;
};

interface EditSpeakersModalProps {
  isOpen: boolean;
  onClose: () => void;
  recording: RecordingDetailsProps;
}

export function EditSpeakersModal({
  isOpen,
  onClose,
  recording,
}: EditSpeakersModalProps) {
  const { PutAPI } = useApiContext();
  const { setSelectedRecording } = useGeneralContext();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setDrafts(
      (recording.speakers || []).map((s, idx) => ({
        id: s.id,
        name: s.name || `Locutor ${idx + 1}`,
        isProfessional: !!s.isProfessional,
      })),
    );
  }, [isOpen, recording.speakers]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const nonProfessionalIds = useMemo(
    () => drafts.filter((d) => !d.isProfessional).map((d) => d.id),
    [drafts],
  );

  const getDraftStyle = (draft: Draft) => {
    if (draft.isProfessional) return PROFESSIONAL_STYLE;
    const idx = nonProfessionalIds.indexOf(draft.id);
    return SPEAKER_PALETTE[Math.max(idx, 0) % SPEAKER_PALETTE.length];
  };

  const handleNameChange = (id: string, name: string) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
  };

  const toggleProfessional = (id: string) => {
    setDrafts((prev) =>
      prev.map((d) => ({
        ...d,
        isProfessional: d.id === id ? !d.isProfessional : false,
      })),
    );
  };

  const handleSave = async () => {
    const invalid = drafts.find((d) => !d.name.trim());
    if (invalid) {
      return toast.error("Todos os locutores precisam ter um nome.");
    }

    setIsSaving(true);
    const payload = {
      speakers: drafts.map((d) => ({
        id: d.id,
        name: d.name.trim(),
        isProfessional: d.isProfessional,
      })),
    };

    try {
      const response = await PutAPI("/recording-speaker", payload, true);
      if (response.status === 200) {
        setSelectedRecording({
          ...recording,
          speakers: recording.speakers.map((s) => {
            const d = drafts.find((x) => x.id === s.id);
            return d
              ? { ...s, name: d.name.trim(), isProfessional: d.isProfessional }
              : s;
          }),
        });
        toast.success("Locutores atualizados com sucesso!");
        onClose();
      } else {
        toast.error("Não foi possível salvar os locutores. Tente novamente.");
      }
    } catch {
      toast.error("Erro ao salvar os locutores.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[9999999] flex items-center justify-center overflow-y-auto overscroll-contain bg-gray-900/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-[0_20px_60px_-12px_rgba(17,24,39,0.35)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between px-6 pt-6 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-500 to-neutral-900 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.55)]">
                  <Mic2 size={18} strokeWidth={2.2} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Editar Locutores
                  </h2>
                  <p className="text-xs text-gray-500">
                    Renomeie e marque quem é o locutor profissional
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-px shrink-0 bg-gray-100" />

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6">
              {drafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <Mic2 size={18} />
                  </div>
                  <p className="text-sm text-gray-500">
                    Nenhum locutor disponível para esta gravação.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {drafts.map((draft) => {
                    const style = getDraftStyle(draft);
                    const initial = getSpeakerInitial(draft.name);
                    return (
                      <div
                        key={draft.id}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 transition",
                          draft.isProfessional &&
                            "border-gray-900/20 bg-gray-50/60",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-semibold text-white shadow-sm",
                            style.avatar,
                          )}
                        >
                          {initial}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <span
                            className={cn(
                              "text-[10px] font-semibold tracking-wide uppercase",
                              style.text,
                            )}
                          >
                            {draft.isProfessional
                              ? "Profissional"
                              : style.label}
                          </span>
                          <input
                            type="text"
                            value={draft.name}
                            onChange={(e) =>
                              handleNameChange(draft.id, e.target.value)
                            }
                            placeholder="Nome do locutor"
                            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/5"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleProfessional(draft.id)}
                          aria-label={
                            draft.isProfessional
                              ? "Remover marcação de profissional"
                              : "Marcar como profissional"
                          }
                          title={
                            draft.isProfessional
                              ? "Locutor profissional"
                              : "Marcar como profissional"
                          }
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition",
                            draft.isProfessional
                              ? "bg-gradient-to-br from-neutral-500 to-neutral-900 text-white shadow-[0_4px_14px_-4px_rgba(17,24,39,0.55)]"
                              : "border border-gray-200 bg-white text-gray-400 hover:text-gray-700",
                          )}
                        >
                          <Star
                            size={15}
                            strokeWidth={2.2}
                            className={cn(draft.isProfessional && "fill-white")}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="h-px shrink-0 bg-gray-100" />

            {/* Footer */}
            <div className="flex shrink-0 flex-col-reverse items-stretch gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || drafts.length === 0}
                className="group relative flex h-11 min-w-[170px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(17,24,39,0.55)] transition-all hover:shadow-[0_6px_18px_-4px_rgba(17,24,39,0.7)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.18)_50%,transparent_75%)] bg-[length:250%_100%] opacity-0 transition-opacity group-hover:animate-[shimmer_2.8s_ease-in-out_infinite] group-hover:opacity-100" />
                {isSaving ? (
                  <Loader2 className="relative h-4 w-4 animate-spin" />
                ) : (
                  <span className="relative">Salvar alterações</span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
