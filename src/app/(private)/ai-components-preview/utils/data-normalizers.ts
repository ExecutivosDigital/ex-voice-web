import { FieldConfig, GenericListItem } from "../types/component-types";
import { isFieldConfig, isGenericListItem, isObject, isStringArray } from "./type-guards";

/**
 * Normalizadores de dados para garantir compatibilidade entre formatos legado e genérico
 */

/**
 * Normaliza items genéricos de qualquer formato
 */
export function normalizeGenericItems(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico (items[])
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  return [];
}

/**
 * Normaliza campos (fields) de qualquer formato
 */
export function normalizeFields(data: unknown): FieldConfig[] {
  if (!isObject(data)) return [];

  // Formato genérico (fields[])
  if (Array.isArray(data.fields)) {
    return data.fields.filter(isFieldConfig);
  }

  return [];
}

/**
 * Normaliza array de strings
 */
export function normalizeStringArray(data: unknown, key: string): string[] {
  if (!isObject(data)) return [];
  const value = data[key];
  if (isStringArray(value)) return value;
  return [];
}

/**
 * Normaliza texto único (content, observations, etc.)
 */
export function normalizeText(data: unknown, key: string): string {
  if (!isObject(data)) return "";
  const value = data[key];
  if (typeof value === "string") return value;
  return "";
}

/**
 * Normaliza allergies do formato legado para genérico
 */
export function normalizeAllergies(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  // Formato legado
  if (Array.isArray(data.allergies)) {
    return data.allergies.map((allergy: any) => ({
      primary: allergy.name || "",
      metadata: [
        allergy.reaction && { label: "Reação", value: allergy.reaction },
        allergy.severity && { label: "Severidade", value: allergy.severity },
      ].filter(Boolean) as Array<{ label: string; value: string }>,
    }));
  }

  return [];
}

/**
 * Normaliza symptoms do formato legado para genérico
 */
export function normalizeSymptoms(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  // Formato legado
  if (Array.isArray(data.symptoms)) {
    return data.symptoms.map((symptom: any) => ({
      primary: symptom.name || "",
      metadata: [
        symptom.frequency && { label: "Frequência", value: symptom.frequency },
        symptom.severity && { label: "Severidade", value: symptom.severity },
      ].filter(Boolean) as Array<{ label: string; value: string }>,
    }));
  }

  return [];
}

/**
 * Normaliza medications do formato legado para genérico
 */
export function normalizeMedications(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  // Formato legado
  if (Array.isArray(data.medications)) {
    return data.medications.map((med: any) => ({
      primary: med.name || "",
      metadata: [
        med.frequency && { label: "Frequência", value: med.frequency },
        med.type && { label: "Tipo", value: med.type },
      ].filter(Boolean) as Array<{ label: string; value: string }>,
    }));
  }

  return [];
}

/**
 * Normaliza prescriptions do formato legado para genérico
 */
export function normalizePrescriptions(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  // Formato legado
  if (Array.isArray(data.prescriptions)) {
    return data.prescriptions.flatMap((p: any) =>
      p.items
        ? p.items.map((item: any) => ({
            id: p.id,
            primary: item.name || "",
            secondary: p.type || "",
            metadata: [
              { label: "Dosagem", value: item.dosage || "" },
              { label: "Frequência", value: item.frequency || "" },
              { label: "Duração", value: item.duration || "" },
            ],
            tags: p.date ? [p.date] : [],
          }))
        : []
    );
  }

  return [];
}

/**
 * Normaliza exams do formato legado para genérico
 */
export function normalizeExams(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  // Formato legado
  if (Array.isArray(data.exams)) {
    return data.exams.flatMap((ex: any) =>
      ex.items
        ? ex.items.map((item: any) => ({
            id: ex.id,
            primary: item.name || "",
            secondary: ex.category || "",
            metadata: [
              { label: "Prioridade", value: item.priority || "Normal" },
            ],
            tags: ex.date ? [ex.date] : [],
          }))
        : []
    );
  }

  return [];
}

/**
 * Normaliza referrals do formato legado para genérico
 */
export function normalizeReferrals(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  // Formato legado
  if (Array.isArray(data.referrals)) {
    return data.referrals.map((ref: any) => ({
      id: ref.id,
      primary: ref.specialty || "",
      secondary: ref.professional || "",
      metadata: [
        { label: "Data", value: ref.date || "" },
        { label: "Motivo", value: ref.reason || "" },
        ref.urgency && { label: "Urgência", value: ref.urgency },
      ].filter(Boolean) as Array<{ label: string; value: string }>,
    }));
  }

  return [];
}

/**
 * Normaliza appointments do formato legado para genérico
 */
export function normalizeAppointments(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  // Formato legado
  if (Array.isArray(data.appointments)) {
    return data.appointments.map((apt: any) => ({
      id: apt.id,
      primary: apt.type || "Reunião",
      secondary: apt.doctor || "",
      metadata: [
        { label: "Data", value: apt.date || "" },
        apt.time && { label: "Horário", value: apt.time },
        apt.notes && { label: "Observações", value: apt.notes },
      ].filter(Boolean) as Array<{ label: string; value: string }>,
    }));
  }

  return [];
}

/**
 * Normaliza differentials do formato legado para genérico
 */
export function normalizeDifferentials(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  // Formato legado
  if (Array.isArray(data.differentials)) {
    return data.differentials.map((diff: any) => ({
      primary: diff.name || "",
      metadata: [
        diff.probability && { label: "Probabilidade", value: diff.probability },
      ].filter(Boolean) as Array<{ label: string; value: string }>,
      tags: diff.excluded ? ["Excluído"] : [],
    }));
  }

  return [];
}

/**
 * Normaliza suggestedExams do formato legado para genérico
 */
export function normalizeSuggestedExams(data: unknown): GenericListItem[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.items)) {
    return data.items.filter(isGenericListItem);
  }

  // Formato legado
  if (Array.isArray(data.suggestedExams)) {
    return data.suggestedExams.map((exam: any) => ({
      primary: exam.name || "",
      metadata: [
        exam.priority && { label: "Prioridade", value: exam.priority },
      ].filter(Boolean) as Array<{ label: string; value: string }>,
    }));
  }

  return [];
}

/**
 * Normaliza biometrics do formato legado para genérico
 */
export function normalizeBiometrics(data: unknown): FieldConfig[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.fields)) {
    return data.fields.filter(isFieldConfig);
  }

  // Formato legado
  if (isObject(data.personal)) {
    const personal = data.personal as Record<string, string>;
    return [
      personal.bloodType && {
        label: "Tipo Sanguíneo",
        value: personal.bloodType,
        variant: "badge" as const,
        priority: 1,
      },
      personal.bmi && {
        label: "IMC",
        value: personal.bmi,
        priority: 2,
      },
      (personal.weight || personal.height) && {
        label: "Peso / Altura",
        value: `${personal.weight || "-"} / ${personal.height || "-"}`,
        priority: 3,
      },
      personal.age && {
        label: "Idade",
        value: personal.age,
        priority: 4,
      },
    ]
      .filter(Boolean)
      .map((f) => f as FieldConfig)
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  return [];
}

/**
 * Normaliza socialHistory do formato legado para genérico
 */
export function normalizeSocialHistory(data: unknown): FieldConfig[] {
  if (!isObject(data)) return [];

  // Formato genérico
  if (Array.isArray(data.fields)) {
    return data.fields.filter(isFieldConfig);
  }

  // Formato legado
  if (isObject(data.socialHistory)) {
    const social = data.socialHistory as Record<string, string>;
    return Object.entries(social)
      .filter(([, v]) => v)
      .map(([k, v]) => ({
        label: k,
        value: v,
      }));
  }

  return [];
}

/**
 * Normaliza mainDiagnosis do formato legado para genérico
 */
export function normalizeMainDiagnosis(data: unknown): {
  fields: FieldConfig[];
  content: string;
} {
  if (!isObject(data)) return { fields: [], content: "" };

  // Formato genérico
  const fields = Array.isArray(data.fields)
    ? data.fields.filter(isFieldConfig)
    : [];

  // Formato legado
  const legacyFields: FieldConfig[] = [
    (data.mainCondition as string) && {
      label: "Condição Principal",
      value: data.mainCondition as string,
      variant: "highlight" as const,
      priority: 1,
    },
    (data.cid as string) && {
      label: "CID",
      value: data.cid as string,
      priority: 2,
    },
    (data.confidence as string) && {
      label: "Confiança",
      value: data.confidence as string,
      priority: 3,
    },
    (data.severity as string) && {
      label: "Severidade",
      value: data.severity as string,
      priority: 4,
    },
    (data.evolution as string) && {
      label: "Evolução",
      value: data.evolution as string,
      priority: 5,
    },
  ]
    .filter(Boolean)
    .map((f) => f as FieldConfig);

  const displayFields =
    fields.length > 0
      ? fields.sort((a, b) => (a.priority || 0) - (b.priority || 0))
      : legacyFields;

  const content =
    (data.content as string) ||
    (data.justification as string) ||
    "";

  return { fields: displayFields, content };
}
