"use client";

import { useSession } from "@/context/auth";
import { useCorporate } from "@/context/corporateContext";
import { useLayoutPrefs } from "@/store";
import { cn } from "@/utils/cn";
import {
  Building2,
  Calendar,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Mic,
  PanelTop,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

/**
 * Sidebar de navegação no desktop (alternativa à barra no topo). O usuário
 * escolhe entre navbar e sidebar (useLayoutPrefs.navMode) e pode colapsar
 * a lateral. Mobile continua com o drawer + bottom nav.
 */

const NAV_ITEMS: { label: string; href: string; icon: typeof Mic }[] = [
  { label: "Gravação", href: "/", icon: Mic },
  { label: "Últimas Gravações", href: "/recordings", icon: Waves },
  { label: "Clientes", href: "/clients", icon: Users },
  { label: "Agenda", href: "/agenda", icon: Calendar },
];

export function DesktopSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, clearSession } = useSession();
  const { isController } = useCorporate();
  const { sidebarCollapsed, toggleSidebarCollapsed, setNavMode } =
    useLayoutPrefs();

  const items = isController
    ? [...NAV_ITEMS, { label: "Empresa", href: "/company", icon: Building2 }]
    : NAV_ITEMS;

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  const initial = profile?.name?.charAt(0)?.toUpperCase() || "?";
  const width = sidebarCollapsed ? "w-[72px]" : "w-60";

  return (
    <aside
      className={cn(
        // bg-white opaco (não /80): semi-transparente deixava o conteúdo passar
        // por trás ao rolar a página, dando o efeito "flutuante" do print.
        // z-50 para ficar acima do conteúdo. h-screen fixa cobre a viewport toda.
        "fixed top-0 left-0 z-50 hidden h-screen shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200 md:flex",
        width,
      )}
    >
      {/* Topo: logo + trocar para navbar */}
      <div className="flex h-16 items-center justify-between gap-2 border-b border-gray-100 px-3">
        {!sidebarCollapsed && (
          <button onClick={() => router.push("/")} aria-label="Início">
            <Image
              src="/logos/logo-dark.svg"
              alt="Executivos Voice"
              width={1250}
              height={500}
              quality={100}
              className="h-6 w-auto object-contain"
            />
          </button>
        )}
        <button
          onClick={() => setNavMode("navbar")}
          title="Usar barra no topo"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <PanelTop size={16} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition",
                sidebarCollapsed && "justify-center px-0",
                active
                  ? "bg-gradient-to-r from-primary to-primary-dim text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon size={17} className="shrink-0" strokeWidth={2.1} />
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => router.push("/plans")}
          title={sidebarCollapsed ? "Planos" : undefined}
          className={cn(
            "mt-1 flex h-10 items-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-3 text-sm font-semibold text-gray-900 shadow-[0_4px_14px_-4px_rgba(245,158,11,0.55)] transition hover:scale-[1.02]",
            sidebarCollapsed && "justify-center px-0",
          )}
        >
          <Sparkles size={17} className="shrink-0" />
          {!sidebarCollapsed && <span>Planos</span>}
        </button>
      </nav>

      {/* Rodapé: usuário + colapsar */}
      <div className="border-t border-gray-100 p-2">
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl px-2 py-2",
            sidebarCollapsed && "justify-center",
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gray-600 text-xs font-semibold text-white">
            {initial}
          </span>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {profile?.name?.split(" ")[0] || "Você"}
              </p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={async () => {
                await clearSession();
                router.push("/login");
              }}
              title="Sair"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
        <button
          onClick={toggleSidebarCollapsed}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          {sidebarCollapsed ? (
            <ChevronsRight size={15} />
          ) : (
            <>
              <ChevronsLeft size={15} /> Recolher
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
