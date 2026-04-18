import {
  Check,
  FileText,
  Loader2,
  Search,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { MonocromaticoShell } from "../_components/monocromatico/chrome";
import { mockRecording } from "../_mocks/data";

const prompts = [
  { name: "IA Padrão", source: "IA Padrão", description: "Resumo genérico padrão da plataforma" },
  { name: "Consulta Psicológica", source: "Pessoal", description: "Focado em queixa, plano terapêutico e próximos passos" },
  { name: "Consultório Clínica A", source: "Empresa", description: "Prompt personalizado da sua clínica" },
  { name: "Reunião de Equipe", source: "Global", description: "Reuniões com time: decisões, próximos passos" },
];

export default function RecordingMonocromatico() {
  return (
    <MonocromaticoShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-16">
          <div>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                  Gravação
                </span>
                <h1
                  className="mt-3 text-4xl text-neutral-900"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  {mockRecording.title}.
                </h1>
                <p
                  className="mt-2 italic text-neutral-500"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  {mockRecording.date} · {mockRecording.duration}
                </p>
              </div>
              <button className="flex items-center gap-2 border border-neutral-900 px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50">
                <Sparkles className="h-4 w-4" />
                Solicitar Transcrição
              </button>
            </div>
            <nav className="mt-10 flex items-center gap-10 border-b border-neutral-200 text-sm">
              <a className="border-b border-neutral-900 pb-3 text-neutral-900">Geral</a>
              <a href="/preview/transcription-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Transcrição</a>
              <a href="/preview/chat-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Chat</a>
              <a href="/preview/overview-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Insights</a>
            </nav>
          </div>

          {/* READY */}
          <article className="prose prose-neutral max-w-none">
            <h1
              className="!mt-0 !text-4xl !font-normal !text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Resumo da consulta
            </h1>
            <p
              className="!italic !text-neutral-500"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Uma síntese estruturada em quatro seções.
            </p>
            <h2
              className="!text-2xl !font-normal !text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Queixa principal
            </h2>
            <p>
              Paciente relata ansiedade recorrente associada a mudanças no ambiente de
              trabalho, com episódios de insônia nas últimas 3 semanas.
            </p>
            <h2
              className="!text-2xl !font-normal !text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Histórico
            </h2>
            <ul>
              <li>Sem histórico familiar direto de transtornos de ansiedade.</li>
              <li>Uso ocasional de medicação para dormir (automedicação).</li>
              <li>Pratica atividade física 2x por semana.</li>
            </ul>
            <h2
              className="!text-2xl !font-normal !text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Plano terapêutico
            </h2>
            <ol>
              <li>Iniciar acompanhamento semanal</li>
              <li>Diário de sono + estressores</li>
              <li>Reavaliar em 30 dias</li>
            </ol>
            <h2
              className="!text-2xl !font-normal !text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Próximos passos
            </h2>
            <p>
              Agendar retorno em <strong>2 semanas</strong> e compartilhar material de
              apoio sobre higiene do sono.
            </p>
          </article>

          {/* PENDING */}
          <section className="border-y border-dashed border-neutral-300 py-12 text-center">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-700" />
              Gerando resumo e transcrição
            </span>
            <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 bg-white">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-700" />
            </div>
            <h3
              className="mt-6 text-3xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              A mágica está acontecendo.
            </h3>
            <p
              className="mx-auto mt-2 max-w-lg italic text-neutral-500"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Seu áudio está sendo processado pela nossa IA para gerar um resumo
              completo. Por favor, aguarde.
            </p>
          </section>

          {/* NOT_REQUESTED */}
          <section className="py-12 text-center">
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-sm border border-neutral-300 bg-white">
              <FileText className="h-9 w-9 text-neutral-700" />
              <Wand2 className="absolute -right-3 -top-3 h-5 w-5 animate-bounce text-neutral-500" />
              <Sparkles className="absolute -left-3 top-2 h-4 w-4 animate-pulse text-neutral-500" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
              Ação Necessária
            </span>
            <h3
              className="mt-4 text-4xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Resumo não solicitado.
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
              Para visualizar insights e resumo textual desta reunião, é necessário
              primeiro solicitar a transcrição do áudio.
            </p>
            <p
              className="mt-1 text-xs italic text-neutral-400"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Nossa IA fará o trabalho pesado.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
              <Sparkles className="h-4 w-4" />
              Solicitar Transcrição
            </button>
          </section>
        </div>

        <aside className="border-l border-neutral-200 pl-8">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <h3
              className="text-2xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Escolha a IA
            </h3>
            <button aria-label="Fechar" className="text-neutral-400 hover:text-neutral-900">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              placeholder="Buscar IA..."
              className="w-full border-b border-neutral-300 bg-transparent py-2 pl-6 pr-3 text-sm placeholder:italic placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            />
          </div>
          <ul className="mt-6 max-h-[55vh] space-y-4 overflow-y-auto pr-1">
            {prompts.map((p, i) => {
              const isSelected = i === 1;
              return (
                <li key={p.name}>
                  <button
                    className={`w-full border-b border-neutral-200 pb-4 text-left ${
                      isSelected ? "bg-neutral-100" : "hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? "border-neutral-900 bg-neutral-900" : "border-neutral-400"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-lg text-neutral-900"
                            style={{ fontFamily: "var(--preview-font-instrument)" }}
                          >
                            {p.name}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                            — {p.source}
                          </span>
                        </div>
                        <p
                          className="mt-1 text-xs italic text-neutral-500"
                          style={{ fontFamily: "var(--preview-font-instrument)" }}
                        >
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <button className="mt-8 w-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
            Confirmar seleção de IA: Consulta Psicológica
          </button>
        </aside>
      </div>
    </MonocromaticoShell>
  );
}
