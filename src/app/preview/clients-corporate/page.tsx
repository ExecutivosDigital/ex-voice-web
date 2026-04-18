import {
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Mic,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  X,
} from "lucide-react";
import { CorporateShell } from "../_components/corporate/chrome";
import { mockClients } from "../_mocks/data";

export default function ClientsCorporate() {
  return (
    <CorporateShell
      breadcrumb={[{ label: "Contatos" }]}
      pageTitle="Contatos"
      activeHref="/preview/clients-corporate"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Seus Contatos
            </h1>
            <p className="text-sm text-slate-500">
              Gerencie todos os seus Contatos · 28 registros
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Download className="h-3.5 w-3.5" />
              Exportar
            </button>
            <button className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
              <Plus className="h-3.5 w-3.5" />
              Novo Contato
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
              <Filter className="h-3.5 w-3.5" />
              Filtros
            </span>
            {["Todos", "Ativos", "Novos este mês", "Com gravação pendente"].map((f, i) => (
              <button
                key={f}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium ${
                  i === 0
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Buscar por nome, email, descrição..."
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="w-8 px-3 py-2.5">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  <button className="flex items-center gap-1 hover:text-slate-900">
                    Nome do Cliente
                    <ArrowDown className="h-3 w-3 text-blue-600" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  <button className="flex items-center gap-1 hover:text-slate-900">
                    Descrição
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  Gravações
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  Última atividade
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockClients.map((c, i) => {
                const initials = c.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("");
                return (
                  <tr key={c.id} className={`${i % 2 === 1 ? "bg-slate-50/40" : ""} hover:bg-blue-50/30`}>
                    <td className="px-3 py-2.5">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                          {initials}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-slate-900">
                            {c.name}
                            {i === 0 && (
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {c.id.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs truncate px-3 py-2.5 text-slate-600">
                      {c.description}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        {c.recordings}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500">18 abr 2026</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Gravar">
                          <Mic className="h-3.5 w-3.5" />
                        </button>
                        <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Mais ações">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex flex-col items-start justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs md:flex-row md:items-center">
            <span className="text-slate-600">
              Mostrando <b>1–5</b> de <b>28</b> contatos
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Linhas:</span>
                <select className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs">
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" disabled>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    className={`h-7 w-7 rounded-md text-xs font-medium ${
                      p === 1 ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty + CreateClientSheet preview */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_400px]">
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Estado vazio
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Nenhum Contato encontrado. Cadastre um novo Contato para começar.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
              <Plus className="h-3.5 w-3.5" />
              Novo Contato
            </button>
          </div>

          <aside className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Novo Contato
                </h3>
                <p className="text-[11px] text-slate-500">
                  Preencha os dados para cadastrar
                </p>
              </div>
              <button aria-label="Fechar" className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 px-4 py-4">
              <Field label="Nome completo" placeholder="Ex: Maria Souza" required />
              <Field label="Email" placeholder="maria@exemplo.com" />
              <Field label="Telefone" placeholder="(11) 99999-9999" />
              <Field label="Descrição" placeholder="Observação interna" multiline />
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
              <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                Cancelar
              </button>
              <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                Salvar contato
              </button>
            </div>
          </aside>
        </div>
      </div>
    </CorporateShell>
  );
}

function Field({
  label,
  placeholder,
  multiline,
  required,
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {multiline ? (
        <textarea
          rows={3}
          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder={placeholder}
        />
      ) : (
        <input
          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder={placeholder}
        />
      )}
    </label>
  );
}
