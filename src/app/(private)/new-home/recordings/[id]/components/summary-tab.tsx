"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { RequestTranscription } from "@/components/ui/request-transcription";
import { motion } from "framer-motion";
import { FileText, Loader2, Sparkles } from "lucide-react";
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
    recording.transcriptionStatus === "PENDING"
  ) {
    return (
      <Placeholder
        icon={<Loader2 size={22} className="animate-spin" />}
        title={
          recording.transcriptionStatus === "TRANSCRIBING"
            ? "Transcrevendo sua gravação"
            : "Na fila de processamento"
        }
        description="Em alguns minutos seu resumo aparece aqui."
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-8"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
          <Sparkles size={15} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Resumo inteligente
        </h2>
      </div>
      <div className="prose prose-sm md:prose-base prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {recording.summary}
        </ReactMarkdown>
      </div>
    </motion.article>
  );
}
