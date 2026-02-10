"use client";

import { ComponentType } from "../../types/component-types";
import {
  AllergiesCard,
  BiometricsCard,
  CertificatesCard,
  ChronicConditionsCard,
  ClinicalNotesCard,
  DifferentialDiagnosisCard,
  ExamsCard,
  FamilyHistoryCard,
  MainDiagnosisCard,
  MedicalHistoryTimelineCard,
  MedicationsCard,
  NextAppointmentsCard,
  ObservationsCard,
  OrientationsCard,
  PrescriptionCard,
  ReferralsCard,
  RiskFactorsCard,
  SocialHistoryCard,
  SuggestedExamsCard,
  SymptomsCard,
  TreatmentPlanCard,
} from "../cards";

/**
 * Tipo para todas as variantes possíveis dos cards
 */
export type CardVariant = 
  | "emerald" 
  | "blue" 
  | "violet" 
  | "amber" 
  | "teal" 
  | "gray" 
  | "rose" 
  | "indigo" 
  | "red" 
  | "purple" 
  | "neutral" 
  | "orange";

/**
 * Interface comum para todos os cards
 */
export interface CardComponentProps {
  title: string;
  variant?: CardVariant;
  data: any;
}

/**
 * Registry de componentes - mapeia tipos para componentes React
 */
export const COMPONENT_REGISTRY: Record<
  ComponentType,
  React.ComponentType<CardComponentProps>
> = {
  prescription_card: PrescriptionCard as React.ComponentType<CardComponentProps>,
  exams_card: ExamsCard as React.ComponentType<CardComponentProps>,
  referrals_card: ReferralsCard as React.ComponentType<CardComponentProps>,
  certificates_card: CertificatesCard as React.ComponentType<CardComponentProps>,
  orientations_card: OrientationsCard as React.ComponentType<CardComponentProps>,
  clinical_notes_card: ClinicalNotesCard as React.ComponentType<CardComponentProps>,
  next_appointments_card: NextAppointmentsCard as React.ComponentType<CardComponentProps>,
  biometrics_card: BiometricsCard as React.ComponentType<CardComponentProps>,
  allergies_card: AllergiesCard as React.ComponentType<CardComponentProps>,
  chronic_conditions_card: ChronicConditionsCard as React.ComponentType<CardComponentProps>,
  medications_card: MedicationsCard as React.ComponentType<CardComponentProps>,
  social_history_card: SocialHistoryCard as React.ComponentType<CardComponentProps>,
  family_history_card: FamilyHistoryCard as React.ComponentType<CardComponentProps>,
  medical_history_timeline_card: MedicalHistoryTimelineCard as React.ComponentType<CardComponentProps>,
  main_diagnosis_card: MainDiagnosisCard as React.ComponentType<CardComponentProps>,
  symptoms_card: SymptomsCard as React.ComponentType<CardComponentProps>,
  risk_factors_card: RiskFactorsCard as React.ComponentType<CardComponentProps>,
  treatment_plan_card: TreatmentPlanCard as React.ComponentType<CardComponentProps>,
  differential_diagnosis_card: DifferentialDiagnosisCard as React.ComponentType<CardComponentProps>,
  suggested_exams_card: SuggestedExamsCard as React.ComponentType<CardComponentProps>,
  observations_card: ObservationsCard as React.ComponentType<CardComponentProps>,
};

/**
 * Obtém o componente React para um tipo específico
 */
export function getComponent(
  type: ComponentType
): React.ComponentType<CardComponentProps> | null {
  return COMPONENT_REGISTRY[type] || null;
}

/**
 * Verifica se um tipo de componente existe no registry
 */
export function hasComponent(type: string): type is ComponentType {
  return type in COMPONENT_REGISTRY;
}
