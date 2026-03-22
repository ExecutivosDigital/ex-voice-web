"use client";

import { useSession } from "@/context/auth";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/blocks/dialog";
import { cn } from "@/utils/cn";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Crown,
  Mic,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "trialAppModalClosedAt";
const COOLDOWN_MINUTES = 30;

function formatCredits(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h${m}m` : `${h}h`;
  }
  if (seconds >= 60) return `${Math.floor(seconds / 60)}min`;
  return `${seconds}s`;
}

function CreditRing({
  percentage,
  available,
  total,
  isEmpty,
  isLow,
}: {
  percentage: number;
  available: string;
  total: string;
  isEmpty: boolean;
  isLow: boolean;
}) {
  const size = 120;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;
  const strokeColor = isEmpty
    ? "rgb(248 113 113)"
    : isLow
      ? "rgb(251 191 36)"
      : "rgb(52 211 153)";

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-bold text-white">{available}</span>
        <span className="text-[10px] text-white/45">de {total}</span>
      </div>
    </div>
  );
}

export function TrialAppModal() {
  const {
    isTrial,
    profile,
    availableRecording,
    totalRecording,
    availabilityLoaded,
    handleGetAvailableRecording,
  } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const refreshAvailability = useCallback(() => {
    void handleGetAvailableRecording();
  }, [handleGetAvailableRecording]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!profile || !isTrial) {
      setIsOpen(false);
      return;
    }

    const closedAt = localStorage.getItem(STORAGE_KEY);
    if (!closedAt) {
      setIsOpen(true);
      return;
    }

    const closedTimestamp = parseInt(closedAt, 10);
    const minutesSinceClosed = (Date.now() - closedTimestamp) / (1000 * 60);
    setIsOpen(minutesSinceClosed >= COOLDOWN_MINUTES);
  }, [profile, isTrial]);

  useEffect(() => {
    if (isOpen && isTrial) {
      refreshAvailability();
    }
  }, [isOpen, isTrial, refreshAvailability]);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
    setIsOpen(false);
  };

  const goToPlans = () => {
    handleClose();
    router.push("/plans");
  };

  if (!isOpen || !isTrial || !profile) return null;

  const percentage =
    totalRecording > 0
      ? Math.min(100, Math.round((availableRecording / totalRecording) * 100))
      : 0;
  const isEmpty = totalRecording > 0 && availableRecording <= 0;
  const isLow = !isEmpty && percentage > 0 && percentage < 25;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) setIsOpen(true);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="z-[100] bg-black/75 backdrop-blur-md" />
        <DialogPrimitive.Content
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[101] max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[860px] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl duration-200",
          )}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex max-h-[92vh] flex-col md:max-h-[min(560px,92vh)] md:flex-row">
            {/* Lado esquerdo — imagem + anel de créditos */}
            <div className="relative flex min-h-[220px] w-full shrink-0 flex-col items-center justify-center overflow-hidden bg-black md:w-[42%] md:min-h-[min(560px,92vh)]">
              <Image
                src="/ex-team.png"
                alt=""
                fill
                className="object-cover opacity-90"
                sizes="(max-width:768px) 100vw, 360px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

              {availabilityLoaded && totalRecording > 0 && (
                <div className="relative z-10 flex flex-col items-center gap-2 py-8 md:py-0">
                  <CreditRing
                    percentage={percentage}
                    available={formatCredits(availableRecording)}
                    total={formatCredits(totalRecording)}
                    isEmpty={isEmpty}
                    isLow={isLow}
                  />
                  <span className="text-[11px] font-medium text-white/40">
                    Créditos restantes
                  </span>
                </div>
              )}
            </div>

            {/* Lado direito — conteúdo */}
            <div className="flex flex-1 flex-col justify-center overflow-y-auto px-7 py-9 sm:px-10 sm:py-10">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-5 flex items-center gap-3"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>
                  Trial ativo
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-2 text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl"
              >
                Seu potencial vai{" "}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  além do trial
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-7 max-w-sm text-[15px] leading-relaxed text-white/50"
              >
                Assine um plano e tenha acesso completo a gravações, relatórios
                com IA e suporte dedicado.
              </motion.p>

              {availabilityLoaded && totalRecording > 0 && (
                <div className="mb-6 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 md:hidden">
                  <CreditRing
                    percentage={percentage}
                    available={formatCredits(availableRecording)}
                    total={formatCredits(totalRecording)}
                    isEmpty={isEmpty}
                    isLow={isLow}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-white/60">
                      Créditos restantes
                    </span>
                    {isEmpty ? (
                      <span className="text-xs text-red-400">
                        Seus créditos acabaram
                      </span>
                    ) : isLow ? (
                      <span className="text-xs text-amber-400">
                        Créditos acabando
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-400">
                        Créditos disponíveis
                      </span>
                    )}
                  </div>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-8 flex flex-wrap gap-2"
              >
                {[
                  { icon: Mic, label: "Gravações ilimitadas" },
                  { icon: Sparkles, label: "Relatórios com IA" },
                  { icon: Zap, label: "Suporte prioritário" },
                  { icon: Crown, label: "Recursos premium" },
                ].map((feat) => (
                  <span
                    key={feat.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60"
                  >
                    <feat.icon className="h-3 w-3 text-white/30" />
                    {feat.label}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  onClick={goToPlans}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-neutral-700 to-neutral-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-neutral-600 hover:to-neutral-800 sm:w-auto"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 transition group-hover:opacity-100" />
                  Ver planos e assinar
                  <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-sm font-medium text-white/35 transition hover:text-white/55"
                >
                  Agora não
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/45"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-[#F7CE46] text-[#F7CE46]"
                    />
                  ))}
                  <span className="ml-1 font-semibold text-white/70">4.9</span>
                </div>
                <span className="hidden h-3 w-px bg-white/20 sm:block" />
                <span>+10.000 profissionais confiam no EX Voice</span>
              </motion.div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
