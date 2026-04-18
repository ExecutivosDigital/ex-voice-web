import { Bell, ChevronDown, Download, Mic, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { mockUser } from "../../_mocks/data";

type Crumb = { label: string; href?: string };

export function MinimalistaShell({
  breadcrumb = [],
  children,
}: {
  breadcrumb?: Crumb[];
  children: ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-white font-[family-name:var(--preview-font-geist)] text-neutral-900"
      style={{ fontFamily: "var(--preview-font-geist)" }}
    >
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5">
          <a href="/preview" className="flex items-center gap-2 text-sm font-medium tracking-tight text-neutral-900">
            <span className="inline-block h-2 w-2 rounded-full bg-neutral-900" />
            EX Voice
          </a>
          <nav className="hidden items-center gap-8 text-sm text-neutral-500 md:flex">
            <a href="/preview/home-minimalista" className="text-neutral-900">Dashboard</a>
            <a href="/preview/recordings-minimalista" className="hover:text-neutral-900">Gravações</a>
            <a href="/preview/clients-minimalista" className="hover:text-neutral-900">Contatos</a>
            <a href="/preview/plans-minimalista" className="hover:text-neutral-900">Planos</a>
          </nav>
          <div className="flex items-center gap-5">
            <button className="hidden items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 sm:flex" aria-label="Créditos">
              <Sparkles className="h-4 w-4" />
              <span>{mockUser.credits}</span>
            </button>
            <button className="hidden items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 md:flex">
              <Download className="h-4 w-4" />
              Baixar o App
            </button>
            <button className="relative text-neutral-500 hover:text-neutral-900" aria-label="Notificações">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-neutral-900" />
            </button>
            <button className="rounded-md border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800">
              <span className="flex items-center gap-1.5">
                <Mic className="h-3.5 w-3.5" />
                Gravar
              </span>
            </button>
            <button className="flex items-center gap-2 text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-xs font-medium">
                {mockUser.initials}
              </span>
              <span className="hidden text-neutral-900 sm:block">{mockUser.name.split(" ")[0]}</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </button>
          </div>
        </div>
        {breadcrumb.length > 0 && (
          <div className="mx-auto max-w-[1400px] px-8 pb-5">
            <nav className="flex items-center gap-2 text-sm text-neutral-400">
              {breadcrumb.map((c, i) => (
                <span key={`${c.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && <span className="text-neutral-300">/</span>}
                  <span className={i === breadcrumb.length - 1 ? "text-neutral-900" : ""}>{c.label}</span>
                </span>
              ))}
            </nav>
          </div>
        )}
        <div className="mx-auto max-w-[1400px] px-8 pb-3 text-sm text-neutral-500">
          Bem-vindo(a), {mockUser.name.split(" ")[0]}.
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-8 py-10">{children}</main>
    </div>
  );
}
