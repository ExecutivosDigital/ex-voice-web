"use client";

import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { VariantColor } from "./types";

/**
 * Casca comum de todos os cards da análise: borda, header com ícone e título,
 * slot de ação no canto (ex.: copiar tudo). Os cards só cuidam do conteúdo.
 */

const VARIANTS: Record<
  VariantColor,
  { border: string; iconBg: string; iconText: string }
> = {
  emerald: {
    border: "border-emerald-100",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
  },
  blue: {
    border: "border-blue-100",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
  },
  violet: {
    border: "border-violet-100",
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
  },
  amber: {
    border: "border-amber-100",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
  },
  teal: {
    border: "border-teal-100",
    iconBg: "bg-teal-50",
    iconText: "text-teal-600",
  },
  gray: {
    border: "border-gray-200/70",
    iconBg: "bg-gray-100",
    iconText: "text-gray-600",
  },
  rose: {
    border: "border-rose-100",
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
  },
};

export function CardShell({
  icon: Icon,
  title,
  variant = "gray",
  headerAction,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  variant?: VariantColor;
  /** Renderizado no canto direito do header (ex.: botão copiar, chip). */
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const styles = VARIANTS[variant] ?? VARIANTS.gray;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm",
        styles.border,
        className,
      )}
    >
      <div
        className={cn("flex items-center gap-3 border-b px-5 py-4", styles.border)}
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            styles.iconBg,
            styles.iconText,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3
          title={title}
          className="min-w-0 flex-1 truncate leading-snug font-semibold text-gray-900"
        >
          {title}
        </h3>
        {headerAction}
      </div>
      {children}
    </div>
  );
}

/** Botão "copiar tudo" do header — feedback inline de copiado. */
export function CopyAllButton({
  copied,
  onCopy,
}: {
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      onClick={onCopy}
      className={cn(
        "ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition",
        copied
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800",
      )}
      aria-label="Copiar tudo"
    >
      {copied ? "copiado" : "copiar tudo"}
    </button>
  );
}
