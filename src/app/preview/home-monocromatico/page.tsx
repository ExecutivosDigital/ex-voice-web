import {
  Activity,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Clock,
  Mic,
  Plus,
  Users,
  Zap,
} from "lucide-react";
import { MonocromaticoShell } from "../_components/monocromatico/chrome";
import {
  mockChartData,
  mockContent,
  mockKpis,
  mockMeetings,
  mockReminders,
} from "../_mocks/data";

const iconMap = { mic: Mic, clock: Clock, users: Users, activity: Activity };

export default function HomeMonocromatico() {
  const maxY = Math.max(...mockChartData.map((d) => d.recordings));

  return (
    <MonocromaticoShell>
      <div className="flex flex-col gap-16">
        {/* Page header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-neutral-200 pb-8 md:flex-row md:items-end">
          <div>
            <h1
              className="text-5xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Dashboard.
            </h1>
            <p className="mt-3 text-neutral-500">
              Acompanhe suas métricas e atividades no intervalo selecionado.
            </p>
          </div>
          <button className="flex items-center gap-2 border-b border-neutral-300 pb-1 text-sm text-neutral-700 hover:border-neutral-900">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <span style={{ fontFamily: "var(--preview-font-instrument)" }} className="italic">
              12 — 18 abr 2026
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
          </button>
        </div>

        {/* Upgrade banner */}
        <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-700" />
              Trial ativo
            </div>
            <h2
              className="text-3xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Desbloqueie todo o potencial do <em>EX Voice</em>.
            </h2>
            <p className="max-w-2xl text-neutral-500">
              Gravações ilimitadas, IA personalizada, exportação em PDF e chat com
              acesso ao contexto completo da reunião.
            </p>
          </div>
          <button className="group flex items-center gap-2 border border-neutral-900 px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50">
            <Zap className="h-4 w-4" />
            <span>Fazer Upgrade</span>
          </button>
        </section>

        {/* KPI cards */}
        <section>
          <div className="grid grid-cols-1 divide-neutral-200 border-y border-neutral-200 sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
            {mockKpis.map((kpi) => {
              const Icon = iconMap[kpi.icon as keyof typeof iconMap];
              return (
                <div key={kpi.title} className="flex flex-col gap-6 py-8 px-6 first:pl-0 last:pr-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                      {kpi.title}
                    </span>
                    <Icon className="h-4 w-4 text-neutral-300" />
                  </div>
                  <div>
                    <div
                      className="text-5xl text-neutral-900"
                      style={{ fontFamily: "var(--preview-font-instrument)" }}
                    >
                      {kpi.value}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">{kpi.subtitle}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`rounded-full border px-2 py-0.5 ${
                        kpi.trend.isPositive
                          ? "border-neutral-400 text-neutral-700"
                          : "border-neutral-300 text-neutral-500"
                      }`}
                    >
                      {kpi.trend.isPositive ? "+" : "-"}
                      {kpi.trend.value}%
                    </span>
                    <span className="text-neutral-400">vs. período anterior</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Chart + Meetings */}
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4">
              <h2
                className="text-2xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Gravações — <em className="text-neutral-500">últimos 7 dias</em>
              </h2>
              <button className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
                Ver detalhado →
              </button>
            </div>
            <svg viewBox="0 0 700 240" className="mt-8 h-64 w-full">
              {mockChartData.map((d, i) => {
                const x = 40 + (i * 620) / (mockChartData.length - 1);
                const h = (d.recordings / maxY) * 180;
                return (
                  <g key={d.date}>
                    <rect
                      x={x - 10}
                      y={210 - h}
                      width="20"
                      height={h}
                      fill={i === mockChartData.length - 1 ? "#171717" : "#a3a3a3"}
                    />
                    <text
                      x={x}
                      y={230}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#737373"
                      fontStyle="italic"
                    >
                      {d.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="border-l border-neutral-200 pl-8">
            <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4">
              <h2
                className="text-2xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Próximas reuniões
              </h2>
              <button className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
                Conectar
              </button>
            </div>
            <div className="relative mt-6">
              <div className="relative z-10 flex flex-col items-start gap-4">
                <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                  Em breve
                </span>
                <p
                  className="text-lg text-neutral-900"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  Conecte sua agenda e veja seus compromissos aqui.
                </p>
                <button className="mt-2 border-b border-neutral-900 pb-0.5 text-sm font-medium text-neutral-900 hover:text-neutral-600">
                  Conectar com Google →
                </button>
              </div>
              <div className="mt-8 space-y-4 opacity-25">
                {mockMeetings.map((m) => (
                  <div
                    key={m.title}
                    className="border-b border-dashed border-neutral-200 pb-3 last:border-none"
                  >
                    <div className="text-sm text-neutral-900">{m.title}</div>
                    <div
                      className="text-xs text-neutral-500"
                      style={{ fontFamily: "var(--preview-font-instrument)" }}
                    >
                      <em>{m.date}</em> · {m.time} · {m.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reminders + Content */}
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div>
            <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4">
              <h2
                className="text-2xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Lembretes
              </h2>
              <button className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
                <Plus className="h-3 w-3" />
                Novo
              </button>
            </div>
            <ul className="mt-6 space-y-5">
              {mockReminders.map((r) => (
                <li key={r.title} className="flex items-start gap-4 border-b border-neutral-100 pb-4 last:border-none">
                  <span
                    className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                      r.priority === "alta"
                        ? "bg-neutral-900"
                        : r.priority === "média"
                          ? "bg-neutral-500"
                          : "bg-neutral-300"
                    }`}
                  />
                  <div>
                    <div className="text-sm text-neutral-900">{r.title}</div>
                    <div
                      className="text-xs italic text-neutral-500"
                      style={{ fontFamily: "var(--preview-font-instrument)" }}
                    >
                      {r.due}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4">
              <h2
                className="text-2xl text-neutral-900"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                Aprenda com a gente
              </h2>
              <button className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
                Ver todos →
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {mockContent.map((c) => (
                <a key={c.title} href="#" className="group flex flex-col gap-3 border-b border-neutral-200 pb-6">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                    {c.category}
                  </span>
                  <h3
                    className="text-lg text-neutral-900 group-hover:italic"
                    style={{ fontFamily: "var(--preview-font-instrument)" }}
                  >
                    {c.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-xs text-neutral-500">
                    <span>{c.readTime} de leitura</span>
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MonocromaticoShell>
  );
}
