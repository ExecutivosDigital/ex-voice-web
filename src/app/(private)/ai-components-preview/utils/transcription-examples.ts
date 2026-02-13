import { AIComponentResponse } from "../types/component-types";
import examplesFromJson from "./example.json";

/**
 * Arquivo com exemplos de resultados de transcrição para testes.
 * Cada exemplo simula diferentes cenários e estruturas de dados que a IA pode gerar.
 */

// Exemplo 1: Consulta de rotina com hipertensão (caso completo)
export const example1_Hypertension: AIComponentResponse = {
  pageTitle: "Resumo da Consulta - Hipertensão Arterial",
  sections: [
    {
      title: "Diagnóstico",
      description: "Hipótese diagnóstica e informações clínicas",
      variant: "blue",
      components: [
        {
          type: "main_diagnosis_card",
          title: "Diagnóstico Principal",
          variant: "blue",
          data: {
            mainCondition: "Hipertensão Arterial Sistêmica (HAS)",
            cid: "I10",
            confidence: "Alta",
            severity: "Moderada",
            evolution: "Crônica",
            justification:
              "Paciente apresenta histórico de pressão arterial elevada (150/90 mmHg) em múltiplas aferições, associado a cefaleia occipital e tontura ocasional. Histórico familiar positivo para doenças cardiovasculares e idade superior a 40 anos corroboram a hipótese.",
          },
        },
        {
          type: "symptoms_card",
          title: "Sintomas Relatados",
          variant: "rose",
          data: {
            symptoms: [
              {
                name: "Cefaleia Occipital",
                frequency: "Frequente",
                severity: "Moderada",
              },
              {
                name: "Tontura",
                frequency: "Ocasional",
                severity: "Leve",
              },
              {
                name: "Cansaço aos esforços",
                frequency: "Ocasional",
                severity: "Moderada",
              },
            ],
          },
        },
        {
          type: "risk_factors_card",
          title: "Fatores de Risco",
          variant: "orange",
          data: {
            riskFactors: [
              "Histórico Familiar Positivo",
              "Sedentarismo",
              "Sobrepeso (IMC > 25)",
              "Dieta rica em sódio",
            ],
          },
        },
      ],
    },
    {
      title: "Receituários",
      description: "Medicamentos prescritos na consulta",
      variant: "emerald",
      components: [
        {
          type: "prescription_card",
          title: "Receituário Simples",
          variant: "emerald",
          data: {
            prescriptions: [
              {
                id: 1,
                date: "15/01/2026",
                type: "Receituário Simples",
                items: [
                  {
                    name: "Losartana Potássica 50mg",
                    dosage: "1 comprimido",
                    frequency: "12/12h",
                    duration: "Uso Contínuo",
                  },
                  {
                    name: "Hidroclorotiazida 25mg",
                    dosage: "1 comprimido",
                    frequency: "1x pela manhã",
                    duration: "Uso Contínuo",
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      title: "Exames Solicitados",
      description: "Exames laboratoriais e de imagem solicitados",
      variant: "blue",
      components: [
        {
          type: "exams_card",
          title: "Exames Laboratoriais",
          variant: "blue",
          data: {
            exams: [
              {
                id: 1,
                date: "15/01/2026",
                category: "Laboratoriais",
                items: [
                  {
                    name: "Hemograma Completo",
                    priority: "Normal",
                  },
                  {
                    name: "Creatinina",
                    priority: "Normal",
                  },
                  {
                    name: "Glicemia de Jejum",
                    priority: "Alta",
                  },
                ],
              },
            ],
            totalCount: 3,
          },
        },
      ],
    },
    {
      title: "Orientações e Observações",
      description: "Orientações ao paciente e notas clínicas",
      variant: "teal",
      components: [
        {
          type: "orientations_card",
          title: "Orientações ao Paciente",
          variant: "teal",
          data: {
            orientations: [
              "Manter dieta hipossódica (máximo 2g de sal/dia).",
              "Realizar atividade física leve (caminhada de 30 min, 5x/semana).",
              "Aferir pressão arterial diariamente e anotar valores.",
              "Evitar consumo de bebidas alcoólicas.",
            ],
          },
        },
      ],
    },
  ],
};

// Exemplo 2: Consulta pediátrica (caso mais simples, menos componentes)
export const example2_Pediatric: AIComponentResponse = {
  pageTitle: "Resumo da Consulta - Pediatria",
  sections: [
    {
      title: "Diagnóstico",
      description: "Hipótese diagnóstica",
      variant: "blue",
      components: [
        {
          type: "main_diagnosis_card",
          title: "Diagnóstico Principal",
          variant: "blue",
          data: {
            fields: [
              { label: "Condição", value: "Resfriado Comum" },
              { label: "CID", value: "J00" },
              { label: "Confiança", value: "Alta" },
            ],
            content: "Paciente apresenta sintomas típicos de resfriado comum, sem sinais de complicação.",
          },
        },
        {
          type: "symptoms_card",
          title: "Sintomas",
          variant: "rose",
          data: {
            items: [
              {
                primary: "Coriza",
                secondary: "Leve a moderada",
                metadata: [
                  { label: "Duração", value: "3 dias" },
                ],
              },
              {
                primary: "Tosse",
                secondary: "Seca",
                metadata: [
                  { label: "Frequência", value: "Ocasional" },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      title: "Receituários",
      description: "Medicamentos prescritos",
      variant: "emerald",
      components: [
        {
          type: "prescription_card",
          title: "Receituário Simples",
          variant: "emerald",
          data: {
            items: [
              {
                primary: "Paracetamol Gotas",
                secondary: "200mg/ml",
                metadata: [
                  { label: "Dosagem", value: "0,5ml" },
                  { label: "Frequência", value: "6/6h" },
                  { label: "Duração", value: "5 dias" },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      title: "Orientações",
      description: "Orientações aos responsáveis",
      variant: "teal",
      components: [
        {
          type: "orientations_card",
          title: "Orientações",
          variant: "teal",
          data: {
            orientations: [
              "Manter hidratação adequada.",
              "Oferecer alimentação leve e fracionada.",
              "Retornar se houver piora dos sintomas ou febre persistente.",
            ],
          },
        },
      ],
    },
  ],
};

// Exemplo 3: Consulta com múltiplos diagnósticos e formato genérico (testa flexibilidade)
export const example3_MultipleDiagnoses: AIComponentResponse = {
  pageTitle: "Resumo da Consulta - Múltiplas Condições",
  sections: [
    {
      title: "Informações Clínicas",
      description: "Dados biométricos e condições do paciente",
      variant: "blue",
      components: [
        {
          type: "biometrics_card",
          title: "Biometria",
          variant: "blue",
          data: {
            fields: [
              { label: "Tipo Sanguíneo", value: "A+" },
              { label: "Altura", value: "1.75 m" },
              { label: "Peso", value: "82 kg" },
              { label: "IMC", value: "26.8 (Sobrepeso)" },
              { label: "Idade", value: "45 anos" },
            ],
          },
        },
        {
          type: "allergies_card",
          title: "Alergias",
          variant: "red",
          data: {
            items: [
              {
                primary: "Penicilina",
                secondary: "Anafilaxia",
                metadata: [
                  { label: "Severidade", value: "Alta" },
                ],
                tags: ["Crítica"],
              },
              {
                primary: "Dipirona",
                secondary: "Erupção Cutânea",
                metadata: [
                  { label: "Severidade", value: "Moderada" },
                ],
              },
            ],
          },
        },
        {
          type: "chronic_conditions_card",
          title: "Condições Crônicas",
          variant: "indigo",
          data: {
            chronicConditions: [
              {
                name: "Diabetes Tipo 2",
                since: "2018",
                status: "Controlado",
              },
              {
                name: "Asma Leve",
                since: "Infância",
                status: "Crises Ocasionais",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Diagnóstico",
      description: "Hipóteses diagnósticas",
      variant: "blue",
      components: [
        {
          type: "main_diagnosis_card",
          title: "Diagnóstico Principal",
          variant: "blue",
          data: {
            fields: [
              { label: "Condição Principal", value: "Hipertensão Arterial Sistêmica" },
              { label: "CID", value: "I10" },
              { label: "Confiança", value: "Alta" },
              { label: "Severidade", value: "Moderada" },
            ],
            content:
              "Paciente com HAS descompensada, necessitando ajuste medicamentoso. Associado a diabetes tipo 2, requer monitoramento rigoroso.",
          },
        },
        {
          type: "differential_diagnosis_card",
          title: "Diagnósticos Diferenciais",
          variant: "purple",
          data: {
            items: [
              {
                primary: "Hipertensão do Avental Branco",
                secondary: "Baixa probabilidade",
                metadata: [
                  { label: "Status", value: "Excluído" },
                ],
                tags: ["Descartado"],
              },
              {
                primary: "Hipertensão Secundária (Renal)",
                secondary: "Média probabilidade",
                metadata: [
                  { label: "Status", value: "Em investigação" },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      title: "Medicação e Histórico",
      description: "Medicamentos em uso e histórico médico",
      variant: "neutral",
      components: [
        {
          type: "medications_card",
          title: "Medicação Contínua",
          variant: "teal",
          data: {
            items: [
              {
                primary: "Metformina 850mg",
                secondary: "Uso Contínuo",
                metadata: [
                  { label: "Frequência", value: "2x ao dia" },
                ],
              },
              {
                primary: "Simvastatina 20mg",
                secondary: "Uso Contínuo",
                metadata: [
                  { label: "Frequência", value: "1x à noite" },
                ],
              },
            ],
          },
        },
        {
          type: "social_history_card",
          title: "Histórico Social",
          variant: "neutral",
          data: {
            fields: [
              { label: "Tabagismo", value: "Ex-tabagista (parou há 5 anos)" },
              { label: "Álcool", value: "Socialmente (fins de semana)" },
              { label: "Atividade Física", value: "Sedentário" },
              { label: "Dieta", value: "Rica em carboidratos" },
            ],
          },
        },
        {
          type: "family_history_card",
          title: "Histórico Familiar",
          variant: "neutral",
          data: {
            familyHistory: [
              {
                relation: "Pai",
                condition: "Infarto Agudo do Miocárdio (IAM)",
                age: "55 anos",
              },
              {
                relation: "Mãe",
                condition: "Hipertensão Arterial Sistêmica (HAS)",
                age: "Desde os 40",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Plano Terapêutico",
      description: "Tratamento proposto e recomendações",
      variant: "emerald",
      components: [
        {
          type: "treatment_plan_card",
          title: "Plano de Tratamento",
          variant: "emerald",
          data: {
            treatment: {
              medications: [
                {
                  name: "Losartana Potássica",
                  dosage: "50mg",
                  frequency: "12/12h",
                  duration: "Contínuo",
                },
                {
                  name: "Hidroclorotiazida",
                  dosage: "25mg",
                  frequency: "1x pela manhã",
                  duration: "Contínuo",
                },
              ],
              lifestyle: [
                "Dieta DASH (Hipossódica)",
                "Caminhada 30min/dia (5x semana)",
                "Redução do consumo de álcool",
              ],
            },
          },
        },
        {
          type: "suggested_exams_card",
          title: "Exames Sugeridos",
          variant: "indigo",
          data: {
            items: [
              {
                primary: "MAPA 24h",
                metadata: [
                  { label: "Prioridade", value: "Alta" },
                ],
                tags: ["Urgente"],
              },
              {
                primary: "Ecocardiograma Transtorácico",
                metadata: [
                  { label: "Prioridade", value: "Média" },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
};

// Exemplo 4: Consulta com dados mínimos (testa casos extremos)
export const example4_Minimal: AIComponentResponse = {
  pageTitle: "Resumo da Consulta",
  sections: [
    {
      title: "Diagnóstico",
      description: "Informações clínicas",
      variant: "blue",
      components: [
        {
          type: "main_diagnosis_card",
          title: "Diagnóstico",
          variant: "blue",
          data: {
            fields: [
              { label: "Condição", value: "Consulta de Rotina" },
            ],
            content: "Paciente em acompanhamento regular, sem queixas específicas.",
          },
        },
      ],
    },
    {
      title: "Observações",
      description: "Notas clínicas",
      variant: "gray",
      components: [
        {
          type: "clinical_notes_card",
          title: "Observações",
          variant: "gray",
          data: {
            content: "Paciente orientado sobre importância do acompanhamento regular.",
          },
        },
      ],
    },
  ],
};

// Exemplo 5: Consulta com muitos componentes (testa layout e performance)
export const example5_Comprehensive: AIComponentResponse = {
  pageTitle: "Resumo da Consulta - Caso Completo",
  sections: [
    {
      title: "Receituários",
      description: "Medicamentos prescritos na consulta",
      variant: "emerald",
      components: [
        {
          type: "prescription_card",
          title: "Receituário Simples",
          variant: "emerald",
          data: {
            prescriptions: [
              {
                id: 1,
                date: "15/01/2026",
                type: "Receituário Simples",
                items: [
                  {
                    name: "Losartana Potássica 50mg",
                    dosage: "1 comprimido",
                    frequency: "12/12h",
                    duration: "Uso Contínuo",
                  },
                  {
                    name: "Hidroclorotiazida 25mg",
                    dosage: "1 comprimido",
                    frequency: "1x pela manhã",
                    duration: "Uso Contínuo",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "prescription_card",
          title: "Receituário Especial",
          variant: "emerald",
          data: {
            prescriptions: [
              {
                id: 2,
                date: "15/01/2026",
                type: "Receituário Especial (Azul)",
                items: [
                  {
                    name: "Clonazepam 2mg",
                    dosage: "1 comprimido",
                    frequency: "À noite",
                    duration: "30 dias",
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      title: "Exames Solicitados",
      description: "Exames laboratoriais e de imagem solicitados",
      variant: "blue",
      components: [
        {
          type: "exams_card",
          title: "Exames Laboratoriais",
          variant: "blue",
          data: {
            exams: [
              {
                id: 1,
                date: "15/01/2026",
                category: "Laboratoriais",
                items: [
                  {
                    name: "Hemograma Completo",
                    priority: "Normal",
                  },
                  {
                    name: "Creatinina",
                    priority: "Normal",
                  },
                  {
                    name: "Glicemia de Jejum",
                    priority: "Alta",
                  },
                ],
              },
            ],
            totalCount: 3,
          },
        },
        {
          type: "exams_card",
          title: "Exames de Imagem",
          variant: "indigo",
          data: {
            exams: [
              {
                id: 2,
                date: "15/01/2026",
                category: "Imagem/Cardiológicos",
                items: [
                  {
                    name: "Eletrocardiograma de Repouso",
                    priority: "Alta",
                  },
                  {
                    name: "MAPA 24h",
                    priority: "Alta",
                  },
                ],
              },
            ],
            totalCount: 2,
          },
        },
      ],
    },
    {
      title: "Encaminhamentos",
      description: "Especialidades e profissionais indicados",
      variant: "violet",
      components: [
        {
          type: "referrals_card",
          title: "Encaminhamentos Médicos",
          variant: "violet",
          data: {
            referrals: [
              {
                id: 1,
                date: "15/01/2026",
                specialty: "Cardiologia",
                professional: "Dr. Marcos Ribeiro",
                reason: "Avaliação de risco cardiovascular e estratificação.",
                urgency: "Prioritária",
              },
              {
                id: 2,
                date: "15/01/2026",
                specialty: "Nutrição",
                professional: "Dra. Amanda Lima",
                reason:
                  "Reeducação alimentar para controle pressórico e glicêmico. Dieta DASH.",
                urgency: "Eletiva",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Atestados",
      description: "Documentos médicos emitidos",
      variant: "amber",
      components: [
        {
          type: "certificates_card",
          title: "Atestados Emitidos",
          variant: "amber",
          data: {
            certificates: [
              {
                id: 1,
                date: "15/01/2026",
                type: "Atestado de Comparecimento",
                description: "Compareceu à consulta médica nesta data.",
                period: "Manhã (08:00 - 12:00)",
              },
              {
                id: 2,
                date: "15/01/2026",
                type: "Atestado Médico",
                description: "Afastamento por motivo de saúde.",
                period: "2 dias (15/01 e 16/01)",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Orientações e Observações",
      description: "Orientações ao paciente e notas clínicas",
      variant: "teal",
      components: [
        {
          type: "orientations_card",
          title: "Orientações ao Paciente",
          variant: "teal",
          data: {
            orientations: [
              "Manter dieta hipossódica (máximo 2g de sal/dia).",
              "Realizar atividade física leve (caminhada de 30 min, 5x/semana).",
              "Aferir pressão arterial diariamente e anotar valores.",
              "Evitar consumo de bebidas alcoólicas.",
            ],
          },
        },
        {
          type: "clinical_notes_card",
          title: "Observações do Médico",
          variant: "gray",
          data: {
            notes:
              "Paciente orientado sobre a importância da adesão ao tratamento farmacológico e não farmacológico. Discutido prognóstico e metas terapêuticas (PA < 130/80 mmHg). Paciente verbalizou compreensão e concordou com plano proposto.",
          },
        },
      ],
    },
    {
      title: "Próximos Agendamentos",
      description: "Consultas e retornos agendados",
      variant: "rose",
      components: [
        {
          type: "next_appointments_card",
          title: "Agendamentos Futuros",
          variant: "rose",
          data: {
            appointments: [
              {
                id: 1,
                date: "15/02/2026",
                time: "09:00",
                type: "Retorno Clínico Geral",
                doctor: "Dr. Silva",
                notes: "Trazer exames solicitados.",
              },
              {
                id: 2,
                date: "22/02/2026",
                time: "14:00",
                type: "Consulta Cardiologia",
                doctor: "Dr. Marcos Ribeiro",
                notes: "Avaliação pós-exames.",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Informações Clínicas",
      description: "Dados biométricos e condições do paciente",
      variant: "blue",
      components: [
        {
          type: "biometrics_card",
          title: "Biometria",
          variant: "blue",
          data: {
            personal: {
              bloodType: "A+",
              height: "1.75 m",
              weight: "82 kg",
              bmi: "26.8 (Sobrepeso)",
              age: "45 anos",
            },
          },
        },
        {
          type: "allergies_card",
          title: "Alergias",
          variant: "red",
          data: {
            allergies: [
              {
                name: "Penicilina",
                reaction: "Anafilaxia",
                severity: "Alta",
              },
              {
                name: "Dipirona",
                reaction: "Erupção Cutânea",
                severity: "Moderada",
              },
            ],
          },
        },
        {
          type: "chronic_conditions_card",
          title: "Condições Crônicas",
          variant: "indigo",
          data: {
            chronicConditions: [
              {
                name: "Diabetes Tipo 2",
                since: "2018",
                status: "Controlado",
              },
              {
                name: "Asma Leve",
                since: "Infância",
                status: "Crises Ocasionais",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Medicação e Histórico",
      description: "Medicamentos em uso e histórico médico",
      variant: "neutral",
      components: [
        {
          type: "medications_card",
          title: "Medicação Contínua",
          variant: "teal",
          data: {
            medications: [
              {
                name: "Metformina 850mg",
                frequency: "2x ao dia",
                type: "Uso Contínuo",
              },
              {
                name: "Simvastatina 20mg",
                frequency: "1x à noite",
                type: "Uso Contínuo",
              },
            ],
          },
        },
        {
          type: "social_history_card",
          title: "Histórico Social",
          variant: "neutral",
          data: {
            socialHistory: {
              smoking: "Ex-tabagista (parou há 5 anos)",
              alcohol: "Socialmente (fins de semana)",
              activity: "Sedentário",
              diet: "Rica em carboidratos",
            },
          },
        },
        {
          type: "family_history_card",
          title: "Histórico Familiar",
          variant: "neutral",
          data: {
            familyHistory: [
              {
                relation: "Pai",
                condition: "Infarto Agudo do Miocárdio (IAM)",
                age: "55 anos",
              },
              {
                relation: "Mãe",
                condition: "Hipertensão Arterial Sistêmica (HAS)",
                age: "Desde os 40",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Diagnóstico",
      description: "Hipótese diagnóstica e informações clínicas",
      variant: "blue",
      components: [
        {
          type: "main_diagnosis_card",
          title: "Diagnóstico Principal",
          variant: "blue",
          data: {
            mainCondition: "Hipertensão Arterial Sistêmica (HAS)",
            cid: "I10",
            confidence: "Alta",
            severity: "Moderada",
            evolution: "Crônica",
            justification:
              "Paciente apresenta histórico de pressão arterial elevada (150/90 mmHg) em múltiplas aferições, associado a cefaleia occipital e tontura ocasional. Histórico familiar positivo para doenças cardiovasculares e idade superior a 40 anos corroboram a hipótese.",
          },
        },
        {
          type: "symptoms_card",
          title: "Sintomas Relatados",
          variant: "rose",
          data: {
            symptoms: [
              {
                name: "Cefaleia Occipital",
                frequency: "Frequente",
                severity: "Moderada",
              },
              {
                name: "Tontura",
                frequency: "Ocasional",
                severity: "Leve",
              },
              {
                name: "Cansaço aos esforços",
                frequency: "Ocasional",
                severity: "Moderada",
              },
            ],
          },
        },
        {
          type: "risk_factors_card",
          title: "Fatores de Risco",
          variant: "orange",
          data: {
            riskFactors: [
              "Histórico Familiar Positivo",
              "Sedentarismo",
              "Sobrepeso (IMC > 25)",
              "Dieta rica em sódio",
            ],
          },
        },
      ],
    },
    {
      title: "Plano Terapêutico",
      description: "Tratamento proposto e recomendações",
      variant: "emerald",
      components: [
        {
          type: "treatment_plan_card",
          title: "Plano de Tratamento",
          variant: "emerald",
          data: {
            treatment: {
              medications: [
                {
                  name: "Losartana Potássica",
                  dosage: "50mg",
                  frequency: "12/12h",
                  duration: "Contínuo",
                },
                {
                  name: "Hidroclorotiazida",
                  dosage: "25mg",
                  frequency: "1x pela manhã",
                  duration: "Contínuo",
                },
              ],
              lifestyle: [
                "Dieta DASH (Hipossódica)",
                "Caminhada 30min/dia (5x semana)",
                "Redução do consumo de álcool",
              ],
            },
          },
        },
        {
          type: "differential_diagnosis_card",
          title: "Diagnósticos Diferenciais",
          variant: "purple",
          data: {
            differentials: [
              {
                name: "Hipertensão do Avental Branco",
                probability: "Baixa",
                excluded: true,
              },
              {
                name: "Hipertensão Secundária (Renal)",
                probability: "Média",
                excluded: false,
              },
            ],
          },
        },
        {
          type: "suggested_exams_card",
          title: "Exames Sugeridos",
          variant: "indigo",
          data: {
            suggestedExams: [
              {
                name: "MAPA 24h",
                priority: "Alta",
              },
              {
                name: "Ecocardiograma Transtorácico",
                priority: "Média",
              },
            ],
          },
        },
        {
          type: "observations_card",
          title: "Observações Clínicas",
          variant: "amber",
          data: {
            observations:
              "Necessário monitoramento rigoroso da função renal e fundoscopia anual para rastreio de lesões em órgãos-alvo.",
          },
        },
      ],
    },
  ],
};

// Importar exemplos do arquivo JSON
const jsonExamples = examplesFromJson as AIComponentResponse[];

// Criar um mapa com os exemplos do JSON usando o pageTitle como chave
const jsonExamplesMap: Record<string, AIComponentResponse> = {};
jsonExamples.forEach((example, index) => {
  const title = example.pageTitle || `Exemplo ${index + 1} do JSON`;
  jsonExamplesMap[title] = example;
});

// Mapa de todos os exemplos disponíveis (manuais + JSON)
export const transcriptionExamples: Record<string, AIComponentResponse> = {
  "Hipertensão (Completo)": example1_Hypertension,
  "Pediatria (Simples)": example2_Pediatric,
  "Múltiplos Diagnósticos": example3_MultipleDiagnoses,
  "Dados Mínimos": example4_Minimal,
  "Caso Completo": example5_Comprehensive,
  // Adicionar exemplos do JSON
  ...jsonExamplesMap,
};

// Tipo para as chaves dos exemplos
export type ExampleKey = string;

// Função helper para obter um exemplo
export function getTranscriptionExample(key: ExampleKey): AIComponentResponse {
  return transcriptionExamples[key];
}

// Função helper para obter todas as chaves disponíveis
export function getAvailableExampleKeys(): ExampleKey[] {
  return Object.keys(transcriptionExamples) as ExampleKey[];
}

// Função helper para obter apenas os exemplos do JSON
export function getJsonExampleKeys(): string[] {
  return Object.keys(jsonExamplesMap);
}

// Função helper para obter um exemplo do JSON por índice
export function getJsonExampleByIndex(index: number): AIComponentResponse | null {
  if (index >= 0 && index < jsonExamples.length) {
    return jsonExamples[index];
  }
  return null;
}

// Função helper para obter o total de exemplos do JSON
export function getJsonExamplesCount(): number {
  return jsonExamples.length;
}
