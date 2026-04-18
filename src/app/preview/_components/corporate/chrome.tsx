import {
  Bell,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Headphones,
  Home,
  LayoutGrid,
  LogOut,
  Mic,
  Settings,
  Sparkles,
  UserCircle,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { mockUser } from "../../_mocks/data";

type Crumb = { label: string; href?: string };

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/preview/home-corporate", active: true },
  { icon: Mic, label: "Gravações", href: "/preview/recordings-corporate" },
  { icon: Users, label: "Contatos", href: "/preview/clients-corporate" },
  { icon: FileText, label: "Planos", href: "/preview/plans-corporate" },
];

const sidebarBottom = [
  { icon: Settings, label: "Configurações" },
  { icon: Headphones, label: "Suporte" },
];

export function CorporateShell({
  breadcrumb = [],
  children,
  pageTitle,
  activeHref,
}: {
  breadcrumb?: Crumb[];
  children: ReactNode;
  pageTitle?: string;
  activeHref?: string;
}) {
  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900"
      style={{ fontFamily: "var(--preview-font-inter)" }}
    >
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="flex w-60 flex-col border-r border-slate-200 bg-white">
          <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
              <LayoutGrid className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">EX Voice</span>
          </div>
          <nav className="flex-1 space-y-0.5 p-3">
            <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navegação
            </div>
            {sidebarItems.map((item) => {
              const isActive = activeHref ? item.href === activeHref : item.active;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm ${
                    isActive
                      ? "bg-blue-50 font-medium text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div className="space-y-0.5 border-t border-slate-200 p-3">
            {sidebarBottom.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center gap-2.5 rounded-md bg-slate-50 px-2.5 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {mockUser.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{mockUser.name}</div>
                <div className="truncate text-xs text-slate-500">{mockUser.email}</div>
              </div>
              <button className="text-slate-400 hover:text-slate-700" aria-label="Menu usuário">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Right column */}
        <div className="flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
            <nav className="flex items-center gap-1.5 text-sm">
              <a href="/preview/home-corporate" className="text-slate-500 hover:text-slate-900">
                Home
              </a>
              {breadcrumb.map((c, i) => (
                <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <span
                    className={
                      i === breadcrumb.length - 1
                        ? "font-medium text-slate-900"
                        : "text-slate-500"
                    }
                  >
                    {c.label}
                  </span>
                </span>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span className="font-medium text-slate-700">{mockUser.credits}</span>
                <span className="text-slate-500">créditos</span>
              </div>
              <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                <Download className="h-3.5 w-3.5" />
                Baixar o App
              </button>
              <button className="relative text-slate-500 hover:text-slate-900" aria-label="Notificações">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  3
                </span>
              </button>
              <button className="flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                <Mic className="h-3.5 w-3.5" />
                Nova Gravação
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <button className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {mockUser.initials}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>
            </div>
          </header>

          {/* Page header strip */}
          {pageTitle && (
            <div className="border-b border-slate-200 bg-white px-6 py-3 text-xs text-slate-500">
              Bem-vindo(a), <span className="font-medium text-slate-800">{mockUser.name.split(" ")[0]}</span>. Hoje é 18 de abril de 2026.
            </div>
          )}

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export const userMenuItems = [
  { icon: UserCircle, label: "Gerenciar Perfil" },
  { icon: Mic, label: "Acessar Aplicativo" },
  { icon: Headphones, label: "Falar com Suporte" },
  { icon: LogOut, label: "Sair da Conta", danger: true },
];
