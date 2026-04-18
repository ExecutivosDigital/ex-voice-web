"use client";

import { useApiContext } from "@/context/ApiContext";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Crown,
  Headphones,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Plan {
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

type BillingCycle = "MONTHLY" | "YEARLY";
type PaymentMethod = "PIX" | "CREDIT";

interface PlanPreset {
  displayName: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  features: { text: string; highlight?: boolean }[];
  featured?: boolean;
  tag?: string;
}

const PLAN_PRESETS: PlanPreset[] = [
  {
    displayName: "Autônomo",
    subtitle: "Para profissionais independentes",
    icon: Headphones,
    features: [
      { text: "Gravação ilimitada", highlight: true },
      { text: "150h de transcrição / mês" },
      { text: "5h de transcrição / dia" },
      { text: "Resumos básicos com IA" },
      { text: "Suporte comunitário" },
    ],
  },
  {
    displayName: "Ultra",
    subtitle: "Mais escolhido",
    icon: Crown,
    featured: true,
    tag: "Mais popular",
    features: [
      { text: "Gravação 100% ilimitada", highlight: true },
      { text: "Transcrição 100% ilimitada", highlight: true },
      { text: "Insights avançados com IA" },
      { text: "Diarização de falantes" },
      { text: "Personalizar ou treinar IA" },
      { text: "Suporte prioritário" },
      { text: "Exportação avançada" },
    ],
  },
  {
    displayName: "Corporativo",
    subtitle: "Para equipes e empresas",
    icon: Users,
    features: [
      { text: "Pool de horas compartilhado", highlight: true },
      { text: "Gravação ilimitada por usuário" },
      { text: "5h de transcrição / dia por usuário" },
      { text: "Treinar IA com base de conhecimento" },
      { text: "Gerente de conta dedicado" },
      { text: "SLA e suporte 24/7" },
    ],
  },
];

const UNLIMITED_THRESHOLD = 720;

function fmtBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

function getPlanPrice(
  plan: Plan,
  cycle: BillingCycle,
  method: PaymentMethod,
): number {
  if (method === "CREDIT") {
    if (cycle === "YEARLY")
      return plan.creditYearlyPrice ?? (plan.creditMonthlyPrice ?? 0) * 12;
    return plan.creditMonthlyPrice ?? plan.creditPrice ?? 0;
  }
  if (cycle === "YEARLY")
    return plan.pixYearlyPrice ?? (plan.pixPrice ?? 0) * 12;
  return plan.pixMonthlyPrice ?? plan.pixPrice ?? 0;
}

function getMonthlyHours(plan: Plan): number | null {
  if (plan.monthlyRecordAvailable != null) return plan.monthlyRecordAvailable;
  if (plan.dailyRecordAvailable != null)
    return Math.round((plan.dailyRecordAvailable * 30) / 3600);
  return null;
}

function getRecordLabel(plan: Plan): string {
  const h = getMonthlyHours(plan);
  if (h != null && h >= UNLIMITED_THRESHOLD) return "Uso ilimitado";
  if (h != null) return `${h}h por mês`;
  return "Gravação incluída";
}

function getPresetFor(plan: Plan, index: number): PlanPreset {
  const byName = PLAN_PRESETS.find((p) =>
    plan.name?.toLowerCase().includes(p.displayName.toLowerCase()),
  );
  return byName ?? PLAN_PRESETS[index % PLAN_PRESETS.length];
}

export default function MinimalPlansPage() {
  const { GetAPI } = useApiContext();
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cycle, setCycle] = useState<BillingCycle>("MONTHLY");
  const [method, setMethod] = useState<PaymentMethod>("PIX");

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await GetAPI("/signature-plan/channel/WEB", true);
      if (res.status === 200 && res.body?.plans) {
        setPlans(res.body.plans as Plan[]);
      }
    } catch {
      console.error("Erro ao buscar planos");
    } finally {
      setIsLoading(false);
    }
  }, [GetAPI]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const yearlySavings = useMemo(() => {
    if (!plans.length) return 0;
    const first = plans[0];
    const monthly = getPlanPrice(first, "MONTHLY", method);
    const yearly = getPlanPrice(first, "YEARLY", method);
    if (!monthly || !yearly) return 0;
    return Math.max(0, Math.round((1 - yearly / (monthly * 12)) * 100));
  }, [plans, method]);

  return (
    <div className="flex w-full flex-col gap-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-3"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Assinatura
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h1 className="text-balance text-3xl font-semibold text-gray-900 md:text-5xl">
            Escolha o seu{" "}
            <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
              plano
            </span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-gray-500">
            Ative recursos de IA, desbloqueie horas de transcrição e personalize
            a forma como você trabalha.
          </p>
        </div>
      </motion.section>

      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex items-center gap-1 self-start rounded-full border border-gray-200/70 bg-white/70 p-1 backdrop-blur-md">
          {(["MONTHLY", "YEARLY"] as BillingCycle[]).map((c) => {
            const active = cycle === c;
            return (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "text-white" : "text-gray-600 hover:text-gray-900",
                )}
              >
                {active && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)]" />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  {c === "MONTHLY" ? "Mensal" : "Anual"}
                  {c === "YEARLY" && yearlySavings > 0 && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 text-emerald-700",
                      )}
                    >
                      -{yearlySavings}%
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {(["PIX", "CREDIT"] as PaymentMethod[]).map((m) => {
            const active = method === m;
            return (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                  active
                    ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-sm"
                    : "bg-white/60 text-gray-600 ring-1 ring-gray-200 backdrop-blur-sm hover:bg-white",
                )}
              >
                {m === "PIX" ? "PIX" : "Cartão"}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        {isLoading ? (
          <SkeletonGrid />
        ) : plans.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {plans.map((plan, i) => {
                const preset = getPresetFor(plan, i);
                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    preset={preset}
                    cycle={cycle}
                    method={method}
                    index={i}
                    onSelect={() =>
                      router.push(
                        `/new-home/plans/checkout?planId=${plan.id}&cycle=${cycle}&method=${method}`,
                      )
                    }
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      <section className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-10 text-center backdrop-blur-sm md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-md">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Pagamento seguro e cancelamento a qualquer momento
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Troque de plano ou cancele sem burocracia. Sem contratos longos.
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/5541997819114"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Falar com um especialista
          <ArrowRight size={12} />
        </a>
      </section>
    </div>
  );
}

function PlanCard({
  plan,
  preset,
  cycle,
  method,
  index,
  onSelect,
}: {
  plan: Plan;
  preset: PlanPreset;
  cycle: BillingCycle;
  method: PaymentMethod;
  index: number;
  onSelect: () => void;
}) {
  const Icon = preset.icon;
  const price = getPlanPrice(plan, cycle, method);
  const monthlyEquivalent = cycle === "YEARLY" ? price / 12 : price;
  const recordLabel = getRecordLabel(plan);
  const featured = preset.featured;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-3xl border p-6 text-left transition",
        featured
          ? "border-transparent bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white shadow-[0_20px_50px_-20px_rgba(17,24,39,0.6)]"
          : "border-gray-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-gray-300 hover:shadow-[0_14px_40px_-20px_rgba(15,23,42,0.3)]",
      )}
    >
      {featured && (
        <>
          <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-amber-400/30 via-orange-500/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-transparent blur-3xl" />
        </>
      )}
      {!featured && (
        <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 transition-transform duration-500 group-hover:scale-x-100" />
      )}

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            featured
              ? "bg-white/10 text-white ring-1 ring-white/20"
              : "bg-gradient-to-br from-gray-900 to-gray-700 text-white",
          )}
        >
          <Icon size={18} />
        </div>
        {preset.tag && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase",
              featured
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_4px_14px_-4px_rgba(245,158,11,0.65)]"
                : "bg-gray-900 text-white",
            )}
          >
            <Sparkles size={10} />
            {preset.tag}
          </span>
        )}
      </div>

      <div className="relative">
        <h3
          className={cn(
            "text-xl font-semibold",
            featured ? "text-white" : "text-gray-900",
          )}
        >
          {preset.displayName}
        </h3>
        <p
          className={cn(
            "mt-1 text-sm",
            featured ? "text-white/60" : "text-gray-500",
          )}
        >
          {preset.subtitle}
        </p>
      </div>

      <div className="relative">
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "text-4xl font-semibold tracking-tight",
              featured ? "text-white" : "text-gray-900",
            )}
          >
            {price ? fmtBRL(monthlyEquivalent) : "—"}
          </span>
          <span
            className={cn(
              "text-sm",
              featured ? "text-white/50" : "text-gray-400",
            )}
          >
            /mês
          </span>
        </div>
        <p
          className={cn(
            "mt-1 text-xs",
            featured ? "text-white/50" : "text-gray-500",
          )}
        >
          {cycle === "YEARLY"
            ? `${fmtBRL(price)} cobrado anualmente`
            : method === "PIX"
              ? "via PIX, cobrado mensalmente"
              : "no cartão, cobrado mensalmente"}
        </p>
      </div>

      <div
        className={cn(
          "relative h-px w-full",
          featured ? "bg-white/10" : "bg-gray-100",
        )}
      />

      <div className="relative flex items-center gap-2">
        <Zap
          size={14}
          className={featured ? "text-amber-300" : "text-gray-700"}
        />
        <span
          className={cn(
            "text-xs font-semibold tracking-wide uppercase",
            featured ? "text-white/80" : "text-gray-700",
          )}
        >
          {recordLabel}
        </span>
      </div>

      <ul className="relative flex flex-col gap-2.5">
        {preset.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                featured
                  ? f.highlight
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                    : "bg-white/10 text-white"
                  : f.highlight
                    ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white"
                    : "bg-gray-100 text-gray-700",
              )}
            >
              <Check size={10} strokeWidth={3} />
            </span>
            <span
              className={cn(
                "text-sm leading-relaxed",
                featured
                  ? f.highlight
                    ? "font-medium text-white"
                    : "text-white/70"
                  : f.highlight
                    ? "font-medium text-gray-900"
                    : "text-gray-600",
              )}
            >
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={cn(
          "relative mt-auto inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition",
          featured
            ? "bg-white text-gray-900 shadow-lg shadow-black/20 hover:scale-[1.02]"
            : "bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg shadow-gray-900/20 hover:scale-[1.02]",
        )}
      >
        Assinar {preset.displayName}
        <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex h-[520px] animate-pulse flex-col gap-4 rounded-3xl border border-gray-200/60 bg-white/60 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 rounded-2xl bg-gray-100" />
            <div className="h-5 w-20 rounded-full bg-gray-100" />
          </div>
          <div className="h-5 w-2/3 rounded-full bg-gray-100" />
          <div className="h-3 w-1/2 rounded-full bg-gray-100" />
          <div className="mt-2 h-10 w-1/2 rounded-full bg-gray-100" />
          <div className="mt-2 flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className="h-3 w-full rounded-full bg-gray-100"
              />
            ))}
          </div>
          <div className="mt-auto h-10 w-full rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
        <Sparkles size={26} />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        Nenhum plano disponível
      </h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        Tivemos um problema para carregar os planos. Tente novamente em alguns
        instantes.
      </p>
    </div>
  );
}
