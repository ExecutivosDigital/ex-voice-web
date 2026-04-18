import { Bell, ChevronDown, Download, Mic, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { mockUser } from "../../_mocks/data";

type Crumb = { label: string; href?: string };

export function MonocromaticoShell({
  breadcrumb = [],
  children,
}: {
  breadcrumb?: Crumb[];
  children: ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-neutral-50 text-neutral-900"
      style={{ fontFamily: "var(--preview-font-inter)" }}
    >
      <header className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-10 py-6">
          <a
            href="/preview"
            className="flex items-baseline gap-1.5"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            <span className="text-2xl text-neutral-900">EX</span>
            <span className="text-2xl italic text-neutral-500">Voice</span>
          </a>
          <nav className="hidden items-center gap-10 text-sm md:flex">
            <a href="/preview/home-monocromatico" className="text-neutral-900 underline decoration-neutral-400 decoration-1 underline-offset-8">Dashboard</a>
            <a href="/preview/recordings-monocromatico" className="text-neutral-600 hover:text-neutral-900">Gravações</a>
            <a href="/preview/clients-monocromatico" className="text-neutral-600 hover:text-neutral-900">Contatos</a>
            <a href="/preview/plans-monocromatico" className="text-neutral-600 hover:text-neutral-900">Planos</a>
          </nav>
          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-1.5 text-sm text-neutral-500 sm:flex">
              <Sparkles className="h-4 w-4" />
              <span>{mockUser.credits} créditos</span>
            </div>
            <button className="hidden items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 md:flex">
              <Download className="h-4 w-4" />
              Baixar o App
            </button>
            <button className="relative text-neutral-600 hover:text-neutral-900" aria-label="Notificações">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-neutral-900" />
            </button>
            <button className="flex items-center gap-2 border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-100">
              <Mic className="h-3.5 w-3.5" />
              Gravar
            </button>
            <button className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-700">
                {mockUser.initials}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-[1280px] px-10 pb-6">
          {breadcrumb.length > 0 && (
            <nav className="mb-1 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400">
              {breadcrumb.map((c, i) => (
                <span key={`${c.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  <span className={i === breadcrumb.length - 1 ? "text-neutral-700" : ""}>{c.label}</span>
                </span>
              ))}
            </nav>
          )}
          <p
            className="text-neutral-500"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            <span className="italic">Bem-vindo(a),</span>{" "}
            <span className="text-neutral-900">{mockUser.name.split(" ")[0]}</span>
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-10 py-12">{children}</main>
    </div>
  );
}
