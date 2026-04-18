import {
  Check,
  Clock,
  Copy,
  Download,
  FileText,
  Loader2,
  MoreHorizontal,
  Search,
  Share2,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { CorporateShell } from "../_components/corporate/chrome";
import { mockRecording } from "../_mocks/data";

const prompts = [
  { name: "IA Padrão", source: "IA Padrão", description: "Resumo genérico padrão da plataforma" },
  { name: "Consulta Psicológica", source: "Pessoal", description: "Focado em queixa, plano terapêutico e próximos passos" },
  { name: "Consultório Clínica A", source: "Empresa", description: "Prompt personalizado da sua clínica" },
  { name: "Reunião de Equipe", source: "Global", description: "Reuniões com time: decisões, próximos passos" },
];

const sourceBadge: Record<string, string> = {
  "IA Padrão": "bg-slate-100 text-slate-700",
  "Pessoal": "bg-blue-100 text-blue-700",
  "Empresa": "bg-emerald-100 text-emerald-700",
  "Global": "bg-amber-100 text-amber-700",
};

export default function RecordingCorporate() {
  return (
    <CorporateShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
      pageTitle="Gravação"
      activeHref="/preview/recordings-corporate"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  <Check className="h-3 w-3" />
                  Transcrição pronta
                </span>
                <h1 className="mt-2 text-xl font-semibold text-slate-900">
                  {mockRecording.title}
                </h1>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {mockRecording.date}
                  </span>
                  <span>·</span>
                  <span>{mockRecording.duration}</span>
                  <span>·</span>
                  <span>Cliente: {mockRecording.client}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Share2 className="h-3.5 w-3.5" />
                  Compartilhar
                </button>
                <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Download className="h-3.5 w-3.5" />
                  Baixar
                </button>
                <button className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Solicitar Transcrição
                </button>
                <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
            <nav className="mt-5 flex items-center gap-1 border-b border-slate-200 text-xs">
              <a className="-mb-px border-b-2 border-blue-600 px-3 py-2 font-semibold text-blue-700">Geral</a>
              <a href="/preview/transcription-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Transcrição</a>
              <a href="/preview/chat-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Chat</a>
              <a href="/preview/overview-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Insights</a>
            </nav>
          </div>

          {/* READY state */}
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Resumo</h2>
              <button className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50">
                <Copy className="h-3 w-3" />
                Copiar
              </button>
            </div>
            <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-lg prose-h2:text-sm prose-h2:uppercase prose-h2:tracking-wider prose-h2:text-blue-700">
              <h1>Resumo da Consulta</h1>
              <h2>Queixa Principal</h2>
              <p>
                Paciente relata ansiedade recorrente associada a mudanças no ambiente de
                trabalho, com episódios de insônia nas últimas 3 semanas.
              </p>
              <h2>Histórico</h2>
              <ul>
                <li>Sem histórico familiar direto de transtornos de ansiedade.</li>
                <li>Uso ocasional de medicação para dormir (automedicação).</li>
                <li>Pratica atividade física 2x por semana.</li>
              </ul>
              <h2>Plano Terapêutico</h2>
              <ol>
                <li>Iniciar acompanhamento semanal</li>
                <li>Diário de sono + estressores</li>
                <li>Reavaliar em 30 dias</li>
              </ol>
              <h2>Próximos Passos</h2>
              <p>
                Agendar retorno em <strong>2 semanas</strong> e compartilhar material de
                apoio sobre higiene do sono.
              </p>
            </div>
          </article>

          {/* PENDING */}
          <section className="rounded-lg border border-amber-200 bg-amber-50/30 p-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              Gerando Resumo e Transcrição
            </span>
            <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-slate-900">
              A Mágica está acontecendo
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-slate-600">
              Seu áudio está sendo processado pela nossa IA para gerar um resumo
              completo. Isso pode levar alguns minutos.
            </p>
            <div className="mx-auto mt-4 max-w-xs">
              <div className="h-1.5 overflow-hidden rounded-full bg-amber-100">
                <div className="h-full w-2/3 rounded-full bg-amber-500" />
              </div>
              <p className="mt-2 text-[11px] font-medium text-amber-700">
                Processando · 67%
              </p>
            </div>
          </section>

          {/* NOT_REQUESTED */}
          <section className="rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 p-8 text-center">
            <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-white shadow-sm">
              <FileText className="h-7 w-7 text-blue-600" />
              <Wand2 className="absolute -right-2 -top-2 h-5 w-5 animate-bounce rounded-full bg-amber-400 p-1 text-white shadow" />
              <Sparkles className="absolute -left-2 top-1 h-4 w-4 animate-pulse text-blue-500" />
            </div>
            <span className="inline-block rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Ação Necessária
            </span>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">
              Resumo Não Solicitado
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-slate-600">
              Para visualizar os insights e o resumo textual desta reunião, é
              necessário primeiro solicitar a transcrição do áudio.
            </p>
            <p className="mt-1 text-[11px] italic text-slate-500">
              Nossa IA fará o trabalho pesado para você.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Solicitar Transcrição
            </button>
          </section>
        </div>

        {/* Right: RequestTranscription modal */}
        <aside className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white">
            <div>
              <h3 className="text-sm font-semibold">Escolha a IA para transcrição</h3>
              <p className="text-[11px] text-blue-100">
                Prompts disponíveis para você
              </p>
            </div>
            <button aria-label="Fechar" className="rounded text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Buscar IA..."
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <ul className="mt-3 max-h-[55vh] space-y-2 overflow-y-auto pr-1">
              {prompts.map((p, i) => {
                const isSelected = i === 1;
                return (
                  <li key={p.name}>
                    <button
                      className={`w-full rounded-md border p-3 text-left transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-900">
                              {p.name}
                            </span>
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${sourceBadge[p.source]}`}
                            >
                              {p.source}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-auto border-t border-slate-200 bg-slate-50 p-3">
            <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
              Confirmar seleção de IA: Consulta Psicológica
            </button>
          </div>
        </aside>
      </div>
    </CorporateShell>
  );
}
