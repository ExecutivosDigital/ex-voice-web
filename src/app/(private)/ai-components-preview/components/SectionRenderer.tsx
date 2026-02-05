"use client";

import { Copy, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { AIComponent, AISection } from "../types/component-types";
import { CardEditForm } from "./CardEditForm";
import { ComponentRenderer } from "./ComponentRenderer";

interface SectionRendererProps {
  section: AISection;
  sectionIndex?: number;
  showCardActions?: boolean;
  clientId?: string;
  recordingId?: string;
  onUpdateComponent?: (
    sectionIndex: number,
    componentIndex: number,
    updated: AIComponent,
  ) => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
}

// Componentes que sempre ocupam largura total (não devem estar em grid)
const FULL_WIDTH_COMPONENTS = [
  "main_diagnosis_card",
  "treatment_plan_card",
  "medical_history_timeline_card",
  "orientations_card",
  "clinical_notes_card",
];

// Componentes que podem ocupar 2 colunas ou mais (médio-grande)
const WIDE_COMPONENTS = [
  "prescription_card",
  "exams_card",
  "referrals_card",
  "certificates_card",
  "next_appointments_card",
];

// Componentes compactos que funcionam bem em grid (pequenos-médios)
const COMPACT_COMPONENTS = [
  "biometrics_card",
  "allergies_card",
  "chronic_conditions_card",
  "medications_card",
  "social_history_card",
  "family_history_card",
  "symptoms_card",
  "risk_factors_card",
  "suggested_exams_card",
  "differential_diagnosis_card",
  "observations_card",
];

/**
 * Calcula a quantidade de itens/conteúdo em um componente
 */
function getComponentItemCount(component: AIComponent): number {
  const data = component.data || {};

  // Tentar diferentes estruturas de dados usando type guards seguros
  if ("items" in data && Array.isArray(data.items)) return data.items.length;
  if ("fields" in data && Array.isArray(data.fields)) return data.fields.length;
  if ("prescriptions" in data && Array.isArray(data.prescriptions)) {
    return data.prescriptions.reduce(
      (acc: number, p: any) => acc + (p.items?.length || 0),
      0,
    );
  }
  if ("exams" in data && Array.isArray(data.exams)) {
    return data.exams.reduce(
      (acc: number, e: any) => acc + (e.items?.length || 0),
      0,
    );
  }
  if ("appointments" in data && Array.isArray(data.appointments))
    return data.appointments.length;
  if ("symptoms" in data && Array.isArray(data.symptoms))
    return data.symptoms.length;
  if ("allergies" in data && Array.isArray(data.allergies))
    return data.allergies.length;
  if ("orientations" in data && Array.isArray(data.orientations))
    return data.orientations.length;
  if ("referrals" in data && Array.isArray(data.referrals))
    return data.referrals.length;
  if ("certificates" in data && Array.isArray(data.certificates))
    return data.certificates.length;
  if ("riskFactors" in data && Array.isArray(data.riskFactors))
    return data.riskFactors.length;
  if ("familyHistory" in data && Array.isArray(data.familyHistory))
    return data.familyHistory.length;
  if ("differentials" in data && Array.isArray(data.differentials))
    return data.differentials.length;
  if ("suggestedExams" in data && Array.isArray(data.suggestedExams))
    return data.suggestedExams.length;
  if ("personal" in data && typeof data.personal === "object") {
    return Object.values(data.personal).filter((v) => v).length;
  }
  if ('treatment' in data && typeof data.treatment === 'object' && data.treatment !== null) {
    const treatment = data.treatment as any;
    const medicationsCount = (treatment.medications && Array.isArray(treatment.medications)) ? treatment.medications.length : 0;
    const lifestyleCount = (treatment.lifestyle && Array.isArray(treatment.lifestyle)) ? treatment.lifestyle.length : 0;
    return medicationsCount + lifestyleCount;
  }
  
  return 0;
}

/**
 * Determina quantas colunas um componente deve ocupar baseado no conteúdo
 */
function getComponentSpan(
  component: AIComponent,
  totalComponents: number,
): number {
  const itemCount = getComponentItemCount(component);

  // Se é componente de largura total, sempre 1 (mas ocupa toda a linha)
  if (FULL_WIDTH_COMPONENTS.includes(component.type)) {
    return 1; // Será renderizado separadamente
  }

  // Se há apenas 1 componente na seção (exceto full-width), limitar largura
  if (totalComponents === 1) {
    if (WIDE_COMPONENTS.includes(component.type)) {
      return 1; // Mas com max-width aplicado no card
    }
    if (COMPACT_COMPONENTS.includes(component.type)) {
      return 1; // Mas com max-width aplicado no card
    }
  }

  // Para componentes wide
  if (WIDE_COMPONENTS.includes(component.type)) {
    if (itemCount === 0) return 1;
    if (itemCount <= 2) return 1; // Poucos itens = 1 coluna
    return 1; // Mantém 1 coluna mas pode expandir
  }

  // Para componentes compactos
  if (COMPACT_COMPONENTS.includes(component.type)) {
    if (itemCount === 0) return 1;
    if (itemCount >= 4) return 2; // Muitos itens = pode ocupar 2 colunas
    if (itemCount >= 3) {
      // Verificar se tem muitos tags/metadata
      const data = component.data || {};
      const items =
        "items" in data && Array.isArray(data.items)
          ? data.items
          : "symptoms" in data && Array.isArray(data.symptoms)
            ? data.symptoms
            : [];
      const hasManyTags = items.some(
        (item: any) =>
          (item.metadata && item.metadata.length > 2) ||
          (item.tags && item.tags.length > 2),
      );
      return hasManyTags ? 2 : 1;
    }
    return 1; // Poucos itens = 1 coluna
  }

  return 1;
}

function categorizeComponents(components: AISection["components"]) {
  const fullWidth: typeof components = [];
  const gridComponents: Array<{ component: AIComponent; span: number }> = [];

  if (!components || !Array.isArray(components)) {
    return { fullWidth, gridComponents };
  }

  const totalComponents = components.length;

  components.forEach((component) => {
    if (FULL_WIDTH_COMPONENTS.includes(component.type)) {
      fullWidth.push(component);
    } else {
      const span = getComponentSpan(component, totalComponents);
      gridComponents.push({ component, span });
    }
  });

  return { fullWidth, gridComponents };
}

/**
 * Formata o conteúdo do componente como texto legível (não JSON)
 * para o botão Copiar colar as informações certinhas.
 */
function getComponentCopyText(component: AIComponent): string {
  const d = (component.data ?? {}) as Record<string, unknown>;
  const lines: string[] = [component.title, ""];

  // Orientations: lista de strings
  if (Array.isArray(d.orientations) && d.orientations.length > 0) {
    (d.orientations as string[]).forEach((item) => lines.push(`• ${item}`));
    return lines.join("\n");
  }

  // Risk factors: lista de strings
  if (Array.isArray(d.riskFactors) && d.riskFactors.length > 0) {
    (d.riskFactors as string[]).forEach((item) => lines.push(`• ${item}`));
    return lines.join("\n");
  }

  // Observations: texto único
  if (typeof d.observations === "string" && d.observations) {
    lines.push(d.observations);
    return lines.join("\n");
  }

  // Clinical notes: content ou sections
  if (Array.isArray(d.sections) && d.sections.length > 0) {
    (d.sections as Array<{ title?: string; content: string }>).forEach(
      (sec) => {
        if (sec.title) lines.push(sec.title);
        if (sec.content) lines.push(sec.content);
        lines.push("");
      },
    );
    if (typeof d.content === "string" && d.content) lines.push(d.content);
    return lines.join("\n").trim();
  }
  if (typeof d.content === "string" && d.content) {
    lines.push(d.content);
    return lines.join("\n");
  }

  // Fields (main_diagnosis, biometrics, social_history, etc.)
  if (Array.isArray(d.fields) && d.fields.length > 0) {
    (d.fields as Array<{ label: string; value: string }>).forEach((f) =>
      lines.push(`${f.label}: ${f.value}`),
    );
    if (typeof d.content === "string" && d.content) {
      lines.push("", "Justificativa clínica:", d.content);
    }
    return lines.join("\n");
  }

  // Main diagnosis legado
  if (d.mainCondition || d.cid) {
    if (d.mainCondition) lines.push(`Condição principal: ${d.mainCondition}`);
    if (d.cid) lines.push(`CID: ${d.cid}`);
    if (d.confidence) lines.push(`Confiança: ${d.confidence}`);
    if (d.severity) lines.push(`Severidade: ${d.severity}`);
    if (d.evolution) lines.push(`Evolução: ${d.evolution}`);
    if (d.justification)
      lines.push("", "Justificativa:", String(d.justification));
    if (d.content) lines.push("", "Justificativa:", String(d.content));
    return lines.join("\n");
  }

  // Family history
  if (Array.isArray(d.familyHistory) && d.familyHistory.length > 0) {
    (
      d.familyHistory as Array<{
        relation: string;
        condition: string;
        age: string;
      }>
    ).forEach((item) =>
      lines.push(`• ${item.relation}: ${item.condition} (idade: ${item.age})`),
    );
    return lines.join("\n");
  }

  // Chronic conditions
  if (Array.isArray(d.chronicConditions) && d.chronicConditions.length > 0) {
    (
      d.chronicConditions as Array<{
        name: string;
        since: string;
        status: string;
      }>
    ).forEach((item) =>
      lines.push(`• ${item.name} | desde: ${item.since} | ${item.status}`),
    );
    return lines.join("\n");
  }

  // Medical history timeline
  if (Array.isArray(d.history) && d.history.length > 0) {
    (
      d.history as Array<{
        date: string;
        type: string;
        doctor: string;
        specialty: string;
        note: string;
      }>
    ).forEach((item) => {
      lines.push(
        `• ${item.date} | ${item.type} | ${item.doctor} (${item.specialty})`,
      );
      if (item.note) lines.push(`  ${item.note}`);
    });
    return lines.join("\n");
  }

  // Certificates
  if (Array.isArray(d.certificates) && d.certificates.length > 0) {
    (
      d.certificates as Array<{
        date: string;
        type: string;
        description: string;
        period: string;
      }>
    ).forEach((item) =>
      lines.push(
        `• ${item.type} | ${item.date} | ${item.period}\n  ${item.description}`,
      ),
    );
    return lines.join("\n");
  }

  // Items genéricos (symptoms, allergies, medications, exams, referrals, etc.)
  if (Array.isArray(d.items) && d.items.length > 0) {
    (
      d.items as Array<{
        primary?: string;
        secondary?: string;
        metadata?: Array<{ label: string; value: string }>;
      }>
    ).forEach((item) => {
      const primary = item.primary ?? (item as { name?: string }).name ?? "";
      const secondary = item.secondary ?? "";
      const meta =
        item.metadata?.map((m) => `${m.label}: ${m.value}`).join(" | ") ?? "";
      if (secondary || meta) {
        lines.push(
          `• ${primary}${secondary ? ` - ${secondary}` : ""}${meta ? ` (${meta})` : ""}`,
        );
      } else {
        lines.push(`• ${primary}`);
      }
    });
    return lines.join("\n");
  }

  // Legado: symptoms, allergies, medications, referrals, etc.
  const legacyArrays: Record<string, string> = {
    symptoms_card: "symptoms",
    allergies_card: "allergies",
    medications_card: "medications",
    differential_diagnosis_card: "differentials",
    suggested_exams_card: "suggestedExams",
  };
  const key = legacyArrays[component.type];
  if (key && Array.isArray(d[key])) {
    const arr = d[key] as Array<Record<string, string>>;
    arr.forEach((item) => {
      const name = item.name ?? item.primary ?? "";
      const extra = [
        item.frequency,
        item.reaction,
        item.severity,
        item.probability,
      ]
        .filter(Boolean)
        .join(" | ");
      lines.push(extra ? `• ${name} (${extra})` : `• ${name}`);
    });
    return lines.join("\n");
  }

  // Prescriptions legado
  if (Array.isArray(d.prescriptions) && d.prescriptions.length > 0) {
    (
      d.prescriptions as Array<{
        type?: string;
        date?: string;
        items?: Array<{
          name: string;
          dosage: string;
          frequency: string;
          duration: string;
        }>;
      }>
    ).forEach((p) => {
      lines.push(`${p.type ?? "Receita"}${p.date ? ` - ${p.date}` : ""}`);
      p.items?.forEach((i) =>
        lines.push(
          `  • ${i.name} | ${i.dosage} | ${i.frequency} | ${i.duration}`,
        ),
      );
      lines.push("");
    });
    return lines.join("\n").trim();
  }

  // Next appointments legado
  if (Array.isArray(d.appointments) && d.appointments.length > 0) {
    (
      d.appointments as Array<{
        date: string;
        time?: string;
        type?: string;
        doctor?: string;
        notes?: string;
      }>
    ).forEach((a) => {
      lines.push(
        `• ${a.date}${a.time ? ` ${a.time}` : ""} | ${a.type ?? ""}${a.doctor ? ` | ${a.doctor}` : ""}`,
      );
      if (a.notes) lines.push(`  ${a.notes}`);
    });
    return lines.join("\n");
  }

  // Biometrics/Social legado (personal / socialHistory)
  const personal = (d.personal ?? d.socialHistory) as
    | Record<string, string>
    | undefined;
  if (personal && typeof personal === "object") {
    Object.entries(personal).forEach(([k, v]) => {
      if (v) lines.push(`${k}: ${v}`);
    });
    return lines.join("\n");
  }

  // Fallback: conteúdo único ou campos soltos
  if (typeof d.content === "string" && d.content) {
    lines.push(d.content);
    return lines.join("\n");
  }

  return lines.slice(0, 1).join("\n"); // só o título se não houver dados
}

function CardWithActions({
  component,
  sectionIndex,
  componentIndex,
  showCardActions,
  onUpdateComponent,
  onEditStart,
  onEditEnd,
  children,
}: {
  component: AIComponent;
  sectionIndex: number;
  componentIndex: number;
  showCardActions: boolean;
  onUpdateComponent?: (
    sectionIndex: number,
    componentIndex: number,
    updated: AIComponent,
  ) => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  children: React.ReactNode;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (!showCardActions) return <>{children}</>;

  const handleCopy = async () => {
    const text = getComponentCopyText(component);
    await navigator.clipboard.writeText(text);
    toast.success("Conteúdo copiado para a área de transferência!");
  };

  const handleStartEdit = () => {
    onEditStart?.();
    setIsEditing(true);
  };

  const handleSaveFromForm = (updated: AIComponent) => {
    onUpdateComponent?.(sectionIndex, componentIndex, updated);
    onEditEnd?.();
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    onEditEnd?.();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex w-full max-w-full min-w-0 flex-col gap-2">
        <CardEditForm
          component={component}
          onSave={handleSaveFromForm}
          onCancel={handleCancelEdit}
          onCopy={handleCopy}
        />
      </div>
    );
  }

  return (
    <div className="flex max-w-full min-w-0 flex-col gap-2">
      <div className="flex min-w-0 items-start gap-2">
        <div className="max-w-full min-w-0 flex-1 overflow-x-hidden break-words [&>*]:max-w-full [&>*]:min-w-0">
          {children}
        </div>
        <button
          type="button"
          onClick={handleStartEdit}
          className="shrink-0 rounded-lg border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
          title="Editar"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2 self-end">
        <button
          type="button"
          onClick={handleCopy}
          className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          <Copy className="h-3.5 w-3.5" />
          Copiar
        </button>
      </div>
    </div>
  );
}

export function SectionRenderer({
  section,
  sectionIndex = 0,
  showCardActions = false,
  clientId,
  recordingId,
  onUpdateComponent,
  onEditStart,
  onEditEnd,
}: SectionRendererProps) {
  // Verificar se components existe e é um array
  if (
    !section.components ||
    !Array.isArray(section.components) ||
    section.components.length === 0
  ) {
    return (
      <section className="mb-10 w-full">
        <div className="mb-6 flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {section.title}
            </h2>
            {section.description && (
              <p className="mt-1 text-sm text-gray-500">
                {section.description}
              </p>
            )}
          </div>
        </div>
        <div className="py-8 text-center text-gray-500">
          <p>Nenhum componente disponível nesta seção</p>
        </div>
      </section>
    );
  }

  const { fullWidth, gridComponents } = categorizeComponents(
    section.components,
  );
  const totalGridComponents = gridComponents.length;

  return (
    <section className="mb-10 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Header da Seção */}
      <div className="mb-6 flex min-w-0 items-start justify-between border-b border-gray-100 pb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold break-words text-gray-900">
            {section.title}
          </h2>
          {section.description && (
            <p className="mt-1 text-sm break-words text-gray-500">
              {section.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        {/* Componentes de largura total - Um abaixo do outro */}
        {fullWidth.length > 0 && (
          <div className="flex min-w-0 flex-col gap-6">
            {fullWidth.map((component, idx) => (
              <CardWithActions
                key={`full-${idx}`}
                component={component}
                sectionIndex={sectionIndex}
                componentIndex={idx}
                showCardActions={showCardActions}
                onUpdateComponent={onUpdateComponent}
                onEditStart={onEditStart}
                onEditEnd={onEditEnd}
              >
                <ComponentRenderer component={component} />
              </CardWithActions>
            ))}
          </div>
        )}

        {/* Grid inteligente para componentes restantes */}
        {gridComponents.length > 0 && (
          <div
            className={`grid w-full max-w-full min-w-0 gap-4 md:gap-6 ${
              totalGridComponents === 1
                ? "justify-items-start" // Alinha à esquerda quando há apenas 1 componente
                : ""
            }`}
            style={{
              gridTemplateColumns:
                totalGridComponents === 1
                  ? "minmax(0, max-content)" // minmax(0, ...) permite o item encolher
                  : "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            }}
          >
            {gridComponents.map(({ component, span }, idx) => {
              const gridColumnSpan =
                totalGridComponents === 1
                  ? undefined
                  : span > 1
                    ? `span ${span}`
                    : undefined;

              return (
                <div
                  key={`grid-${idx}`}
                  className="h-full w-full max-w-full min-w-0"
                  style={
                    gridColumnSpan ? { gridColumn: gridColumnSpan } : undefined
                  }
                >
                  <CardWithActions
                    component={component}
                    sectionIndex={sectionIndex}
                    componentIndex={idx}
                    showCardActions={showCardActions}
                    onUpdateComponent={onUpdateComponent}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                  >
                    <ComponentRenderer component={component} />
                  </CardWithActions>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
