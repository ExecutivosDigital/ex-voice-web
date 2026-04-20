"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Calendar, Mic, Sparkles, Users, Waves } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ITEMS: {
  label: string;
  href: string;
  icon: typeof Mic;
  highlight?: boolean;
}[] = [
  { label: "Gravar", href: "/", icon: Mic },
  { label: "Gravações", href: "/recordings", icon: Waves },
  { label: "Clientes", href: "/clients", icon: Users },
  { label: "Agenda", href: "/agenda", icon: Calendar },
  { label: "Planos", href: "/plans", icon: Sparkles, highlight: true },
];

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  if (!mounted) return null;

  return createPortal(
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] md:hidden"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-0.5 rounded-2xl border border-gray-200/70 bg-white/85 px-1.5 py-1.5 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.25)] backdrop-blur-xl">
        {ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition-colors",
                active
                  ? "text-white"
                  : item.highlight
                    ? "text-gray-900"
                    : "text-gray-500",
              )}
            >
              {active && (
                <motion.span
                  layoutId="mobile-bottom-active"
                  className={cn(
                    "absolute inset-0 rounded-xl shadow-[0_4px_14px_-4px_rgba(17,24,39,0.45)]",
                    item.highlight
                      ? "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500"
                      : "bg-gradient-to-r from-gray-900 to-gray-700",
                  )}
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 32,
                  }}
                />
              )}
              <Icon size={18} strokeWidth={2.2} className="relative" />
              <span className="relative text-[10px] leading-none font-semibold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>,
    document.body,
  );
}
