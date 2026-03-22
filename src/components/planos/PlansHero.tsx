"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type PlansHeroProps = {
  /** Exibe o link de WhatsApp institucional (desligado na área logada por padrão). */
  showWhatsappCta?: boolean;
  className?: string;
};

export default function PlansHero({
  showWhatsappCta = false,
  className,
}: PlansHeroProps) {
  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-black pt-36 pb-16 md:pt-44 md:pb-20",
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[100px]" />
        <div className="absolute top-1/2 right-0 h-[350px] w-[350px] rounded-full bg-amber-600/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url('https://transparenttextures.com/patterns/carbon-fibre.png')",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-bold tracking-widest text-blue-100 uppercase">
            Planos & Preços
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mb-8 max-w-6xl text-4xl font-semibold tracking-tighter text-white md:text-6xl lg:text-7xl"
        >
          O Plano Certo Para Cada <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            Forma de Trabalhar.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-neutral-400 md:text-xl"
        >
          Do uso pessoal ao enterprise, escolha o plano que se adapta à sua
          rotina.{" "}
          <span className="font-medium text-white">Sem custos ocultos, sem surpresas.</span>
        </motion.p>

        {showWhatsappCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a
              href="https://api.whatsapp.com/send/?phone=5541997819114&text=Ola%2C+desejo+falar+com+Especialista+da+ExVoice&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
            >
              Falar com Especialista
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
