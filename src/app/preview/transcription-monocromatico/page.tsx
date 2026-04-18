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
import { MonocromaticoShell } from "../_components/monocromatico/chrome";
import { mockRecording, mockTranscript } from "../_mocks/data";

export default function TranscriptionMonocromatico() {
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
          {/* Header */}
          <div>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                  Diálogo
                </span>
                <h1
                  className="mt-3 text-5xl text-neutral-900"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  Transcrição.
                </h1>
                <p
                  className="mt-2 italic text-neutral-500"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  Visualize a transcrição completa da gravação.
                </p>
              </div>
              <button className="flex items-center gap-2 border border-neutral-900 px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50">
                <Users className="h-4 w-4" />
                Organizar Locutores
              </button>
            </div>
            <nav className="mt-10 flex items-center gap-10 border-b border-neutral-200 text-sm">
              <a href="/preview/recording-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Geral</a>
              <a className="border-b border-neutral-900 pb-3 text-neutral-900">Transcrição</a>
              <a href="/preview/chat-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Chat</a>
              <a href="/preview/overview-monocromatico" className="pb-3 text-neutral-500 hover:text-neutral-900">Insights</a>
            </nav>
          </div>

          {/* Transcript editorial */}
          <div>
            <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
              <div className="flex items-center gap-8">
                <span>Profissional (direita)</span>
                <span>Contato/Outro (esquerda)</span>
              </div>
              <span>{mockRecording.duration}</span>
            </div>
            <div className="space-y-8">
              {mockTranscript.map((seg, i) => {
                const right = seg.role === "profissional";
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-4 ${right ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm ${
                        right
                          ? "bg-neutral-900 text-neutral-50"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {right ? <Briefcase className="h-4 w-4" /> : seg.speaker.slice(0, 1)}
                    </span>
                    <div className={`max-w-[75%] ${right ? "text-right" : ""}`}>
                      <div className="mb-1 flex items-center gap-2 text-xs text-neutral-500">
                        <span
                          className="text-neutral-900"
                          style={{ fontFamily: "var(--preview-font-instrument)" }}
                        >
                          {seg.speaker}
                        </span>
                        <span
                          className="italic text-neutral-400"
                          style={{ fontFamily: "var(--preview-font-instrument)" }}
                        >
                          · {seg.timestamp}
                        </span>
                      </div>
                      <p
                        className="text-lg leading-relaxed text-neutral-900"
                        style={{ fontFamily: "var(--preview-font-instrument)" }}
                      >
                        {right ? <em>&ldquo;{seg.text}&rdquo;</em> : `“${seg.text}”`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Empty states */}
          <div className="grid grid-cols-1 gap-12 border-t border-neutral-200 pt-12 md:grid-cols-2">
            <section className="text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Estado — Processando
              </span>
              <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 bg-white">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-700" />
              </div>
              <h3
                className="mt-4 text-2xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                A mágica está acontecendo.
              </h3>
              <p
                className="mt-2 text-xs italic text-neutral-500"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Sua transcrição foi solicitada e está sendo gerada.
              </p>
            </section>

            <section className="text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                Estado — Vazio
              </span>
              <div className="mx-auto mt-6 flex h-14 w-20 items-center justify-center border border-neutral-300 bg-white">
                <svg viewBox="0 0 80 32" className="h-5 w-14">
                  {[4, 8, 14, 20, 12, 6, 16, 24, 18, 10].map((h, i) => (
                    <rect key={i} x={i * 8} y={(32 - h) / 2} width="4" height={h} rx="1" fill="#737373" />
                  ))}
                </svg>
              </div>
              <h3
                className="mt-4 text-2xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Transcrição não disponível.
              </h3>
              <button className="mt-5 inline-flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm text-neutral-50 hover:bg-neutral-800">
                <Sparkles className="h-4 w-4" />
                Solicitar Transcrição
              </button>
            </section>
          </div>

          <div className="sticky bottom-4 flex justify-end">
            <button
              aria-label="Voltar ao topo"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white hover:bg-neutral-100"
            >
              <ArrowUp className="h-4 w-4 text-neutral-700" />
            </button>
          </div>
        </div>

        {/* Organizar locutores */}
        <aside className="border-l border-neutral-200 pl-8">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <h3
              className="text-2xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Organizar locutores
            </h3>
            <button aria-label="Fechar" className="text-neutral-400 hover:text-neutral-900">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p
            className="mt-2 text-sm italic text-neutral-500"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Arraste para reordenar ou marque o profissional.
          </p>
          <ul className="mt-6 space-y-4">
            {[
              { name: "Dr. Ricardo", role: "Profissional", selected: true },
              { name: "Maria Souza", role: "Contato/Outro", selected: false },
              { name: "Locutor 3", role: "Contato/Outro", selected: false },
            ].map((s) => (
              <li key={s.name} className="group flex items-center gap-4 border-b border-neutral-200 pb-4">
                <GripVertical className="h-4 w-4 cursor-grab text-neutral-400" />
                <button
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm ${
                    s.selected
                      ? "bg-neutral-900 text-neutral-50"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {s.selected ? <Briefcase className="h-4 w-4" /> : s.name.slice(0, 1)}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-lg text-neutral-900"
                      style={{ fontFamily: "var(--preview-font-instrument)" }}
                    >
                      {s.name}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100" aria-label="Editar">
                      <Pencil className="h-3 w-3 text-neutral-400" />
                    </button>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500">
                    {s.role}
                  </div>
                </div>
                {s.selected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900">
                    <Check className="h-3 w-3 text-neutral-50" />
                  </span>
                )}
              </li>
            ))}
          </ul>
          <button className="mt-8 w-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
            Salvar
          </button>
        </aside>
      </div>
    </MonocromaticoShell>
  );
}
