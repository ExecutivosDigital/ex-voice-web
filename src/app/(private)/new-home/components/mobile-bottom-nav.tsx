"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Mic, Sparkles, Users, Waves } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ITEMS: {
  label: string;
  href: string;
  icon: typeof Mic;
  highlight?: boolean;
}[] = [
  { label: "Gravar", href: "/new-home", icon: Mic },
  { label: "Gravações", href: "/new-home/recordings", icon: Waves },
  { label: "Clientes", href: "/new-home/clients", icon: Users },
  { label: "Agenda", href: "/new-home/agenda", icon: Calendar },
  { label: "Planos", href: "/new-home/plans", icon: Sparkles, highlight: true },
];

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);

  const isActive = (href: string) =>
    href === "/new-home" ? pathname === href : pathname.startsWith(href);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastYRef.current;

      if (Math.abs(diff) < 6) return;

      if (y < 80) {
        setVisible(true);
      } else if (diff > 0) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="mobile-bottom-nav"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
                  <span className="relative text-[10px] font-semibold leading-none">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
