"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellRing, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Pedido de permissão de notificação estilo "banner de cookies" (ideia do
 * Victor, 21/07): uma vez concedida na home, vale para todos os avisos —
 * watchdog de gravação e reunião começando — sem interromper o fluxo de
 * gravar. O navegador só concede via gesto do usuário, então o banner é o
 * caminho mais fluido possível.
 */

const CHAVE_DISPENSADO = "voice.notificacoes.banner-dispensado";

export function NotificationPermissionBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    try {
      if (localStorage.getItem(CHAVE_DISPENSADO)) return;
    } catch {
      // sem localStorage, segue mostrando
    }
    // "default" = nunca decidiu. Concedida ou negada, não há o que pedir.
    setVisivel(Notification.permission === "default");
  }, []);

  const ativar = async () => {
    try {
      await Notification.requestPermission();
    } catch {
      // navegador sem suporte — só fecha
    }
    setVisivel(false);
  };

  const dispensar = () => {
    try {
      localStorage.setItem(CHAVE_DISPENSADO, "1");
    } catch {
      // sem localStorage a dispensa vale só nesta sessão
    }
    setVisivel(false);
  };

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="flex items-center gap-3 rounded-2xl border border-gray-200/70 bg-white/90 p-3 pl-4 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)] backdrop-blur-sm"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
            <BellRing size={16} />
          </span>
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-gray-600">
            <span className="font-semibold text-gray-900">
              Ative os avisos de gravação.
            </span>{" "}
            A gente te avisa quando uma reunião começar sem gravação e quando
            uma gravação ficar rodando esquecida — mesmo com esta aba em
            segundo plano.
          </p>
          <button
            onClick={ativar}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-gray-900 px-3.5 text-[10px] font-semibold tracking-wider text-white uppercase transition hover:bg-gray-700"
          >
            Ativar avisos
          </button>
          <button
            onClick={dispensar}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Dispensar"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
