"use client";

import {
  Bell,
  ChevronRight,
  FileText,
  Folder,
  Home,
  Mic,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { mockProfile } from "../_mocks";

type Crumb = { label: string; href?: string };

const nav = [
  { icon: Home, label: "Início", href: "/v2/home" },
  { icon: Mic, label: "Gravações", href: "/v2/recordings" },
  { icon: Users, label: "Contatos", href: "/v2/clients" },
  { icon: Bell, label: "Lembretes", href: "/v2/reminders" },
  { icon: FileText, label: "Estudos", href: "/v2/studies" },
  { icon: Folder, label: "Outros", href: "/v2/others" },
];

export function Shell({
  children,
  breadcrumbs = [],
  onRecordClick,
}: {
  children: ReactNode;
  breadcrumbs?: Crumb[];
  onRecordClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === pathname || (href !== "/v2/home" && pathname?.startsWith(href));

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r border-neutral-100 bg-white lg:flex">
        {/* Logo */}
        <div className="flex h-[72px] items-center px-6">
          <Image
            src="/logos/logo-dark.svg"
            alt="EX Voice"
            width={120}
            height={32}
            className="h-7 w-auto object-contain"
            priority
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-neutral-100 font-semibold text-neutral-900"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    <item.icon className="h-4 w-4" strokeWidth={active ? 2.25 : 1.8} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-4 h-px bg-neutral-100" />

          <ul className="space-y-0.5">
            <li>
              <Link
                href="/v2/chat-business"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.8} />
                <span className="flex-1">AI Executivos</span>
                <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Novo
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Record CTA */}
        <div className="px-3 pb-3">
          <button
            onClick={onRecordClick}
            className="flex w-full items-center gap-2.5 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg hover:shadow-neutral-900/25 active:scale-[0.98]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
              <Mic className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="flex-1 text-left">Nova Gravação</span>
          </button>
        </div>

        {/* User */}
        <div className="border-t border-neutral-100 p-3">
          <Link
            href="/v2/profile"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-neutral-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-500 to-neutral-900 text-sm font-semibold text-white">
              {mockProfile.initials}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate text-sm font-semibold text-neutral-900">
                {mockProfile.firstName}
              </div>
              <div className="truncate text-[11px] text-neutral-500">
                {mockProfile.credits} créditos
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:pl-[240px]">
        {/* Top bar — minimal */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-neutral-100 bg-white/80 px-8 backdrop-blur">
          <nav className="flex min-w-0 items-center gap-1.5 text-sm">
            {breadcrumbs.length === 0 ? (
              <span className="text-sm text-neutral-400">&nbsp;</span>
            ) : (
              breadcrumbs.map((c, i) => {
                const last = i === breadcrumbs.length - 1;
                return (
                  <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                    {c.href && !last ? (
                      <Link href={c.href} className="text-neutral-500 hover:text-neutral-900">
                        {c.label}
                      </Link>
                    ) : (
                      <span className={last ? "font-medium text-neutral-900" : "text-neutral-500"}>
                        {c.label}
                      </span>
                    )}
                    {!last && <ChevronRight className="h-3.5 w-3.5 text-neutral-300" />}
                  </span>
                );
              })
            )}
          </nav>

          <div className="flex items-center gap-1">
            <button
              aria-label="Buscar"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/v2/notifications"
              aria-label="Notificações"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </Link>
          </div>
        </header>

        <main className="px-8 py-10">{children}</main>
      </div>
    </div>
  );
}
