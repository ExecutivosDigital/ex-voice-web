"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Mic } from "lucide-react";
import { RecordMode } from "./mode-cards";

interface ModeCardsLogosProps {
  onSelect: (mode: RecordMode) => void;
}

export function ModeCardsLogos({ onSelect }: ModeCardsLogosProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <PresencialCard onClick={() => onSelect("presencial")} />
      <OnlineCard onClick={() => onSelect("online")} />
    </div>
  );
}

const cardBase =
  "group relative flex w-full cursor-pointer flex-col gap-5 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5 focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:outline-none";

function PresencialCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      aria-label="Iniciar gravação presencial"
      className={cn(cardBase)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-inner">
          <Mic size={22} className="text-white" strokeWidth={2} />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-gray-600 uppercase">
          <MapPin size={10} /> no local
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">
          Presencial
        </h3>
        <p className="text-sm leading-relaxed text-gray-500">
          Grave reuniões ao vivo, conversas e visitas com o microfone do seu
          dispositivo.
        </p>
      </div>

      {/* placeholder visual: ambientes */}
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-2">
        <span className="text-[11px] font-medium tracking-wide text-gray-500">
          Escritório · Sala · Café · Externa
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 rounded-xl bg-gray-900 px-4 py-3 text-white transition-all duration-300 group-hover:bg-red-600">
        <span className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="text-sm font-semibold">Iniciar gravação</span>
        </span>
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </div>
    </motion.button>
  );
}

function OnlineCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      aria-label="Iniciar gravação online"
      className={cn(cardBase)}
    >
      <div className="flex items-start justify-between gap-3">
        {/* cluster de logos */}
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
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          online
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">
          Online
        </h3>
        <p className="text-sm leading-relaxed text-gray-500">
          Capture reuniões do Meet, Zoom e Teams com áudio da aba + microfone.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-2">
        <span className="text-[11px] font-medium tracking-wide text-gray-500">
          Tela + áudio do sistema
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 rounded-xl bg-gray-900 px-4 py-3 text-white transition-all duration-300 group-hover:bg-red-600">
        <span className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="text-sm font-semibold">Iniciar gravação</span>
        </span>
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </div>
    </motion.button>
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
      <path
        d="M6 9h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6V9z"
        fill="white"
      />
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
