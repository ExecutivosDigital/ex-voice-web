"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  Building2,
  Check,
  CreditCard,
  Crown,
  Loader2,
  QrCode,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type BillingCycle = "MONTHLY" | "YEARLY";

/** Campos usados da API de planos (alinhado a `page.tsx`). */
export interface PlanCardData {
  id: string;
  name: string;
  description: string;
  pixMonthlyPrice?: number;
  pixYearlyPrice?: number;
  pixPrice?: number;
  creditMonthlyPrice?: number;
  creditYearlyPrice?: number;
  creditPrice?: number;
  dailyRecordAvailable?: number;
  monthlyRecordAvailable?: number;
}

type Theme = {
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  accentGlow: string;
  highlight: boolean;
  tag?: string;
  badge?: string;
  topLine: "amber" | "emerald" | "blue" | "white";
  Icon: LucideIcon;
};

function getPlanTheme(name: string): Theme {
  const n = name.toLowerCase();
  if (n.includes("ultra")) {
    return {
      accentColor: "text-amber-400",
      accentBg: "bg-amber-500/10",
      accentBorder: "border-amber-500/30",
      accentGlow: "shadow-[0_0_80px_-15px_rgba(245,158,11,0.15)]",
      highlight: true,
      tag: "Mais Popular",
      topLine: "amber",
      Icon: Crown,
    };
  }
  if (n.includes("empresa") || n.includes("corporativ") || n.includes("enterprise")) {
    return {
      accentColor: "text-emerald-400",
      accentBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/20",
      accentGlow: "",
      highlight: false,
      badge: "Para equipes",
      topLine: "emerald",
      Icon: Building2,
    };
  }
  if (n.includes("pro")) {
    return {
      accentColor: "text-blue-400",
      accentBg: "bg-blue-500/10",
      accentBorder: "border-blue-500/20",
      accentGlow: "",
      highlight: false,
      topLine: "blue",
      Icon: Star,
    };
  }
  return {
    accentColor: "text-neutral-400",
    accentBg: "bg-neutral-500/10",
    accentBorder: "border-neutral-500/20",
    accentGlow: "",
    highlight: false,
    topLine: "white",
    Icon: Zap,
  };
}

function topLineClass(top: Theme["topLine"]): string {
  if (top === "amber") return "via-amber-500/50";
  if (top === "emerald") return "via-emerald-500/30";
  if (top === "blue") return "via-blue-500/30";
  return "via-white/10";
}

type PlanFeature = { text: string; included: boolean; highlight?: boolean };

function getPlanFeatures(name: string): PlanFeature[] {
  const n = name.toLowerCase();
  if (n.includes("ultra")) {
    return [
      { text: "Gravação 100% ilimitada", included: true, highlight: true },
      { text: "Transcrição 100% ilimitada", included: true, highlight: true },
      { text: "Resumos executivos por IA", included: true },
      { text: "Diarização avançada", included: true },
      { text: "Personalizar e treinar a IA", included: true, highlight: true },
      { text: "Suporte prioritário", included: true },
      { text: "Exportação avançada", included: true },
    ];
  }
  if (n.includes("empresa") || n.includes("corporativ") || n.includes("enterprise")) {
    return [
      { text: "Pool de Horas inteligente", included: true, highlight: true },
      { text: "Gravação ilimitada por usuário", included: true },
      { text: "5h transcrição/dia por usuário", included: true },
      { text: "Banco de horas compartilhado", included: true, highlight: true },
      { text: "Personalizar e treinar a IA", included: true },
      { text: "Gerente de conta dedicado", included: true },
      { text: "SLA e suporte 24/7", included: true },
    ];
  }
  if (n.includes("pro")) {
    return [
      { text: "Gravação ilimitada", included: true, highlight: true },
      { text: "5 horas de transcrição/dia", included: true, highlight: true },
      { text: "Resumos executivos por IA", included: true },
      { text: "Diarização de falantes", included: true },
      { text: "Suporte por e-mail", included: true },
      { text: "Personalizar ou treinar a IA", included: false },
      { text: "Pool de horas", included: false },
    ];
  }
  return [
    { text: "Gravação ilimitada", included: true },
    { text: "Resumos por IA", included: true },
    { text: "Suporte dedicado", included: true },
  ];
}

function getPlanSubtitle(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("ultra")) return "Ilimitado";
  if (n.includes("empresa") || n.includes("corporativ") || n.includes("enterprise")) return "Corporativo";
  if (n.includes("pro")) return "Ilimitado";
  return "Individual";
}

export type InstitutionalPlanCardsProps = {
  plans: PlanCardData[];
  selectedPlanId: string | null;
  onSelectPlan: (id: string) => void;
  billingCycle: BillingCycle;
  loading?: boolean;
  getPlanPixPrice: (plan: PlanCardData, cycle: BillingCycle) => number;
  getPlanCreditPrice: (plan: PlanCardData, cycle: BillingCycle) => number;
  fmtBRL: (v: number) => string;
  getRecordLabel: (plan: PlanCardData) => string;
};

export function InstitutionalPlanCards({
  plans,
  selectedPlanId,
  onSelectPlan,
  billingCycle,
  loading,
  getPlanPixPrice,
  getPlanCreditPrice,
  fmtBRL,
  getRecordLabel,
}: InstitutionalPlanCardsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-black py-10 font-sans md:py-14">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full bg-blue-900/15 opacity-40 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-purple-900/10 opacity-30 blur-[120px]" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-amber-900/10 opacity-20 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1536px] px-4 sm:px-6">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
          {plans.map((plan, index) => {
            const theme = getPlanTheme(plan.name);
            const Icon = theme.Icon;
            const isSelected = selectedPlanId === plan.id;
            const price = getPlanCreditPrice(plan, billingCycle);
            const pixPrice = getPlanPixPrice(plan, billingCycle);
            const features = getPlanFeatures(plan.name);
            const subtitle = getPlanSubtitle(plan.name);

            const isConsultation =
              pixPrice <= 0 &&
              price <= 0 &&
              (plan.name.toLowerCase().includes("empresa") ||
                plan.name.toLowerCase().includes("consulta"));

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group relative h-full"
              >
                <motion.button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectPlan(plan.id)}
                  className={cn(
                    "relative h-full w-full text-left",
                    "flex flex-col rounded-[2rem] border backdrop-blur-sm transition-all duration-500",
                    theme.highlight
                      ? cn(
                          "bg-gradient-to-b from-amber-950/30 via-[#0a0e1a] to-[#060a14] scale-[1.02] xl:scale-105",
                          theme.accentBorder,
                          theme.accentGlow,
                        )
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]",
                    isSelected && "ring-2 ring-white/25 ring-offset-2 ring-offset-black",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0 right-8 left-8 h-[1px] bg-gradient-to-r from-transparent to-transparent",
                      topLineClass(theme.topLine),
                    )}
                  />

                  {theme.tag && (
                    <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-1.5 text-[10px] font-bold tracking-[0.15em] text-white uppercase shadow-lg shadow-amber-900/40 whitespace-nowrap">
                        <Crown size={10} />
                        {theme.tag}
                      </span>
                    </div>
                  )}

                  {theme.badge && (
                    <div className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-1.5 text-[10px] font-bold tracking-[0.15em] text-white uppercase shadow-lg shadow-emerald-900/40 whitespace-nowrap">
                        <Users size={10} />
                        {theme.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex h-full flex-col p-7 sm:p-8">
                    <div className="mb-6 flex items-start justify-between pt-1">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={cn(
                              "text-base font-bold tracking-[0.1em] uppercase sm:text-lg",
                              theme.accentColor,
                            )}
                          >
                            {plan.name}
                          </h3>
                        </div>
                        {subtitle && (
                          <p className="text-xs text-neutral-500 font-medium mb-4">
                            {subtitle}
                          </p>
                        )}
                        <div className="mb-4 flex items-baseline gap-1.5">
                          {isConsultation ? (
                            <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                              Sob consulta
                            </span>
                          ) : billingCycle === "YEARLY" ? (
                            <>
                              <span className="text-sm font-semibold text-neutral-500">
                                12x de
                              </span>
                              <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                {fmtBRL(
                                  (pixPrice > 0 ? pixPrice : price) / 12,
                                )}
                              </span>
                              {pixPrice > 0 && pixPrice < price && (
                                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F7CE46] to-[#FFCC00] px-2 py-0.5 text-[10px] font-bold text-black">
                                  <QrCode className="h-2.5 w-2.5" /> PIX
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                {fmtBRL(
                                  pixPrice > 0 ? pixPrice : price,
                                )}
                              </span>
                              {pixPrice > 0 && pixPrice < price && (
                                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#F7CE46] to-[#FFCC00] px-2 py-0.5 text-[10px] font-bold text-black">
                                  <QrCode className="h-2.5 w-2.5" /> PIX
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        {!isConsultation &&
                          pixPrice > 0 &&
                          pixPrice < price && (
                            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-neutral-400">
                              <CreditCard className="h-3 w-3" />
                              {billingCycle === "YEARLY"
                                ? `12x de ${fmtBRL(price / 12)}`
                                : fmtBRL(price)}{" "}
                              no cartão
                            </div>
                          )}
                      </div>

                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:scale-110",
                          theme.accentBg,
                          theme.accentBorder,
                        )}
                      >
                        <Icon
                          size={20}
                          className={theme.accentColor}
                          strokeWidth={1.8}
                        />
                      </div>
                    </div>

                    {plan.description?.trim() && (
                      <p className="mb-7 min-h-[44px] text-[13px] leading-relaxed font-light text-neutral-400">
                        {plan.description.trim()}
                      </p>
                    )}

                    <div className="mb-7 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                    <ul className="mb-8 flex-grow space-y-3.5">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          {feature.included ? (
                            <div
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors duration-300",
                                feature.highlight
                                  ? cn(theme.accentBg, "border", theme.accentBorder)
                                  : "border border-white/[0.06] bg-white/[0.04]",
                              )}
                            >
                              <Check
                                size={11}
                                strokeWidth={2.5}
                                className={feature.highlight ? theme.accentColor : "text-neutral-400"}
                              />
                            </div>
                          ) : (
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/[0.04] bg-white/[0.02]">
                              <X size={10} className="text-neutral-700" />
                            </div>
                          )}
                          <span
                            className={cn(
                              "text-[13px] leading-snug",
                              feature.included
                                ? feature.highlight
                                  ? "font-medium text-white"
                                  : "font-light text-neutral-300"
                                : "font-light text-neutral-600",
                            )}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                      <span className="text-xs font-medium text-neutral-500">
                        {isSelected ? "Plano selecionado" : "Toque para selecionar"}
                      </span>
                      {isSelected ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                          <Check className="h-4 w-4 text-black" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-white/20" />
                      )}
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
