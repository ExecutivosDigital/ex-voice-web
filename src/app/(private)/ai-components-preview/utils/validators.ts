import { AIComponent, ComponentType } from "../types/component-types";
import { isObject, isStringArray } from "./type-guards";

/**
 * Validadores para garantir que os dados da IA estão no formato esperado
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Valida se um componente tem a estrutura básica correta
 */
export function validateComponent(component: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(component)) {
    return { valid: false, errors: ["Component must be an object"] };
  }

  const comp = component as Record<string, unknown>;

  // Validar type
  if (!comp.type || typeof comp.type !== "string") {
    errors.push("Component type is missing or invalid");
  }

  // Validar title
  if (!comp.title || typeof comp.title !== "string") {
    errors.push("Component title is missing or invalid");
  }

  // Validar data
  if (!comp.data) {
    errors.push("Component data is missing");
  } else if (!isObject(comp.data)) {
    errors.push("Component data must be an object");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida dados específicos baseado no tipo de componente
 */
export function validateComponentData(
  component: AIComponent
): ValidationResult {
  const errors: string[] = [];
  const data = component.data;

  if (!isObject(data)) {
    return { valid: false, errors: ["Data must be an object"] };
  }

  // Validações específicas por tipo
  switch (component.type) {
    case "orientations_card":
      if (!isStringArray(data.orientations) && !Array.isArray(data.items)) {
        errors.push("Orientations must be an array of strings or items");
      }
      break;

    case "risk_factors_card":
      if (!isStringArray(data.riskFactors) && !Array.isArray(data.items)) {
        errors.push("Risk factors must be an array of strings or items");
      }
      break;

    case "observations_card":
      if (
        typeof data.observations !== "string" &&
        typeof data.content !== "string"
      ) {
        errors.push("Observations must be a string");
      }
      break;

    case "clinical_notes_card":
      if (
        typeof data.content !== "string" &&
        typeof (data as any).notes !== "string" &&
        !Array.isArray(data.sections)
      ) {
        errors.push(
          "Clinical notes must have content, notes, or sections array"
        );
      }
      break;

    case "allergies_card":
    case "symptoms_card":
    case "medications_card":
      if (
        !Array.isArray(data.items) &&
        !Array.isArray((data as any).allergies) &&
        !Array.isArray((data as any).symptoms) &&
        !Array.isArray((data as any).medications)
      ) {
        errors.push(
          `${component.type} must have items array or legacy format array`
        );
      }
      break;

    // Outros tipos podem ter validações específicas se necessário
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida uma seção completa
 */
export function validateSection(section: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(section)) {
    return { valid: false, errors: ["Section must be an object"] };
  }

  const sec = section as Record<string, unknown>;

  if (!sec.title || typeof sec.title !== "string") {
    errors.push("Section title is missing or invalid");
  }

  if (!Array.isArray(sec.components)) {
    errors.push("Section components must be an array");
  } else {
    // Validar cada componente
    sec.components.forEach((comp, idx) => {
      const result = validateComponent(comp);
      if (!result.valid) {
        errors.push(
          `Component ${idx}: ${result.errors.join(", ")}`
        );
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
