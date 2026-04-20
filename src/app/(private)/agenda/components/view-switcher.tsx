"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

export type AgendaView = "day" | "month" | "year";

interface ViewSwitcherProps {
  value: AgendaView;
  onChange: (view: AgendaView) => void;
}

const OPTIONS: { value: AgendaView; label: string }[] = [
  { value: "day", label: "Dia" },
  { value: "month", label: "Mês" },
  { value: "year", label: "Ano" },
];

export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className="relative inline-flex items-center gap-0.5 rounded-full border border-gray-200 bg-white/80 p-1 backdrop-blur-sm">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 rounded-full px-3.5 py-1 text-[11px] font-semibold tracking-wider uppercase transition-colors",
              active ? "text-white" : "text-gray-500 hover:text-gray-900",
            )}
          >
            {active && (
              <motion.span
                layoutId="agenda-view-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-[0_6px_18px_-8px_rgba(17,24,39,0.45)]"
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
