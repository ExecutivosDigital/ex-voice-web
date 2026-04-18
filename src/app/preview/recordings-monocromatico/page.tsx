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
import { MonocromaticoShell } from "../_components/monocromatico/chrome";
import { mockRecordings } from "../_mocks/data";

const typeIcon = { Contato: Video, Lembrete: Bell, Estudo: GraduationCap, Outro: Folder };

function TranscriptionBadge({ status }: { status: string }) {
  const base = "inline-flex items-center gap-1.5 text-xs";
  if (status === "PRONTO")
    return (
      <span className={`${base} text-neutral-900`}>
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
        Pronta
      </span>
    );
  if (status === "TRANSCRIBING")
    return (
      <span className={`${base} italic text-neutral-600`} style={{ fontFamily: "var(--preview-font-instrument)" }}>
        <Loader2 className="h-3 w-3 animate-spin" />
        Transcrevendo
      </span>
    );
  if (status === "PENDING")
    return (
      <span className={`${base} text-neutral-600`}>
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
        Pendente
      </span>
    );
  return (
    <span className={`${base} text-neutral-400`}>
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
      Não solicitada
    </span>
  );
}

export default function RecordingsMonocromatico() {
  return (
    <MonocromaticoShell breadcrumb={[{ label: "Gravações" }]}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-neutral-200 pb-8 md:flex-row md:items-end">
          <div>
            <h1
              className="text-5xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Últimas gravações.
            </h1>
            <p className="mt-3 text-neutral-500">
              Gerencie todas as suas gravações organizadas por tipo e transcrição.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              className="w-full border-b border-neutral-300 bg-transparent py-2 pl-6 pr-3 text-sm text-neutral-900 placeholder:italic placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
              placeholder="Buscar..."
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Filtrar
          </span>
          {[
            { label: "Contato", icon: Video, active: true },
            { label: "Lembretes", icon: Bell, active: false },
            { label: "Estudos", icon: GraduationCap, active: false },
            { label: "Outros", icon: Folder, active: false },
          ].map((f) => (
            <button
              key={f.label}
              className={`flex items-center gap-1.5 pb-1 text-sm ${
                f.active
                  ? "border-b border-neutral-900 text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <f.icon className="h-3.5 w-3.5" />
              {f.label}
            </button>
          ))}
        </div>

        {/* Table — editorial rows */}
        <div className="border-t border-neutral-200">
          <div className="grid grid-cols-[90px_1fr_160px_130px_150px_40px] gap-4 border-b border-neutral-200 py-3 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            <button className="flex items-center gap-1 text-left hover:text-neutral-900">
              Tipo <ArrowUpDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-1 text-left hover:text-neutral-900">
              Título <ArrowDown className="h-3 w-3 text-neutral-900" />
            </button>
            <button className="flex items-center gap-1 text-left hover:text-neutral-900">
              Data <ArrowUpDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-1 text-left hover:text-neutral-900">
              Tempo <ArrowUpDown className="h-3 w-3" />
            </button>
            <span>Transcrição</span>
            <span className="text-right">Ações</span>
          </div>
          {mockRecordings.map((r) => {
            const TypeIcon = typeIcon[r.type];
            return (
              <div
                key={r.id}
                className="grid grid-cols-[90px_1fr_160px_130px_150px_40px] items-center gap-4 border-b border-neutral-200 py-6 transition hover:bg-neutral-100"
              >
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-500">
                  <TypeIcon className="h-3.5 w-3.5" />
                  {r.type}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    aria-label="Reproduzir"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:border-neutral-900"
                  >
                    <Play className="h-3 w-3" />
                  </button>
                  <span
                    className="text-base text-neutral-900"
                    style={{ fontFamily: "var(--preview-font-instrument)" }}
                  >
                    {r.title}
                  </span>
                </div>
                <span
                  className="text-sm italic text-neutral-600"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  {r.date}
                </span>
                <span className="font-mono text-xs text-neutral-600">{r.duration}</span>
                <TranscriptionBadge status={r.transcription} />
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
            Mostrando 1–5 de 48
          </span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900">
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`h-7 w-7 ${
                  p === 1 ? "border border-neutral-900 text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="text-neutral-400">…</span>
            <button className="h-7 w-7 text-neutral-500 hover:text-neutral-900">10</button>
            <button className="flex items-center gap-1 text-neutral-900 hover:text-neutral-600">
              Próxima
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-dashed border-neutral-200 pt-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
            Estado vazio
          </p>
          <p
            className="mt-2 text-neutral-700"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Nenhuma gravação neste filtro.
          </p>
          <button className="mt-5 inline-flex items-center gap-2 border border-neutral-900 px-5 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50">
            <FileText className="h-4 w-4" />
            Gravar
          </button>
        </div>
      </div>
    </MonocromaticoShell>
  );
}
