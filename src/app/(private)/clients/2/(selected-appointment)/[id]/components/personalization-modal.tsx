"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface StepConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

const STEPS: StepConfig[] = [
  {
    badge: "PERSONALIZAÇÃO",
    title: "Personalize a",
    titleHighlight: "Inteligência da sua IA",
    description:
      "Defina como nossa IA deve interpretar suas reuniões e gerar insights personalizados para o seu negócio.",
  },
  {
    badge: "RECURSOS",
    title: "O que nossa",
    titleHighlight: "IA gera para você",
    description:
      "Decisões Irrevogáveis, Análises de Risco, Planos de Ação e muito mais para transformar suas reuniões.",
  },
  {
    badge: "CONTATO",
    title: "Personalize sua",
    titleHighlight: "IA agora",
    description:
      "Nossa tecnologia adaptativa aprende seus termos técnicos e padrões de governança.",
  },
];

const STEP_IMAGES = [
  "/modal/perso1.png",
  "/modal/perso2.png",
  "/modal/perso3.png",
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "resumo" | "prontuario";
}

const WHATSAPP_LINK =
  "https://api.whatsapp.com/send/?phone=5541997819114&text&type=phone_number&app_absent=0";

export function PersonalizationModal({
  isOpen,
  onClose,
  type,
}: PersonalizationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  useEffect(() => {
    if (isOpen && !hasSeenModal) {
      setCurrentStep(0);
      setHasSeenModal(true);
    }
  }, [isOpen, hasSeenModal]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(0);
  };

  const handleWhatsAppClick = () => {
    const message =
      type === "resumo"
        ? "Olá! Gostaria de personalizar meus resumos gerais no EX Voice."
        : "Olá! Gostaria de personalizar minha IA no EX Voice.";

    const whatsappUrl = `${WHATSAPP_LINK}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    handleClose();
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex w-full max-w-4xl my-auto flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl shadow-black/30 max-h-[90vh]"
      >
        {/* Left Panel - Image (desktop) */}
        <div
          className="relative hidden w-[45%] md:flex items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(165deg, rgba(38,38,38,0.97) 0%, rgba(24,24,27,0.98) 50%, rgba(15,15,18,0.99) 100%)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 20, 0],
                y: [0, -15, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-gray-400/[0.08] blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -15, 0],
                y: [0, 20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-gray-500/[0.06] blur-3xl"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
              className="relative z-10 flex items-center justify-center py-12"
            >
              <div className="relative w-[220px] aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50">
                <Image
                  src={STEP_IMAGES[currentStep]}
                  alt={step.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-1 top-8 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-gray-400/20 to-gray-500/20 backdrop-blur-sm shadow-lg"
              >
                <Sparkles className="h-5 w-5 text-gray-300" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === currentStep ? 24 : 6,
                  backgroundColor:
                    i === currentStep
                      ? "rgba(212,212,212,0.85)"
                      : i < currentStep
                        ? "rgba(255,255,255,0.35)"
                        : "rgba(255,255,255,0.12)",
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-1.5 rounded-full"
              />
            ))}
          </div>

          <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent" />
        </div>

        {/* Right Panel - Content */}
        <div className="flex flex-1 flex-col bg-white overflow-y-auto">
          <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.span
                key={step.badge}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-[10px] font-bold tracking-widest text-gray-500"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gray-400" />
                </span>
                {step.badge}
              </motion.span>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 md:hidden">
                  {STEPS.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        width: i === currentStep ? 24 : 6,
                        backgroundColor:
                          i === currentStep
                            ? "rgba(64,64,64,0.85)"
                            : i < currentStep
                              ? "rgba(0,0,0,0.25)"
                              : "rgba(0,0,0,0.08)",
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="h-1.5 rounded-full"
                    />
                  ))}
                </div>
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Image - mobile only */}
            <div className="md:hidden flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-200/50 to-gray-300/50 blur-2xl" />
                </div>
                <div className="relative w-[200px] aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
                  <Image
                    src={STEP_IMAGES[currentStep]}
                    alt={step.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-md"
                >
                  <Sparkles className="h-4 w-4 text-gray-600" />
                </motion.div>
              </div>
            </div>

            {/* Step content */}
            <div className="flex-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
                >
                  <h2 className="mb-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                    {step.title}{" "}
                    <span className="bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                      {step.titleHighlight}
                    </span>
                  </h2>
                  <p className="max-w-sm text-sm leading-relaxed text-gray-500 mb-8">
                    {step.description}
                  </p>

                  {isLastStep && (
                    <div className="space-y-3">
                      <button
                        onClick={handleWhatsAppClick}
                        className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-neutral-700 to-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-neutral-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-900/30 hover:from-neutral-600 hover:to-neutral-800 active:scale-[0.98]"
                      >
                        <MessageCircle className="h-4.5 w-4.5" />
                        Fale Conosco
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                      <p className="text-center text-xs text-gray-400">
                        Nossa equipe irá ajudá-lo a configurar sua IA
                        personalizada
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-auto pt-6">
              <div className="flex w-full gap-3">
                {currentStep > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handlePrevious}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-gray-100 active:scale-[0.98]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Voltar
                  </motion.button>
                )}

                {isLastStep ? (
                  <button
                    onClick={handleClose}
                    className={cn(
                      "group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-3.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-gray-100 active:scale-[0.98]",
                    )}
                  >
                    Fechar
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-neutral-700 to-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-neutral-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-900/30 hover:from-neutral-600 hover:to-neutral-800 active:scale-[0.98]"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}
