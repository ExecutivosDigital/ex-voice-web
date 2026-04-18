"use client";

import { useSession } from "@/context/auth";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowUpRight, Minus, Sparkles, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function formatCreditValue(seconds: number): string {
  const hours = seconds / 3600;
  if (hours > 24) return "Ilimitado";
  return `${Math.floor(hours)}h`;
}

type Tone = "neutral" | "trial" | "warn" | "danger" | "expired";

function toneGradients(tone: Tone) {
  switch (tone) {
    case "expired":
    case "danger":
      return {
        ringFrom: "#fb7185",
        ringTo: "#f43f5e",
        glow: "bg-rose-300/30",
        chip:
          "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_6px_14px_-4px_rgba(244,63,94,0.5)]",
      };
    case "warn":
      return {
        ringFrom: "#fbbf24",
        ringTo: "#f97316",
        glow: "bg-amber-300/30",
        chip:
          "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_6px_14px_-4px_rgba(245,158,11,0.55)]",
      };
    case "trial":
      return {
        ringFrom: "#111827",
        ringTo: "#6b7280",
        glow: "bg-gray-900/5",
        chip:
          "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-[0_6px_14px_-4px_rgba(17,24,39,0.4)]",
      };
    default:
      return {
        ringFrom: "#111827",
        ringTo: "#6b7280",
        glow: "bg-gray-900/5",
        chip:
          "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-[0_6px_14px_-4px_rgba(17,24,39,0.4)]",
      };
  }
}

function ProgressRing({
  percentage,
  tone,
  size = 56,
  stroke = 5,
}: {
  percentage: number;
  tone: Tone;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, percentage)) / 100);
  const { ringFrom, ringTo } = toneGradients(tone);
  const gradId = `ring-${tone}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ringFrom} />
          <stop offset="100%" stopColor={ringTo} />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(229, 231, 235, 0.7)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export function FloatingTrialWidget() {
  const {
    availableRecording,
    totalRecording,
    isTrial,
    availabilityLoaded,
    profile,
  } = useSession();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !availabilityLoaded || !profile || dismissed) return null;

  const isUnlimited =
    totalRecording > 0 && availableRecording / 3600 > 24;
  if (isUnlimited) return null;

  const isExpired =
    !isTrial && availableRecording === 0 && totalRecording === 0;
  const percentage =
    totalRecording > 0 ? (availableRecording / totalRecording) * 100 : 0;
  const isTimeBased = totalRecording >= 60;
  const availableLabel = isTimeBased
    ? formatCreditValue(availableRecording)
    : String(availableRecording);
  const totalLabel = isTimeBased
    ? formatCreditValue(totalRecording)
    : String(totalRecording);
  const isEmpty = totalRecording > 0 && availableRecording === 0;
  const isLow = totalRecording > 0 && percentage <= 25 && !isEmpty;

  const tone: Tone = isExpired
    ? "expired"
    : isEmpty
      ? "danger"
      : isLow
        ? "warn"
        : isTrial
          ? "trial"
          : "neutral";

  const { glow, chip } = toneGradients(tone);

  const headline = isExpired
    ? "Plano esgotado"
    : isEmpty
      ? "Sem créditos"
      : isLow
        ? "Consumo alto"
        : isTrial
          ? "Trial ativo"
          : "Seu plano";

  const subcopy = isExpired
    ? "Reative seu plano para continuar gravando."
    : isEmpty
      ? "Faça upgrade para liberar mais tempo de gravação."
      : isLow
        ? "Seu consumo está chegando no limite."
        : isTrial
          ? "Desbloqueie recursos ilimitados."
          : "Turbine sua conta e ganhe mais recursos.";

  const goPlans = () => router.push("/new-home/plans");

  if (collapsed) {
    return createPortal(
      <motion.button
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setCollapsed(false)}
        style={{ position: "fixed", bottom: 20, left: 20 }}
        className="group z-[9998] flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white/80 backdrop-blur-xl shadow-[0_16px_40px_-16px_rgba(15,23,42,0.25)] transition hover:scale-105 hover:shadow-[0_20px_48px_-16px_rgba(15,23,42,0.35)]"
        aria-label="Abrir consumo"
      >
        <div className={cn("absolute inset-0 rounded-full opacity-70 blur-xl", glow)} />
        <div className="relative">
          <ProgressRing percentage={percentage} tone={tone} size={44} stroke={4} />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Sparkles size={14} className="text-gray-800" />
          </span>
        </div>
      </motion.button>,
      document.body,
    );
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      style={{ position: "fixed", bottom: 20, left: 20 }}
      className="group z-[9998] w-[min(320px,calc(100vw-2.5rem))]"
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-3 rounded-[28px] blur-2xl opacity-80",
          glow,
        )}
      />

      <div className="relative overflow-hidden rounded-[22px] border border-white/80 bg-white/75 p-4 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25),0_0_0_1px_rgba(15,23,42,0.02)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.4)_100%)]" />

        <div className="relative flex items-start gap-3.5">
          <div className="relative">
            <ProgressRing percentage={percentage} tone={tone} />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold tabular-nums text-gray-900">
                {isExpired ? "0%" : `${Math.floor(percentage)}%`}
              </span>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.18em] text-gray-500 uppercase">
                  {isTrial && <Zap size={10} className="text-amber-500" />}
                  {headline}
                </p>
                <p className="mt-1 text-lg leading-none font-semibold tabular-nums text-gray-900">
                  {isExpired ? (
                    "—"
                  ) : (
                    <>
                      {availableLabel}
                      <span className="ml-1 text-xs font-normal text-gray-400">
                        / {totalLabel}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex shrink-0 items-center -mt-1 -mr-1">
                <button
                  onClick={() => setCollapsed(true)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Minimizar"
                >
                  <Minus size={12} />
                </button>
                {!isTrial && !isExpired && !isLow && !isEmpty && (
                  <button
                    onClick={() => setDismissed(true)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Fechar"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="relative mt-3 text-[11px] leading-relaxed text-gray-500">
          {subcopy}
        </p>

        <button
          onClick={goPlans}
          className={cn(
            "group/btn relative mt-3 flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-xl py-2.5 text-xs font-semibold transition hover:scale-[1.02]",
            chip,
          )}
        >
          <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.35)_50%,transparent_75%)] bg-[length:250%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
          <Sparkles size={12} className="relative" />
          <span className="relative">Fazer upgrade</span>
          <ArrowUpRight
            size={12}
            className="relative transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          />
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}
