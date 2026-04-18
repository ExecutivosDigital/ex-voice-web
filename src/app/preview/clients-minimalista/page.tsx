import {
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import { MinimalistaShell } from "../_components/minimalista/chrome";
import { mockClients } from "../_mocks/data";

export default function ClientsMinimalista() {
  return (
    <MinimalistaShell breadcrumb={[{ label: "Contatos" }]}>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
              Seus Contatos
            </h1>
            <p className="mt-1 text-neutral-500">
              Gerencie todos os seus Contatos
            </p>
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                placeholder="Buscar..."
              />
            </div>
            <button className="flex shrink-0 items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
              <Plus className="h-4 w-4" />
              Novo Contato
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  <button className="flex items-center gap-1.5 hover:text-neutral-900">
                    Nome do Cliente
                    <ArrowDown className="h-3 w-3 text-neutral-900" />
                  </button>
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  <button className="flex items-center gap-1.5 hover:text-neutral-900">
                    Descrição
                    <ArrowUpDown className="h-3 w-3 text-neutral-300" />
                  </button>
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Gravações
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {mockClients.map((c) => {
                const initials = c.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("");
                return (
                  <tr key={c.id} className="border-b border-neutral-100 last:border-none hover:bg-neutral-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-xs font-medium text-neutral-700">
                          {initials}
                        </span>
                        <span className="font-medium text-neutral-900">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-neutral-600">{c.description}</td>
                    <td className="px-5 py-4 text-neutral-700">{c.recordings}</td>
                    <td className="px-5 py-4">
                      <button className="text-neutral-400 hover:text-neutral-900" aria-label="Mais ações">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-3 text-sm">
            <span className="text-neutral-500">Mostrando 1–5 de 28</span>
            <div className="flex items-center gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3, 4].map((p) => (
                <button
                  key={p}
                  className={`h-8 w-8 rounded-md text-xs ${
                    p === 1
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 text-neutral-700 hover:border-neutral-900"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 hover:border-neutral-900">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mock CreateClientSheet preview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-md border border-dashed border-neutral-200 bg-white p-8 text-center">
            <p className="text-xs uppercase tracking-wider text-neutral-400">
              Estado vazio
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              Nenhum Contato encontrado. Cadastre um novo Contato para começar.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-md border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white">
              <Plus className="h-4 w-4" />
              Novo Contato
            </button>
          </div>

          <aside className="rounded-md border border-neutral-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-neutral-400" />
                <span className="text-sm font-medium text-neutral-900">
                  Novo Contato
                </span>
              </div>
              <button aria-label="Fechar" className="text-neutral-400 hover:text-neutral-900">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-6 text-xs text-neutral-500">
              Preencha os dados para cadastrar um novo contato.
            </p>
            <div className="space-y-4">
              <Field label="Nome completo" placeholder="Ex: Maria Souza" />
              <Field label="Email" placeholder="maria@exemplo.com" />
              <Field label="Telefone" placeholder="(11) 99999-9999" />
              <Field label="Descrição" placeholder="Observação interna (opcional)" multiline />
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-700 hover:border-neutral-900">
                Cancelar
              </button>
              <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
                Salvar contato
              </button>
            </div>
          </aside>
        </div>
      </div>
    </MinimalistaShell>
  );
}

function Field({ label, placeholder, multiline }: { label: string; placeholder: string; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      {multiline ? (
        <textarea
          className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          rows={3}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
          placeholder={placeholder}
        />
      )}
    </label>
  );
}
