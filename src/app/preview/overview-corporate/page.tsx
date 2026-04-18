import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileDown,
  Loader2,
  MessageCircle,
  Pencil,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { CorporateShell } from "../_components/corporate/chrome";
import { mockOverviewSections, mockRecording } from "../_mocks/data";

export default function OverviewCorporate() {
  return (
    <CorporateShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
      pageTitle="Insights"
      activeHref="/preview/recordings-corporate"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
        {/* Header card */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                <Sparkles className="h-3 w-3" />
                Insights gerados por IA
              </span>
              <h1 className="mt-2 text-xl font-semibold text-slate-900">Insights</h1>
              <p className="text-xs text-slate-500">
                Resumo estruturado · {mockOverviewSections.length} seções · Atualizado há 2h
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100">
                <Sparkles className="h-3.5 w-3.5" />
                Personalizar Insights
              </button>
              <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                <Share2 className="h-3.5 w-3.5" />
                Compartilhar
              </button>
              <button className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                <FileDown className="h-3.5 w-3.5" />
                Exportar em PDF
              </button>
            </div>
          </div>
          <nav className="mt-5 flex items-center gap-1 border-b border-slate-200 text-xs">
            <a href="/preview/recording-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Geral</a>
            <a href="/preview/transcription-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Transcrição</a>
            <a href="/preview/chat-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Chat</a>
            <a className="-mb-px border-b-2 border-blue-600 px-3 py-2 font-semibold text-blue-700">Insights</a>
          </nav>
        </div>

        {/* Dynamic renderer sections */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mockOverviewSections.map((s, idx) => {
            const palette = ["blue", "amber", "emerald", "indigo"][idx] as
              | "blue"
              | "amber"
              | "emerald"
              | "indigo";
            const toneMap: Record<string, string> = {
              blue: "bg-blue-50 text-blue-700",
              amber: "bg-amber-50 text-amber-700",
              emerald: "bg-emerald-50 text-emerald-700",
              indigo: "bg-indigo-50 text-indigo-700",
            };
            return (
              <article
                key={s.title}
                className="group flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between border-b border-slate-200 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-bold ${toneMap[palette]}`}
                    >
                      {idx + 1}
                    </span>
                    <h2 className="text-sm font-semibold text-slate-900">{s.title}</h2>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      aria-label="Editar"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label="Copiar"
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <ul className="flex-1 space-y-2 px-5 py-4 text-sm">
                  {s.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${toneMap[palette]}`}
                      >
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Inline edit sample */}
        <section className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/30 p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              <Pencil className="h-3 w-3" />
              Editando
            </span>
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                Cancelar
              </button>
              <button className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700">
                Salvar alterações
              </button>
            </div>
          </div>
          <textarea
            defaultValue="Paciente relata ansiedade recorrente associada a mudanças no ambiente de trabalho, com episódios de insônia nas últimas 3 semanas."
            className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={3}
          />
        </section>

        {/* Loading + Empty */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
            <p className="mt-2 text-xs text-slate-600">Carregando gravação...</p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Resumo Estruturado não disponível
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Esta gravação ainda não possui um resumo estruturado gerado pela IA.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Você pode visualizar o resumo em texto na aba{" "}
              <a href="/preview/recording-corporate" className="font-semibold text-blue-700 underline">
                Geral
              </a>
              .
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
          <span>
            Resumo gerado em 18 abr 2026, 10:42 · Versão 1.2
          </span>
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
            <FileDown className="h-3.5 w-3.5" />
            Exportar em PDF
          </button>
        </div>

        {/* PersonalizationModal preview — 3 steps */}
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Personalização</h3>
              <div className="ml-4 flex items-center gap-1 text-[11px] text-blue-100">
                <span className="rounded-full bg-white px-2 py-0.5 font-bold text-blue-700">1</span>
                <span>PERSONALIZAÇÃO</span>
                <span className="opacity-40">→</span>
                <span className="rounded-full border border-white/30 px-2 py-0.5 font-bold">2</span>
                <span className="opacity-60">RECURSOS</span>
                <span className="opacity-40">→</span>
                <span className="rounded-full border border-white/30 px-2 py-0.5 font-bold">3</span>
                <span className="opacity-60">CONTATO</span>
              </div>
            </div>
            <button aria-label="Fechar" className="text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white md:aspect-auto">
              <Sparkles className="h-14 w-14 opacity-60" />
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-slate-900">
                Personalize seus insights
              </h4>
              <p className="mt-2 text-sm text-slate-600">
                Diga-nos o que é importante para você e nossa IA ajusta estrutura,
                tom e profundidade dos insights gerados.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Prompts personalizados por tipo de reunião
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Destacar informações sensíveis do paciente
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  Exportar em formatos customizados
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
            <button className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <ChevronLeft className="h-3.5 w-3.5" />
              Voltar
            </button>
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                Fechar
              </button>
              <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                Continuar
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Final step */}
        <section className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-8 text-center shadow-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            Contato · Passo 3/3
          </span>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Vamos conversar?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Nosso time pode montar prompts e templates específicos para sua clínica
            ou empresa.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            <MessageCircle className="h-4 w-4" />
            Fale Conosco
          </button>
        </section>
      </div>
    </CorporateShell>
  );
}
