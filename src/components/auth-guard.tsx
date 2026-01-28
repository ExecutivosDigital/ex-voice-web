// components/AuthGuard.tsx
"use client";

import { useSession } from "@/context/auth";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { profile, loading, checkSession } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const validateSession = async () => {
      if (loading) return;
      if (hasRedirected.current) return;

      const isValid = await checkSession();

      if (!isValid || !profile) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const recheckValid = await checkSession();

        if (!recheckValid) {
          hasRedirected.current = true;
          router.push("/login");
        }
      }
    };

    validateSession();
  }, [profile, loading, checkSession, router, pathname]);

  if (loading || !profile) {
    return (
      <AnimatePresence mode="wait">
        <LoadingScreen key="loading" fallback={fallback} />
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

const loadingMessages = [
  "Iniciando conexão segura...",
  "Validando certificados de acesso...",
  "Criptografando ambiente de trabalho...",
  "Sincronizando seus registros...",
  "Quase pronto para você...",
];

function LoadingScreen({ fallback }: { fallback?: React.ReactNode }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  if (fallback) return <>{fallback}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#fafafa]"
    >
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute inset-0 z-0 opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-slate-400/10 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -120, 0],
            y: [0, 80, 0],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-slate-500/10 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300/10 blur-[150px]"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"
      />
      <div
        className="absolute inset-0 z-1 bg-grid-slate-200/[0.04] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Animated Icon/Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mb-12"
        >
          {/* Animated Glow Rings */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 -m-4 rounded-full bg-gradient-to-tr from-slate-300/10 to-slate-400/10 blur-2xl"
          />

          {/* Glass Card for Logo */}
          <div className="relative flex h-32 w-64 items-center justify-center overflow-hidden rounded-3xl border border-white/40 bg-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-xl ring-1 ring-black/5 sm:h-40 sm:w-80">
            {/* Scanning Shimmer Effect (Behind Logo) */}
            <motion.div
              animate={{
                top: ["-100%", "200%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-0 z-0 h-1/2 w-full bg-gradient-to-b from-transparent via-slate-400/15 to-transparent skew-y-12"
            />

            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 z-10 m-auto flex items-center justify-center"
            >
              <Image
                src="/logos/logo-dark.svg"
                alt="Logo"
                width={240}
                height={96}
                className="object-contain"
                style={{ width: "auto", height: "60%" }}
                priority
              />
            </motion.div>
          </div>

          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -right-3 bottom-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/80 text-slate-700 shadow-lg backdrop-blur-md"
          >
            <ShieldCheck className="h-5 w-5" />
          </motion.div>
        </motion.div>

        {/* Loading Progress Section */}
        <div className="flex flex-col items-center max-w-sm w-full">
          <div className="relative mb-8 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/50 ring-1 ring-black/5">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 10,
                ease: "linear",
              }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900 bg-[length:200%_100%]"
            />
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "200% 0%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </div>

          {/* Animated Messages */}
          <div className="relative h-16 w-full text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-2 text-slate-800/80">
                  <Loader2 className="h-4 w-4 animate-spin-slow" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Sistema Ativo</span>
                </div>
                <h3 className="bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-xl font-semibold tracking-tight text-transparent sm:text-2xl">
                  {loadingMessages[messageIndex]}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/40 border border-white/60 shadow-sm backdrop-blur-md">
          <Lock className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">Ambiente Seguro End-to-End</span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-slate-300" />
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">
            Executivo's Voice
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-slate-300" />
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}
