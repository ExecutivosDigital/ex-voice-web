"use client";

import { LogoBubble, MeetLogo, TeamsLogo, ZoomLogo } from "@/components/ui/brand-logos";
import { useTravarScrollDaPagina } from "@/hooks/useTravarScrollDaPagina";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Mic, X } from "lucide-react";
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
  useTravarScrollDaPagina(!!evento);
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

          {/* Mesma linguagem dos cards da home (pedido do Victor, 22/07) */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => onEscolher("presencial")}
              className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5"
            >
              <div className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-inner">
                    <Mic size={22} className="text-white" strokeWidth={2} />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-gray-600 uppercase">
                    <MapPin size={10} /> no local
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Presencial
                  </h4>
                  <p className="text-xs leading-relaxed text-gray-500">
                    Grava pelo microfone, todos na mesma sala.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onEscolher("online")}
              className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5"
            >
              <div className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center -space-x-2">
                    <LogoBubble>
                      <MeetLogo />
                    </LogoBubble>
                    <LogoBubble>
                      <ZoomLogo />
                    </LogoBubble>
                    <LogoBubble>
                      <TeamsLogo />
                    </LogoBubble>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-gray-600 uppercase">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    online
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg font-semibold text-gray-900">Online</h4>
                  <p className="text-xs leading-relaxed text-gray-500">
                    Captura a aba da chamada — quem fala fica separado por
                    canal.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
