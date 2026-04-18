import { ArrowRight, Mic } from "lucide-react";

const routes = [
  {
    path: "/silencio/recorder",
    title: "Nova modal de gravar",
    description: "Protótipo interativo — 3 steps, quick capture",
    hero: true,
  },
  { path: "/silencio/home", title: "Home", description: "Agenda emocional do dia" },
  { path: "/silencio/recordings", title: "Gravações", description: "Feed cronológico com waveforms" },
  { path: "/silencio/recording", title: "Detalhe de gravação", description: "Two-pane com contexto persistente" },
  { path: "/silencio/insights", title: "Insights", description: "Editorial, tipografia-driven" },
];

export default function SilencioIndex() {
  return (
    <div
      className="min-h-screen bg-[#0E0D0B] text-[#ECE9E2]"
      style={{ fontFamily: "var(--silencio-sans)" }}
    >
      <main className="mx-auto max-w-2xl px-6 py-24">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#8B857A]">
          <span className="h-px w-8 bg-[#8B857A]" />
          Silêncio · visão 01
        </div>
        <h1
          className="mt-6 text-5xl leading-tight text-[#ECE9E2]"
          style={{ fontFamily: "var(--silencio-serif)" }}
        >
          Uma versão mais{" "}
          <em className="text-[#C9A961]">silenciosa</em>{" "}
          do EX Voice.
        </h1>
        <p className="mt-4 max-w-lg leading-relaxed text-[#8B857A]">
          Menos cromo, menos fricção. A gravação começa em um clique. A curadoria
          vem depois.
        </p>

        <ul className="mt-16 space-y-2">
          {routes.map((r) => (
            <li key={r.path}>
              <a
                href={r.path}
                className={`group flex items-center justify-between border-b py-5 transition ${
                  r.hero
                    ? "border-[#C9A961]/30 hover:border-[#C9A961]"
                    : "border-[#2A2824] hover:border-[#4A4740]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    {r.hero && <Mic className="h-4 w-4 text-[#C9A961]" />}
                    <span className="text-lg text-[#ECE9E2]">{r.title}</span>
                  </div>
                  <div className="mt-1 text-sm text-[#8B857A]">{r.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#4A4740] transition group-hover:translate-x-1 group-hover:text-[#C9A961]" />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 space-y-2 text-xs uppercase tracking-[0.2em] text-[#4A4740]">
          <p>Paleta: off-black warm · bronze accent · ivory</p>
          <p>Typography: Inter · Fraunces (display, italics)</p>
          <p>Princípio: gesto &gt; formulário</p>
        </div>
      </main>
    </div>
  );
}
