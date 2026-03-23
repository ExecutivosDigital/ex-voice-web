"use client";

import { RequestTranscription } from "@/components/ui/request-transcription";
import { Mic, Loader2, Sparkles, Clock } from "lucide-react";
import { useGeneralContext } from "@/context/GeneralContext";

interface TranscriptionEmptyStateProps {
  description?: string;
}

export function TranscriptionEmptyState({
  description = "O áudio desta gravação ainda não foi transcrito. Solicite agora para gerar a transcrição automaticamente.",
}: TranscriptionEmptyStateProps) {
  const { selectedRecording } = useGeneralContext();
  const isPending = selectedRecording?.transcriptionStatus === "PENDING";

  if (isPending) {
    return (
      <div className="flex flex-1 w-full h-full flex-col items-center justify-center px-8 py-16 select-none mt-10">
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          {/* Animated 3D Loader Container */}
          <div className="relative mb-8 flex justify-center w-full">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/20 blur-2xl" />
            
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 shadow-xl shadow-amber-200/50 ring-1 ring-amber-200/50">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/40 to-transparent" />
              <Loader2 className="h-10 w-10 animate-spin text-amber-500 relative z-10" />
              
              {/* Floating badges */}
              <div className="absolute -right-3 -top-3 flex items-center justify-center rounded-full bg-white p-1.5 shadow-md">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              Processando Áudio
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Transcrição em Andamento
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Sua transcrição foi solicitada e está sendo gerada. Isso pode levar alguns minutos dependendo do tamanho do áudio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full h-full flex-col items-center justify-center px-8 py-16 select-none mt-10">
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
        {/* 3D Illustration */}
        <div className="relative mb-10 flex justify-center w-full">
          {/* Ambient glow behind card */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-48 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300/30 blur-3xl" />

          {/* Main 3D card */}
          <div
            className="relative w-64 rounded-[28px] p-6 lg:w-72"
            style={{
              background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
              transform: "perspective(900px) rotateX(14deg) rotateY(-8deg)",
              transformStyle: "preserve-3d",
              boxShadow:
                "0 40px 80px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Top shine */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[28px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 50%)",
              }}
            />

            {/* macOS-style dots */}
            <div className="mb-5 flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <div className="h-3 w-3 rounded-full bg-green-400/70" />
            </div>

            {/* Header row */}
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <Mic className="h-6 w-6 text-white/60" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-2 w-24 rounded-full bg-white/15 lg:w-28" />
                <div className="h-2 w-16 rounded-full bg-white/08" style={{ opacity: 0.08 }} />
              </div>
            </div>

            {/* Waveform bars */}
            <div className="flex items-end gap-[3px] justify-center" style={{ height: "48px" }}>
              {[20, 36, 24, 44, 32, 52, 40, 28, 48, 36, 20, 44, 32, 48, 28, 36].map(
                (h, i) => (
                  <div
                    key={i}
                    className="w-[4px] lg:w-[5px] flex-shrink-0 rounded-full"
                    style={{
                      height: `${h}px`,
                      background:
                        i % 2 === 0
                          ? "rgba(255,255,255,0.18)"
                          : "rgba(255,255,255,0.10)",
                    }}
                  />
                ),
              )}
            </div>

            {/* Footer row */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/25">
                Sem transcrição
              </span>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400/80" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Vazio
                </span>
              </div>
            </div>
          </div>

          {/* Floating pill — top right */}
          <div
            className="absolute -right-2 -top-3 lg:-right-5 lg:-top-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-xl shadow-slate-300/50 ring-1 ring-slate-100/80"
            style={{ transform: "translateZ(30px)" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px] font-semibold text-slate-600">
              Gere Agora
            </span>
          </div>

          {/* Floating pill — bottom left */}
          <div className="absolute -bottom-3 -left-2 lg:-bottom-3 lg:-left-5 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-xl shadow-slate-300/50 ring-1 ring-slate-100/80">
            <div className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="text-[11px] font-semibold text-slate-400">
              Áudio não processado
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <h2 className="text-xl font-bold text-slate-800">
            Transcrição não disponível
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex w-full justify-center items-center">
          <RequestTranscription />
        </div>
      </div>
    </div>
  );
}

