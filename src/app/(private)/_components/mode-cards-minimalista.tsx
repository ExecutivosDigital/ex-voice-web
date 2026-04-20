"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Mic, Video } from "lucide-react";
import { RecordMode } from "./mode-cards";

interface ModeCardsMinimalistaProps {
  onSelect: (mode: RecordMode) => void;
}

export function ModeCardsMinimalista({ onSelect }: ModeCardsMinimalistaProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <MinimalistaCard
        mode="presencial"
        title="Presencial"
        subtitle="Só microfone"
        icon={Mic}
        onClick={() => onSelect("presencial")}
      />
      <MinimalistaCard
        mode="online"
        title="Online"
        subtitle="Tela + áudio"
        icon={Video}
        onClick={() => onSelect("online")}
      />
    </div>
  );
}

interface MinimalistaCardProps {
  mode: RecordMode;
  title: string;
  subtitle: string;
  icon: typeof Mic;
  onClick: () => void;
}

function MinimalistaCard({
  mode,
  title,
  subtitle,
  icon: Icon,
  onClick,
}: MinimalistaCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: mode === "presencial" ? 0.05 : 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      aria-label={`Iniciar gravação ${title.toLowerCase()}`}
      className={cn(
        "group relative flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm transition-all duration-300",
        "hover:border-gray-900 hover:shadow-md",
        "active:bg-gray-50",
        "focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:outline-none",
      )}
    >
      {/* indicador visual de "isto é clicável" — barra lateral que cresce no hover */}
      <span
        aria-hidden
        className="absolute top-0 bottom-0 left-0 w-0.5 bg-gray-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition-colors duration-300 group-hover:border-gray-300 group-hover:bg-white">
          <Icon size={18} className="text-gray-700" strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>

      {/* cápsula de ação — usa affordance padrão de botão */}
      <span className="flex shrink-0 items-center gap-2 rounded-full bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-300 group-hover:bg-red-600 group-hover:shadow-md group-hover:shadow-red-600/30">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        Gravar
      </span>
    </motion.button>
  );
}
