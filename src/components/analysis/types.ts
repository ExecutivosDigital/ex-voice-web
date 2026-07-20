/**
 * Tipos da análise estruturada (structuredSummary) que a IA gera por gravação.
 *
 * O motor é multi-domínio e o catálogo de tipos é aberto (`type: string`):
 * gravações do EX corporativo emitem os tipos de negócio abaixo; o acervo
 * legado pode conter tipos herdados do domínio médico — esses caem no
 * GenericCard, que renderiza qualquer shape razoável sem card dedicado.
 */

export interface AIComponent {
  type: string;
  title: string;
  variant?: VariantColor;
  data: Record<string, unknown>;
}

export interface AISection {
  title?: string;
  components: AIComponent[];
}

export interface AIComponentResponse {
  pageTitle: string;
  sections: AISection[];
}

export type VariantColor =
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "teal"
  | "gray"
  | "rose";

/** Tipos que o EX corporativo realmente emite (default-prompts da API). */
export const BUSINESS_CARD_TYPES = [
  "actions_card",
  "decisions_card",
  "commitments_card",
  "entities_card",
  "sentiment_card",
  "chapters_card",
  "clinical_notes_card", // usado pelo LLM como "anotações" genéricas
  "observations_card",
] as const;

// ── Shapes de dados dos cards de negócio ──────────────────────────────

export interface ActionItem {
  id?: string | number;
  primary: string;
  secondary?: string;
  metadata?: { label: string; value: string }[];
  tags?: string[];
  status?: string;
}

export interface EntityGroup {
  label: string;
  items: string[];
}

export type Sentiment = "positivo" | "neutro" | "negativo";

export interface SentimentHighlight {
  label: string;
  sentiment: Sentiment;
  note: string;
}

export interface Chapter {
  title: string;
  start: number;
}

export interface NotesSection {
  title?: string;
  content: string;
}
