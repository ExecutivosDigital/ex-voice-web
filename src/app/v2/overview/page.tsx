"use client";

import {
  Calendar,
  Check,
  Clock,
  Copy,
  FileDown,
  Pencil,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { mockRecording, overviewSections } from "../_mocks";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";

export default function OverviewV2() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Shell
        breadcrumbs={[
          { label: "Contatos", href: "/v2/clients" },
          { label: mockRecording.client, href: "/v2/clients/c1" },
          { label: mockRecording.title },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-3xl space-y-10">
          {/* Header */}
          <header>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <Sparkles className="h-3 w-3" />
              Insights da consulta
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
              {mockRecording.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {mockRecording.client}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {mockRecording.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {mockRecording.duration}
              </span>
            </div>
          </header>

          {/* Tabs */}
          <nav className="flex items-center gap-1 border-b border-neutral-100">
            {[
              { label: "Resumo", href: "#" },
              { label: "Insights", href: "#", active: true },
              { label: "Chat", href: "#" },
              { label: "Transcrição", href: "#" },
            ].map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className={`relative px-4 py-3 text-sm font-medium transition ${
                  t.active
                    ? "text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {t.label}
                {t.active && (
                  <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-neutral-900" />
                )}
              </Link>
            ))}
          </nav>

          {/* Sections */}
          <article className="space-y-12">
            {overviewSections.map((section, idx) => (
              <section key={section.title} className="group">
                <div className="mb-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-neutral-300">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                    <button
                      aria-label="Editar seção"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label="Copiar"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <ul className="space-y-3 pl-7">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </article>

          {/* Quiet footer */}
          <footer className="flex items-center justify-between border-t border-neutral-100 pt-8 text-xs text-neutral-500">
            <span>Gerado pela IA em {mockRecording.date}</span>
            <Link
              href="#"
              className="text-neutral-500 transition hover:text-neutral-900"
            >
              Personalizar insights
            </Link>
          </footer>
        </div>

        {/* Sticky export — floats bottom-right */}
        <div className="pointer-events-none fixed bottom-6 right-6 z-10">
          <button className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-neutral-500 to-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-900/25 transition hover:shadow-xl active:scale-[0.98]">
            <FileDown className="h-4 w-4" />
            Exportar em PDF
          </button>
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
