"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Info,
  Laptop,
  MapPin,
  Mic,
  MonitorPlay,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type RecordMode = "presencial" | "online";

interface ModeCardsProps {
  onSelect: (mode: RecordMode) => void;
}

export function ModeCards({ onSelect }: ModeCardsProps) {
  const [showOnlineInfo, setShowOnlineInfo] = useState(false);

  const handleOnlineClick = () => {
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      setShowOnlineInfo(true);
      return;
    }
    onSelect("online");
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PresencialCard onClick={() => onSelect("presencial")} />
        <OnlineCard onClick={handleOnlineClick} />
      </div>
      <AnimatePresence>
        {showOnlineInfo && (
          <OnlineDesktopModal onClose={() => setShowOnlineInfo(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

const cardBase =
  "group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5 focus-visible:ring-4 focus-visible:ring-gray-900/20 focus-visible:outline-none";

function PresencialCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.99 }}
      aria-label="Clique aqui para iniciar gravação presencial"
      className={cn(cardBase)}
    >
      <div className="flex h-full flex-col gap-5 p-5">
        {/* Cabeçalho: ícone + badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-inner">
            <Mic size={22} className="text-white" strokeWidth={2} />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-gray-600 uppercase">
            <MapPin size={10} /> no local
          </span>
        </div>

        {/* Título + descrição */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Presencial
          </h3>
          <p className="text-sm leading-relaxed text-gray-500">
            Grave reuniões ao vivo, conversas e visitas com o microfone do seu
            dispositivo.
          </p>
        </div>

        <PulseCta icon={Mic} />
      </div>
    </motion.button>
  );
}

function OnlineCard({ onClick }: { onClick: () => void }) {
  const onlineLabel = (
    <>
      <span className="md:hidden">Saiba mais</span>
      <span className="hidden md:inline">
        Clique aqui para iniciar gravação
      </span>
    </>
  );
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.99 }}
      aria-label="Gravação online"
      className={cn(cardBase)}
    >
      <div className="flex h-full flex-col gap-5 p-5">
        {/* Cabeçalho: logos + badge */}
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

        {/* Título + descrição */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Online
          </h3>
          <p className="text-sm leading-relaxed text-gray-500">
            Capture reuniões do Meet, Zoom e Teams com áudio da aba + microfone.
          </p>
        </div>

        <PulseCta icon={Video} label={onlineLabel} />
      </div>
    </motion.button>
  );
}

function PulseCta({
  icon: Icon,
  label,
}: {
  icon: typeof Mic;
  label?: React.ReactNode;
}) {
  return (
    <div className="mt-auto flex items-center gap-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3.5 text-white shadow-md shadow-gray-900/20 transition-all duration-300 group-hover:from-gray-900 group-hover:to-black group-hover:shadow-lg group-hover:shadow-gray-900/30">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/25">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/30 opacity-60" />
        <Icon size={18} className="relative text-white" strokeWidth={2.5} />
      </span>
      <span className="flex-1 text-center text-sm font-semibold whitespace-nowrap">
        {label ?? "Clique aqui para iniciar gravação"}
      </span>
      <span className="flex h-11 w-11 shrink-0 items-center justify-end">
        <ArrowRight
          size={18}
          strokeWidth={2.5}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </div>
  );
}

function LogoBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
      {children}
    </span>
  );
}

function MeetLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path d="M15 8v8l5 3V5l-5 3z" fill="#00ac47" />
      <path d="M3 6v12h9V6H3z" fill="#fff" />
      <path d="M3 6v12h9V6H3z" fill="none" stroke="#ea4335" strokeWidth="0" />
      <path d="M12 12l3-2v4l-3-2z" fill="#ffba00" />
      <path d="M3 6h9l-2 3H3V6z" fill="#4285f4" />
      <path d="M3 18h9l-2-3H3v3z" fill="#34a853" />
    </svg>
  );
}

function ZoomLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#2D8CFF" />
      <path d="M6 9h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6V9z" fill="white" />
      <path d="M16 11l3-2v6l-3-2v-2z" fill="white" />
    </svg>
  );
}

function TeamsLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <rect x="2" y="5" width="14" height="14" rx="2" fill="#4b53bc" />
      <text
        x="9"
        y="16"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="white"
        fontFamily="system-ui"
      >
        T
      </text>
      <circle cx="19" cy="9" r="3.5" fill="#7b83eb" />
      <circle cx="19" cy="9" r="1.5" fill="white" />
    </svg>
  );
}

function OnlineDesktopModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ height: "100dvh" }}
      className="fixed inset-x-0 top-0 z-[99999] flex items-end justify-center overflow-hidden bg-black/55 backdrop-blur-md sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[100dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.55)] sm:max-h-[90dvh] sm:rounded-3xl"
      >
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          data-lenis-prevent
        >
          {/* Header escuro com gradiente */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#131a33] to-[#1d2447] px-5 pt-5 pb-5 text-white sm:px-6 sm:pt-7 sm:pb-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl sm:h-52 sm:w-52" />
              <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl sm:h-52 sm:w-52" />
            </div>

            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-2.5 sm:mb-4">
                <div className="absolute inset-0 animate-ping rounded-2xl bg-white/10" />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md sm:h-14 sm:w-14">
                  <Laptop
                    size={22}
                    className="text-white sm:hidden"
                    strokeWidth={2}
                  />
                  <Laptop
                    size={26}
                    className="hidden text-white sm:block"
                    strokeWidth={2}
                  />
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9.5px] font-semibold tracking-[0.22em] text-white/80 uppercase backdrop-blur-sm sm:text-[10px]">
                <Info size={10} />
                Disponível no computador
              </span>

              <h2 className="mt-2.5 text-[17px] leading-tight font-semibold text-balance sm:mt-3 sm:text-xl">
                Gravação online é pelo computador
              </h2>
              <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-white/70 sm:mt-2 sm:text-sm">
                Acesse o Ex Voice pelo notebook ou desktop usando Chrome, Edge,
                Brave ou Opera.
              </p>

              {/* Logos das plataformas */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:mt-5 sm:gap-2">
                <PlatformChip logo={<MeetLogo />} label="Meet" />
                <PlatformChip logo={<ZoomLogo />} label="Zoom" />
                <PlatformChip logo={<TeamsLogo />} label="Teams" />
                <span className="flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/70">
                  e mais
                </span>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col gap-3 px-5 py-4 sm:gap-4 sm:px-6 sm:py-6">
            <Feature
              icon={MonitorPlay}
              title="Funciona em qualquer plataforma"
              description="Meet, Zoom, Teams, Webex, Discord — se toca no navegador, a gente grava."
            />
            <Feature
              icon={Mic}
              title="Áudio da aba + seu microfone"
              description="Captura todos os participantes junto com sua voz, sem instalar bot."
            />
            <Feature
              icon={Sparkles}
              title="Transcrição e resumo automáticos"
              description="Ao final, você recebe transcrição, resumo executivo e próximos passos."
            />

            <div className="flex items-start gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-3 py-2.5 text-[11px] leading-relaxed text-gray-600">
              <Check
                size={12}
                className="mt-0.5 shrink-0 text-emerald-600"
                strokeWidth={3}
              />
              <p>
                No celular, use{" "}
                <span className="font-semibold text-gray-900">Presencial</span>{" "}
                para gravar conversas, visitas e reuniões ao vivo.
              </p>
            </div>
          </div>
        </div>

        {/* Footer fixo com botão, respeitando safe-area do iOS/Android */}
        <div
          className="flex-shrink-0 border-t border-gray-100 bg-white px-5 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] sm:px-6 sm:pt-4 sm:pb-4"
        >
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:from-black hover:to-gray-800"
          >
            Entendi
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function PlatformChip({
  logo,
  label,
}: {
  logo: React.ReactNode;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-1 pr-2.5 pl-1 text-[11px] font-medium text-white/80">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
        <span className="h-4 w-4">{logo}</span>
      </span>
      {label}
    </span>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Mic;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-sm">
        <Icon size={16} strokeWidth={2} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}
