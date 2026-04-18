import { Copy, FileDown, Pencil } from "lucide-react";
import { overviewSections } from "../_mocks";

export function SectionInsights() {
  return (
    <div className="space-y-12">
      {overviewSections.map((section, idx) => (
        <section key={section.title} className="group">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-neutral-300">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                {section.title}
              </h2>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
              <button
                aria-label="Editar seção"
                className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Copiar"
                className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <ul className="space-y-3 pl-7">
            {section.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-neutral-700"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className="flex items-center justify-between border-t border-neutral-100 pt-6 text-xs text-neutral-500">
        <span>Gerado pela IA</span>
        <a href="#" className="text-neutral-500 transition hover:text-neutral-900">
          Personalizar insights
        </a>
      </footer>

      {/* Sticky export FAB — floats bottom-right */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-10">
        <button className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-neutral-500 to-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-900/25 transition hover:shadow-xl active:scale-[0.98]">
          <FileDown className="h-4 w-4" />
          Exportar em PDF
        </button>
      </div>
    </div>
  );
}
