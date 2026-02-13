"use client";

import { useSession } from "@/context/auth";
import { cn } from "@/utils/cn";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface StepContent {
  title: string;
  text: string;
}

const steps: StepContent[] = [
  {
    title: "BAIXE O APP",
    text: "Transforme seu celular na ferramenta mais poderosa do seu consultório",
  },
  {
    title: "FUNCIONALIDADES MOBILE",
    text: "Grave consultas, gerencie prontuários e acesse a inteligência do Health Voice de onde estiver",
  },
  {
    title: "COMECE AGORA",
    text: "Baixe o aplicativo e desbloqueie todo o potencial Health Voice na palma da sua mão",
  },
];

// Imagens para cada step
const stepImages = [
  "/modal/mobile1.png",
  "/modal/mobile2.png",
  "/modal/mobile3.png",
];

// Links dos apps
const appleStoreLink = "https://apps.apple.com/br/app/executivos-voice/id6754694679";
const googlePlayLink = "https://play.google.com/store/apps/details?id=com.executivos.healthvoice";

const STORAGE_KEY = "trialAppModalClosedAt";
const COOLDOWN_MINUTES = 30;

export function TrialAppModal() {
  const { isTrial, profile } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [canClose, setCanClose] = useState(false);

  // Abrir modal quando o usuário for trial e tiver passado o cooldown
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if (!profile || !isTrial) {
      setIsOpen(false);
      return;
    }

    // Verificar se pode abrir a modal (30 minutos após fechar)
    const closedAt = localStorage.getItem(STORAGE_KEY);
    if (!closedAt) {
      // Nunca foi fechada, pode abrir
      setIsOpen(true);
      return;
    }

    const closedTimestamp = parseInt(closedAt, 10);
    const now = Date.now();
    const minutesSinceClosed = (now - closedTimestamp) / (1000 * 60);

    // Só abre se passaram 30 minutos
    if (minutesSinceClosed >= COOLDOWN_MINUTES) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [profile, isTrial]);

  // Timer decrescente de 5 segundos na última etapa
  useEffect(() => {
    if (currentStep === 2 && isOpen) {
      setCanClose(false);
      setTimeRemaining(5);
      
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCanClose(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanClose(true);
      setTimeRemaining(0);
    }
  }, [currentStep, isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    // Salvar timestamp no localStorage quando fechar
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
    
    setIsOpen(false);
    setCurrentStep(0);
    setTimeRemaining(5);
    setCanClose(false);
  };


  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-[6px] p-4 animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto max-h-[95vh] rounded-3xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 overflow-hidden flex flex-col">
        {/* Gradiente de fundo usando cores do sistema */}
        <div
          className="w-full flex-1 overflow-y-auto"
          style={{
            background: "linear-gradient(to bottom, #4A4A4B 0%, #444444 25%, #3a3a3a 50%, #2a2a2a 75%, #1a1a1a 90%, #000000 100%)",
          }}
        >
          {/* Conteúdo da modal */}
          <div className="flex flex-col items-center px-5 py-6 pb-8">
            {/* Imagem no topo - todas as steps */}
            <div className="relative mb-4 w-[55%] max-w-[200px] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={stepImages[currentStep]}
                alt={currentStepData.title}
                width={240}
                height={0}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            {/* Título */}
            <div className="mt-2 mb-3 w-full px-2">
              {currentStep === 0 ? (
                <h2 className="text-center text-2xl leading-8 text-white">
                  <span className="font-normal">BAIXE O</span>{" "}
                  <span className="font-bold">APP</span>
                </h2>
              ) : currentStep === 1 ? (
                <h2 className="text-center text-2xl leading-8 text-white">
                  <span className="font-normal">FUNCIONALIDADES</span>{" "}
                  <span className="font-bold">MOBILE</span>
                </h2>
              ) : (
                <h2 className="text-center text-2xl leading-8 text-white">
                  <span className="font-normal">COMECE</span>{" "}
                  <span className="font-bold">AGORA</span>
                </h2>
              )}
            </div>

            {/* Texto */}
            <p className="mb-4 text-center text-base leading-6 text-white px-2">
              {currentStepData.text}
            </p>

            {/* Indicador de passos */}
            <div className="mb-6 flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "w-8 bg-white"
                      : index < currentStep
                        ? "w-2 bg-stone-400"
                        : "w-2 bg-white/30"
                  )}
                />
              ))}
            </div>

            {/* Botões */}
            {isLastStep ? (
              <div className="w-full space-y-3 pb-2">
                <div className="flex w-full flex-col gap-4 sm:flex-row">
                  <a
                    href={appleStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-1 items-center justify-center gap-3 rounded-xl border border-white/30 bg-white px-6 py-4 font-bold text-stone-800 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <span>Baixar na App Store</span>
                  </a>
                  <a
                    href={googlePlayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-1 items-center justify-center gap-3 rounded-xl bg-stone-800 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-stone-700 hover:scale-105 active:scale-95"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <span>Google Play</span>
                  </a>
                </div>

                {/* Timer e botão "Começar a utilizar" */}
                {!canClose ? (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-white">
                      Aguarde <span className="font-bold">{timeRemaining}s</span> para continuar
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleClose}
                    className="flex w-full items-center justify-center rounded-xl bg-white px-6 py-4 font-bold text-stone-800 shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    Começar a utilizar
                  </button>
                )}
              </div>
            ) : currentStep === 0 ? (
              // Step 1: apenas botão Continuar
              <button
                onClick={handleNext}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-stone-800 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-stone-700 hover:scale-105 active:scale-95"
              >
                <span>Continuar</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              // Step 2: botão Voltar e Continuar
              <div className="flex w-full gap-3">
                <button
                  onClick={handlePrevious}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-6 py-4 font-semibold text-stone-800 transition-all hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={handleNext}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-800 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-stone-700 hover:scale-105 active:scale-95"
                >
                  <span>Continuar</span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}
