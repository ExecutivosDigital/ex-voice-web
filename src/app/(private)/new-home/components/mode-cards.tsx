"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowUpRight, Mic, Video } from "lucide-react";

export type RecordMode = "presencial" | "online";

interface ModeCardsProps {
  onSelect: (mode: RecordMode) => void;
}

export function ModeCards({ onSelect }: ModeCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ModeCard
        mode="presencial"
        title="Presencial"
        subtitle="Só microfone"
        description="Grave reuniões ao vivo, conversas e visitas com apenas um toque."
        icon={Mic}
        accent="from-gray-900 via-gray-800 to-gray-900"
        highlight="bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.18),transparent)]"
        onClick={() => onSelect("presencial")}
      />
      <ModeCard
        mode="online"
        title="Online"
        subtitle="Tela + áudio"
        description="Capture reuniões do Meet, Zoom e Teams com áudio da aba + microfone."
        icon={Video}
        accent="from-[#111827] via-[#1e2540] to-[#111827]"
        highlight="bg-[radial-gradient(60%_60%_at_50%_0%,rgba(120,145,255,0.25),transparent)]"
        onClick={() => onSelect("online")}
      />
    </div>
  );
}

interface ModeCardProps {
  mode: RecordMode;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Mic;
  accent: string;
  highlight: string;
  onClick: () => void;
}

function ModeCard({
  mode,
  title,
  subtitle,
  description,
  icon: Icon,
  accent,
  highlight,
  onClick,
}: ModeCardProps) {
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
      className={cn(
        "group relative flex w-full overflow-hidden rounded-2xl bg-gradient-to-br p-[1px] text-left shadow-lg shadow-black/5 transition",
        accent,
      )}
    >
      <div className="relative flex w-full flex-col gap-3 rounded-[calc(1rem-1px)] bg-gradient-to-br from-[#0b0c10] via-[#111318] to-[#1a1d24] p-4">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100",
            highlight,
          )}
        />

        <div className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-2xl transition-all duration-500 group-hover:bg-white/10" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-md transition group-hover:bg-white/15">
              <Icon size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-white md:text-xl">
                {title}
              </h3>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-white/50 uppercase">
                {subtitle}
              </p>
            </div>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition group-hover:border-white/40 group-hover:bg-white/20 group-hover:text-white">
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>

        <p className="relative max-w-sm text-xs leading-relaxed text-white/60">
          {description}
        </p>

        <div className="relative mt-0.5 flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-medium tracking-[0.18em] text-white/60 uppercase">
            Tocar para iniciar
          </span>
        </div>
      </div>
    </motion.button>
  );
}
