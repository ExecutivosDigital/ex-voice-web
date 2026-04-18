"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { RecordMode } from "./mode-cards";

interface ModeCardsDispositivoProps {
  onSelect: (mode: RecordMode) => void;
}

export function ModeCardsDispositivo({ onSelect }: ModeCardsDispositivoProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DispositivoCard
        mode="presencial"
        title="Presencial"
        subtitle="Usando o microfone do dispositivo"
        device={<PhoneDevice />}
        onClick={() => onSelect("presencial")}
      />
      <DispositivoCard
        mode="online"
        title="Online"
        subtitle="Capturando tela + áudio da reunião"
        device={<LaptopDevice />}
        onClick={() => onSelect("online")}
      />
    </div>
  );
}

interface DispositivoCardProps {
  mode: RecordMode;
  title: string;
  subtitle: string;
  device: React.ReactNode;
  onClick: () => void;
}

function DispositivoCard({
  mode,
  title,
  subtitle,
  device,
  onClick,
}: DispositivoCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: mode === "presencial" ? 0.05 : 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      aria-label={`Iniciar gravação ${title.toLowerCase()}`}
      className={cn(
        "group relative flex w-full cursor-pointer items-center gap-5 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-300",
        "hover:border-gray-300 hover:shadow-xl hover:shadow-gray-900/5",
        "focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:outline-none",
      )}
    >
      {/* dispositivo grande na esquerda */}
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200 transition-transform duration-500 group-hover:scale-105">
        {device}
      </div>

      {/* conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">
            {title}
          </h3>
          <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.15)]" />
        </div>
        <p className="text-sm leading-relaxed text-gray-500">{subtitle}</p>

        <div className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 group-hover:bg-red-600 group-hover:shadow-md group-hover:shadow-red-600/30">
          Iniciar gravação
          <ArrowRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </motion.button>
  );
}

function PhoneDevice() {
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" aria-hidden>
      <defs>
        <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* corpo do smartphone */}
      <rect
        x="30"
        y="10"
        width="36"
        height="64"
        rx="7"
        fill="url(#phoneGrad)"
      />
      {/* tela */}
      <rect
        x="33"
        y="14"
        width="30"
        height="56"
        rx="3"
        fill="url(#screenGrad)"
      />
      {/* notch */}
      <rect x="43" y="16" width="10" height="2" rx="1" fill="#000" />

      {/* botão de gravação na tela */}
      <circle cx="48" cy="36" r="9" fill="#ef4444" />
      <rect x="44.5" y="32.5" width="7" height="7" rx="1" fill="white" />

      {/* waveform na tela */}
      <g stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
        <line x1="37" y1="58" x2="37" y2="60" />
        <line x1="40" y1="55" x2="40" y2="63" />
        <line x1="43" y1="52" x2="43" y2="66" />
        <line x1="46" y1="54" x2="46" y2="64" />
        <line x1="49" y1="50" x2="49" y2="68" />
        <line x1="52" y1="53" x2="52" y2="65" />
        <line x1="55" y1="55" x2="55" y2="63" />
        <line x1="58" y1="58" x2="58" y2="60" />
      </g>

      {/* ondas de áudio irradiando do dispositivo */}
      <g stroke="#ef4444" fill="none" strokeLinecap="round">
        <path d="M 20 35 Q 10 42 20 49" strokeWidth="2" opacity="0.5" />
        <path d="M 15 30 Q -2 42 15 54" strokeWidth="2" opacity="0.25" />
        <path d="M 76 35 Q 86 42 76 49" strokeWidth="2" opacity="0.5" />
        <path d="M 81 30 Q 98 42 81 54" strokeWidth="2" opacity="0.25" />
      </g>
    </svg>
  );
}

function LaptopDevice() {
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" aria-hidden>
      <defs>
        <linearGradient id="laptopGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>

      {/* base do laptop */}
      <path d="M 12 70 L 84 70 L 88 78 L 8 78 Z" fill="#374151" />
      <rect x="8" y="76" width="80" height="3" rx="1" fill="#1f2937" />

      {/* tela */}
      <rect x="18" y="18" width="60" height="52" rx="3" fill="url(#laptopGrad)" />
      <rect x="20" y="20" width="56" height="48" rx="2" fill="#0f172a" />

      {/* dentro da tela: janela de videochamada */}
      {/* barra de título */}
      <rect x="22" y="22" width="52" height="5" rx="1" fill="#334155" />
      <circle cx="25" cy="24.5" r="1" fill="#ef4444" />
      <circle cx="28" cy="24.5" r="1" fill="#f59e0b" />
      <circle cx="31" cy="24.5" r="1" fill="#10b981" />

      {/* tiles de vídeo (2x2 simplificado) */}
      <rect x="23" y="29" width="24" height="17" rx="1.5" fill="#475569" />
      <circle cx="35" cy="36" r="3" fill="#94a3b8" />
      <path d="M 31 42 Q 35 39 39 42 L 39 44 Q 35 42 31 44 Z" fill="#94a3b8" />

      <rect x="49" y="29" width="24" height="17" rx="1.5" fill="#334155" />
      <circle cx="61" cy="36" r="3" fill="#64748b" />
      <path d="M 57 42 Q 61 39 65 42 L 65 44 Q 61 42 57 44 Z" fill="#64748b" />

      <rect x="23" y="48" width="24" height="17" rx="1.5" fill="#1e40af" />
      <circle cx="35" cy="55" r="3" fill="#93c5fd" />
      <path d="M 31 61 Q 35 58 39 61 L 39 63 Q 35 61 31 63 Z" fill="#93c5fd" />

      <rect x="49" y="48" width="24" height="17" rx="1.5" fill="#334155" />
      <circle cx="61" cy="55" r="3" fill="#64748b" />
      <path d="M 57 61 Q 61 58 65 61 L 65 63 Q 61 61 57 63 Z" fill="#64748b" />

      {/* badge REC na tela */}
      <rect x="63" y="30" width="10" height="5" rx="2" fill="#ef4444" />
      <circle cx="65.5" cy="32.5" r="1" fill="white" />
    </svg>
  );
}
