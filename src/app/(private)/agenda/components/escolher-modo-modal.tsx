"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic, MonitorUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GoogleEvent } from "../use-google-calendar";

/**
 * Evento sem link de Meet não diz como a reunião vai acontecer — o usuário
 * escolhe (decisão da call com o João, 21/07: não assumir presencial).
 */
export function EscolherModoModal({
  evento,
  onEscolher,
  onClose,
}: {
  evento: GoogleEvent | null;
  onEscolher: (mode: "online" | "presencial") => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !evento) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)]"
        >
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                Gravar reunião
              </p>
              <h3 className="mt-1 truncate text-lg font-semibold text-gray-900">
                {evento.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Este compromisso não tem link de reunião — como ela vai
                acontecer?
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => onEscolher("online")}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-200 bg-white p-5 text-center transition hover:border-gray-900 hover:shadow-[0_8px_24px_-14px_rgba(15,23,42,0.3)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-gray-900 group-hover:text-white">
                <MonitorUp size={20} />
              </span>
              <span className="text-sm font-semibold text-gray-900">Online</span>
              <span className="text-[11px] leading-snug text-gray-500">
                Captura a aba da chamada — quem fala fica separado por canal
              </span>
            </button>
            <button
              onClick={() => onEscolher("presencial")}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-200 bg-white p-5 text-center transition hover:border-gray-900 hover:shadow-[0_8px_24px_-14px_rgba(15,23,42,0.3)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-gray-900 group-hover:text-white">
                <Mic size={20} />
              </span>
              <span className="text-sm font-semibold text-gray-900">
                Presencial
              </span>
              <span className="text-[11px] leading-snug text-gray-500">
                Grava pelo microfone, todos na mesma sala
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
