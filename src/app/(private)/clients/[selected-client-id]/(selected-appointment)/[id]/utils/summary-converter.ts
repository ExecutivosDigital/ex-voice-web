import { AIComponentResponse } from "@/app/(private)/ai-components-preview/types/component-types";

/**
 * Converte um resumo estruturado (structuredSummary ou specificSummary) para o formato AIComponentResponse.
 * Suporta tanto o formato antigo (com components[]) quanto o novo (com sections[]).
 */
export function convertToAIComponentResponse(
  summary: any,
): AIComponentResponse | null {
  if (!summary) {
    return null;
  }

  // Se já está no formato correto com sections
  if (summary.sections && Array.isArray(summary.sections)) {
    return summary as AIComponentResponse;
  }

  // Se está no formato antigo com components, converter para o novo formato
  if (summary.components && Array.isArray(summary.components)) {
    return {
      pageTitle: summary.pageTitle || "Resumo Estruturado",
      sections: [
        {
          title: "Componentes",
          components: summary.components,
        },
      ],
    };
  }

  // Se não tem nem sections nem components, retorna null
  return null;
}
