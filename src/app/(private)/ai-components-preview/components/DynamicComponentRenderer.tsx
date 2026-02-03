"use client";

import { AIComponentResponse } from "../types/component-types";
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
    updated: import("../types/component-types").AIComponent,
  ) => void;
  /** Chamado quando um card entra em modo edição */
  onEditStart?: () => void;
  /** Chamado quando um card sai do modo edição (salvar ou cancelar) */
  onEditEnd?: () => void;
}

// Componente principal que renderiza a resposta completa da IA com seções
export function DynamicComponentRenderer({
  response,
  showCardActions = false,
  clientId,
  recordingId,
  onUpdateComponent,
  onEditStart,
  onEditEnd,
}: DynamicComponentRendererProps) {
  console.log("[DynamicComponentRenderer] response:", response);
  console.log(
    "[DynamicComponentRenderer] response.sections:",
    response?.sections,
  );
  console.log(
    "[DynamicComponentRenderer] response.sections type:",
    typeof response?.sections,
  );
  console.log(
    "[DynamicComponentRenderer] response.sections isArray:",
    Array.isArray(response?.sections),
  );
  console.log(
    "[DynamicComponentRenderer] response.sections?.length:",
    response?.sections?.length,
  );

  if (!response.sections || response.sections.length === 0) {
    console.log(
      "[DynamicComponentRenderer] No sections or empty, returning empty message",
    );
    return (
      <div className="py-12 text-center text-gray-500">
        <p>Nenhuma seção para exibir</p>
      </div>
    );
  }

  console.log(
    "[DynamicComponentRenderer] Rendering",
    response.sections.length,
    "sections",
  );

  return (
    <div className="animate-in fade-in flex w-full max-w-full min-w-0 flex-col gap-8 overflow-x-hidden pb-10 duration-500">
      {response.sections.map((section, index) => {
        console.log(
          `[DynamicComponentRenderer] Rendering section ${index}:`,
          section,
        );
        console.log(
          `[DynamicComponentRenderer] Section ${index} full JSON:`,
          JSON.stringify(section, null, 2),
        );
        console.log(
          `[DynamicComponentRenderer] Section ${index}.components:`,
          section.components,
        );
        console.log(
          `[DynamicComponentRenderer] Section ${index}.components type:`,
          typeof section.components,
        );
        console.log(
          `[DynamicComponentRenderer] Section ${index}.components isArray:`,
          Array.isArray(section.components),
        );
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
