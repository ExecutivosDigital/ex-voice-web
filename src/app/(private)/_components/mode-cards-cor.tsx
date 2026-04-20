"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowRight, Mic, Video } from "lucide-react";
import { RecordMode } from "./mode-cards";

interface ModeCardsCorProps {
  onSelect: (mode: RecordMode) => void;
}

export function ModeCardsCor({ onSelect }: ModeCardsCorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CorCard
        mode="presencial"
        title="Presencial"
        subtitle="Só microfone"
        description="Grave reuniões ao vivo, conversas e visitas."
        icon={Mic}
        palette={{
          bg: "bg-amber-50",
          bgAccent: "bg-amber-100/60",
          border: "border-amber-200/80",
          borderHover: "hover:border-amber-300",
          iconBg: "bg-amber-500",
          iconBorder: "ring-amber-200",
          text: "text-amber-900",
          muted: "text-amber-700/80",
          label: "text-amber-700",
        }}
        onClick={() => onSelect("presencial")}
      />
      <CorCard
        mode="online"
        title="Online"
        subtitle="Tela + áudio"
        description="Meet, Zoom e Teams com áudio da aba + microfone."
        icon={Video}
        palette={{
          bg: "bg-sky-50",
          bgAccent: "bg-sky-100/60",
          border: "border-sky-200/80",
          borderHover: "hover:border-sky-300",
          iconBg: "bg-sky-500",
          iconBorder: "ring-sky-200",
          text: "text-sky-900",
          muted: "text-sky-700/80",
          label: "text-sky-700",
        }}
        onClick={() => onSelect("online")}
      />
    </div>
  );
}

interface Palette {
  bg: string;
  bgAccent: string;
  border: string;
  borderHover: string;
  iconBg: string;
  iconBorder: string;
  text: string;
  muted: string;
  label: string;
}

interface CorCardProps {
  mode: RecordMode;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Mic;
  palette: Palette;
  onClick: () => void;
}

function CorCard({
  mode,
  title,
  subtitle,
  description,
  icon: Icon,
  palette,
  onClick,
}: CorCardProps) {
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
        "group relative flex w-full cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border p-5 text-left shadow-sm transition-all duration-300",
        palette.bg,
        palette.border,
        palette.borderHover,
        "hover:shadow-lg hover:shadow-gray-900/5",
        "focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:outline-none",
      )}
    >
      {/* blob ambiente canto */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-80",
          palette.bgAccent,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl ring-4 ring-offset-0 transition-transform duration-300 group-hover:scale-105",
            palette.iconBg,
            palette.iconBorder,
          )}
        >
          <Icon size={22} className="text-white" strokeWidth={2.2} />
        </div>
        <span
          className={cn(
            "text-[10px] font-semibold tracking-[0.22em] uppercase",
            palette.label,
          )}
        >
          {subtitle}
        </span>
      </div>

      <div className="relative flex flex-col gap-1.5">
        <h3 className={cn("text-xl font-semibold md:text-2xl", palette.text)}>
          {title}
        </h3>
        <p className={cn("text-sm leading-relaxed", palette.muted)}>
          {description}
        </p>
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-2 rounded-xl bg-white/70 px-3.5 py-2.5 ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:ring-black/10">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-sm font-semibold text-gray-900">
            Iniciar gravação
          </span>
        </span>
        <ArrowRight
          size={15}
          className="text-gray-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gray-900"
        />
      </div>
    </motion.button>
  );
}
