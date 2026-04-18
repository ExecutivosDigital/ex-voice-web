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
import { MonocromaticoShell } from "../_components/monocromatico/chrome";
import { mockOverviewSections, mockRecording } from "../_mocks/data";

export default function OverviewMonocromatico() {
  return (
    <MonocromaticoShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
    >
      <div className="flex flex-col gap-16">
        <div>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Análise Estruturada
              </span>
              <h1
                className="mt-3 text-5xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Insights.
              </h1>
              <p
                className="mt-2 italic text-neutral-500"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Resumo estruturado gerado pela IA.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-2 border-b border-neutral-900 pb-1 text-sm text-neutral-900">
                <Sparkles className="h-4 w-4" />
                Personalizar Insights
              </button>
              <button className="flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-3 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
                <FileDown className="h-4 w-4" />
                Exportar em PDF
              </button>
            </div>
          </div>
          <nav className="mt-10 flex items-center gap-10 border-b border-neutral-200 text-sm">
            <a href="/preview/recording-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Geral</a>
            <a href="/preview/transcription-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Transcrição</a>
            <a href="/preview/chat-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Chat</a>
            <a className="border-b border-neutral-900 pb-3 text-neutral-900">Insights</a>
          </nav>
        </div>

        {/* Sections */}
        <section className="space-y-16">
          {mockOverviewSections.map((s, idx) => (
            <article key={s.title}>
              <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                    Seção {idx + 1}
                  </span>
                  <h2
                    className="mt-2 text-3xl text-neutral-900"
                    style={{ fontFamily: "var(--preview-font-instrument)" }}
                  >
                    {s.title}.
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    aria-label="Editar"
                    className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900"
                  >
                    <Pencil className="h-3 w-3" />
                    Editar
                  </button>
                  <button
                    aria-label="Copiar"
                    className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900"
                  >
                    <Copy className="h-3 w-3" />
                    Copiar
                  </button>
                </div>
              </div>
              <ul className="mt-6 space-y-5">
                {s.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 border-b border-neutral-100 pb-4 last:border-none">
                    <span
                      className="mt-1 text-xs uppercase tracking-widest text-neutral-500"
                      style={{ fontFamily: "var(--preview-font-instrument)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="flex-1 text-lg text-neutral-800"
                      style={{ fontFamily: "var(--preview-font-instrument)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* States */}
        <section className="border-y border-neutral-200 py-12 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-700" />
          <p
            className="mt-4 text-lg italic text-neutral-700"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Carregando gravação...
          </p>
        </section>

        <section className="border-t border-dashed border-neutral-300 pt-12 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Estado — Empty
          </span>
          <h3
            className="mt-3 text-3xl text-neutral-900"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Resumo estruturado não disponível.
          </h3>
          <p className="mt-2 text-sm italic text-neutral-500" style={{ fontFamily: "var(--preview-font-instrument)" }}>
            Você pode visualizar o resumo em texto na aba{" "}
            <a href="/preview/recording-monocromatico" className="border-b border-neutral-900 pb-0.5 text-neutral-900">
              Geral
            </a>.
          </p>
        </section>

        {/* Footer export */}
        <div className="flex items-center justify-end border-t border-neutral-200 pt-6">
          <button className="flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-3 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
            <FileDown className="h-4 w-4" />
            Exportar em PDF
          </button>
        </div>

        {/* PersonalizationModal editorial */}
        <section className="border-t border-neutral-200 pt-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[300px_1fr]">
            <div className="relative flex aspect-square items-center justify-center border border-neutral-300 bg-neutral-100">
              <Sparkles className="h-16 w-16 text-neutral-400" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="h-0.5 w-8 bg-neutral-900" />
                <span className="h-0.5 w-4 bg-neutral-400" />
                <span className="h-0.5 w-4 bg-neutral-400" />
              </div>
            </div>
            <div className="relative">
              <button
                aria-label="Fechar"
                className="absolute right-0 top-0 text-neutral-400 hover:text-neutral-900"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Personalização · 1 de 3
              </span>
              <h3
                className="mt-3 text-4xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Personalize seus <em>insights</em>.
              </h3>
              <p
                className="mt-4 max-w-lg text-lg italic text-neutral-600"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Diga-nos o que é importante para você e nossa IA ajusta a estrutura,
                o tom e a profundidade dos insights.
              </p>
              <ul className="mt-6 space-y-3 text-base" style={{ fontFamily: "var(--preview-font-instrument)" }}>
                <li className="border-b border-neutral-200 pb-2">— Prompts personalizados por tipo de reunião</li>
                <li className="border-b border-neutral-200 pb-2">— Destacar informações sensíveis do paciente</li>
                <li className="border-b border-neutral-200 pb-2">— Exportar em formatos customizados</li>
              </ul>
              <div className="mt-10 flex items-center justify-between">
                <button className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900">
                  <ChevronLeft className="h-4 w-4" />
                  <span style={{ fontFamily: "var(--preview-font-instrument)" }} className="italic">
                    Voltar
                  </span>
                </button>
                <div className="flex items-center gap-6">
                  <button className="text-sm text-neutral-500 hover:text-neutral-900">
                    Fechar
                  </button>
                  <button className="flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
                    Continuar
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Last step — WhatsApp CTA */}
        <section className="border-y border-neutral-200 py-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Contato · 3 de 3
          </span>
          <h3
            className="mt-4 text-4xl text-neutral-900"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Vamos conversar?
          </h3>
          <p
            className="mx-auto mt-3 max-w-lg text-lg italic text-neutral-600"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Nosso time pode montar prompts e templates específicos para sua clínica.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
            <MessageCircle className="h-4 w-4" />
            Fale Conosco
          </button>
        </section>
      </div>
    </MonocromaticoShell>
  );
}
