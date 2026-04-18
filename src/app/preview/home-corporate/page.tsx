import {
  Activity,
  ArrowRight,
  Bell,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Filter,
  Mic,
  MoreHorizontal,
  Plus,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { CorporateShell } from "../_components/corporate/chrome";
import {
  mockChartData,
  mockContent,
  mockKpis,
  mockMeetings,
  mockReminders,
} from "../_mocks/data";

const iconMap = { mic: Mic, clock: Clock, users: Users, activity: Activity };

export default function HomeCorporate() {
  const maxY = Math.max(...mockChartData.map((d) => d.recordings));

  return (
    <CorporateShell
      breadcrumb={[{ label: "Dashboard" }]}
      pageTitle="Dashboard"
      activeHref="/preview/home-corporate"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        {/* Page title + actions */}
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Acompanhe suas métricas e atividades
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Filter className="h-3.5 w-3.5" />
              Filtros
            </button>
            <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              12 — 18 abr 2026
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Upgrade banner */}
        <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-start gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                Trial Ativo
              </span>
              <div>
                <h3 className="text-base font-semibold">
                  Desbloqueie todo o potencial do EX Voice
                </h3>
                <p className="mt-0.5 text-sm text-blue-100">
                  Gravações ilimitadas, IA personalizada e relatórios exportáveis.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">
              <Zap className="h-3.5 w-3.5" />
              Fazer Upgrade
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockKpis.map((kpi) => {
            const Icon = iconMap[kpi.icon as keyof typeof iconMap];
            const TrendIcon = kpi.trend.isPositive ? TrendingUp : TrendingDown;
            return (
              <div
                key={kpi.title}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {kpi.title}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-slate-900">
                    {kpi.value}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      kpi.trend.isPositive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {kpi.trend.isPositive ? "+" : "-"}
                    {kpi.trend.value}%
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{kpi.subtitle}</div>
              </div>
            );
          })}
        </div>

        {/* Chart + Meetings */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Gravações — Últimos 7 dias
                </h2>
                <p className="text-xs text-slate-500">
                  Volume diário de gravações processadas
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  Exportar CSV
                </button>
                <button className="text-slate-400 hover:text-slate-700">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <svg viewBox="0 0 700 220" className="h-56 w-full">
                <defs>
                  <linearGradient id="corpFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={i} x1="40" y1={30 + i * 40} x2="690" y2={30 + i * 40} />
                  ))}
                </g>
                <polygon
                  fill="url(#corpFill)"
                  points={`40,190 ${mockChartData
                    .map(
                      (d, i) =>
                        `${40 + (i * 650) / (mockChartData.length - 1)},${190 - (d.recordings / maxY) * 150}`,
                    )
                    .join(" ")} 690,190`}
                />
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
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
                      <circle cx={x} cy={y} r="3.5" fill="#2563eb" stroke="white" strokeWidth="2" />
                      <text x={x} y={210} textAnchor="middle" fontSize="10" fill="#64748b">
                        {d.date}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Próximas Reuniões
                  </h2>
                  <p className="text-xs text-slate-500">Google Agenda</p>
                </div>
              </div>
              <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
                Conectar
              </a>
            </div>
            <div className="relative flex-1 p-5">
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/85 px-5 text-center backdrop-blur-sm">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                  Em Breve
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Conecte sua agenda
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Sincronize com o Google Agenda para acompanhar suas reuniões.
                  </p>
                </div>
                <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-red-500" />
                  Conectar com Google
                </button>
              </div>
              <ul className="space-y-3 opacity-30">
                {mockMeetings.map((m) => (
                  <li
                    key={m.title}
                    className="flex items-center gap-3 rounded-md border border-slate-100 p-3"
                  >
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded-md bg-blue-50 text-blue-700">
                      <span className="text-[10px] font-semibold uppercase">
                        {m.date}
                      </span>
                      <span className="text-xs font-semibold">{m.time}</span>
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="font-medium text-slate-900">{m.title}</div>
                      <div className="text-xs text-slate-500">{m.duration}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reminders + Content */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-slate-900">Lembretes</h2>
              </div>
              <button className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700">
                <Plus className="h-3 w-3" />
                Novo
              </button>
            </div>
            <ul className="divide-y divide-slate-100">
              {mockReminders.map((r) => (
                <li key={r.title} className="flex items-start gap-3 px-5 py-3">
                  <span
                    className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      r.priority === "alta"
                        ? "bg-rose-50 text-rose-700"
                        : r.priority === "média"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    {r.priority}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {r.title}
                    </div>
                    <div className="text-xs text-slate-500">{r.due}</div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Base de conhecimento
              </h2>
              <a href="#" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                Ver todos
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
              {mockContent.map((c) => (
                <a
                  key={c.title}
                  href="#"
                  className="group rounded-md border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/30"
                >
                  <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
                    {c.category}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                    {c.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{c.readTime} de leitura</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CorporateShell>
  );
}
