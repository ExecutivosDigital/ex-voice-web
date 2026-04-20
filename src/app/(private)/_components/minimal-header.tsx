"use client";

import { ProfileModal } from "@/components/profile/profile-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/blocks/dropdown-menu";
import { useSession } from "@/context/auth";
import { useSidebar } from "@/store";
import { cn } from "@/utils/cn";
import {
  ArrowUpRight,
  LogOut,
  Menu,
  MessageCircle,
  Sparkles,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MinimalNotificationBell } from "./minimal-notification-bell";

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Gravação", href: "/" },
  { label: "Últimas Gravações", href: "/recordings" },
  { label: "Clientes", href: "/clients" },
  { label: "Agenda", href: "/agenda" },
];

export function MinimalHeader() {
  const { profile, clearSession } = useSession();
  const { setMobileMenu } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initial = profile?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <ProfileModal isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} />

      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-300",
          isScrolled
            ? "border-gray-200/70 bg-white/80 backdrop-blur-md"
            : "border-transparent bg-white/60 backdrop-blur-sm",
        )}
      >
        <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
              aria-label="Abrir menu"
            >
              <Menu size={18} />
            </button>
            <button
              onClick={() => router.push("")}
              className="flex items-center"
              aria-label="Início"
            >
              <Image
                src="/logos/logo-dark.svg"
                alt="Executivos Voice"
                width={1250}
                height={500}
                quality={100}
                className="h-6 w-auto object-contain"
              />
            </button>
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200/70 bg-white/70 p-1 backdrop-blur-md md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                    active ? "text-white" : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)]" />
                  )}
                  <span className="relative whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => router.push("/plans")}
              className="group relative ml-1 inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-[0_4px_14px_-4px_rgba(245,158,11,0.65)] transition hover:scale-[1.03]"
              aria-label="Fazer upgrade"
            >
              <span className="absolute inset-0 animate-[shimmer_2.8s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] bg-[length:250%_100%]" />
              <Sparkles size={13} className="relative" />
              <span className="relative">Planos</span>
              <ArrowUpRight
                size={13}
                className="relative transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </nav>

          <div className="flex items-center gap-1.5 md:gap-2">
            <MinimalNotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-9 items-center gap-2 rounded-full bg-gray-100/80 pr-3 pl-1 text-gray-700 transition hover:bg-gray-200/80"
                  aria-label="Abrir menu do usuário"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-600 text-xs font-semibold text-white">
                    {initial}
                  </span>
                  <span className="max-w-[100px] truncate text-sm font-medium">
                    {profile?.name?.split(" ")[0] || "Você"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white p-1 shadow-xl shadow-gray-300/40"
              >
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-600 text-sm font-semibold text-white">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {profile?.name || "Usuário"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {profile?.email || ""}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="p-1">
                  <DropdownMenuItem
                    onSelect={(e: Event) => {
                      e.preventDefault();
                      setIsProfileOpen(true);
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <UserRound size={16} className="text-gray-500" />
                    Gerenciar perfil
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={() =>
                      window.open("https://wa.me/5541997819114", "_blank")
                    }
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <MessageCircle size={16} className="text-gray-500" />
                    Falar com suporte
                  </DropdownMenuItem>

                  <div className="my-1 h-px bg-gray-100" />

                  <DropdownMenuItem
                    onSelect={async () => {
                      await clearSession();
                      router.push("/login");
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                  >
                    <LogOut size={16} />
                    Sair
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
