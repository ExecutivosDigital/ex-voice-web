"use client";

import { useApiContext } from "@/context/ApiContext";
import { useEffect, useState } from "react";
import { DynamicComponentRenderer } from "../ai-components-preview/components/DynamicComponentRenderer";
import { AIComponentResponse } from "../ai-components-preview/types/component-types";
import { Loader2 } from "lucide-react";

export default function AITestPage() {
  const { GetAPI } = useApiContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<any>(null);
  const [structuredSummary, setStructuredSummary] = useState<AIComponentResponse | null>(null);
  const [specificSummary, setSpecificSummary] = useState<AIComponentResponse | null>(null);

  // ID da gravação para teste
  const recordingId = "6dc926fb-fc8f-44a3-b212-57469c209770";

  useEffect(() => {
    const fetchRecording = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await GetAPI(`/recording/${recordingId}`, true);

        if (response.status === 200) {
          setRecording(response.body);

          // Converter structuredSummary para o formato esperado
          if (response.body.structuredSummary) {
            // Se já está no formato correto com sections
            if (response.body.structuredSummary.sections) {
              setStructuredSummary(response.body.structuredSummary);
            } else {
              // Se está no formato antigo com components, converter
              setStructuredSummary({
                pageTitle: response.body.structuredSummary.pageTitle || "Resumo Estruturado",
                sections: [
                  {
                    title: "Componentes",
                    components: response.body.structuredSummary.components || [],
                  },
                ],
              });
            }
          }

          // Converter specificSummary para o formato esperado
          if (response.body.specificSummary) {
            // Se já está no formato correto com sections
            if (response.body.specificSummary.sections) {
              setSpecificSummary(response.body.specificSummary);
            } else {
              // Se está no formato antigo com components, converter
              setSpecificSummary({
                pageTitle: response.body.specificSummary.pageTitle || "Resumo Específico",
                sections: [
                  {
                    title: "Componentes",
                    components: response.body.specificSummary.components || [],
                  },
                ],
              });
            }
          }
        } else {
          setError(`Erro ao buscar gravação: ${response.status}`);
        }
      } catch (err) {
        setError(`Erro ao buscar gravação: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecording();
  }, [GetAPI, recordingId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-sm text-gray-500">Carregando gravação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">Erro</h2>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {recording?.name || "Gravação de Teste"}
        </h1>
        <p className="text-sm text-gray-500">
          Visualização dos resumos estruturados gerados pela IA
        </p>
        <div className="mt-2 flex gap-4 text-xs text-gray-400">
          <span>ID: {recordingId}</span>
          <span>Status: {recording?.transcriptionStatus}</span>
          {recording?.structuredSummary && <span className="text-green-600">✓ Structured Summary</span>}
          {recording?.specificSummary && <span className="text-gray-600">✓ Specific Summary</span>}
        </div>
      </div>

      {/* Structured Summary Section */}
      {structuredSummary ? (
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Resumo Estruturado (Structured Summary)
              </h2>
              <p className="text-xs text-gray-500">
                Componentes organizados em seções lógicas
              </p>
            </div>
          </div>
          <div className="animate-in fade-in duration-500">
            <DynamicComponentRenderer response={structuredSummary} />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">
            Nenhum resumo estruturado disponível para esta gravação
          </p>
        </div>
      )}

      {/* Specific Summary Section */}
      {specificSummary ? (
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow-md">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Resumo Específico (Specific Summary)
              </h2>
              <p className="text-xs text-gray-500">
                Foco em pontos de atenção e informações críticas
              </p>
            </div>
          </div>
          <div className="animate-in fade-in duration-500">
            <DynamicComponentRenderer response={specificSummary} />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">
            Nenhum resumo específico disponível para esta gravação
          </p>
        </div>
      )}

      {/* Debug Info (opcional) */}
      {process.env.NODE_ENV === "development" && (
        <details className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Debug Info (Desenvolvimento)
          </summary>
          <pre className="mt-4 max-h-96 overflow-auto rounded bg-white p-4 text-xs">
            {JSON.stringify(
              {
                recording: {
                  id: recording?.id,
                  name: recording?.name,
                  hasStructuredSummary: !!recording?.structuredSummary,
                  hasSpecificSummary: !!recording?.specificSummary,
                },
                structuredSummary,
                specificSummary,
              },
              null,
              2
            )}
          </pre>
        </details>
      )}
    </div>
  );
}
