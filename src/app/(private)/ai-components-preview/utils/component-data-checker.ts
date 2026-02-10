import { AIComponent } from "../types/component-types";
import { isObject } from "./type-guards";

/**
 * Verifica se um componente tem dados válidos para renderização
 * Retorna false se o componente não deve ser renderizado (dados vazios)
 */
export function hasValidComponentData(component: AIComponent): boolean {
  if (!component.data || !isObject(component.data)) {
    return false;
  }

  const data = component.data as Record<string, unknown>;

  switch (component.type) {
    case "treatment_plan_card":
      // Verificar se tem medications ou lifestyle
      const treatment = data.treatment as
        | {
            medications?: unknown[];
            lifestyle?: unknown[];
          }
        | undefined;
      if (!treatment) return false;
      const hasMedications =
        Array.isArray(treatment.medications) &&
        treatment.medications.length > 0;
      const hasLifestyle =
        Array.isArray(treatment.lifestyle) && treatment.lifestyle.length > 0;
      return hasMedications || hasLifestyle;

    case "orientations_card":
      return (
        Array.isArray(data.orientations) && data.orientations.length > 0
      );

    case "risk_factors_card":
      return (
        Array.isArray(data.riskFactors) && data.riskFactors.length > 0
      );

    case "observations_card":
      return (
        typeof data.observations === "string" &&
        data.observations.trim().length > 0
      );

    case "clinical_notes_card":
      const hasContent =
        typeof data.content === "string" && data.content.trim().length > 0;
      const hasNotes =
        typeof (data as any).notes === "string" &&
        (data as any).notes.trim().length > 0;
      const hasSections =
        Array.isArray(data.sections) && data.sections.length > 0;
      return hasContent || hasNotes || hasSections;

    case "allergies_card":
      const hasAllergiesItems =
        Array.isArray(data.items) && data.items.length > 0;
      const hasAllergiesLegacy =
        Array.isArray(data.allergies) && data.allergies.length > 0;
      return hasAllergiesItems || hasAllergiesLegacy;

    case "symptoms_card":
      const hasSymptomsItems =
        Array.isArray(data.items) && data.items.length > 0;
      const hasSymptomsLegacy =
        Array.isArray(data.symptoms) && data.symptoms.length > 0;
      return hasSymptomsItems || hasSymptomsLegacy;

    case "medications_card":
      const hasMedicationsItems =
        Array.isArray(data.items) && data.items.length > 0;
      const hasMedicationsLegacy =
        Array.isArray(data.medications) && data.medications.length > 0;
      return hasMedicationsItems || hasMedicationsLegacy;

    case "prescription_card":
      const hasPrescriptionItems =
        Array.isArray(data.items) && data.items.length > 0;
      const hasPrescriptions =
        Array.isArray(data.prescriptions) && data.prescriptions.length > 0;
      return hasPrescriptionItems || hasPrescriptions;

    case "exams_card":
      const hasExamsItems =
        Array.isArray(data.items) && data.items.length > 0;
      const hasExams =
        Array.isArray(data.exams) && data.exams.length > 0;
      return hasExamsItems || hasExams;

    case "referrals_card":
      const hasReferralsItems =
        Array.isArray(data.items) && data.items.length > 0;
      const hasReferrals =
        Array.isArray(data.referrals) && data.referrals.length > 0;
      return hasReferralsItems || hasReferrals;

    case "next_appointments_card":
      const hasAppointmentsItems =
        Array.isArray(data.items) && data.items.length > 0;
      const hasAppointments =
        Array.isArray(data.appointments) && data.appointments.length > 0;
      return hasAppointmentsItems || hasAppointments;

    case "certificates_card":
      return (
        Array.isArray(data.certificates) && data.certificates.length > 0
      );

    case "chronic_conditions_card":
      return (
        Array.isArray(data.chronicConditions) &&
        data.chronicConditions.length > 0
      );

    case "family_history_card":
      return (
        Array.isArray(data.familyHistory) && data.familyHistory.length > 0
      );

    case "medical_history_timeline_card":
      return Array.isArray(data.history) && data.history.length > 0;

    case "differential_diagnosis_card":
      const hasDifferentialsItems =
        Array.isArray(data.items) && data.items.length > 0;
      const hasDifferentials =
        Array.isArray(data.differentials) && data.differentials.length > 0;
      return hasDifferentialsItems || hasDifferentials;

    case "suggested_exams_card":
      const hasSuggestedExamsItems =
        Array.isArray(data.items) && data.items.length > 0;
      const hasSuggestedExams =
        Array.isArray(data.suggestedExams) &&
        data.suggestedExams.length > 0;
      return hasSuggestedExamsItems || hasSuggestedExams;

    case "biometrics_card":
      const hasBiometricsFields =
        Array.isArray(data.fields) && data.fields.length > 0;
      const hasPersonal =
        isObject(data.personal) &&
        Object.values(data.personal).some((v) => v);
      return hasBiometricsFields || hasPersonal;

    case "social_history_card":
      const hasSocialFields =
        Array.isArray(data.fields) && data.fields.length > 0;
      const hasSocialHistory =
        isObject(data.socialHistory) &&
        Object.values(data.socialHistory).some((v) => v);
      return hasSocialFields || hasSocialHistory;

    case "main_diagnosis_card":
      const hasMainFields =
        Array.isArray(data.fields) && data.fields.length > 0;
      const hasMainCondition = !!(
        data.mainCondition ||
        data.cid ||
        data.confidence ||
        data.severity ||
        data.evolution
      );
      const hasJustification =
        typeof data.content === "string" &&
        data.content.trim().length > 0;
      const hasJustificationLegacy =
        typeof data.justification === "string" &&
        data.justification.trim().length > 0;
      return (
        hasMainFields ||
        hasMainCondition ||
        hasJustification ||
        hasJustificationLegacy
      );

    default:
      // Para tipos desconhecidos, sempre renderizar (pode ter dados que não conhecemos)
      return true;
  }
}
