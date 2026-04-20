"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { RequestTranscription } from "@/components/ui/request-transcription";
import { motion } from "framer-motion";
import { Brain, Loader2 } from "lucide-react";
import { Placeholder } from "./placeholder";
import { Overview } from "@/app/(private)/clients/2/(selected-appointment)/[id]/components/overview";

export function InsightsTab({
  recording,
}: {
  recording: RecordingDetailsProps;
}) {
  if (recording.transcriptionStatus === "NOT_REQUESTED") {
    return (
      <Placeholder
        icon={<Brain size={22} />}
        title="Análise ainda não gerada"
        description="Solicite a transcrição e a IA vai destrinchar a conversa em insights organizados."
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
            ? "Gerando sua análise"
            : "Aguardando processamento"
        }
        description="Em alguns minutos sua análise inteligente aparece aqui."
      />
    );
  }

  if (!recording.structuredSummary) {
    return (
      <Placeholder
        icon={<Brain size={22} />}
        title="Sem análise disponível"
        description="A IA não gerou uma análise estruturada para esta gravação."
      />
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-gray-200/70 bg-white/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-7"
    >
      <Overview />
    </motion.section>
  );
}
