"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAgendaStore } from "../../agenda/use-agenda-store";

const BENEFITS = [
  {
    icon: RefreshCw,
    title: "Sincronização nos dois sentidos",
    description:
      "Toda reunião criada aqui aparece no seu Google Agenda. Os compromissos do Google Agenda aparecem aqui prontos pra gravar.",
  },
  {
    icon: CheckCircle2,
    title: "Sem esforço manual",
    description:
      "Mudou a data no Google? Atualiza aqui. Remarcou por aqui? Vai pro Google. Você só gerencia em um lugar.",
  },
  {
    icon: ShieldCheck,
    title: "Seguro e reversível",
    description:
      "Usamos autenticação oficial do Google. Nada é publicado sem sua permissão e você pode desconectar quando quiser.",
  },
];

export function GoogleConnectCard() {
  const googleConnected = useAgendaStore((s) => s.googleConnected);
  const googleEmail = useAgendaStore((s) => s.googleEmail);
  const connectGoogle = useAgendaStore((s) => s.connectGoogle);
  const disconnectGoogle = useAgendaStore((s) => s.disconnectGoogle);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      connectGoogle("voce@gmail.com");
      setLoading(false);
    }, 900);
  };

  if (googleConnected) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200/70 bg-gradient-to-r from-emerald-50/70 via-white to-white p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-emerald-100">
            <GoogleIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              Google Agenda conectado
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-700 uppercase">
                <Check size={9} />
                Sincronizado
              </span>
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Sincronizando como{" "}
              <span className="font-medium text-gray-700">{googleEmail}</span>
            </p>
          </div>
        </div>
        <button
          onClick={disconnectGoogle}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
        >
          <X size={12} />
          Desconectar
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b0c10] via-[#131519] to-[#1e2026] p-6 text-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] md:p-8"
      >
        <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-[1.15fr_1fr] md:items-center">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-max items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] text-white/70 uppercase backdrop-blur-md">
              <RefreshCw size={11} />
              Integração
            </span>

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl leading-tight font-semibold md:text-3xl">
                Conecte seu{" "}
                <span className="bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
                  Google Agenda
                </span>{" "}
                e pare de digitar reuniões duas vezes.
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-white/70">
                Ao conectar, sua agenda aqui e o Google Agenda passam a andar
                juntos: o que entra de um lado aparece do outro, e qualquer
                alteração é refletida automaticamente — sem precisar copiar nada
                manualmente.
              </p>
            </div>

            <ul className="flex flex-col gap-2.5 pt-1">
              {[
                "Reuniões criadas aqui → enviadas pro seu Google Agenda",
                "Compromissos do Google → aparecem aqui prontos pra gravar",
                "Remarcou ou cancelou? Atualiza nos dois lados sozinho",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-xs leading-relaxed text-white/80"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                    <Check size={10} strokeWidth={3} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={handleConnect}
                disabled={loading}
                className={cn(
                  "group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-[0_10px_24px_-8px_rgba(255,255,255,0.35)] transition",
                  loading
                    ? "cursor-wait opacity-80"
                    : "hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(255,255,255,0.5)]",
                )}
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <GoogleIcon className="h-4 w-4" />
                )}
                Vincular com Google Agenda
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/80 backdrop-blur-md transition hover:border-white/30 hover:text-white"
              >
                Como funciona?
              </button>
            </div>

            <p className="pt-1 text-[11px] text-white/50">
              Você pode desconectar a qualquer momento. Não postamos nada sem
              sua autorização.
            </p>
          </div>

          <div className="relative hidden md:block">
            <SyncIllustration />
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
                    Integração
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    Como a sincronização funciona
                  </h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                {BENEFITS.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.title}
                      className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
                        <Icon size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {b.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-600">
                          {b.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
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

function SyncIllustration() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <IllustrationCard
          label="Aqui"
          sublabel="Sua agenda"
          iconBg="bg-gradient-to-br from-white/10 to-white/5"
          icon={
            <span className="text-[13px] font-semibold text-white">EV</span>
          }
          rows={[
            { time: "14:00", title: "Sessão - Maria" },
            { time: "16:30", title: "Follow-up João" },
          ]}
        />

        <motion.div
          animate={{ x: [0, 4, 0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex flex-col items-center gap-1 text-white/50"
        >
          <RefreshCw size={16} />
          <span className="text-[9px] font-semibold tracking-widest uppercase">
            Sync
          </span>
        </motion.div>

        <IllustrationCard
          label="Google"
          sublabel="Agenda"
          iconBg="bg-white"
          icon={<GoogleIcon className="h-4 w-4" />}
          rows={[
            { time: "14:00", title: "Sessão - Maria" },
            { time: "16:30", title: "Follow-up João" },
          ]}
        />
      </div>
    </div>
  );
}

function IllustrationCard({
  label,
  sublabel,
  icon,
  iconBg,
  rows,
}: {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  iconBg: string;
  rows: { time: string; title: string }[];
}) {
  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            iconBg,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold text-white">
            {label}
          </p>
          <p className="truncate text-[9px] text-white/40">{sublabel}</p>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {rows.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1.5"
          >
            <span className="text-[9px] font-semibold text-white/60">
              {r.time}
            </span>
            <span className="truncate text-[10px] text-white/80">
              {r.title}
            </span>
          </div>
        ))}
      </div>
    </div>
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
