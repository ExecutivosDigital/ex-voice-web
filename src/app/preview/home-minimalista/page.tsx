import {
  Activity,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Clock,
  Mic,
  Plus,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { MinimalistaShell } from "../_components/minimalista/chrome";
import {
  mockChartData,
  mockContent,
  mockKpis,
  mockMeetings,
  mockReminders,
} from "../_mocks/data";

const iconMap = { mic: Mic, clock: Clock, users: Users, activity: Activity };

export default function HomeMinimalista() {
  const maxY = Math.max(...mockChartData.map((d) => d.recordings));

  return (
    <MinimalistaShell>
      <div className="flex flex-col gap-12">
        {/* Page header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
              Dashboard
            </h1>
            <p className="mt-1 text-neutral-500">
              Acompanhe suas métricas e atividades
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 hover:border-neutral-300">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <span>12 — 18 abr 2026</span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          </button>
        </div>

        {/* Upgrade banner */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-md border border-neutral-200 bg-neutral-50 p-6 md:flex-row md:items-center">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              TRIAL ATIVO
            </span>
            <div>
              <h3 className="text-base font-medium text-neutral-900">
                Desbloqueie todo o potencial do EX Voice
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                Gravações ilimitadas, IA personalizada e exportação em PDF.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
            <Zap className="h-4 w-4" />
            Fazer Upgrade
          </button>
        </div>

        {/* KPI cards */}
        <section>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
            {mockKpis.map((kpi) => {
              const Icon = iconMap[kpi.icon as keyof typeof iconMap];
              const TrendIcon = kpi.trend.isPositive ? TrendingUp : TrendingDown;
              return (
                <div key={kpi.title} className="flex flex-col gap-6 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-neutral-500">
                      {kpi.title}
                    </span>
                    <Icon className="h-4 w-4 text-neutral-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-medium tracking-tight text-neutral-900">
                      {kpi.value}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">{kpi.subtitle}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <TrendIcon
                      className={`h-3.5 w-3.5 ${kpi.trend.isPositive ? "text-emerald-600" : "text-rose-600"}`}
                    />
                    <span
                      className={kpi.trend.isPositive ? "text-emerald-600" : "text-rose-600"}
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
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-md border border-neutral-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-medium text-neutral-900">Gravações</h2>
                <p className="text-xs text-neutral-500">Últimos 7 dias</p>
              </div>
              <button className="text-xs text-neutral-500 hover:text-neutral-900">
                Ver detalhado
              </button>
            </div>
            <svg viewBox="0 0 700 220" className="mt-6 h-56 w-full">
              <g stroke="#e5e5e5" strokeWidth="1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="40" y1={30 + i * 40} x2="690" y2={30 + i * 40} />
                ))}
              </g>
              <polyline
                fill="none"
                stroke="#171717"
                strokeWidth="1.5"
                points={mockChartData
                  .map(
                    (d, i) =>
                      `${40 + (i * 650) / (mockChartData.length - 1)},${190 - (d.recordings / maxY) * 150}`,
                  )
                  .join(" ")}
              />
              {mockChartData.map((d, i) => {
                const x = 40 + (i * 650) / (mockChartData.length - 1);
                const y = 190 - (d.recordings / maxY) * 150;
                return (
                  <g key={d.date}>
                    <circle cx={x} cy={y} r="3" fill="#171717" />
                    <text x={x} y={210} textAnchor="middle" fontSize="10" fill="#737373">
                      {d.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-col rounded-md border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-medium text-neutral-900">
                  Próximas reuniões
                </h2>
                <p className="text-xs text-neutral-500">Google Agenda</p>
              </div>
              <button className="text-xs text-neutral-500 hover:text-neutral-900">
                Conectar
              </button>
            </div>
            <div className="relative mt-6 flex-1">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-md bg-white/70 text-center backdrop-blur-sm">
                <span className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs uppercase tracking-wider text-neutral-500">
                  Em Breve
                </span>
                <div className="px-4">
                  <p className="text-sm font-medium text-neutral-900">
                    Conecte sua agenda
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Sincronize com o Google Agenda para ver suas próximas reuniões
                    aqui.
                  </p>
                </div>
                <button className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50">
                  Conectar com Google
                </button>
              </div>
              <div className="space-y-3 opacity-20">
                {mockMeetings.map((m) => (
                  <div
                    key={m.title}
                    className="flex items-center gap-3 border-b border-neutral-100 pb-3 last:border-none"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200">
                      <Calendar className="h-4 w-4 text-neutral-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-900">
                        {m.title}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {m.date} · {m.time} · {m.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reminders + Content */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col rounded-md border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-neutral-900">Lembretes</h2>
              <button className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900">
                <Plus className="h-3.5 w-3.5" />
                Novo
              </button>
            </div>
            <ul className="mt-4 space-y-4">
              {mockReminders.map((r) => (
                <li
                  key={r.title}
                  className="flex items-start gap-3 border-b border-neutral-100 pb-4 last:border-none last:pb-0"
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 rounded-full ${
                      r.priority === "alta"
                        ? "bg-rose-500"
                        : r.priority === "média"
                          ? "bg-amber-500"
                          : "bg-neutral-400"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-neutral-900">{r.title}</div>
                    <div className="text-xs text-neutral-500">{r.due}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-neutral-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-medium text-neutral-900">
                  Aprenda com a gente
                </h2>
                <p className="text-xs text-neutral-500">Conteúdos curados</p>
              </div>
              <button className="text-xs text-neutral-500 hover:text-neutral-900">
                Ver todos
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {mockContent.map((c) => (
                <a
                  key={c.title}
                  href="#"
                  className="group flex flex-col gap-4 rounded-md border border-neutral-200 p-5 hover:border-neutral-900"
                >
                  <span className="text-xs uppercase tracking-wider text-neutral-500">
                    {c.category}
                  </span>
                  <h3 className="text-sm font-medium text-neutral-900 group-hover:underline">
                    {c.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-xs text-neutral-500">
                    <span>{c.readTime} de leitura</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MinimalistaShell>
  );
}
