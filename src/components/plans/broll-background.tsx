"use client";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

type BrollVariant = "default" | "checkout";

type BrollBackgroundProps = {
  /** Classes no wrapper externo (ex.: absolute inset-0) */
  className?: string;
  /** Classes extra no elemento <video> */
  videoClassName?: string;
  /** Opacidade do vídeo (0–1). Se omitido, usa o padrão do variant. */
  videoOpacity?: number;
  /**
   * `default` = painel /plans (overlays fortes).
   * `checkout` = fundo full-screen mais claro para o movimento do B-roll ser visível.
   */
  variant?: BrollVariant;
};

const VARIANT_PRESETS: Record<
  BrollVariant,
  { opacity: number; overlay1: string; overlay2: string; preload: "auto" | "metadata" }
> = {
  default: {
    opacity: 0.4,
    overlay1: "bg-black/70",
    overlay2: "bg-gradient-to-t from-black/70 via-transparent to-black/30",
    preload: "metadata",
  },
  checkout: {
    opacity: 0.72,
    overlay1: "bg-black/38",
    overlay2:
      "bg-gradient-to-b from-black/45 via-black/25 to-black/55",
    preload: "auto",
  },
};

/**
 * Vídeo B-roll em loop com overlays escuros (reutilizável em /plans e /checkout).
 * Com `prefers-reduced-motion: reduce`, mostra gradiente estático em vez de vídeo.
 */
export function BrollBackground({
  className,
  videoClassName,
  videoOpacity: videoOpacityProp,
  variant = "default",
}: BrollBackgroundProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preset = VARIANT_PRESETS[variant];
  const videoOpacity = videoOpacityProp ?? preset.opacity;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Garante play em browsers que seguram autoplay até haver interação (muted costuma bastar)
  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduceMotion) return;
    const run = () => {
      el.play().catch(() => {
        /* autoplay bloqueado — fica pausado até gesto do user */
      });
    };
    run();
    el.addEventListener("loadeddata", run);
    return () => el.removeEventListener("loadeddata", run);
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "absolute inset-0 z-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload={preset.preload}
        className={cn(
          "absolute inset-0 z-0 h-full w-full object-cover",
          videoClassName,
        )}
        style={{ opacity: videoOpacity }}
      >
        <source src="/B-Rolls.mp4" type="video/mp4" />
      </video>
      <div className={cn("absolute inset-0 z-[1]", preset.overlay1)} />
      <div className={cn("absolute inset-0 z-[2]", preset.overlay2)} />
    </div>
  );
}

type BrollHeroStripProps = {
  className?: string;
};

/** Faixa compacta com o mesmo B-roll para mobile (substitui painel escondido em lg). */
export function BrollHeroStrip({ className }: BrollHeroStripProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "relative h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-black lg:hidden",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "relative h-40 w-full overflow-hidden rounded-2xl lg:hidden",
        className,
      )}
      aria-hidden
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      >
        <source src="/B-Rolls.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 left-4 right-4">
        <p className="text-xs font-semibold tracking-wide text-white/90">
          EX Voice — gravações inteligentes com IA
        </p>
      </div>
    </div>
  );
}
