"use client";

import {
  CalendarClock,
  CheckCircle,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileOutput,
  FileSignature,
  FileText,
  Pill,
  UserPlus,
} from "lucide-react";

export function Points() {
  const pointsData = {
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
    exams: [
      {
        id: 1,
        date: "15/01/2026",
        category: "Laboratoriais",
        items: [
          {
            name: "Hemograma Completo",
            priority: "Normal",
            status: "Pendente",
          },
          { name: "Creatinina", priority: "Normal", status: "Pendente" },
          { name: "Potássio Sérico", priority: "Normal", status: "Pendente" },
          { name: "Glicemia de Jejum", priority: "Alta", status: "Pendente" },
          {
            name: "Hemoglobina Glicada (HbA1c)",
            priority: "Alta",
            status: "Pendente",
          },
          { name: "Perfil Lipídico", priority: "Normal", status: "Pendente" },
        ],
      },
      {
        id: 2,
        date: "15/01/2026",
        category: "Imagem/Cardiológicos",
        items: [
          {
            name: "Eletrocardiograma de Repouso",
            priority: "Alta",
            status: "Agendado",
          },
          { name: "MAPA 24h", priority: "Alta", status: "Pendente" },
          {
            name: "Ecocardiograma Transtorácico",
            priority: "Média",
            status: "Pendente",
          },
        ],
      },
    ],
    referrals: [
      {
        id: 1,
        date: "15/01/2026",
        specialty: "Oftalmologia",
        professional: "A definir",
        reason:
          "Avaliação de fundo de olho para rastreio de Retinopatia Hipertensiva",
        urgency: "Eletiva",
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
      {
        id: 3,
        date: "15/01/2026",
        specialty: "Cardiologia",
        professional: "Dr. Marcos Ribeiro",
        reason: "Avaliação de risco cardiovascular e estratificação.",
        urgency: "Prioritária",
      },
    ],
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
    nextAppointments: [
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
    orientations: [
      "Manter dieta hipossódica (máximo 2g de sal/dia).",
      "Realizar atividade física leve (caminhada de 30 min, 5x/semana).",
      "Aferir pressão arterial diariamente e anotar valores.",
      "Evitar consumo de bebidas alcoólicas.",
      "Retornar imediatamente em caso de: dor no peito, falta de ar intensa, tontura persistente.",
    ],
    clinicalNotes:
      "Paciente orientado sobre a importância da adesão ao tratamento farmacológico e não farmacológico. Discutido prognóstico e metas terapêuticas (PA < 130/80 mmHg). Paciente verbalizou compreensão e concordou com plano proposto. Familiares presentes na consulta.",
  };

  return (
    <div className="animate-in fade-in flex w-full flex-col gap-8 pb-10 duration-500">
      {/* ========== 1. Receituários ========== */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Receituários</h2>
              <p className="text-xs text-gray-400">
                {pointsData.prescriptions.length} receita(s) emitida(s)
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-100">
            <Download className="h-4 w-4" />
            Baixar Todas
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {pointsData.prescriptions.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span className="block text-sm font-bold text-gray-900">
                    {p.type}
                  </span>
                  <span className="text-xs text-gray-400">{p.date}</span>
                </div>
                <button className="rounded-lg bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {p.items.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-3"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-emerald-900">
                        {item.name}
                      </p>
                      <span className="rounded border border-emerald-100 bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 uppercase">
                        {item.duration}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-emerald-700">
                      {item.dosage} • {item.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* ========== 2. Exames Pedidos ========== */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200">
              <FileOutput className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Exames Solicitados
              </h2>
              <p className="text-xs text-gray-400">
                {pointsData.exams.reduce((acc, e) => acc + e.items.length, 0)}{" "}
                exame(s) no total
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">
            <Download className="h-4 w-4" />
            Baixar Guias
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {pointsData.exams.map((ex) => (
            <div
              key={ex.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between border-b border-gray-50 pb-3">
                <div>
                  <span className="block text-sm font-bold text-gray-900">
                    {ex.category}
                  </span>
                  <span className="text-xs text-gray-400">{ex.date}</span>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                  {ex.items.length} itens
                </span>
              </div>
              <div className="space-y-2">
                {ex.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 transition-colors hover:bg-blue-50/50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${item.priority === "Alta" ? "bg-red-400" : "bg-blue-400"}`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* ========== 3. Encaminhamentos ========== */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-md shadow-violet-200">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Encaminhamentos</h2>
            <p className="text-xs text-gray-400">
              {pointsData.referrals.length} encaminhamento(s)
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {pointsData.referrals.map((ref) => (
            <div
              key={ref.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-violet-200 hover:bg-violet-50/20 sm:flex-row sm:items-start"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-600">
                  {ref.specialty.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {ref.specialty}
                  </h4>
                  <p className="mt-0.5 text-sm text-gray-500">{ref.reason}</p>
                  {ref.professional !== "A definir" && (
                    <p className="mt-2 text-xs font-medium text-violet-600">
                      Profissional: {ref.professional}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${ref.urgency === "Prioritária" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}
                >
                  {ref.urgency}
                </span>
                <span className="text-xs text-gray-400">{ref.date}</span>
                <button className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:underline">
                  Ver Guia <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* ========== 4. Atestados ========== */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-200">
            <FileSignature className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Atestados</h2>
            <p className="text-xs text-gray-400">
              {pointsData.certificates.length} atestado(s)
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {pointsData.certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-start justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-gray-900">{cert.type}</p>
                <p className="mt-1 text-sm text-gray-500">{cert.description}</p>
                <p className="mt-2 text-xs text-gray-400">
                  Período: {cert.period}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-md border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                  {cert.date}
                </span>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-600">
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* ========== 5. Orientações ========== */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-200">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Orientações ao Paciente
          </h2>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50/30 p-6">
          <ul className="space-y-3">
            {pointsData.orientations.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-gray-700"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* ========== 6. Notas Clínicas ========== */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-md shadow-gray-200">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Observações do Médico
          </h2>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm leading-relaxed text-gray-600 italic">
            "{pointsData.clinicalNotes}"
          </p>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* ========== 7. Próximas Consultas ========== */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200">
            <CalendarClock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Próximos Agendamentos
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {pointsData.nextAppointments.map((appt) => (
            <div
              key={appt.id}
              className="flex items-start gap-5 rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-white p-5 transition-all hover:shadow-md"
            >
              <div className="flex min-w-[70px] flex-col items-center justify-center rounded-xl border border-rose-100 bg-white p-3 shadow-sm">
                <span className="text-2xl font-bold text-rose-600">
                  {appt.date.split("/")[0]}
                </span>
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  {
                    [
                      "JAN",
                      "FEV",
                      "MAR",
                      "ABR",
                      "MAI",
                      "JUN",
                      "JUL",
                      "AGO",
                      "SET",
                      "OUT",
                      "NOV",
                      "DEZ",
                    ][parseInt(appt.date.split("/")[1]) - 1]
                  }
                </span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{appt.type}</p>
                <p className="text-sm font-medium text-rose-600">
                  {appt.time} • {appt.doctor}
                </p>
                {appt.notes && (
                  <p className="mt-2 inline-block rounded border border-gray-100 bg-white/50 px-2 py-1 text-xs text-gray-500">
                    <span className="font-medium">Obs:</span> {appt.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
