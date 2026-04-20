"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RecordMode } from "./mode-cards";

interface ModeCardsMockupProps {
  onSelect: (mode: RecordMode) => void;
}

export function ModeCardsMockup({ onSelect }: ModeCardsMockupProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <MockupCard
        mode="presencial"
        title="Presencial"
        description="Reuniões ao vivo, conversas e visitas com apenas um toque."
        illustration={<PresencialScene />}
        onClick={() => onSelect("presencial")}
      />
      <MockupCard
        mode="online"
        title="Online"
        description="Meet, Zoom e Teams com áudio da aba + microfone."
        illustration={<OnlineScene />}
        onClick={() => onSelect("online")}
      />
    </div>
  );
}

interface MockupCardProps {
  mode: RecordMode;
  title: string;
  description: string;
  illustration: React.ReactNode;
  onClick: () => void;
}

function MockupCard({
  mode,
  title,
  description,
  illustration,
  onClick,
}: MockupCardProps) {
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
        "group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-all duration-300",
        "hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5",
        "focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:outline-none",
      )}
    >
      {/* ilustração ocupa metade superior */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 transition-all duration-500 group-hover:scale-[1.02]">
        {illustration}
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-gray-100 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              {description}
            </p>
          </div>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-gray-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-700"
          />
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 ring-1 ring-red-100 transition-all duration-300 group-hover:bg-red-100 group-hover:ring-red-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-red-700">
            Iniciar gravação
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// Mini cena presencial: mesa vista de cima com microfone + balões de fala
function PresencialScene() {
  return (
    <svg
      viewBox="0 0 400 200"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="tableGrad" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </radialGradient>
        <linearGradient id="micGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* fundo com padrão sutil */}
      <rect width="400" height="200" fill="#fafaf9" />

      {/* mesa (elipse) */}
      <ellipse
        cx="200"
        cy="115"
        rx="150"
        ry="55"
        fill="url(#tableGrad)"
        opacity="0.9"
      />
      <ellipse
        cx="200"
        cy="112"
        rx="150"
        ry="55"
        fill="none"
        stroke="#d97706"
        strokeOpacity="0.15"
        strokeWidth="1"
      />

      {/* cadeiras/pessoas como círculos */}
      <g>
        {/* pessoa esquerda */}
        <circle cx="80" cy="100" r="16" fill="#e0e7ff" />
        <circle cx="80" cy="100" r="16" fill="none" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="80" cy="96" r="6" fill="#6366f1" opacity="0.7" />

        {/* pessoa direita */}
        <circle cx="320" cy="100" r="16" fill="#fce7f3" />
        <circle cx="320" cy="100" r="16" fill="none" stroke="#ec4899" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="320" cy="96" r="6" fill="#ec4899" opacity="0.7" />
      </g>

      {/* microfone no centro */}
      <g>
        {/* base */}
        <rect x="185" y="130" width="30" height="4" rx="2" fill="#1f2937" />
        {/* haste */}
        <rect x="198" y="100" width="4" height="30" fill="#374151" />
        {/* cápsula */}
        <rect
          x="182"
          y="68"
          width="36"
          height="40"
          rx="18"
          fill="url(#micGrad)"
        />
        {/* grade */}
        <line x1="188" y1="78" x2="212" y2="78" stroke="#4b5563" strokeWidth="1" />
        <line x1="188" y1="84" x2="212" y2="84" stroke="#4b5563" strokeWidth="1" />
        <line x1="188" y1="90" x2="212" y2="90" stroke="#4b5563" strokeWidth="1" />
        <line x1="188" y1="96" x2="212" y2="96" stroke="#4b5563" strokeWidth="1" />
        {/* highlight */}
        <rect x="186" y="72" width="6" height="16" rx="3" fill="white" opacity="0.15" />
      </g>

      {/* ondas de áudio irradiando */}
      <g stroke="#ef4444" fill="none" strokeLinecap="round">
        <path d="M 140 85 Q 130 88 140 91" strokeWidth="2" opacity="0.6" />
        <path d="M 125 82 Q 110 88 125 94" strokeWidth="2" opacity="0.35" />
        <path d="M 260 85 Q 270 88 260 91" strokeWidth="2" opacity="0.6" />
        <path d="M 275 82 Q 290 88 275 94" strokeWidth="2" opacity="0.35" />
      </g>

      {/* balões de conversa */}
      <g>
        <rect x="40" y="40" width="44" height="22" rx="11" fill="white" stroke="#e5e7eb" />
        <circle cx="52" cy="51" r="1.5" fill="#9ca3af" />
        <circle cx="62" cy="51" r="1.5" fill="#9ca3af" />
        <circle cx="72" cy="51" r="1.5" fill="#9ca3af" />

        <rect x="316" y="40" width="44" height="22" rx="11" fill="white" stroke="#e5e7eb" />
        <circle cx="328" cy="51" r="1.5" fill="#9ca3af" />
        <circle cx="338" cy="51" r="1.5" fill="#9ca3af" />
        <circle cx="348" cy="51" r="1.5" fill="#9ca3af" />
      </g>
    </svg>
  );
}

// Mini mockup de reunião online: janela com grade de tiles de vídeo
function OnlineScene() {
  return (
    <svg
      viewBox="0 0 400 200"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="windowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* fundo */}
      <rect width="400" height="200" fill="#f8fafc" />

      {/* janela do navegador */}
      <rect x="40" y="25" width="320" height="150" rx="10" fill="url(#windowGrad)" />
      <rect x="40" y="25" width="320" height="22" rx="10" fill="#334155" />
      <rect x="40" y="43" width="320" height="4" fill="#334155" />

      {/* botões da janela */}
      <circle cx="54" cy="36" r="3.5" fill="#ef4444" />
      <circle cx="66" cy="36" r="3.5" fill="#f59e0b" />
      <circle cx="78" cy="36" r="3.5" fill="#10b981" />

      {/* barra de URL */}
      <rect x="110" y="30" width="220" height="12" rx="6" fill="#475569" />

      {/* grade de tiles de vídeo (2x2) */}
      <g>
        {/* tile 1 */}
        <rect x="60" y="60" width="140" height="50" rx="6" fill="#475569" />
        <circle cx="130" cy="82" r="12" fill="#64748b" />
        <circle cx="130" cy="78" r="4" fill="#94a3b8" />
        <path d="M 118 95 Q 130 88 142 95 L 142 100 Q 130 96 118 100 Z" fill="#94a3b8" />
        {/* indicador ativo */}
        <circle cx="190" cy="68" r="3" fill="#10b981" />

        {/* tile 2 */}
        <rect x="205" y="60" width="135" height="50" rx="6" fill="#334155" />
        <circle cx="272" cy="82" r="12" fill="#475569" />
        <circle cx="272" cy="78" r="4" fill="#64748b" />
        <path d="M 260 95 Q 272 88 284 95 L 284 100 Q 272 96 260 100 Z" fill="#64748b" />

        {/* tile 3 */}
        <rect x="60" y="115" width="140" height="50" rx="6" fill="#334155" />
        <circle cx="130" cy="137" r="12" fill="#475569" />
        <circle cx="130" cy="133" r="4" fill="#64748b" />
        <path d="M 118 150 Q 130 143 142 150 L 142 155 Q 130 151 118 155 Z" fill="#64748b" />

        {/* tile 4 (você — destaque) */}
        <rect x="205" y="115" width="135" height="50" rx="6" fill="#1e40af" />
        <circle cx="272" cy="137" r="12" fill="#3b82f6" />
        <circle cx="272" cy="133" r="4" fill="#93c5fd" />
        <path d="M 260 150 Q 272 143 284 150 L 284 155 Q 272 151 260 155 Z" fill="#93c5fd" />
        <rect x="210" y="155" width="32" height="7" rx="2" fill="#60a5fa" opacity="0.8" />
      </g>

      {/* ícone de áudio captando */}
      <g transform="translate(340, 120)">
        <circle r="16" fill="#ef4444" opacity="0.15" />
        <circle r="10" fill="#ef4444" />
        <rect x="-1.5" y="-5" width="3" height="7" rx="1.5" fill="white" />
        <path d="M -4 1 Q -4 5 0 5 Q 4 5 4 1" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
