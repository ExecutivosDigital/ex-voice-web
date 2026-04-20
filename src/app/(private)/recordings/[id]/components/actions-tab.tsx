"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { RequestTranscription } from "@/components/ui/request-transcription";
import { motion } from "framer-motion";
import { ListChecks, Loader2 } from "lucide-react";
import { Placeholder } from "./placeholder";
import { MedicalRecord } from "@/app/(private)/clients/2/(selected-appointment)/[id]/components/medical-record";

export function ActionsTab({
  recording,
}: {
  recording: RecordingDetailsProps;
}) {
  if (recording.transcriptionStatus === "NOT_REQUESTED") {
    return (
      <Placeholder
        icon={<ListChecks size={22} />}
        title="Sem ações por enquanto"
        description="Solicite a transcrição e a IA vai extrair os próximos passos e ações desta gravação."
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
            : "Aguardando processamento"
        }
        description="Assim que finalizar, as ações extraídas aparecem aqui."
      />
    );
  }

  if (!recording.specificSummary) {
    return (
      <Placeholder
        icon={<ListChecks size={22} />}
        title="Nenhuma ação identificada"
        description="A IA não extraiu ações específicas para esta gravação."
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
      <MedicalRecord />
    </motion.section>
  );
}
