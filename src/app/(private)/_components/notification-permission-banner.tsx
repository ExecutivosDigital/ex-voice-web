"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellRing, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Pedido de permissão de notificação, estilo banner de cookies (Victor,
 * 21-22/07): flutuante no canto inferior, com o ATIVAR como caminho óbvio.
 * Recusar de vez é possível mas trabalhoso de propósito: "Agora não" só
 * esconde na sessão; o opt-out permanente vive atrás do menu "···".
 */

const CHAVE_NUNCA = "voice.notificacoes.nunca-pedir";
const CHAVE_SESSAO = "voice.notificacoes.sessao-dispensada";

export function NotificationPermissionBanner() {
  const [visivel, setVisivel] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof Notification === "undefined") return;
    try {
      if (localStorage.getItem(CHAVE_NUNCA)) return;
      if (sessionStorage.getItem(CHAVE_SESSAO)) return;
    } catch {
      // sem storage, segue mostrando
    }
    // "default" = nunca decidiu. Concedida ou negada, não há o que pedir.
    setVisivel(Notification.permission === "default");
  }, []);

  if (!mounted) return null;

  const ativar = async () => {
    try {
      await Notification.requestPermission();
    } catch {
      // navegador sem suporte — só fecha
    }
    setVisivel(false);
  };

  const agoraNao = () => {
    try {
      sessionStorage.setItem(CHAVE_SESSAO, "1");
    } catch {
      // sem storage a dispensa vale só em memória
    }
    setVisivel(false);
  };

  const nuncaMais = () => {
    try {
      localStorage.setItem(CHAVE_NUNCA, "1");
    } catch {
      // sem storage vira dispensa de sessão
    }
    setVisivel(false);
  };

  return createPortal(
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 bottom-4 z-40 w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-gray-200/70 bg-white/95 p-4 shadow-[0_20px_60px_-16px_rgba(15,23,42,0.35)] backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dim text-white shadow-md shadow-gray-900/20">
              <BellRing size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">
                Ative os avisos de gravação
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                A gente te avisa quando uma reunião começar sem gravação e
                quando uma gravação ficar rodando esquecida — mesmo com a aba
                em segundo plano.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={ativar}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-dim"
            >
              Ativar avisos
            </button>
            <button
              onClick={agoraNao}
              className="h-9 rounded-full px-3 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              Agora não
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuAberto((m) => !m)}
                aria-label="Mais opções"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuAberto && (
                <div className="absolute right-0 bottom-11 w-44 rounded-2xl border border-gray-100 bg-white p-1 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.3)]">
                  <button
                    onClick={nuncaMais}
                    className="w-full rounded-xl px-3 py-2 text-left text-xs text-gray-500 transition hover:bg-gray-50 hover:text-gray-800"
                  >
                    Não pedir novamente
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
