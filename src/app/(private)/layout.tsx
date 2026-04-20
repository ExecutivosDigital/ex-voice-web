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
import { FloatingTrialWidget } from "./_components/floating-trial-widget";
import { MinimalHeader } from "./_components/minimal-header";
import { MobileBottomNav } from "./_components/mobile-bottom-nav";
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

  const isNewHome = true;
  // pathname === "" ||
  // pathname.startsWith("/") ||
  // pathname === "-Mockup" ||
  // pathname === "-Dispositivo" ||
  // pathname === "-Cor" ||
  // pathname === "-Logos" ||
  // pathname === "-minimalista";

  // const isFullscreen =
  //   pathname === "/checkout" ||
  //   pathname.startsWith("/checkout/") ||
  //   pathname === "/plans" ||
  //   pathname.startsWith("/plans/") ||
  //   pathname === "/plans2" ||
  //   pathname.startsWith("/plans2/") ||
  //   pathname === "/plans3" ||
  //   pathname.startsWith("/plans3/") ||
  //   pathname === "/plans4" ||
  //   pathname.startsWith("/plans4/") ||
  //   pathname === "/plans5" ||
  //   pathname.startsWith("/plans5/") ||
  //   pathname === "/plans6" ||
  //   pathname.startsWith("/plans6/");

  // if (isFullscreen) {
  //   return (
  //     <AuthGuard>
  //       <GeneralContextProvider>
  //         <ChatPageProvider>
  //           <MobileAppBlocker />

  //           <div className="min-h-screen w-full bg-[#0d0d0d]">{children}</div>
  //         </ChatPageProvider>
  //       </GeneralContextProvider>
  //     </AuthGuard>
  //   );
  // }

  if (isNewHome) {
    return (
      <AuthGuard>
        <GeneralContextProvider>
          <ChatPageProvider>
            <Sidebar />
            <div className="relative min-h-screen w-full bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(156,163,175,0.18),transparent),radial-gradient(900px_500px_at_110%_10%,rgba(99,102,241,0.08),transparent)]">
              <MinimalHeader />
              <motion.main
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 md:px-6 md:py-14"
              >
                {children}
              </motion.main>
              <FloatingTrialWidget />
              <MobileBottomNav />
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
