"use client";

import { ModeCards, RecordMode } from "@/app/(private)/_components/mode-cards";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Mic2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface RecordingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mode: RecordMode) => void;
  clientName?: string;
  className?: string;
}

export function RecordingModeModal({
  isOpen,
  onClose,
  onSelect,
  clientName,
  className,
}: RecordingModeModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

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
          className={cn(
            "fixed inset-0 z-[9999999] flex items-center justify-center overflow-y-auto overscroll-contain bg-gray-900/50 p-4 backdrop-blur-sm",
            className,
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-[0_20px_60px_-12px_rgba(17,24,39,0.35)]"
          >
            <div className="flex shrink-0 items-start justify-between px-6 pt-6 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-500 to-neutral-900 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.55)]">
                  <Mic2 size={20} strokeWidth={2.2} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Como vai ser a reunião?
                  </h2>
                  <p className="text-xs text-gray-500">
                    {clientName
                      ? `Selecione o tipo para gravar com ${clientName}`
                      : "Selecione o tipo da gravação"}
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

            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-7">
              <ModeCards onSelect={onSelect} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
