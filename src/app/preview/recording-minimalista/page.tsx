import {
  Check,
  FileText,
  Loader2,
  Search,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { MinimalistaShell } from "../_components/minimalista/chrome";
import { mockRecording } from "../_mocks/data";

const prompts = [
  { name: "IA Padrão", source: "IA Padrão", description: "Resumo genérico padrão da plataforma" },
  { name: "Consulta Psicológica", source: "Pessoal", description: "Focado em queixa, plano terapêutico e próximos passos" },
  { name: "Consultório Clínica A", source: "Empresa", description: "Prompt personalizado da sua clínica" },
  { name: "Reunião de Equipe", source: "Global", description: "Reuniões com time: decisões, próximos passos" },
];

export default function RecordingMinimalista() {
  return (
    <MinimalistaShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-10">
          {/* Header with tabs */}
          <div>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
                  {mockRecording.title}
                </h1>
                <p className="mt-1 text-neutral-500">
                  {mockRecording.date} · {mockRecording.duration}
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
                <Sparkles className="h-4 w-4" />
                Solicitar Transcrição
              </button>
            </div>
            <nav className="mt-8 flex items-center gap-8 border-b border-neutral-200 text-sm">
              <a className="border-b border-neutral-900 pb-2 font-medium text-neutral-900">Geral</a>
              <a href="/preview/transcription-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Transcrição</a>
              <a href="/preview/chat-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Chat</a>
              <a href="/preview/overview-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Insights</a>
            </nav>
          </div>

          {/* READY state — Markdown summary */}
          <article className="prose prose-neutral max-w-none">
            <h1 className="!mt-0 text-2xl font-medium !text-neutral-900">Resumo da Consulta</h1>
            <h2 className="!text-base !font-medium !text-neutral-900">Queixa Principal</h2>
            <p>
              Paciente relata ansiedade recorrente associada a mudanças no ambiente de
              trabalho, com episódios de insônia nas últimas 3 semanas.
            </p>
            <h2 className="!text-base !font-medium !text-neutral-900">Histórico</h2>
            <ul>
              <li>Sem histórico familiar direto de transtornos de ansiedade.</li>
              <li>Uso ocasional de medicação para dormir (automedicação).</li>
              <li>Pratica atividade física 2x por semana.</li>
            </ul>
            <h2 className="!text-base !font-medium !text-neutral-900">Plano Terapêutico</h2>
            <ol>
              <li>Iniciar acompanhamento semanal</li>
              <li>Diário de sono + estressores</li>
              <li>Reavaliar em 30 dias</li>
            </ol>
            <h2 className="!text-base !font-medium !text-neutral-900">Próximos Passos</h2>
            <p>
              Agendar retorno em <strong>2 semanas</strong> e compartilhar material de
              apoio sobre higiene do sono.
            </p>
          </article>

          {/* PENDING/TRANSCRIBING state */}
          <section className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-0.5 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              Gerando Resumo e Transcrição
            </span>
            <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-700" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-neutral-900">
              A Mágica está acontecendo
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
              Seu áudio está sendo processado pela nossa Inteligência Artificial para
              gerar um resumo completo. Por favor, aguarde.
            </p>
          </section>

          {/* NOT_REQUESTED state */}
          <section className="rounded-md border border-neutral-200 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
              <FileText className="h-7 w-7 text-neutral-700" />
              <Wand2 className="absolute ml-10 -mt-10 h-4 w-4 animate-bounce text-neutral-400" />
              <Sparkles className="absolute -ml-10 -mt-6 h-3 w-3 animate-pulse text-neutral-400" />
            </div>
            <span className="inline-block rounded-full border border-neutral-300 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-widest text-neutral-700">
              Ação Necessária
            </span>
            <h3 className="mt-4 text-xl font-medium text-neutral-900">
              Resumo Não Solicitado
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
              Para visualizar os insights e o resumo textual desta reunião, é necessário
              primeiro solicitar a transcrição do áudio.
            </p>
            <p className="mt-1 text-xs italic text-neutral-400">
              Nossa IA fará o trabalho pesado para você.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
              <Sparkles className="h-4 w-4" />
              Solicitar Transcrição
            </button>
          </section>
        </div>

        {/* Right rail — RequestTranscription modal preview */}
        <aside className="rounded-md border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <h3 className="text-sm font-medium text-neutral-900">
              Escolha a IA para transcrição
            </h3>
            <button aria-label="Fechar" className="text-neutral-400 hover:text-neutral-900">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                placeholder="Buscar IA..."
                className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <ul className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto pr-1">
              {prompts.map((p, i) => {
                const badgeTone: Record<string, string> = {
                  "IA Padrão": "border-neutral-300 bg-neutral-100 text-neutral-700",
                  "Pessoal": "border-blue-200 bg-blue-50 text-blue-700",
                  "Empresa": "border-emerald-200 bg-emerald-50 text-emerald-700",
                  "Global": "border-amber-200 bg-amber-50 text-amber-700",
                };
                const isSelected = i === 1;
                return (
                  <li key={p.name}>
                    <button
                      className={`w-full rounded-md border p-3 text-left transition ${
                        isSelected
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-900">
                              {p.name}
                            </span>
                            <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${badgeTone[p.source]}`}>
                              {p.source}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-neutral-500">{p.description}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="border-t border-neutral-200 p-4">
            <button className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
              Confirmar seleção de IA: Consulta Psicológica
            </button>
          </div>
        </aside>
      </div>
    </MinimalistaShell>
  );
}
