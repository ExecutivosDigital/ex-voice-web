"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic, X } from "lucide-react";
import { GoogleEvent } from "../use-google-calendar";

/**
 * Banner "sua reunião começou e você não está gravando" — deliberadamente
 * chamativo (pulso vermelho): é um alerta operacional, não informação.
 */

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MeetingStartBanner({
  eventos,
  onGravar,
  onDispensar,
}: {
  eventos: GoogleEvent[];
  onGravar: (evento: GoogleEvent) => void;
  onDispensar: (eventoId: string) => void;
}) {
  return (
    <AnimatePresence>
      {eventos.map((evento) => {
        const jaComecou =
          evento.start && Date.now() >= new Date(evento.start).getTime();
        return (
          <motion.div
            key={evento.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-white p-3 pl-4 shadow-[0_8px_24px_-16px_rgba(239,68,68,0.4)]"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>

            <p className="min-w-0 flex-1 text-sm text-gray-800">
              <span className="font-semibold">"{evento.title}"</span>{" "}
              {jaComecou ? (
                <>
                  começou
                  {evento.start ? ` às ${formatHora(evento.start)}` : ""} — e
                  você não está gravando.
                </>
              ) : (
                <>
                  começa
                  {evento.start ? ` às ${formatHora(evento.start)}` : " já"} —
                  quer deixar a gravação pronta?
                </>
              )}
            </p>

            <button
              onClick={() => onGravar(evento)}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3.5 text-[10px] font-semibold tracking-wider text-white uppercase transition hover:bg-red-700"
            >
              <Mic size={11} />
              Gravar agora
            </button>
            <button
              onClick={() => onDispensar(evento.id)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Dispensar aviso"
            >
              <X size={13} />
            </button>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
