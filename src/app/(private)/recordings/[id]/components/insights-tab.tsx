"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import {
  AnalysisView,
  normalizeStructuredSummary,
} from "@/components/analysis";
import { RequestTranscription } from "@/components/ui/request-transcription";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { motion } from "framer-motion";
import { AlertTriangle, Brain, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Placeholder } from "./placeholder";

export function InsightsTab({
  recording,
}: {
  recording: RecordingDetailsProps;
}) {
  const { PutAPI } = useApiContext();
  const { setSelectedRecording } = useGeneralContext();

  // Edição de card (João, 21/07): grava o structuredSummary inteiro com o
  // data novo do componente editado; o selo "Editado" vem do _editadoEm.
  const salvarComponente = async (
    si: number,
    ci: number,
    novoData: Record<string, unknown>,
  ): Promise<boolean> => {
    const atual = normalizeStructuredSummary(recording.structuredSummary);
    if (!atual) return false;
    const novo = {
      pageTitle: atual.pageTitle,
      sections: atual.sections.map((section, i) =>
        i !== si
          ? section
          : {
              ...section,
              components: section.components.map((component, j) =>
                j !== ci ? component : { ...component, data: novoData },
              ),
            },
      ),
    };
    const response = await PutAPI(
      `/recording/${recording.id}`,
      { structuredSummary: novo },
      true,
    );
    if (response.status === 200) {
      setSelectedRecording((prev) =>
        prev ? { ...prev, structuredSummary: novo } : prev,
      );
      toast.success("Análise atualizada");
      return true;
    }
    toast.error("Não foi possível salvar a edição — tente novamente");
    return false;
  };
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
    recording.transcriptionStatus === "PENDING" ||
    recording.transcriptionStatus === "TRANSCRIBING_SUMMARIZING"
  ) {
    const titleMap: Record<string, string> = {
      PENDING: "Aguardando processamento",
      TRANSCRIBING: "Gerando sua análise",
      TRANSCRIBING_SUMMARIZING: "Estruturando insights com IA",
    };
    return (
      <Placeholder
        icon={<Loader2 size={22} className="animate-spin" />}
        title={titleMap[recording.transcriptionStatus]}
        description="Em alguns minutos sua análise inteligente aparece aqui."
      />
    );
  }

  if (recording.transcriptionStatus === "DONE_NO_SUMMARY") {
    return (
      <Placeholder
        icon={<AlertTriangle size={22} />}
        title="A IA está com instabilidade"
        description="A transcrição foi concluída, mas a análise estruturada falhou. Veja a aba Transcrição enquanto isso. Tente novamente em alguns minutos."
      />
    );
  }

  const analysis = normalizeStructuredSummary(recording.structuredSummary);

  if (!analysis) {
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
      <AnalysisView response={analysis} onSalvarComponente={salvarComponente} />
    </motion.section>
  );
}
