"use client";

import { AISection } from "../types/component-types";
import { ComponentRenderer } from "./ComponentRenderer";

interface SectionRendererProps {
  section: AISection;
}

// Componentes grandes que precisam de largura total (ocupam linha inteira)
const LARGE_COMPONENTS = [
  "main_diagnosis_card",
  "treatment_plan_card",
  "medical_history_timeline_card",
  "prescription_card",
  "exams_card",
  "referrals_card",
  "certificates_card",
  "orientations_card",
  "clinical_notes_card",
  "next_appointments_card",
];

// Componentes médios que podem ocupar 2 colunas em desktop
const MEDIUM_COMPONENTS = [
  "differential_diagnosis_card",
  "observations_card",
];

// Componentes pequenos que ficam bem lado a lado em grid compacto
const SMALL_COMPONENTS = [
  "biometrics_card",
  "allergies_card",
  "chronic_conditions_card",
  "medications_card",
  "social_history_card",
  "family_history_card",
  "symptoms_card",
  "risk_factors_card",
  "suggested_exams_card",
];

function categorizeComponents(components: AISection["components"]) {
  const large: typeof components = [];
  const medium: typeof components = [];
  const small: typeof components = [];

  components.forEach((component) => {
    if (LARGE_COMPONENTS.includes(component.type)) {
      large.push(component);
    } else if (MEDIUM_COMPONENTS.includes(component.type)) {
      medium.push(component);
    } else {
      small.push(component);
    }
  });

  return { large, medium, small };
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const { large, medium, small } = categorizeComponents(section.components);

  return (
    <section className="mb-10">
      {/* Header da Seção */}
      <div className="mb-6 flex items-start justify-between border-b border-gray-100 pb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
          {section.description && (
            <p className="mt-1 text-sm text-gray-500">{section.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Componentes grandes - Largura total, um abaixo do outro */}
        {large.length > 0 && (
          <div className="flex flex-col gap-6">
            {large.map((component, idx) => (
              <ComponentRenderer key={`large-${idx}`} component={component} />
            ))}
          </div>
        )}

        {/* Componentes médios - Grid de 2 colunas */}
        {medium.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {medium.map((component, idx) => (
              <ComponentRenderer key={`medium-${idx}`} component={component} />
            ))}
          </div>
        )}

        {/* Componentes pequenos - Grid responsivo compacto */}
        {/* Mobile: 1 coluna | Tablet: 2 colunas | Desktop: 3 colunas | XL: 4 colunas */}
        {small.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {small.map((component, idx) => (
              <div key={`small-${idx}`} className="h-full">
                <ComponentRenderer component={component} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
