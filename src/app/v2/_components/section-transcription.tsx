"use client";

import { Briefcase, Copy, Download, Search, Users } from "lucide-react";
import { mockTranscriptSegments } from "../_mocks";

export function SectionTranscription({ duration }: { duration: string }) {
  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neutral-900" />
            Profissional (direita)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neutral-200" />
            Contato (esquerda)
          </span>
          <span className="text-neutral-300">·</span>
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              placeholder="Buscar na transcrição..."
              className="w-56 rounded-lg border border-neutral-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50">
            <Users className="h-3.5 w-3.5" />
            Organizar Locutores
          </button>
          <button
            aria-label="Baixar"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="Copiar tudo"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Segments */}
      <div className="space-y-4">
        {mockTranscriptSegments.map((seg, i) => {
          const right = seg.role === "profissional";
          return (
            <div
              key={i}
              className={`flex items-end gap-3 ${right ? "flex-row-reverse" : "flex-row"}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  right
                    ? "bg-gradient-to-br from-neutral-500 to-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {right ? <Briefcase className="h-3.5 w-3.5" /> : seg.speaker.slice(0, 1)}
              </span>
              <div className={`max-w-[75%] ${right ? "text-right" : ""}`}>
                <div className="mb-1 flex items-center gap-2 text-[11px]">
                  <span className="font-semibold text-neutral-900">{seg.speaker}</span>
                  <span className="text-neutral-400">{seg.timestamp}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm ${
                    right
                      ? "rounded-br-sm bg-gradient-to-br from-neutral-500 to-neutral-900 text-white"
                      : "rounded-bl-sm border border-neutral-100 bg-neutral-50 text-neutral-800"
                  }`}
                >
                  {seg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
