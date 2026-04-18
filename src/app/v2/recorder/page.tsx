"use client";

import { ArrowRight, Mic } from "lucide-react";
import { useState } from "react";
import { Shell } from "../_components/shell";
import { RecorderModal } from "../_components/recorder-modal";

export default function RecorderPreviewPage() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Shell
        breadcrumbs={[
          { label: "Início", href: "/v2/home" },
          { label: "Nova Gravação" },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Nova Gravação
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Clique no botão abaixo para abrir a modal nova. Ou experimente abrir
              pelo sidebar.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Protótipo interativo da nova modal
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Abra, grave um áudio fictício, revise e salve. Tudo em mock —
                  nenhuma API é chamada.
                </p>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
              >
                <Mic className="h-4 w-4" />
                Abrir modal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Compare
              title="Antes (modal atual)"
              items={[
                "Modal fullscreen 1024px — ocupa tela inteira",
                "50% da tela é carrossel de marketing",
                "Nome + Descrição + Tipo + Contato OBRIGATÓRIOS antes de gravar",
                "Dropdown de contato requer scroll/busca",
                "3 cliques pra iniciar gravação online",
                "Textarea de descrição gigante sugere obrigatório",
              ]}
              tone="before"
            />
            <Compare
              title="Agora (nova modal)"
              items={[
                "Modal 580px centrada, leve e focada",
                "Sem carrossel — espaço é do usuário",
                "1 clique no botão grande e começa a gravar",
                "Últimos contatos em destaque com avatar",
                "Tipo de consulta = toggle sutil (presencial/online)",
                "Detalhes colapsados por padrão — preenche depois se quiser",
              ]}
              tone="after"
            />
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-900">
              Fluxo da nova modal — 4 passos
            </h3>
            <ol className="mt-4 space-y-3 text-sm">
              {[
                { n: "01", title: "Configurar", desc: "Escolha Consulta ou Pessoal, selecione contato dos recentes ou busque. Tipo e detalhes opcionais. Clique em Iniciar." },
                { n: "02", title: "Gravar", desc: "Timer grande, waveform ao vivo, botão Pausa/Parar/Cancelar claros. Feedback: mic ativo, salvamento automático." },
                { n: "03", title: "Revisar", desc: "Play + waveform da gravação. Título sugerido automaticamente. Observações opcional. Salvar ou Descartar." },
                { n: "04", title: "Pronto", desc: "Confirmação calma. Transcrição roda em segundo plano. Você recebe notificação." },
              ].map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-mono text-xs font-semibold text-neutral-600">
                    {s.n}
                  </span>
                  <div>
                    <div className="font-semibold text-neutral-900">{s.title}</div>
                    <div className="text-neutral-600">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Próximo passo
              </div>
              <div className="mt-1 text-sm text-neutral-700">
                Se a modal estiver boa, sigo pra <b>Home</b>, <b>Gravações</b>,{" "}
                <b>Detalhe</b> e <b>Insights</b> na mesma linguagem.
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-neutral-400" />
          </div>
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Compare({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "before" | "after";
}) {
  const isAfter = tone === "after";
  return (
    <div
      className={`rounded-2xl border p-5 ${
        isAfter ? "border-emerald-200 bg-emerald-50/30" : "border-rose-200 bg-rose-50/30"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wider ${
          isAfter ? "text-emerald-700" : "text-rose-700"
        }`}
      >
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-xs">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span
              className={`mt-1 h-1 w-1 shrink-0 rounded-full ${
                isAfter ? "bg-emerald-600" : "bg-rose-600"
              }`}
            />
            <span className="text-neutral-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
