import {
  ArrowDown,
  ArrowUpDown,
  Bell,
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  GraduationCap,
  Loader2,
  MoreHorizontal,
  Play,
  Search,
  Video,
} from "lucide-react";
import { MinimalistaShell } from "../_components/minimalista/chrome";
import { mockRecordings } from "../_mocks/data";

const typeIcon = { Contato: Video, Lembrete: Bell, Estudo: GraduationCap, Outro: Folder };

function TranscriptionBadge({ status }: { status: string }) {
  if (status === "PRONTO")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-neutral-900">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Pronta
      </span>
    );
  if (status === "TRANSCRIBING")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
        <Loader2 className="h-3 w-3 animate-spin" />
        Transcrevendo
      </span>
    );
  if (status === "PENDING")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Pendente
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
      Não solicitada
    </span>
  );
}

export default function RecordingsMinimalista() {
  return (
    <MinimalistaShell breadcrumb={[{ label: "Gravações" }]}>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
              Últimas Gravações
            </h1>
            <p className="mt-1 text-neutral-500">
              Gerencie todas as suas gravações
            </p>
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                placeholder="Buscar..."
                defaultValue=""
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-neutral-500">
            Filtrar por:
          </span>
          {[
            { label: "Contato", icon: Video, active: true },
            { label: "Lembretes", icon: Bell, active: false },
            { label: "Estudos", icon: GraduationCap, active: false },
            { label: "Outros", icon: Folder, active: false },
          ].map((f) => (
            <button
              key={f.label}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                f.active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
              }`}
            >
              <f.icon className="h-3.5 w-3.5" />
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left">
                {[
                  { label: "Tipo", sortable: true, sort: "idle" as const },
                  { label: "Título da Gravação", sortable: true, sort: "desc" as const },
                  { label: "Data da Gravação", sortable: true, sort: "idle" as const },
                  { label: "Tempo de Gravação", sortable: true, sort: "idle" as const },
                  { label: "Transcrição", sortable: false, sort: "idle" as const },
                  { label: "Ações", sortable: false, sort: "idle" as const },
                ].map((col) => (
                  <th key={col.label} className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    <button className="flex items-center gap-1.5 hover:text-neutral-900">
                      {col.label}
                      {col.sortable &&
                        (col.sort === "desc" ? (
                          <ArrowDown className="h-3 w-3 text-neutral-900" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-neutral-300" />
                        ))}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockRecordings.map((r) => {
                const TypeIcon = typeIcon[r.type];
                return (
                  <tr key={r.id} className="border-b border-neutral-100 last:border-none hover:bg-neutral-50">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600">
                        <TypeIcon className="h-3.5 w-3.5 text-neutral-400" />
                        {r.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-900">
                      <div className="flex items-center gap-2">
                        <button
                          aria-label="Reproduzir"
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 hover:border-neutral-900"
                        >
                          <Play className="h-3 w-3" />
                        </button>
                        {r.title}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-neutral-600">{r.date}</td>
                    <td className="px-5 py-4 font-mono text-xs text-neutral-600">
                      {r.duration}
                    </td>
                    <td className="px-5 py-4">
                      <TranscriptionBadge status={r.transcription} />
                    </td>
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
            <span className="text-neutral-500">Mostrando 1–5 de 48</span>
            <div className="flex items-center gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3].map((p) => (
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
              <span className="px-1 text-neutral-400">…</span>
              <button className="h-8 w-8 rounded-md border border-neutral-200 text-xs text-neutral-700 hover:border-neutral-900">
                10
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 hover:border-neutral-900">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty state sample (collapsed tile) */}
        <div className="rounded-md border border-dashed border-neutral-200 bg-white p-8 text-center">
          <p className="text-xs uppercase tracking-wider text-neutral-400">
            Estado vazio
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Nenhuma gravação neste filtro.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
            <FileText className="h-4 w-4" />
            Gravar
          </button>
        </div>
      </div>
    </MinimalistaShell>
  );
}
