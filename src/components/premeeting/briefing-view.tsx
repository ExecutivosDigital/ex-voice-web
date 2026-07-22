"use client";

import { cn } from "@/utils/cn";
import {
  AlertTriangle,
  ArrowRight,
  FileText,
  MessageCircle,
  Target,
} from "lucide-react";
import Link from "next/link";

/**
 * Visual do briefing de pre-meeting — COMPARTILHADO entre a modal da Agenda
 * (evento do Google) e a da tela do contato (feedback 22/07: os dois lugares
 * precisam ser o MESMO briefing, não motores paralelos).
 */

export interface PreMeetingBriefing {
  primeiraConversa: boolean;
  objetivo: string;
  retomar: string[];
  cuidados: string[];
  perguntas: string[];
  baseadoEm: { recordingId: string; name: string; date: string }[];
  contatos: { id: string; name: string; empresa: string | null }[];
  promptIdUsado: string | null;
}

/** Briefing em texto puro (botão copiar / colar em outro lugar). */
export function briefingParaTexto(briefing: PreMeetingBriefing): string {
  const secao = (titulo: string, itens: string[]) =>
    itens.length ? `\n${titulo}:\n${itens.map((i) => `- ${i}`).join("\n")}` : "";
  return [
    `Objetivo: ${briefing.objetivo}`,
    secao("Retomar", briefing.retomar),
    secao("Cuidados", briefing.cuidados),
    secao("Perguntas sugeridas", briefing.perguntas),
  ]
    .filter(Boolean)
    .join("\n");
}

export function BriefingView({ briefing }: { briefing: PreMeetingBriefing }) {
  return (
    <div className="flex flex-col gap-5">
      {briefing.primeiraConversa && (
        <p className="rounded-2xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600">
          Ainda não há reuniões gravadas com este contato — este é um roteiro
          de primeira conversa.
        </p>
      )}

      <Bloco icone={Target} titulo="Objetivo da reunião">
        <p className="text-sm leading-relaxed text-gray-700">
          {briefing.objetivo}
        </p>
      </Bloco>

      {briefing.retomar.length > 0 && (
        <Bloco icone={ArrowRight} titulo="Retomar (ficou em aberto)">
          <Lista itens={briefing.retomar} tom="bg-gray-50 text-gray-700" />
        </Bloco>
      )}

      {briefing.cuidados.length > 0 && (
        <Bloco icone={AlertTriangle} titulo="Cuidados">
          <Lista itens={briefing.cuidados} tom="bg-amber-50 text-amber-800" />
        </Bloco>
      )}

      {briefing.perguntas.length > 0 && (
        <Bloco icone={MessageCircle} titulo="Perguntas sugeridas">
          <Lista
            itens={briefing.perguntas}
            tom="bg-emerald-50/60 text-emerald-900"
          />
        </Bloco>
      )}

      {briefing.baseadoEm.length > 0 && (
        <Bloco icone={FileText} titulo="Baseado nas gravações">
          <div className="flex flex-col gap-1">
            {briefing.baseadoEm.map((r) => (
              <Link
                key={r.recordingId}
                href={`/recordings/${r.recordingId}`}
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs text-gray-700 transition hover:border-gray-300"
              >
                <span className="truncate font-medium">{r.name}</span>
                <span className="ml-2 shrink-0 text-gray-400">
                  {new Date(r.date).toLocaleDateString("pt-BR")}
                </span>
              </Link>
            ))}
          </div>
        </Bloco>
      )}
    </div>
  );
}

function Bloco({
  icone: Icone,
  titulo,
  children,
}: {
  icone: typeof Target;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
        <Icone size={11} />
        {titulo}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Lista({ itens, tom }: { itens: string[]; tom: string }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {itens.map((item) => (
        <li
          key={item}
          className={cn("rounded-xl px-3 py-2 text-xs leading-relaxed", tom)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
