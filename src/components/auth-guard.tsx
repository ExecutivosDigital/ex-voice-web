// components/AuthGuard.tsx
"use client";

import { useSession } from "@/context/auth";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
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
    <AnimatePresence mode="wait">
      <motion.div
        key="content"
        initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        exit={{
          opacity: 0,
          scale: 0.98,
          filter: "blur(4px)",
          transition: { duration: 0.3 },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

const loadingMessages = [
  "Preparando seu ambiente...",
  "Verificando credenciais...",
  "Sincronizando dados...",
  "Quase lá...",
];

function LoadingScreen({ fallback }: { fallback?: React.ReactNode }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  if (fallback) return <>{fallback}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0b]"
      onMouseMove={(e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        mouseX.set(x);
        mouseY.set(y);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Grid de fundo com perspectiva */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(247, 206, 70, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(247, 206, 70, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center top",
          }}
        />
        <motion.div
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFCC00]/5 blur-[120px]"
        />
        <motion.div
          animate={{
            x: ["-50%", "0%", "-50%"],
            y: ["-30%", "0%", "-30%"],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-1/4 -top-1/4 h-[400px] w-[400px] rounded-full bg-neutral-800/20 blur-[80px]"
        />
        <motion.div
          animate={{
            x: ["0%", "-30%", "0%"],
            y: ["0%", "20%", "0%"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-1/4 -left-1/4 h-[350px] w-[350px] rounded-full bg-[#F7CE46]/10 blur-[100px]"
        />
      </div>

      {/* Conteúdo central */}
      <div className="relative z-10 flex flex-col items-center gap-14 px-6">
        {/* Logo com efeito 3D */}
        <motion.div
          style={{
            perspective: "1200px",
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative flex items-center justify-center"
        >
          {/* Brilho atrás da logo */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-48 w-80 rounded-full bg-[#FFCC00]/20 blur-[60px]"
            style={{ transform: "translateZ(-40px)" }}
          />
          {/* Sombra/reflexo 3D */}
          <motion.div
            animate={{
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-4 left-1/2 h-8 w-56 -translate-x-1/2 rounded-full bg-black/50 blur-xl"
            style={{
              transform: "translateZ(-60px) rotateX(80deg) scaleY(0.3)",
              transformStyle: "preserve-3d",
            }}
          />
          {/* Container da logo com glass e profundidade */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
            }}
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(20px)",
            }}
          >
            <motion.div
              animate={{
                rotateY: [0, 5, -5, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex items-center justify-center rounded-2xl bg-black/30 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
              style={{
                transformStyle: "preserve-3d",
                boxShadow:
                  "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <Image
                src="/logos/logo2.png"
                alt="Executivo's Digital - Software House & Business"
                width={280}
                height={112}
                className="h-16 w-auto object-contain drop-shadow-lg sm:h-20 md:h-24"
                priority
                style={{ transform: "translateZ(40px)" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Indicador de progresso e mensagem */}
        <div className="flex flex-col items-center gap-8">
          {/* Barra de progresso moderna */}
          <div className="relative h-[3px] w-72 overflow-hidden rounded-full bg-white/10 sm:w-80">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#FFCC00] via-[#F7CE46] to-[#FFCC00]"
              initial={{ width: "0%" }}
              animate={{
                width: ["0%", "85%", "90%", "85%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ width: "50%" }}
            />
          </div>

          {/* Mensagens com transição */}
          <div className="h-12 overflow-hidden text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.35 },
                }}
                exit={{
                  opacity: 0,
                  y: -16,
                  filter: "blur(4px)",
                  transition: { duration: 0.25 },
                }}
                className="text-sm font-medium tracking-wide text-neutral-400 sm:text-base"
              >
                {loadingMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 flex flex-col items-center gap-3"
      >
        <motion.div
          animate={{ scaleX: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-[#FFCC00]/60 to-transparent"
        />
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          EX Voice Security
        </p>
      </motion.div>
    </motion.div>
  );
}
