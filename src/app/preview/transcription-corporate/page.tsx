import {
  ArrowUp,
  Briefcase,
  Check,
  Copy,
  Download,
  GripVertical,
  Loader2,
  Pencil,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { CorporateShell } from "../_components/corporate/chrome";
import { mockRecording, mockTranscript } from "../_mocks/data";

export default function TranscriptionCorporate() {
  return (
    <CorporateShell
      breadcrumb={[
        { label: "Contatos" },
        { label: "Maria Souza" },
        { label: mockRecording.title },
      ]}
      pageTitle="Transcrição"
      activeHref="/preview/recordings-corporate"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {/* Header card */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  <Check className="h-3 w-3" />
                  Transcrição pronta
                </span>
                <h1 className="mt-2 text-xl font-semibold text-slate-900">Transcrição</h1>
                <p className="text-xs text-slate-500">
                  Visualize a transcrição completa · {mockRecording.duration} · 6 segmentos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Copy className="h-3.5 w-3.5" />
                  Copiar tudo
                </button>
                <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Download className="h-3.5 w-3.5" />
                  Exportar
                </button>
                <button className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                  <Users className="h-3.5 w-3.5" />
                  Organizar Locutores
                </button>
              </div>
            </div>
            <nav className="mt-5 flex items-center gap-1 border-b border-slate-200 text-xs">
              <a href="/preview/recording-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Geral</a>
              <a className="-mb-px border-b-2 border-blue-600 px-3 py-2 font-semibold text-blue-700">Transcrição</a>
              <a href="/preview/chat-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Chat</a>
              <a href="/preview/overview-corporate" className="px-3 py-2 text-slate-600 hover:text-slate-900">Insights</a>
            </nav>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 md:flex-row md:items-center">
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Profissional (direita)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                Contato/Outro (esquerda)
              </span>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Buscar na transcrição..."
                className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Transcript */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {mockTranscript.map((seg, i) => {
                const right = seg.role === "profissional";
                return (
                  <div
                    key={i}
                    className={`flex items-end gap-3 ${right ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        right
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {right ? <Briefcase className="h-3.5 w-3.5" /> : seg.speaker.slice(0, 1)}
                    </span>
                    <div className={`max-w-[75%] ${right ? "text-right" : ""}`}>
                      <div className="mb-1 flex items-center gap-2 text-[11px]">
                        <span className="font-semibold text-slate-900">{seg.speaker}</span>
                        <span className="text-slate-400">{seg.timestamp}</span>
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm ${
                          right
                            ? "rounded-br-sm bg-blue-600 text-white"
                            : "rounded-bl-sm border border-slate-200 bg-slate-50 text-slate-800"
                        }`}
                      >
                        {seg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* States */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <section className="rounded-lg border border-amber-200 bg-amber-50/30 p-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                Processando
              </span>
              <div className="mx-auto mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                A Mágica está acontecendo
              </h3>
              <p className="mt-1 text-[11px] text-slate-600">
                Sua transcrição foi solicitada e está sendo gerada.
              </p>
            </section>

            <section className="rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 p-6 text-center">
              <div className="mx-auto flex h-14 w-20 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm">
                <svg viewBox="0 0 80 32" className="h-5 w-14">
                  {[4, 8, 14, 20, 12, 6, 16, 24, 18, 10].map((h, i) => (
                    <rect key={i} x={i * 8} y={(32 - h) / 2} width="4" height={h} rx="1" fill="#2563eb" />
                  ))}
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                Transcrição não disponível
              </h3>
              <p className="mt-1 text-[11px] text-slate-600">
                Esta gravação ainda não foi transcrita.
              </p>
              <button className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                Solicitar Transcrição
              </button>
            </section>
          </div>

          <div className="sticky bottom-4 flex justify-end">
            <button
              aria-label="Voltar ao topo"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Organizar Locutores side panel */}
        <aside className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white">
            <div>
              <h3 className="text-sm font-semibold">Organizar Locutores</h3>
              <p className="text-[11px] text-blue-100">Arraste para reordenar</p>
            </div>
            <button aria-label="Fechar" className="rounded text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="max-h-[55vh] space-y-2 overflow-y-auto p-4">
            {[
              { name: "Dr. Ricardo", role: "Profissional", selected: true },
              { name: "Maria Souza", role: "Contato/Outro", selected: false },
              { name: "Locutor 3", role: "Contato/Outro", selected: false },
            ].map((s) => (
              <li
                key={s.name}
                className={`group flex items-center gap-2.5 rounded-md border p-3 ${
                  s.selected ? "border-blue-500 bg-blue-50/50" : "border-slate-200"
                }`}
              >
                <button className="cursor-grab text-slate-400 hover:text-slate-700" aria-label="Arrastar">
                  <GripVertical className="h-4 w-4" />
                </button>
                <button
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                    s.selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {s.selected ? <Briefcase className="h-3.5 w-3.5" /> : s.name.slice(0, 1)}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900">{s.name}</span>
                    <button className="opacity-0 group-hover:opacity-100" aria-label="Editar nome">
                      <Pencil className="h-3 w-3 text-slate-400" />
                    </button>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    {s.role}
                  </div>
                </div>
                {s.selected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-200 bg-slate-50 p-3">
            <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
              Salvar
            </button>
          </div>
        </aside>
      </div>
    </CorporateShell>
  );
}
