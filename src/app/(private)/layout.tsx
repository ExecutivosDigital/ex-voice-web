"use client";
import { AuthGuard } from "@/components/auth-guard";
import MobileAppBlocker from "@/components/mobile";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { GeneralContextProvider } from "@/context/GeneralContext";
import { ChatPageProvider } from "@/context/chatContext";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
// coment
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Não inicializa Lenis nas páginas de chat
    if (pathname.includes("/chat")) {
      return;
    }

    // Não inicializa Lenis em mobile (menor que 768px)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup para destruir a instância do Lenis
    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  const isFullscreen =
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/plans" ||
    pathname.startsWith("/plans/") ||
    pathname === "/plans2" ||
    pathname.startsWith("/plans2/") ||
    pathname === "/plans3" ||
    pathname.startsWith("/plans3/");

  if (isFullscreen) {
    return (
      <AuthGuard>
        <GeneralContextProvider>
          <ChatPageProvider>
        <MobileAppBlocker />

            <div className="min-h-screen w-full bg-[#0d0d0d]">
              {children}
            </div>
          </ChatPageProvider>
        </GeneralContextProvider>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <GeneralContextProvider>
        <ChatPageProvider>
          <div
          className={cn(
            "relative flex w-full flex-col pb-20",
            pathname.includes("/chat") && "pb-0",
          )}
        >
          <Header />
          <Sidebar />
        <MobileAppBlocker />


          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
              "relative z-10 mx-auto -mt-14 flex min-h-[75vh] w-full max-w-[90%] flex-col gap-4 overflow-hidden rounded-3xl bg-white p-6",
              pathname.includes("/chat") && "min-h-[70vh]",
            )}
          >
            {children}
          </motion.div>
        </div>
        </ChatPageProvider>
      </GeneralContextProvider>
    </AuthGuard>
  );
}
