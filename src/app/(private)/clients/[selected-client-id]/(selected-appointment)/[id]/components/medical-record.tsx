"use client";

import { useGeneralContext } from "@/context/GeneralContext";
import { DynamicComponentRenderer } from "@/app/(private)/ai-components-preview/components/DynamicComponentRenderer";
import { convertToAIComponentResponse } from "../utils/summary-converter";
import { Loader2 } from "lucide-react";

export function MedicalRecord() {
  const { selectedRecording } = useGeneralContext();

  if (!selectedRecording) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-sm text-gray-500">Carregando gravação...</p>
        </div>
      </div>
    );
  }

  const specificSummary = convertToAIComponentResponse(
    selectedRecording.specificSummary,
  );

  if (!specificSummary) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Prontuário Médico não disponível
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Esta gravação ainda não possui um prontuário médico estruturado gerado pela IA.
            {selectedRecording.summary && (
              <span className="mt-4 block">
                Você pode visualizar o resumo em texto na aba "Geral".
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in w-full duration-500">
      <DynamicComponentRenderer response={specificSummary} />
    </div>
  );
}
