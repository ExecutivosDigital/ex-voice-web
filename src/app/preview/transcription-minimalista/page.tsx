import {
  ArrowUp,
  Briefcase,
  Check,
  GripVertical,
  Loader2,
  Pencil,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { MinimalistaShell } from "../_components/minimalista/chrome";
import { mockRecording, mockTranscript } from "../_mocks/data";

export default function TranscriptionMinimalista() {
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
          {/* Header */}
          <div>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
                  Transcrição
                </h1>
                <p className="mt-1 text-neutral-500">
                  Visualize a transcrição completa da gravação.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
                <Users className="h-4 w-4" />
                Organizar Locutores
              </button>
            </div>
            <nav className="mt-8 flex items-center gap-8 border-b border-neutral-200 text-sm">
              <a href="/preview/recording-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Geral</a>
              <a className="border-b border-neutral-900 pb-2 font-medium text-neutral-900">Transcrição</a>
              <a href="/preview/chat-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Chat</a>
              <a href="/preview/overview-minimalista" className="pb-2 text-neutral-500 hover:text-neutral-900">Insights</a>
            </nav>
          </div>

          {/* Transcript bubbles */}
          <div className="rounded-md border border-neutral-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-neutral-900" />
                  Profissional (direita)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-neutral-300 bg-white" />
                  Contato/Outro (esquerda)
                </span>
              </div>
              <span>{mockRecording.duration}</span>
            </div>
            <div className="space-y-4">
              {mockTranscript.map((seg, i) => {
                const right = seg.role === "profissional";
                return (
                  <div
                    key={i}
                    className={`flex items-end gap-3 ${right ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                        right
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-200 bg-white text-neutral-700"
                      }`}
                    >
                      {right ? <Briefcase className="h-3.5 w-3.5" /> : seg.speaker.slice(0, 1)}
                    </span>
                    <div className={`max-w-[75%] ${right ? "text-right" : ""}`}>
                      <div className="mb-1 flex items-center gap-2 text-xs text-neutral-500">
                        <span className="font-medium text-neutral-700">{seg.speaker}</span>
                        <span className="text-neutral-400">· {seg.timestamp}</span>
                      </div>
                      <div
                        className={`rounded-md px-4 py-3 text-sm ${
                          right
                            ? "bg-neutral-900 text-white"
                            : "border border-neutral-200 bg-neutral-50 text-neutral-800"
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

          {/* Empty states side-by-side */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-md border border-dashed border-neutral-200 bg-white p-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-0.5 text-xs font-medium text-amber-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                Processando Áudio
              </span>
              <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-700" />
              </div>
              <h3 className="mt-3 text-base font-medium text-neutral-900">
                A Mágica está acontecendo
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Sua transcrição foi solicitada e está sendo gerada.
              </p>
            </section>

            <section className="rounded-md border border-neutral-200 bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-28 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
                <svg viewBox="0 0 80 32" className="h-6 w-16">
                  {[4, 8, 14, 20, 12, 6, 16, 24, 18, 10].map((h, i) => (
                    <rect key={i} x={i * 8} y={(32 - h) / 2} width="4" height={h} rx="1" fill="#737373" />
                  ))}
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900">
                Transcrição não disponível
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Esta gravação ainda não foi transcrita.
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
                <Sparkles className="h-4 w-4" />
                Solicitar Transcrição
              </button>
            </section>
          </div>

          {/* Scroll to top hint */}
          <div className="sticky bottom-4 flex justify-end">
            <button
              aria-label="Voltar ao topo"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50"
            >
              <ArrowUp className="h-4 w-4 text-neutral-700" />
            </button>
          </div>
        </div>

        {/* Organizar Locutores panel */}
        <aside className="rounded-md border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-900">Organizar Locutores</h3>
              <p className="text-xs text-neutral-500">Arraste para reordenar</p>
            </div>
            <button aria-label="Fechar" className="text-neutral-400 hover:text-neutral-900">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="max-h-[50vh] space-y-2 overflow-y-auto p-4">
            {[
              { name: "Dr. Ricardo", role: "Profissional", selected: true },
              { name: "Maria Souza", role: "Contato/Outro", selected: false },
              { name: "Locutor 3", role: "Contato/Outro", selected: false },
            ].map((s, i) => (
              <li
                key={s.name}
                className="group flex items-center gap-3 rounded-md border border-neutral-200 p-3"
              >
                <button className="cursor-grab text-neutral-400 hover:text-neutral-900" aria-label="Arrastar">
                  <GripVertical className="h-4 w-4" />
                </button>
                <button
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                    s.selected
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 bg-white text-neutral-700"
                  }`}
                  aria-label="Marcar como profissional"
                >
                  {s.selected ? <Briefcase className="h-3.5 w-3.5" /> : s.name.slice(0, 1)}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-neutral-900">{s.name}</span>
                    <button className="opacity-0 group-hover:opacity-100" aria-label="Editar nome">
                      <Pencil className="h-3 w-3 text-neutral-400" />
                    </button>
                  </div>
                  <div className="text-xs text-neutral-500">{s.role}</div>
                </div>
                {s.selected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="border-t border-neutral-200 p-4">
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
              Salvar
            </button>
          </div>
        </aside>
      </div>
    </MinimalistaShell>
  );
}
