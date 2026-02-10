"use client";

import { useMemo } from "react";
import { AIComponentResponse } from "../../types/component-types";
import { SectionRenderer } from "./SectionRenderer";

interface DynamicComponentRendererProps {
  response: AIComponentResponse;
  /** Exibe botão Editar ao lado e Copiar embaixo de cada card (ex: página de prontuário) */
  showCardActions?: boolean;
  clientId?: string;
  recordingId?: string;
  /** Callback ao salvar edição de um componente (persiste na API) */
  onUpdateComponent?: (
    sectionIndex: number,
    componentIndex: number,
    updated: import("../../types/component-types").AIComponent,
  ) => void;
  /** Chamado quando um card entra em modo edição */
  onEditStart?: () => void;
  /** Chamado quando um card sai do modo edição (salvar ou cancelar) */
  onEditEnd?: () => void;
}

/**
 * Componente principal que renderiza a resposta completa da IA com seções
 * Otimizado com useMemo para evitar re-renderizações desnecessárias
 */
export function DynamicComponentRenderer({
  response,
  showCardActions = false,
  clientId,
  recordingId,
  onUpdateComponent,
  onEditStart,
  onEditEnd,
}: DynamicComponentRendererProps) {
  // Memoizar seções para evitar re-renderizações
  const sections = useMemo(() => {
    if (!response.sections || !Array.isArray(response.sections)) {
      return [];
    }
    return response.sections.filter(Boolean);
  }, [response.sections]);

  // Logs apenas em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    console.log("[DynamicComponentRenderer] Rendering", sections.length, "sections");
  }

  if (sections.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p>Nenhuma seção para exibir</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in flex w-full max-w-full min-w-0 flex-col gap-8 overflow-x-hidden pb-10 duration-500">
      {sections.map((section, index) => {
        try {
          return (
            <SectionRenderer
              key={index}
              section={section}
              sectionIndex={index}
              showCardActions={showCardActions}
              clientId={clientId}
              recordingId={recordingId}
              onUpdateComponent={onUpdateComponent}
              onEditStart={onEditStart}
              onEditEnd={onEditEnd}
            />
          );
        } catch (error) {
          console.error(
            `[DynamicComponentRenderer] Error rendering section ${index}:`,
            error,
          );
          return (
            <div
              key={index}
              className="rounded-lg border border-red-200 bg-red-50 p-4"
            >
              <p className="text-sm text-red-800">
                Erro ao renderizar seção {index}: {String(error)}
              </p>
            </div>
          );
        }
      })}
    </div>
  );
}
