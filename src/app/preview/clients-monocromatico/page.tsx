import {
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  X,
} from "lucide-react";
import { MonocromaticoShell } from "../_components/monocromatico/chrome";
import { mockClients } from "../_mocks/data";

export default function ClientsMonocromatico() {
  return (
    <MonocromaticoShell breadcrumb={[{ label: "Contatos" }]}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-neutral-200 pb-8 md:flex-row md:items-end">
          <div>
            <h1
              className="text-5xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Seus contatos.
            </h1>
            <p className="mt-3 text-neutral-500">
              Gerencie todos os seus contatos e acompanhe seu histórico.
            </p>
          </div>
          <div className="flex w-full items-end gap-6 md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                className="w-full border-b border-neutral-300 bg-transparent py-2 pl-6 pr-3 text-sm text-neutral-900 placeholder:italic placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                placeholder="Buscar..."
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              />
            </div>
            <button className="group flex shrink-0 items-center gap-2 border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50">
              <Plus className="h-4 w-4" />
              Novo contato
            </button>
          </div>
        </div>

        {/* Editorial list */}
        <div className="border-t border-neutral-200">
          <div className="grid grid-cols-[1fr_200px_80px_40px] gap-6 border-b border-neutral-200 py-3 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            <button className="flex items-center gap-1 text-left hover:text-neutral-900">
              Nome <ArrowDown className="h-3 w-3 text-neutral-900" />
            </button>
            <button className="flex items-center gap-1 text-left hover:text-neutral-900">
              Descrição <ArrowUpDown className="h-3 w-3" />
            </button>
            <span>Gravações</span>
            <span className="text-right">Ações</span>
          </div>
          {mockClients.map((c) => {
            const initials = c.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("");
            return (
              <div
                key={c.id}
                className="grid grid-cols-[1fr_200px_80px_40px] items-center gap-6 border-b border-neutral-200 py-6 hover:bg-neutral-100"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-200 text-sm font-medium text-neutral-700">
                    {initials}
                  </span>
                  <div>
                    <div
                      className="text-xl text-neutral-900"
                      style={{ fontFamily: "var(--preview-font-instrument)" }}
                    >
                      {c.name}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-neutral-400">
                      Cliente · EX Voice
                    </div>
                  </div>
                </div>
                <div
                  className="text-sm italic text-neutral-600"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  {c.description}
                </div>
                <div className="text-sm text-neutral-700">
                  <span
                    className="text-2xl text-neutral-900"
                    style={{ fontFamily: "var(--preview-font-instrument)" }}
                  >
                    {c.recordings}
                  </span>
                  <span className="ml-1 text-xs text-neutral-500">grav.</span>
                </div>
                <button
                  aria-label="Mais ações"
                  className="text-right text-neutral-400 hover:text-neutral-900"
                >
                  <MoreHorizontal className="ml-auto h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm">
          <span className="italic text-neutral-500" style={{ fontFamily: "var(--preview-font-instrument)" }}>
            Mostrando 1–5 de 28
          </span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900">
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                className={`h-7 w-7 ${
                  p === 1 ? "border border-neutral-900 text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {p}
              </button>
            ))}
            <button className="flex items-center gap-1 text-neutral-900 hover:text-neutral-600">
              Próxima
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CreateClientSheet editorial panel */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px]">
          <div className="border-t border-dashed border-neutral-200 pt-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Estado vazio
            </p>
            <p
              className="mt-3 text-lg text-neutral-700"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Nenhum contato encontrado.
            </p>
            <p className="text-sm text-neutral-500">
              Cadastre um novo contato para começar.
            </p>
            <button className="mt-5 inline-flex items-center gap-2 border border-neutral-900 px-5 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50">
              <Plus className="h-4 w-4" />
              Novo contato
            </button>
          </div>

          <aside className="border-l border-neutral-200 pl-8">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-4">
              <h3
                className="text-2xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Novo contato
              </h3>
              <button aria-label="Fechar" className="text-neutral-400 hover:text-neutral-900">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p
              className="mb-6 text-sm italic text-neutral-500"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Preencha os dados para cadastrar.
            </p>
            <div className="space-y-6">
              <Field label="Nome completo" placeholder="Ex: Maria Souza" />
              <Field label="Email" placeholder="maria@exemplo.com" />
              <Field label="Telefone" placeholder="(11) 99999-9999" />
              <Field label="Descrição" placeholder="Observação interna" multiline />
            </div>
            <div className="mt-8 flex items-center justify-end gap-6">
              <button className="text-sm text-neutral-500 hover:text-neutral-900">
                Cancelar
              </button>
              <button className="border border-neutral-900 px-5 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50">
                Salvar contato
              </button>
            </div>
          </aside>
        </div>
      </div>
    </MonocromaticoShell>
  );
}

function Field({ label, placeholder, multiline }: { label: string; placeholder: string; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </span>
      {multiline ? (
        <textarea
          className="w-full border-b border-neutral-300 bg-transparent px-0 py-2 text-sm placeholder:italic placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          rows={3}
          placeholder={placeholder}
          style={{ fontFamily: "var(--preview-font-instrument)" }}
        />
      ) : (
        <input
          className="w-full border-b border-neutral-300 bg-transparent px-0 py-2 text-sm placeholder:italic placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          placeholder={placeholder}
          style={{ fontFamily: "var(--preview-font-instrument)" }}
        />
      )}
    </label>
  );
}
