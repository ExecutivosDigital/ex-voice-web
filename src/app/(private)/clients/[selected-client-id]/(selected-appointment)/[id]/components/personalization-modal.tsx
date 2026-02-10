"use client";

import { cn } from "@/utils/cn";
import { ChevronRight, ChevronLeft, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StepContent {
  title: string;
  text: string;
}

const steps: StepContent[] = [
  {
    title: "PERSONALIZE A INTELIGÊNCIA DA SUA IA !",
    text: "Defina como nossa IA deve interpretar suas reuniões",
  },
  {
    title: "O QUE NOSSA IA GERA ?",
    text: "Decisões Irrevogáveis, Análises de Risco, Planos de Ação e muito mais !",
  },
  {
    title: "PERSONALIZE SUA IA AGORA",
    text: "Nossa tecnologia adaptativa aprende seus termos técnicos e padrões de governança.",
  },
];

// Imagens para cada step
const stepImages = [
  "/modal/perso1.png",
  "/modal/perso2.png",
  "/modal/perso3.png",
];

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "resumo" | "prontuario";
}

const WHATSAPP_LINK = "https://api.whatsapp.com/send/?phone=5541997819114&text&type=phone_number&app_absent=0";

export function PersonalizationModal({ isOpen, onClose, type }: PersonalizationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  // Resetar para o primeiro passo quando abrir
  useEffect(() => {
    if (isOpen && !hasSeenModal) {
      setCurrentStep(0);
      setHasSeenModal(true);
    }
  }, [isOpen, hasSeenModal]);

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
    onClose();
    // Resetar para o primeiro passo quando fechar
    setCurrentStep(0);
  };

  const handleWhatsAppClick = () => {
    const message = type === "resumo" 
      ? "Olá! Gostaria de personalizar meus resumos gerais no Health Voice."
      : "Olá! Gostaria de personalizar meus prontuários médicos no Health Voice.";
    
    const whatsappUrl = `${WHATSAPP_LINK}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    handleClose();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-[6px] p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
        {/* Gradiente de fundo azul */}
        <div
          className="w-full"
          style={{
            background: "linear-gradient(to bottom, #F4F4F4 0%, #E8F2FC 5%, #D1E6F8 10%, #B8D9F5 15%, #9BC9F0 20%, #7BB8ED 30%, #5AA5E8 45%, #3D92E3 65%, #0E78EC 100%)",
          }}
        >
          {/* Conteúdo da modal */}
          <div className="flex flex-col items-center px-5 py-10">
            {/* Imagem no topo - step 3 */}
            {isLastStep && (
              <div className="relative mb-6 w-[70%] max-w-[300px] aspect-[16/10] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={stepImages[currentStep]}
                  alt={currentStepData.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            {/* Imagem no topo - steps 1 e 2 */}
            {!isLastStep && (
              <div className="relative mb-6 w-[70%] max-w-[300px] aspect-[16/10] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={stepImages[currentStep]}
                  alt={currentStepData.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Título */}
            <div className="mt-2 mb-4 w-full px-2">
              {currentStep === 0 ? (
                <h2 className="text-center text-2xl leading-8 text-white whitespace-pre-line">
                  <span className="font-normal">PERSONALIZE A</span>{"\n"}
                  <span className="font-bold">INTELIGÊNCIA</span>{" "}
                  <span className="font-normal">DA SUA</span>{" "}
                  <span className="font-bold">IA</span> !
                </h2>
              ) : currentStep === 1 ? (
                <h2 className="text-center text-2xl leading-8 text-white">
                  <span className="font-normal">O QUE NOSSA</span>{" "}
                  <span className="font-bold">IA GERA</span> ?
                </h2>
              ) : (
                <h2 className="text-center text-2xl leading-8 text-white">
                  <span className="font-normal">PERSONALIZE SUA</span>{" "}
                  <span className="font-bold">IA AGORA</span>
                </h2>
              )}
            </div>

            {/* Texto */}
            <p className="mb-6 text-center text-base leading-6 text-white px-2">
              {currentStepData.text}
            </p>

            {/* Indicador de passos */}
            <div className="mb-8 flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "w-8 bg-white"
                      : index < currentStep
                        ? "w-2 bg-blue-300"
                        : "w-2 bg-white/30"
                  )}
                />
              ))}
            </div>

            {/* Botões */}
            {isLastStep ? (
              <div className="w-full">
                <button
                  onClick={handleWhatsAppClick}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#1E40AF] px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Fale Conosco</span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={handleClose}
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-white px-6 py-4 font-bold text-[#1E40AF] shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  Fechar
                </button>
              </div>
            ) : currentStep === 0 ? (
              // Step 1: apenas botão Continuar
              <button
                onClick={handleNext}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E40AF] px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span>Continuar</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              // Step 2: botão Voltar e Continuar
              <div className="flex w-full gap-3">
                <button
                  onClick={handlePrevious}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-6 py-4 font-semibold text-[#1E40AF] transition-all hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={handleNext}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E40AF] px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
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
}
