// Tipos base para componentes gerados pela IA

export type Variant =
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "teal"
  | "gray"
  | "rose"
  | "red"
  | "indigo"
  | "orange"
  | "purple"
  | "neutral";

export type ComponentType =
  | "prescription_card"
  | "exams_card"
  | "referrals_card"
  | "certificates_card"
  | "orientations_card"
  | "clinical_notes_card"
  | "next_appointments_card"
  | "biometrics_card"
  | "allergies_card"
  | "chronic_conditions_card"
  | "medications_card"
  | "social_history_card"
  | "family_history_card"
  | "medical_history_timeline_card"
  | "main_diagnosis_card"
  | "symptoms_card"
  | "risk_factors_card"
  | "treatment_plan_card"
  | "differential_diagnosis_card"
  | "suggested_exams_card"
  | "observations_card";

// Estrutura base de um componente
export interface AIComponent {
  type: ComponentType;
  title: string;
  variant?: Variant;
  data: ComponentData;
}

// Estrutura de uma seção (agrupa componentes relacionados)
export interface AISection {
  title: string;              // Título da seção (ex: "Receituários", "Exames")
  description?: string;       // Descrição opcional da seção
  variant?: Variant;          // Variante de cor para a seção (opcional)
  components: AIComponent[];  // Array de componentes dentro da seção
}

// Resposta completa da IA
export interface AIComponentResponse {
  pageTitle: string;
  sections: AISection[];      // Array de seções (ao invés de components diretos)
}

// Tipos de dados específicos para cada componente

// Prescription Card
export interface PrescriptionCardData {
  prescriptions: Array<{
    id: number;
    date: string;
    type: string;
    items: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
  }>;
}

// Exams Card
export interface ExamsCardData {
  exams: Array<{
    id: number;
    date: string;
    category: string;
    items: Array<{
      name: string;
      priority: "Alta" | "Média" | "Normal" | "Baixa";
    }>;
  }>;
  totalCount?: number;
}

// Referrals Card
export interface ReferralsCardData {
  referrals: Array<{
    id: number;
    date: string;
    specialty: string;
    professional: string;
    reason: string;
    urgency: "Prioritária" | "Eletiva" | "Urgente";
  }>;
}

// Certificates Card
export interface CertificatesCardData {
  certificates: Array<{
    id: number;
    date: string;
    type: string;
    description: string;
    period: string;
  }>;
}

// Orientations Card
export interface OrientationsCardData {
  orientations: string[];
}

// Clinical Notes Card
export interface ClinicalNotesCardData {
  notes: string;
}

// Next Appointments Card
export interface NextAppointmentsCardData {
  appointments: Array<{
    id: number;
    date: string;
    time: string;
    type: string;
    doctor: string;
    notes?: string;
  }>;
}

// Biometrics Card
export interface BiometricsCardData {
  personal: {
    bloodType: string;
    height: string;
    weight: string;
    bmi: string;
    age: string;
  };
}

// Allergies Card
export interface AllergiesCardData {
  allergies: Array<{
    name: string;
    reaction: string;
    severity: "Alta" | "Moderada" | "Baixa";
  }>;
}

// Chronic Conditions Card
export interface ChronicConditionsCardData {
  chronicConditions: Array<{
    name: string;
    since: string;
    status: string;
  }>;
}

// Medications Card
export interface MedicationsCardData {
  medications: Array<{
    name: string;
    frequency: string;
    type: "Uso Contínuo" | "SOS" | "Temporário";
  }>;
}

// Social History Card
export interface SocialHistoryCardData {
  socialHistory: {
    smoking: string;
    alcohol: string;
    activity: string;
    diet: string;
  };
}

// Family History Card
export interface FamilyHistoryCardData {
  familyHistory: Array<{
    relation: string;
    condition: string;
    age: string;
  }>;
}

// Medical History Timeline Card
export interface MedicalHistoryTimelineCardData {
  history: Array<{
    date: string;
    type: string;
    doctor: string;
    specialty: string;
    note: string;
    attachments?: string[];
  }>;
}

// Main Diagnosis Card
export interface MainDiagnosisCardData {
  mainCondition: string;
  cid: string;
  confidence: "Alta" | "Média" | "Baixa";
  severity: "Leve" | "Moderada" | "Grave";
  evolution: "Aguda" | "Crônica" | "Subaguda";
  justification: string;
}

// Symptoms Card
export interface SymptomsCardData {
  symptoms: Array<{
    name: string;
    frequency: "Frequente" | "Ocasional" | "Raro" | "Constante";
    severity: "Leve" | "Moderada" | "Grave";
  }>;
}

// Risk Factors Card
export interface RiskFactorsCardData {
  riskFactors: string[];
}

// Treatment Plan Card
export interface TreatmentPlanCardData {
  treatment: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
    lifestyle: string[];
  };
}

// Differential Diagnosis Card
export interface DifferentialDiagnosisCardData {
  differentials: Array<{
    name: string;
    probability: "Muito Alta" | "Alta" | "Média" | "Baixa" | "Muito Baixa";
    excluded: boolean;
  }>;
}

// Suggested Exams Card
export interface SuggestedExamsCardData {
  suggestedExams: Array<{
    name: string;
    priority: "Alta" | "Média" | "Baixa";
  }>;
}

// Observations Card
export interface ObservationsCardData {
  observations: string;
}

// Union type para todos os tipos de dados
export type ComponentData =
  | PrescriptionCardData
  | ExamsCardData
  | ReferralsCardData
  | CertificatesCardData
  | OrientationsCardData
  | ClinicalNotesCardData
  | NextAppointmentsCardData
  | BiometricsCardData
  | AllergiesCardData
  | ChronicConditionsCardData
  | MedicationsCardData
  | SocialHistoryCardData
  | FamilyHistoryCardData
  | MedicalHistoryTimelineCardData
  | MainDiagnosisCardData
  | SymptomsCardData
  | RiskFactorsCardData
  | TreatmentPlanCardData
  | DifferentialDiagnosisCardData
  | SuggestedExamsCardData
  | ObservationsCardData;
