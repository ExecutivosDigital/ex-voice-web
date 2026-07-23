"use client";

import { cn } from "@/utils/cn";
import { Bot, Building2, Map, Receipt, UsersRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

/** Fase 2.6 — navegação interna da área Empresa (só Controlador). */

const TABS = [
  { label: "Estrutura", href: "/company", icon: Building2 },
  { label: "IAs", href: "/company/ai", icon: Bot },
  { label: "Mapas", href: "/company/maps", icon: Map },
  { label: "Usuários", href: "/company/users", icon: UsersRound },
  { label: "Faturas", href: "/company/billing", icon: Receipt },
];

export function CompanyTabs() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="inline-flex items-center gap-1 self-start rounded-full border border-gray-200/80 bg-white/70 p-1 shadow-sm backdrop-blur-md">
      {TABS.map((tab) => {
        const active =
          tab.href === "/company"
            ? pathname === "/company"
            : pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              active ? "text-white" : "text-gray-600 hover:text-gray-900",
            )}
          >
            {active && (
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-dim shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)]" />
            )}
            <span className="relative flex items-center gap-1.5">
              <Icon size={14} />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
