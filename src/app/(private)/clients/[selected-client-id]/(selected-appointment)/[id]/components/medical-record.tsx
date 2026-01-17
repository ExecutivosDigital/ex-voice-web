"use client";

import { useGeneralContext } from "@/context/GeneralContext";
import {
  Activity,
  AlertCircle,
  Cigarette,
  Dna,
  FileText,
  History,
  Pill,
  User,
  Users,
  Wine,
} from "lucide-react";

export function MedicalRecord() {
  const { selectedClient } = useGeneralContext();

  const medicalData = {
    personal: {
      bloodType: "A+",
      height: "1.75 m",
      weight: "82 kg",
      bmi: "26.8 (Sobrepeso)",
      age: "45 anos",
    },
    allergies: [
      { name: "Penicilina", reaction: "Anafilaxia", severity: "Alta" },
      { name: "Dipirona", reaction: "Erupção Cutânea", severity: "Moderada" },
      { name: "Camarão", reaction: "Edema de Glote", severity: "Alta" },
    ],
    chronicConditions: [
      { name: "Diabetes Tipo 2", since: "2018", status: "Controlado" },
      { name: "Asma Leve", since: "Infância", status: "Crises Ocasionais" },
      { name: "Dislipidemia", since: "2020", status: "Em tratamento" },
    ],
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
      { relation: "Avô Paterno", condition: "AVC Isquêmico", age: "70 anos" },
    ],
    socialHistory: {
      smoking: "Ex-tabagista (parou há 5 anos)",
      alcohol: "Socialmente (fins de semana)",
      activity: "Sedentário",
      diet: "Rica em carboidratos",
    },
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
      { name: "Aerolin Spray", frequency: "Se necessário", type: "SOS" },
    ],
    history: [
      {
        date: "15/12/2023",
        type: "Consulta de Rotina",
        doctor: "Dr. Silva",
        specialty: "Clínico Geral",
        note: "Paciente relatou melhora nos sintomas respiratórios. Glicemia de jejum 110 mg/dL. Pressão arterial 130/80 mmHg. Orientado a manter dieta e iniciar atividade física leve.",
        attachments: ["Exames Laboratoriais", "Receita Médica"],
      },
      {
        date: "10/10/2023",
        type: "Pronto Atendimento",
        doctor: "Dra. Costa",
        specialty: "Pneumologia",
        note: "Crise asmática leve desencadeada por mudança climática. Realizado nebulização com Berotec + Atrovent. Melhora significativa após 40 minutos.",
        attachments: ["Relatório de Alta"],
      },
      {
        date: "05/06/2023",
        type: "Primeira Consulta",
        doctor: "Dr. Silva",
        specialty: "Clínico Geral",
        note: "Anamnese inicial. Paciente queixa-se de polidipsia e poliúria. Solicitado exames laboratoriais completos para investigação de diabetes.",
        attachments: ["Pedido de Exames"],
      },
    ],
  };

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-6 pb-10 duration-500">
      {/* Top Section: Biometrics & Quick Info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm md:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <User className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-gray-900">Biometria</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <span className="text-sm text-gray-500">Tipo Sanguíneo</span>
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">
                {medicalData.personal.bloodType}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <span className="text-sm text-gray-500">IMC</span>
              <span className="text-sm font-medium text-gray-900">
                {medicalData.personal.bmi}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Peso / Altura</span>
              <span className="text-sm font-medium text-gray-900">
                {medicalData.personal.weight} / {medicalData.personal.height}
              </span>
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="rounded-2xl border border-red-100 bg-red-50/30 p-4 shadow-sm md:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-red-900">Alergias</h3>
          </div>
          <div className="space-y-2">
            {medicalData.allergies.map((allergy, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-red-100 bg-white p-2 shadow-sm"
              >
                <span className="text-sm font-medium text-red-900">
                  {allergy.name}
                </span>
                {allergy.severity === "Alta" && (
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-red-500"
                    title="Alta Severidade"
                  ></span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 shadow-sm md:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-indigo-900">Condições</h3>
          </div>
          <div className="space-y-2">
            {medicalData.chronicConditions.map((condition, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-indigo-100 bg-white p-2 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-indigo-900">
                    {condition.name}
                  </span>
                </div>
                <span className="mt-0.5 block text-[10px] text-gray-500">
                  {condition.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Continuous Medications */}
        <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-4 shadow-sm md:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <Pill className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-teal-900">Medicação</h3>
          </div>
          <div className="space-y-2">
            {medicalData.medications.map((med, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-teal-100 bg-white p-2 shadow-sm"
              >
                <span className="block text-sm font-medium text-teal-900">
                  {med.name}
                </span>
                <span className="text-[10px] text-gray-500">
                  {med.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Detailed Info Column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Social History */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
              <Users className="h-5 w-5 text-gray-400" />
              Histórico Social
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Cigarette className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Tabagismo</p>
                  <p className="text-sm text-gray-500">
                    {medicalData.socialHistory.smoking}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wine className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Consumo de Álcool
                  </p>
                  <p className="text-sm text-gray-500">
                    {medicalData.socialHistory.alcohol}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Atividade Física
                  </p>
                  <p className="text-sm text-gray-500">
                    {medicalData.socialHistory.activity}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Family History */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
              <Dna className="h-5 w-5 text-gray-400" />
              Histórico Familiar
            </h3>
            <div className="space-y-4">
              {medicalData.familyHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="relative border-l-2 border-dashed border-gray-200 pl-4"
                >
                  <p className="text-sm font-bold text-gray-800">
                    {item.relation}
                  </p>
                  <p className="text-sm text-gray-600">{item.condition}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Diagnóstico: {item.age}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History Timeline */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <History className="h-5 w-5 text-gray-400" />
              Histórico de Atendimentos
            </h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Ver histórico completo
            </button>
          </div>

          <div className="relative ml-3 space-y-10 border-l-2 border-gray-100 pb-4">
            {medicalData.history.map((record, index) => (
              <div key={index} className="group relative pl-8">
                {/* Timeline Dot */}
                <div className="absolute top-0 -left-[9px] h-4 w-4 rounded-full border-2 border-white bg-blue-500 ring-4 ring-blue-50 transition-all group-hover:ring-blue-100"></div>

                <div className="mb-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span className="block text-sm font-bold text-gray-900">
                      {record.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {record.specialty} • {record.doctor}
                    </span>
                  </div>
                  <span className="w-max rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                    {record.date}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 transition-all hover:border-blue-100 hover:bg-white hover:shadow-md">
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {record.note}
                  </p>

                  {record.attachments && record.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t border-gray-200/50 pt-3">
                      {record.attachments.map((att, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 shadow-sm"
                        >
                          <FileText className="h-3 w-3 text-gray-400" />
                          {att}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
