import { AIComponentResponse } from "../types/component-types";

export const mockAIGeneratedData: AIComponentResponse = {
  pageTitle: "Preview de Componentes Gerados pela IA",
  sections: [
    // ========== SEÇÃO: RECEITUÁRIOS (com flexibilidade) ==========
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
    // ========== SEÇÃO: EXAMES (demonstrando flexibilidade) ==========
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
    // ========== SEÇÃO: ENCAMINHAMENTOS ==========
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
    // ========== SEÇÃO: ATESTADOS ==========
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
    // ========== SEÇÃO: ORIENTAÇÕES E NOTAS ==========
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
    // ========== SEÇÃO: PRÓXIMOS AGENDAMENTOS ==========
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
    // ========== SEÇÃO: INFORMAÇÕES CLÍNICAS BÁSICAS ==========
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
    // ========== SEÇÃO: MEDICAÇÃO E HISTÓRICO ==========
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
    // ========== SEÇÃO: DIAGNÓSTICO PRINCIPAL ==========
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
    // ========== SEÇÃO: PLANO TERAPÊUTICO ==========
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
