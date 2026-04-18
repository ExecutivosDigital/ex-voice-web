"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { useAgendaStore } from "../../agenda/use-agenda-store";

export function GoogleConnectChip() {
  const googleConnected = useAgendaStore((s) => s.googleConnected);
  const googleEmail = useAgendaStore((s) => s.googleEmail);
  const connectGoogle = useAgendaStore((s) => s.connectGoogle);
  const disconnectGoogle = useAgendaStore((s) => s.disconnectGoogle);

  const [loading, setLoading] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      connectGoogle("voce@gmail.com");
      setLoading(false);
    }, 800);
  };

  if (googleConnected) {
    return (
      <div className="group flex h-9 items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/60 pr-1 pl-3 transition">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Google Agenda
          <span className="hidden text-emerald-600/70 md:inline">
            · {googleEmail}
          </span>
        </span>
        <button
          onClick={disconnectGoogle}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-emerald-700/60 opacity-0 transition group-hover:opacity-100 hover:bg-emerald-100 hover:text-emerald-800 focus-visible:opacity-100"
          aria-label="Desconectar"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 p-1 pl-3 backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
          <GoogleIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Google Agenda</span>
        </span>
        <button
          onClick={() => setInfoOpen(true)}
          className="hidden h-6 items-center rounded-full px-2 text-[10px] font-semibold text-gray-400 transition hover:text-gray-700 md:inline-flex"
        >
          Como funciona?
        </button>
        <button
          onClick={handleConnect}
          disabled={loading}
          className={cn(
            "inline-flex h-6 items-center gap-1 rounded-full bg-gray-900 px-2.5 text-[10px] font-semibold text-white transition",
            loading ? "cursor-wait opacity-80" : "hover:bg-gray-700",
          )}
        >
          {loading ? (
            <Loader2 size={10} className="animate-spin" />
          ) : (
            <RefreshCw size={10} />
          )}
          Vincular
        </button>
      </div>

      <AnimatePresence>
        {infoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setInfoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                    <GoogleIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                      Integração
                    </p>
                    <h3 className="text-base font-semibold text-gray-900">
                      Google Agenda
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setInfoOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <X size={15} />
                </button>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Ao vincular, sua agenda daqui e o Google Agenda passam a
                conversar automaticamente:
              </p>

              <ul className="mt-4 flex flex-col gap-2">
                {[
                  "Reuniões criadas aqui aparecem no seu Google Agenda",
                  "Compromissos do Google Agenda aparecem aqui prontos pra gravar",
                  "Alterações de data, horário ou cancelamento sincronizam dos dois lados",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5 text-xs leading-relaxed text-gray-700"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-[11px] text-gray-400">
                Autenticação oficial do Google. Você pode desconectar a qualquer
                momento.
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setInfoOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Depois
                </button>
                <button
                  onClick={() => {
                    setInfoOpen(false);
                    handleConnect();
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
                >
                  <GoogleIcon className="h-3.5 w-3.5" />
                  Vincular agora
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.23 1 12s.43 3.45 1.18 4.96l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
