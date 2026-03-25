"use client";

import { useSession } from "@/context/auth";
import { cn } from "@/utils/cn";
import { ChevronRight, Crown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

function formatCreditValue(seconds: number): string {
  const hours = seconds / 3600;

  if (hours > 24) {
    return "Ilimitado";
  }

  return `${Math.floor(hours)}h`;
}

export function CreditsIndicator({ className }: { className?: string }) {
  const {
    availableRecording,
    totalRecording,
    isTrial,
    availabilityLoaded,
    profile,
  } = useSession();
  const router = useRouter();

  if (!availabilityLoaded || !profile) return null;

  const isExpired =
    !isTrial && availableRecording === 0 && totalRecording === 0;
  const percentage =
    totalRecording > 0 ? (availableRecording / totalRecording) * 100 : 0;
  const isLow = totalRecording > 0 && percentage <= 20;
  const isEmpty = totalRecording > 0 && availableRecording === 0;

  const isTimeBased = totalRecording >= 60;
  const availableLabel = isTimeBased
    ? formatCreditValue(availableRecording)
    : String(availableRecording);
  const totalLabel = isTimeBased
    ? formatCreditValue(totalRecording)
    : String(totalRecording);
  const isUnlimitedPlan =
    availableLabel === "Ilimitado" && totalLabel === "Ilimitado";

  const statusColor = isEmpty
    ? "from-red-500 to-red-400"
    : isLow
      ? "from-amber-500 to-yellow-400"
      : "from-emerald-500 to-emerald-400";

  const statusBg = isEmpty
    ? "bg-red-500"
    : isLow
      ? "bg-amber-500"
      : "bg-emerald-500";

  const dotPing = isEmpty
    ? "bg-red-400"
    : isLow
      ? "bg-amber-400"
      : "bg-emerald-400";

  if (isExpired) {
    return (
      <button
        onClick={() => router.push("/plans")}
        className={cn(
          "group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-amber-400/20 bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-4 py-2 text-white transition-all duration-300 hover:border-amber-400/40 hover:from-amber-500/25 hover:to-orange-500/20 hover:shadow-lg hover:shadow-amber-500/10",
          className,
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(251,191,36,0.06)_50%,transparent_75%)] bg-[length:250%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-400/20">
          <Crown className="h-4 w-4 text-amber-400" />
        </div>
        <div className="relative flex flex-col items-start">
          <span className="text-xs font-bold leading-tight text-amber-200">
            Assinar Plano
          </span>
          <span className="hidden text-[10px] leading-tight text-white/40 sm:inline">
            Desbloqueie gravações
          </span>
        </div>
        <ChevronRight className="relative h-4 w-4 shrink-0 text-amber-400/50 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push("/plans")}
      className={cn(
        "group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.06] px-3.5 py-2 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.10] hover:shadow-lg hover:shadow-black/20",
        isEmpty &&
          "border-red-500/20 bg-red-500/[0.08] hover:border-red-500/30 hover:bg-red-500/[0.12]",
        isLow &&
          !isEmpty &&
          "border-amber-500/20 bg-amber-500/[0.06] hover:border-amber-500/30 hover:bg-amber-500/[0.10]",
        className,
      )}
    >
      {/* Status dot with ping */}
      <div className="relative flex shrink-0 items-center justify-center">
        <span
          className={cn(
            "absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full opacity-40",
            dotPing,
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full shadow-sm",
            statusBg,
          )}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold leading-none tabular-nums tracking-tight">
            {isUnlimitedPlan ? (
              "Ilimitado"
            ) : (
              <>
                {availableLabel}
                <span className="text-white/30"> / </span>
                <span className="text-white/50">{totalLabel}</span>
              </>
            )}
          </span>

          {!isUnlimitedPlan && (
            <span className="hidden text-[11px] leading-none text-white/35 sm:inline">
              {isTimeBased ? "restante" : "gravações"}
            </span>
          )}

          {isTrial && (
            <span className="flex items-center gap-1 rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wider text-amber-300">
              <Sparkles className="h-2.5 w-2.5" />
              TRIAL
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/[0.08] sm:w-32">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
              statusColor,
            )}
            style={{ width: `${Math.max(percentage, 2)}%` }}
          />
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-white/20 transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}
