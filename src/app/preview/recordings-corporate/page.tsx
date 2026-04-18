import {
  ArrowDown,
  ArrowUpDown,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  Folder,
  GraduationCap,
  Loader2,
  Mic,
  MoreHorizontal,
  Play,
  Search,
  Video,
} from "lucide-react";
import { CorporateShell } from "../_components/corporate/chrome";
import { mockRecordings } from "../_mocks/data";

const typeIcon = { Contato: Video, Lembrete: Bell, Estudo: GraduationCap, Outro: Folder };

function TranscriptionBadge({ status }: { status: string }) {
  const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold";
  if (status === "PRONTO")
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        <CheckCircle2 className="h-3 w-3" />
        Pronta
      </span>
    );
  if (status === "TRANSCRIBING")
    return (
      <span className={`${base} bg-blue-50 text-blue-700`}>
        <Loader2 className="h-3 w-3 animate-spin" />
        Transcrevendo
      </span>
    );
  if (status === "PENDING")
    return (
      <span className={`${base} bg-amber-50 text-amber-700`}>
        <Clock className="h-3 w-3" />
        Pendente
      </span>
    );
  return (
    <span className={`${base} bg-slate-100 text-slate-600`}>
      Não solicitada
    </span>
  );
}

export default function RecordingsCorporate() {
  return (
    <CorporateShell
      breadcrumb={[{ label: "Gravações" }]}
      pageTitle="Gravações"
      activeHref="/preview/recordings-corporate"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Últimas Gravações
            </h1>
            <p className="text-sm text-slate-500">
              Gerencie todas as suas gravações · 48 registros
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Download className="h-3.5 w-3.5" />
              Exportar CSV
            </button>
            <button className="flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
              <Mic className="h-3.5 w-3.5" />
              Nova Gravação
            </button>
          </div>
        </div>

        {/* Filters + search */}
        <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
              <Filter className="h-3.5 w-3.5" />
              Tipo:
            </span>
            {[
              { label: "Contato", icon: Video, active: true },
              { label: "Lembretes", icon: Bell, active: false },
              { label: "Estudos", icon: GraduationCap, active: false },
              { label: "Outros", icon: Folder, active: false },
            ].map((f) => (
              <button
                key={f.label}
                className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                  f.active
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <f.icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Buscar por título, cliente, conteúdo..."
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
                {[
                  { label: "Tipo", sortable: true, sort: "idle" },
                  { label: "Título da Gravação", sortable: true, sort: "desc" },
                  { label: "Data da Gravação", sortable: true, sort: "idle" },
                  { label: "Tempo de Gravação", sortable: true, sort: "idle" },
                  { label: "Transcrição", sortable: false, sort: "idle" },
                  { label: "Ações", sortable: false, sort: "idle" },
                ].map((c) => (
                  <th
                    key={c.label}
                    className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600"
                  >
                    <button className="flex items-center gap-1 hover:text-slate-900">
                      {c.label}
                      {c.sortable &&
                        (c.sort === "desc" ? (
                          <ArrowDown className="h-3 w-3 text-blue-600" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        ))}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockRecordings.map((r, i) => {
                const TypeIcon = typeIcon[r.type];
                return (
                  <tr key={r.id} className={`${i % 2 === 1 ? "bg-slate-50/40" : ""} hover:bg-blue-50/30`}>
                    <td className="px-3 py-2.5">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        <TypeIcon className="h-3 w-3" />
                        {r.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="Reproduzir"
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Play className="h-3 w-3" />
                        </button>
                        <span className="font-medium text-slate-900">{r.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{r.date}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-700">{r.duration}</td>
                    <td className="px-3 py-2.5">
                      <TranscriptionBadge status={r.transcription} />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          aria-label="Baixar"
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          aria-label="Mais ações"
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col items-start justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs md:flex-row md:items-center">
            <span className="text-slate-600">
              Mostrando <b>1–5</b> de <b>48</b> gravações
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Linhas por página:</span>
                <select className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs">
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40" disabled>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`h-7 w-7 rounded-md text-xs font-medium ${
                      p === 1 ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="px-1 text-slate-400">…</span>
                <button className="h-7 w-7 rounded-md border border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50">
                  10
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state sample */}
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Estado vazio
          </p>
          <p className="mt-2 text-sm text-slate-700">
            Nenhuma gravação encontrada com os filtros aplicados.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
            <FileText className="h-3.5 w-3.5" />
            Gravar
          </button>
        </div>
      </div>
    </CorporateShell>
  );
}
