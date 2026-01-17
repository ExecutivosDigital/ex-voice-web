"use client";

import { useGeneralContext } from "@/context/GeneralContext";
import {
  Activity,
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Clock,
  FileText,
  GitBranch,
  Info,
  Pill,
  Stethoscope,
} from "lucide-react";

export function Diagnosis() {
  const { selectedRecording } = useGeneralContext();

  // Mock data for diagnosis - Expanded with more details
  const diagnosisData = {
    mainCondition: "Hipertensão Arterial Sistêmica (HAS)",
    cid: "I10",
    confidence: "Alta",
    severity: "Moderada",
    evolution: "Crônica",
    justification:
      "Paciente apresenta histórico de pressão arterial elevada (150/90 mmHg) em múltiplas aferições, associado a cefaleia occipital e tontura ocasional. Histórico familiar positivo para doenças cardiovasculares e idade superior a 40 anos corroboram a hipótese.",
    observations:
      "Necessário monitoramento rigoroso da função renal e fundoscopia anual para rastreio de lesões em órgãos-alvo. A adesão ao tratamento não farmacológico é crucial neste estágio.",
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
      { name: "Feocromocitoma", probability: "Muito Baixa", excluded: true },
    ],
    symptoms: [
      {
        name: "Cefaleia Occipital",
        frequency: "Frequente",
        severity: "Moderada",
      },
      { name: "Tontura", frequency: "Ocasional", severity: "Leve" },
      { name: "Zumbido", frequency: "Raro", severity: "Leve" },
      {
        name: "Cansaço aos esforços",
        frequency: "Ocasional",
        severity: "Moderada",
      },
    ],
    riskFactors: [
      "Histórico Familiar Positivo",
      "Sedentarismo",
      "Sobrepeso (IMC > 25)",
      "Estresse Ocupacional Elevado",
      "Dieta rica em sódio",
    ],
    suggestedExams: [
      { name: "MAPA 24h", status: "Pendente", priority: "Alta" },
      {
        name: "Ecocardiograma Transtorácico",
        status: "Pendente",
        priority: "Média",
      },
      { name: "Creatinina e Ureia", status: "Realizado", priority: "Alta" },
      { name: "Fundoscopia", status: "Agendado", priority: "Baixa" },
    ],
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
        "Cessação do tabagismo",
      ],
    },
  };

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-6 pb-10 duration-500">
      {/* Top Section: Main Diagnosis */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-6 shadow-sm ring-1 ring-blue-100/50">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {diagnosisData.mainCondition}
                </h2>
                <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  CID: {diagnosisData.cid}
                </span>
              </div>
              <p className="mt-1 text-base text-gray-500">
                Diagnóstico Principal Identificado
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Confiança:{" "}
                  <span className="text-gray-900">
                    {diagnosisData.confidence}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Severidade:{" "}
                  <span className="text-gray-900">
                    {diagnosisData.severity}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Evolução:{" "}
                  <span className="text-gray-900">
                    {diagnosisData.evolution}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-white/60 p-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
            <FileText className="h-4 w-4" />
            Justificativa Clínica
          </h3>
          <p className="leading-relaxed text-gray-700">
            {diagnosisData.justification}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Symptoms & Risk Factors */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Symptoms and Risk Factors Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Symptoms */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-5 flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Sintomas Relatados
                  </h3>
                  <p className="text-xs text-gray-400">
                    Identificados na anamnese
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {diagnosisData.symptoms.map((symptom, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-rose-400" />
                      <span className="font-medium text-gray-700">
                        {symptom.name}
                      </span>
                    </div>
                    <span className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500">
                      {symptom.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Factors */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-5 flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Fatores de Risco
                  </h3>
                  <p className="text-xs text-gray-400">
                    Agravantes identificados
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {diagnosisData.riskFactors.map((factor, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-lg border border-orange-100 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Plano Terapêutico
                </h3>
                <p className="text-xs text-gray-400">Sugestão de conduta</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Medicamentos Sugeridos
                </h4>
                <div className="space-y-3">
                  {diagnosisData.treatment.medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="group relative overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 transition-all hover:bg-emerald-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-emerald-900">
                            {med.name}
                          </p>
                          <p className="text-sm text-emerald-700">
                            {med.dosage}
                          </p>
                        </div>
                        <span className="rounded-md border border-emerald-100 bg-white px-2 py-1 text-xs font-medium text-emerald-600 shadow-sm">
                          {med.frequency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  Estilo de Vida
                </h4>
                <ul className="space-y-2">
                  {diagnosisData.treatment.lifestyle.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 rounded-lg border border-transparent p-2 text-sm text-gray-600 hover:border-gray-100 hover:bg-gray-50"
                    >
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Differentials & Exams & Observations */}
        <div className="flex flex-col gap-6">
          {/* Differential Diagnosis */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <GitBranch className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Diagnósticos Diferenciais
              </h3>
            </div>
            <div className="space-y-3">
              {diagnosisData.differentials.map((diff, index) => (
                <div
                  key={index}
                  className={`flex flex-col rounded-xl border p-3 transition-colors ${
                    diff.excluded
                      ? "border-gray-100 bg-gray-50 opacity-70"
                      : "border-purple-100 bg-purple-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${diff.excluded ? "text-gray-500 line-through" : "text-gray-900"}`}
                    >
                      {diff.name}
                    </span>
                    {diff.excluded ? (
                      <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">
                        Excluído
                      </span>
                    ) : (
                      <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-purple-600 uppercase">
                        Possível
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Probabilidade:
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {diff.probability}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Exams */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                <Beaker className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">Exames Sugeridos</h3>
            </div>
            <div className="space-y-3">
              {diagnosisData.suggestedExams.map((exam, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {exam.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${exam.priority === "Alta" ? "bg-red-400" : "bg-blue-400"}`}
                    />
                    <span className="text-xs text-gray-500">
                      {exam.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Info className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">Observações</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              {diagnosisData.observations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
