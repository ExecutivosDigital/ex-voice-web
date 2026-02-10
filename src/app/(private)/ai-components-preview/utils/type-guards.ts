import { GenericListItem, FieldConfig } from "../types/component-types";

/**
 * Type guards para validação de tipos em runtime
 */

export function isGenericListItem(item: unknown): item is GenericListItem {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.primary === "string" ||
    typeof (obj as any).name === "string"
  );
}

export function isFieldConfig(field: unknown): field is FieldConfig {
  if (typeof field !== "object" || field === null) return false;
  const obj = field as Record<string, unknown>;
  return (
    typeof obj.label === "string" &&
    typeof obj.value === "string"
  );
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
