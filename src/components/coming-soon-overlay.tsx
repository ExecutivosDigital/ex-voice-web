"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  compact?: boolean;
  badge?: boolean;
  backdropClassName?: string;
};

export function ComingSoonOverlay({
  children,
  title = "Estamos preparando essa visão",
  description = "Esta seção ainda está em desenvolvimento. Em breve você terá acesso a todos os detalhes aqui.",
  compact = false,
  badge = false,
  backdropClassName,
}: Props) {
  if (badge) {
    return (
      <div className="relative inline-flex">
        <div className="pointer-events-none select-none opacity-50 blur-[1.5px]" aria-hidden>
          {children}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-[9px] font-bold tracking-[0.22em] text-white uppercase shadow-md shadow-gray-900/30">
            <Sparkles size={10} />
            Em breve
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[3px]" aria-hidden>
        {children}
      </div>

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-sm",
          backdropClassName ?? (compact ? "rounded-2xl" : "rounded-[24px]"),
        )}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={
            compact
              ? "relative flex flex-col items-center gap-2 rounded-2xl border border-white/40 bg-white/90 px-4 py-4 text-center shadow-[0_12px_32px_-16px_rgba(15,23,42,0.5)] backdrop-blur-md"
              : "relative flex max-w-md flex-col items-center gap-4 rounded-3xl border border-white/40 bg-white/90 px-8 py-10 text-center shadow-[0_20px_60px_-20px_rgba(15,23,42,0.45)] backdrop-blur-md"
          }
        >
          <span
            className={
              compact
                ? "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-md shadow-gray-900/30"
                : "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg shadow-gray-900/30"
            }
          >
            <Sparkles size={compact ? 16 : 24} />
          </span>
          <div className="flex flex-col gap-1">
            <span
              className={
                compact
                  ? "text-[9px] font-semibold tracking-[0.28em] text-gray-700 uppercase"
                  : "text-[11px] font-semibold tracking-[0.32em] text-gray-700 uppercase"
              }
            >
              Em breve
            </span>
            {!compact && (
              <>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {description}
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
