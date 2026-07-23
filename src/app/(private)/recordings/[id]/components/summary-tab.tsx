"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { RequestTranscription } from "@/components/ui/request-transcription";
import { motion } from "framer-motion";
import { AlertTriangle, FileText, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Placeholder } from "./placeholder";

export function SummaryTab({
  recording,
}: {
  recording: RecordingDetailsProps;
}) {
  if (recording.transcriptionStatus === "NOT_REQUESTED") {
    return (
      <Placeholder
        icon={<Sparkles size={22} />}
        title="Gere um resumo com IA"
        description="Solicite a transcrição e a IA irá analisar sua gravação para gerar insights."
        action={<RequestTranscription />}
      />
    );
  }

  if (
    recording.transcriptionStatus === "TRANSCRIBING" ||
    recording.transcriptionStatus === "PENDING" ||
    recording.transcriptionStatus === "TRANSCRIBING_SUMMARIZING"
  ) {
    const titleMap: Record<string, string> = {
      PENDING: "Na fila de processamento",
      TRANSCRIBING: "Transcrevendo sua gravação",
      TRANSCRIBING_SUMMARIZING: "Gerando análise inteligente",
    };
    return (
      <Placeholder
        icon={<Loader2 size={22} className="animate-spin" />}
        title={titleMap[recording.transcriptionStatus]}
        description="Em alguns minutos seu resumo aparece aqui."
      />
    );
  }

  if (recording.transcriptionStatus === "DONE_NO_SUMMARY") {
    return (
      <Placeholder
        icon={<AlertTriangle size={22} />}
        title="A IA está com instabilidade"
        description="A transcrição foi concluída, mas a geração de resumo falhou. Veja a aba Transcrição enquanto isso. Tente novamente em alguns minutos."
      />
    );
  }

  if (!recording.summary) {
    return (
      <Placeholder
        icon={<FileText size={22} />}
        title="Sem resumo disponível"
        description="Essa gravação foi transcrita mas ainda não gerou um resumo."
      />
    );
  }

  const executive = extractExecutiveSummary(recording.summary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4"
    >
      {/* Resumo executivo em destaque (TL;DR) */}
      {executive && (
        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary to-primary-dim p-5 text-white shadow-lg md:p-6">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
            <Sparkles size={12} className="text-amber-300" /> Resumo executivo
          </p>
          <p className="text-[15px] leading-relaxed text-white/95">
            {executive}
          </p>
        </div>
      )}

      <article className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-8">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dim text-white">
            <Sparkles size={15} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Resumo completo
          </h2>
        </div>
        <div className="prose prose-sm md:prose-base prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {recording.summary}
          </ReactMarkdown>
        </div>
      </article>
    </motion.div>
  );
}

/** Extrai o TL;DR: primeiro parágrafo de texto do resumo (ignora títulos/listas markdown). */
function extractExecutiveSummary(summary: string): string | null {
  const lines = summary.split("\n");
  const paragraph: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (paragraph.length > 0) break;
      continue;
    }
    // Pula títulos, listas e citações markdown — quer o primeiro texto corrido
    if (/^(#|[-*>]|\d+\.)/.test(line)) {
      if (paragraph.length > 0) break;
      continue;
    }
    paragraph.push(line);
    if (paragraph.join(" ").length > 400) break;
  }
  const text = paragraph
    .join(" ")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .trim();
  return text.length > 40 ? text.slice(0, 600) : null;
}
