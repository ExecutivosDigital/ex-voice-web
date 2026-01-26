"use client";

import { AIComponent } from "../types/component-types";
import { AllergiesCard } from "./cards/AllergiesCard";
import { BiometricsCard } from "./cards/BiometricsCard";
import { CertificatesCard } from "./cards/CertificatesCard";
import { ChronicConditionsCard } from "./cards/ChronicConditionsCard";
import { ClinicalNotesCard } from "./cards/ClinicalNotesCard";
import { DifferentialDiagnosisCard } from "./cards/DifferentialDiagnosisCard";
import { ExamsCard } from "./cards/ExamsCard";
import { FamilyHistoryCard } from "./cards/FamilyHistoryCard";
import { MainDiagnosisCard } from "./cards/MainDiagnosisCard";
import { MedicalHistoryTimelineCard } from "./cards/MedicalHistoryTimelineCard";
import { MedicationsCard } from "./cards/MedicationsCard";
import { NextAppointmentsCard } from "./cards/NextAppointmentsCard";
import { ObservationsCard } from "./cards/ObservationsCard";
import { OrientationsCard } from "./cards/OrientationsCard";
import { PrescriptionCard } from "./cards/PrescriptionCard";
import { ReferralsCard } from "./cards/ReferralsCard";
import { RiskFactorsCard } from "./cards/RiskFactorsCard";
import { SocialHistoryCard } from "./cards/SocialHistoryCard";
import { SuggestedExamsCard } from "./cards/SuggestedExamsCard";
import { SymptomsCard } from "./cards/SymptomsCard";
import { TreatmentPlanCard } from "./cards/TreatmentPlanCard";

interface ComponentRendererProps {
  component: AIComponent;
}

// Componente que renderiza um único componente baseado no tipo
export function ComponentRenderer({ component }: ComponentRendererProps) {
  switch (component.type) {
    case "prescription_card":
      return (
        <PrescriptionCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "exams_card":
      return (
        <ExamsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "referrals_card":
      return (
        <ReferralsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "certificates_card":
      return (
        <CertificatesCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "orientations_card":
      return (
        <OrientationsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "clinical_notes_card":
      return (
        <ClinicalNotesCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "next_appointments_card":
      return (
        <NextAppointmentsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "biometrics_card":
      return (
        <BiometricsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "allergies_card":
      return (
        <AllergiesCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "chronic_conditions_card":
      return (
        <ChronicConditionsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "medications_card":
      return (
        <MedicationsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "social_history_card":
      return (
        <SocialHistoryCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "family_history_card":
      return (
        <FamilyHistoryCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "medical_history_timeline_card":
      return (
        <MedicalHistoryTimelineCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "main_diagnosis_card":
      return (
        <MainDiagnosisCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "symptoms_card":
      return (
        <SymptomsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "risk_factors_card":
      return (
        <RiskFactorsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "treatment_plan_card":
      return (
        <TreatmentPlanCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "differential_diagnosis_card":
      return (
        <DifferentialDiagnosisCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "suggested_exams_card":
      return (
        <SuggestedExamsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    case "observations_card":
      return (
        <ObservationsCard
          title={component.title}
          variant={component.variant as any}
          data={component.data as any}
        />
      );
    default:
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Tipo de componente desconhecido: {(component as any).type}
          </p>
        </div>
      );
  }
}
