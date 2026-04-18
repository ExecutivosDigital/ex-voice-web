import {
  ChevronLeft,
  ChevronRight,
  Copy,
  FileDown,
  Loader2,
  MessageCircle,
  Pencil,
  Sparkles,
  X,
} from "lucide-react";
import { MinimalistaShell } from "../_components/minimalista/chrome";
import { mockOverviewSections, mockRecording } from "../_mocks/data";

export default function OverviewMinimalista() {
  return (
    <MinimalistaShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
    >
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
                Insights
              </h1>
              <p className="mt-1 text-neutral-500">
                Resumo estruturado gerado pela IA
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 hover:border-neutral-900">
                <Sparkles className="h-4 w-4" />
                Personalizar Insights
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800">
                <FileDown className="h-4 w-4" />
                Exportar em PDF
              </button>
            </div>
          </div>
          <nav className="mt-8 flex items-center gap-8 border-b border-neutral-200 text-sm">
            <a href="/preview/recording-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Geral</a>
            <a href="/preview/transcription-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Transcrição</a>
            <a href="/preview/chat-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Chat</a>
            <a className="border-b border-neutral-900 pb-2 font-medium text-neutral-900">Insights</a>
          </nav>
        </div>

        {/* Dynamic sections */}
        <section className="space-y-10">
          {mockOverviewSections.map((s, idx) => (
            <article key={s.title}>
              <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-2">
                <h2 className="text-base font-medium text-neutral-900">{s.title}</h2>
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Editar seção"
                    className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="Copiar seção"
                    className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <ul className="space-y-3">
                {s.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
              {idx === 1 && (
                <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-amber-700">
                    Atenção
                  </p>
                  <p className="mt-1 text-neutral-800">
                    Este card possui edição inline. Você pode editar diretamente clicando
                    no botão de lápis.
                  </p>
                </div>
              )}
            </article>
          ))}
        </section>

        {/* Loading state */}
        <section className="rounded-md border border-dashed border-neutral-200 bg-white p-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-500" />
          <p className="mt-3 text-sm text-neutral-500">Carregando gravação...</p>
        </section>

        {/* Empty state */}
        <section className="rounded-md border border-neutral-200 bg-white p-8 text-center">
          <h3 className="text-base font-medium text-neutral-900">
            Resumo Estruturado não disponível
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Esta gravação ainda não possui um resumo estruturado gerado pela IA.
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            Você pode visualizar o resumo em texto na aba{" "}
            <a href="/preview/recording-minimalista" className="font-medium text-neutral-900 underline underline-offset-4">
              Geral
            </a>
            .
          </p>
        </section>

        {/* Footer with second Export button */}
        <div className="flex items-center justify-end border-t border-neutral-200 pt-6">
          <button className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
            <FileDown className="h-4 w-4" />
            Exportar em PDF
          </button>
        </div>

        {/* PersonalizationModal preview */}
        <section className="rounded-md border border-neutral-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
            <div className="relative h-48 bg-gradient-to-br from-neutral-800 to-neutral-950 md:h-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-white/40" />
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              </div>
            </div>
            <div className="relative p-8">
              <button
                aria-label="Fechar"
                className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-900"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="text-xs uppercase tracking-widest text-neutral-500">
                Personalização
              </span>
              <h3 className="mt-3 text-2xl font-medium text-neutral-900">
                Personalize seus insights
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Diga-nos o que é importante para você e nossa IA ajusta a estrutura,
                o tom e a profundidade dos insights gerados.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-900" />
                  Prompts personalizados por tipo de reunião
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-900" />
                  Destacar informações sensíveis do paciente
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-900" />
                  Exportar em formatos customizados
                </li>
              </ul>
              <div className="mt-8 flex items-center justify-between">
                <button className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900">
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </button>
                <div className="flex items-center gap-2">
                  <button className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 hover:border-neutral-900">
                    Fechar
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-800">
                    Continuar
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personalization Final step */}
        <section className="rounded-md border border-neutral-200 bg-neutral-50 p-8 text-center">
          <span className="text-xs uppercase tracking-widest text-neutral-500">
            Contato · Passo 3/3
          </span>
          <h3 className="mt-3 text-2xl font-medium text-neutral-900">
            Vamos conversar?
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            Nosso time pode montar prompts e templates específicos para sua clínica
            ou empresa.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
            <MessageCircle className="h-4 w-4" />
            Fale Conosco
          </button>
        </section>
      </div>
    </MinimalistaShell>
  );
}
