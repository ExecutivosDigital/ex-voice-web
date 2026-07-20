import type { AIComponent, AIComponentResponse, AISection } from "./types";

/**
 * Normaliza o structuredSummary persistido para o formato que a AnalysisView
 * renderiza. Tolerante por design: o campo é JSON gerado por LLM ao longo de
 * várias versões do motor — formato novo (sections[]), formato antigo
 * (components[] soltos) e lixo parcial precisam todos degradar sem quebrar.
 */
export function normalizeStructuredSummary(
  summary: unknown,
): AIComponentResponse | null {
  if (!summary || typeof summary !== "object") return null;
  const raw = summary as Record<string, unknown>;

  // Formato atual: { pageTitle, sections: [{ title?, components: [...] }] }
  if (Array.isArray(raw.sections)) {
    const sections = raw.sections
      .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
      .map(
        (s): AISection => ({
          title: typeof s.title === "string" ? s.title : undefined,
          components: normalizeComponents(s.components),
        }),
      )
      .filter((s) => s.components.length > 0);

    if (sections.length === 0) return null;
    return {
      pageTitle:
        typeof raw.pageTitle === "string" ? raw.pageTitle : "Análise da reunião",
      sections,
    };
  }

  // Formato legado: { components: [...] } sem seções
  if (Array.isArray(raw.components)) {
    const components = normalizeComponents(raw.components);
    if (components.length === 0) return null;
    return {
      pageTitle:
        typeof raw.pageTitle === "string" ? raw.pageTitle : "Análise da reunião",
      sections: [{ components }],
    };
  }

  return null;
}

function normalizeComponents(value: unknown): AIComponent[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
    .filter((c) => typeof c.type === "string")
    .map(
      (c): AIComponent => ({
        type: c.type as string,
        title:
          typeof c.title === "string" && c.title.trim()
            ? c.title
            : "Sem título",
        variant: c.variant as AIComponent["variant"],
        data:
          c.data && typeof c.data === "object"
            ? (c.data as Record<string, unknown>)
            : {},
      }),
    );
}
