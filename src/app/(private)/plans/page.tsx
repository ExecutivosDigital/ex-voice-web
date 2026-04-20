"use client";

import { useApiContext } from "@/context/ApiContext";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Crown,
  Headphones,
  Minus,
  Quote,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
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
  tagline: string;
}

const PLAN_PRESETS: PlanPreset[] = [
  {
    displayName: "Autônomo",
    subtitle: "Para profissionais independentes",
    tagline: "Comece leve, cresça no seu tempo.",
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
    tagline: "Tudo sem limite. Sem fricção.",
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
    tagline: "Seu time com IA em conjunto.",
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

const COMPARISON_ROWS: {
  label: string;
  values: [string | boolean, string | boolean, string | boolean];
}[] = [
  {
    label: "Gravação de reuniões",
    values: ["Ilimitada", "Ilimitada", "Ilimitada"],
  },
  {
    label: "Transcrição por mês",
    values: ["150h", "Ilimitada", "Pool compartilhado"],
  },
  { label: "Resumos com IA", values: [true, true, true] },
  { label: "Insights avançados", values: [false, true, true] },
  { label: "Diarização de falantes", values: [false, true, true] },
  { label: "Treinar IA própria", values: [false, true, true] },
  { label: "Exportação avançada", values: [false, true, true] },
  { label: "Gerente dedicado", values: [false, false, true] },
  { label: "SLA 24/7", values: [false, false, true] },
];

const TESTIMONIALS = [
  {
    quote:
      "Em duas semanas, economizei pelo menos 8 horas por mês só em anotações. A transcrição é absurdamente precisa.",
    author: "Mariana Lopes",
    role: "Psicóloga clínica",
    rating: 5,
  },
  {
    quote:
      "Finalmente posso focar no cliente durante a reunião. O resumo chega pronto e já entro na próxima com tudo organizado.",
    author: "Rafael Moretti",
    role: "Consultor financeiro",
    rating: 5,
  },
  {
    quote:
      "Nosso time inteiro migrou e o ganho foi imediato: reuniões mais produtivas, decisões mais rápidas, histórico impecável.",
    author: "Fernanda Castro",
    role: "Head de Operações · Nuvya",
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    q: "Posso trocar de plano a qualquer momento?",
    a: "Sim. Você pode fazer upgrade ou downgrade quando quiser. Cobramos apenas a diferença proporcional, sem letra miúda.",
  },
  {
    q: "Como funciona o cancelamento?",
    a: "Cancelamento 100% online, em um clique, sem multas ou burocracia. Você mantém o acesso até o fim do período já pago.",
  },
  {
    q: "Meus dados e reuniões ficam seguros?",
    a: "Sim. Criptografia de ponta em repouso e em trânsito, conformidade com LGPD e isolamento completo entre contas.",
  },
  {
    q: "Qual a diferença entre PIX e cartão?",
    a: "PIX oferece o melhor preço, cobrado no ciclo escolhido. Cartão tem renovação automática e também pode ser anual.",
  },
  {
    q: "Tem período de teste?",
    a: "Todos os planos têm garantia de satisfação: se não gostar nos primeiros 7 dias, devolvemos 100% do valor.",
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

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function MinimalPlansPage() {
  const { GetAPI } = useApiContext();
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cycle, setCycle] = useState<BillingCycle>("YEARLY");
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

  const orderedPlans = useMemo(() => {
    if (!plans.length) return [] as Plan[];
    const featured = plans.find((p) => p.name?.toLowerCase().includes("ultra"));
    if (!featured) return plans;
    const rest = plans.filter((p) => p.id !== featured.id);
    if (plans.length === 2) {
      return [rest[0], featured].filter(Boolean) as Plan[];
    }
    return [rest[0], featured, rest[1]].filter(Boolean) as Plan[];
  }, [plans]);

  return (
    <div className="flex w-full flex-col gap-14">
      <Hero />

      <BillingBar
        cycle={cycle}
        method={method}
        onCycleChange={setCycle}
        onMethodChange={setMethod}
        yearlySavings={yearlySavings}
      />

      <section>
        {isLoading ? (
          <SkeletonGrid />
        ) : orderedPlans.length === 0 ? (
          <EmptyState />
        ) : orderedPlans.length === 2 ? (
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.15fr)_minmax(0,1.15fr)] lg:gap-6">
            <ValuePanel cycle={cycle} yearlySavings={yearlySavings} />
            <AnimatePresence mode="popLayout">
              {orderedPlans.map((plan, i) => {
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
                        `/plans/checkout?planId=${plan.id}&cycle=${cycle}&method=${method}`,
                      )
                    }
                  />
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            <AnimatePresence mode="popLayout">
              {orderedPlans.map((plan, i) => {
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
                        `/plans/checkout?planId=${plan.id}&cycle=${cycle}&method=${method}`,
                      )
                    }
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      <TrustStrip />

      <ComparisonTable />

      <Testimonials />

      <FaqSection />

      <SecurityFooter />
    </div>
  );
}

function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium tracking-[0.18em] text-gray-400 uppercase">
          Assinatura
        </p>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-emerald-700 uppercase">
          <ShieldCheck size={10} />7 dias de garantia
        </span>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-balance text-gray-900 md:text-4xl">
            Escolha o plano que{" "}
            <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
              trabalha por você
            </span>
            .
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
            Ative recursos de IA, desbloqueie horas de transcrição e transforme
            cada reunião em conhecimento que fica. Cancele quando quiser.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="flex -space-x-1">
              {["MA", "RC", "FL"].map((s) => (
                <span
                  key={s}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-gray-900 to-gray-600 text-[9px] font-semibold text-white"
                >
                  {s}
                </span>
              ))}
            </span>
            <span>
              <span className="font-semibold text-gray-800">10.000+</span>{" "}
              profissionais ativos
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className="fill-amber-400 text-amber-400"
              />
            ))}
            <span className="ml-1 font-semibold text-gray-800">4.9</span>
            <span>/ 5</span>
          </span>
        </div>
      </div>
    </motion.section>
  );
}

function BillingBar({
  cycle,
  method,
  onCycleChange,
  onMethodChange,
  yearlySavings,
}: {
  cycle: BillingCycle;
  method: PaymentMethod;
  onCycleChange: (c: BillingCycle) => void;
  onMethodChange: (m: PaymentMethod) => void;
  yearlySavings: number;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-gray-200/70 bg-white/70 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Ciclo
        </p>
        <div className="inline-flex items-center gap-1 rounded-full border border-gray-200/70 bg-gray-50/80 p-1">
          {(["MONTHLY", "YEARLY"] as BillingCycle[]).map((c) => {
            const active = cycle === c;
            return (
              <button
                key={c}
                onClick={() => onCycleChange(c)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "text-white" : "text-gray-600 hover:text-gray-900",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="cycle-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  {c === "MONTHLY" ? "Mensal" : "Anual"}
                  {c === "YEARLY" && yearlySavings > 0 && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100 text-emerald-700",
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
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Pagamento
        </p>
        <div className="inline-flex items-center gap-1 rounded-full border border-gray-200/70 bg-gray-50/80 p-1">
          {(["PIX", "CREDIT"] as PaymentMethod[]).map((m) => {
            const active = method === m;
            return (
              <button
                key={m}
                onClick={() => onMethodChange(m)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "text-white" : "text-gray-600 hover:text-gray-900",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="method-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {m === "PIX" ? "PIX" : "Cartão"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
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
  const monthlyReference = getPlanPrice(plan, "MONTHLY", method);
  const showStrike =
    cycle === "YEARLY" && monthlyReference > 0 && monthlyEquivalent > 0;
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
          ? "border-transparent bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white shadow-[0_24px_60px_-24px_rgba(17,24,39,0.7)] lg:-translate-y-2 lg:scale-[1.02]"
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
        <p
          className={cn(
            "mt-2 text-[11px] italic",
            featured ? "text-white/50" : "text-gray-400",
          )}
        >
          “{preset.tagline}”
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
          {showStrike && monthlyReference > monthlyEquivalent && (
            <span
              className={cn(
                "ml-1 text-xs line-through",
                featured ? "text-white/40" : "text-gray-400",
              )}
            >
              {fmtBRL(monthlyReference)}
            </span>
          )}
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

function ValuePanel({
  cycle,
  yearlySavings,
}: {
  cycle: BillingCycle;
  yearlySavings: number;
}) {
  const benefits = [
    { icon: Sparkles, text: "IA que resume e aponta decisões de cada reunião" },
    { icon: ShieldCheck, text: "Criptografia ponta a ponta, total LGPD" },
    { icon: Zap, text: "Ativação em segundos, sem setup" },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col gap-5 py-1 lg:border-l lg:border-dashed lg:border-gray-200 lg:pl-6"
    >
      <div className="flex items-center gap-2">
        <span className="h-px w-6 bg-gray-300" />
        <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Por que assinar
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-balance text-gray-900 md:text-xl">
          Mais tempo pensando.{" "}
          <span className="bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 bg-clip-text text-transparent">
            Menos tempo anotando.
          </span>
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">
          Qualquer plano já inclui o essencial — escolha pelo volume de uso.
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <li key={b.text} className="flex items-start gap-2.5">
              <Icon size={13} className="mt-1 shrink-0 text-gray-500" />
              <span className="text-[13px] leading-relaxed text-gray-700">
                {b.text}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent" />

      <figure className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-1 text-[11px] font-semibold text-gray-800">
            4.9
          </span>
          <span className="text-[11px] text-gray-400">· +2.400 reviews</span>
        </div>
        <blockquote className="text-[13px] leading-relaxed text-gray-700 italic">
          “Economizei 8 horas por mês só em anotações.”
        </blockquote>
        <figcaption className="text-[11px] text-gray-400">
          Mariana · Psicóloga clínica
        </figcaption>
      </figure>

      <div className="mt-auto inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
        <ShieldCheck size={12} />
        {cycle === "YEARLY" && yearlySavings > 0
          ? `Garantia 7 dias · até -${yearlySavings}% no anual`
          : "Garantia 7 dias · cancele em 1 clique"}
      </div>
    </motion.aside>
  );
}

function TrustStrip() {
  const items = [
    {
      label: "Garantia 7 dias",
      value: "100%",
      hint: "satisfação ou reembolso",
    },
    { label: "Ativação", value: "Instantânea", hint: "em segundos após pagar" },
    { label: "Segurança", value: "LGPD", hint: "criptografia ponta a ponta" },
    { label: "Suporte", value: "Rápido", hint: "especialista de verdade" },
  ];
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="flex flex-col rounded-2xl border border-gray-200/70 bg-white/70 px-4 py-3 backdrop-blur-sm"
        >
          <p className="text-[10px] font-semibold tracking-[0.28em] text-gray-400 uppercase">
            {it.label}
          </p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {it.value}
          </p>
          <p className="text-[11px] text-gray-500">{it.hint}</p>
        </div>
      ))}
    </section>
  );
}

function ComparisonTable() {
  const planNames = PLAN_PRESETS.map((p) => p.displayName) as [
    string,
    string,
    string,
  ];
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Compare
        </p>
        <h2 className="text-xl font-semibold text-balance text-gray-900 md:text-2xl">
          Todos os recursos, lado a lado.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-gray-500">
          Uma tabela simples para você decidir em segundos. Sem letra miúda.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/80 backdrop-blur-sm">
        <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
          <div className="px-5 py-3">Recurso</div>
          {planNames.map((name, i) => (
            <div
              key={name}
              className={cn(
                "px-4 py-3 text-center",
                i === 1 && "bg-gray-900 text-white",
              )}
            >
              {name}
              {i === 1 && (
                <Sparkles
                  size={11}
                  className="ml-1 inline-block text-amber-300"
                />
              )}
            </div>
          ))}
        </div>

        {COMPARISON_ROWS.map((row, idx) => (
          <div
            key={row.label}
            className={cn(
              "grid grid-cols-[1.4fr_repeat(3,1fr)] text-sm transition",
              idx % 2 === 1 ? "bg-white" : "bg-gray-50/40",
              "hover:bg-gray-50",
            )}
          >
            <div className="px-5 py-3 font-medium text-gray-800">
              {row.label}
            </div>
            {row.values.map((v, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-center px-4 py-3",
                  i === 1 && "bg-gray-900/[0.03]",
                )}
              >
                {typeof v === "boolean" ? (
                  v ? (
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full",
                        i === 1
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                          : "bg-gradient-to-br from-gray-900 to-gray-700 text-white",
                      )}
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    <Minus size={14} className="text-gray-300" />
                  )
                ) : (
                  <span className="text-xs font-semibold text-gray-700">
                    {v}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Depoimentos
        </p>
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <h2 className="text-xl font-semibold text-balance text-gray-900 md:text-2xl">
            Profissionais que já ganharam horas de volta.
          </h2>
          <div className="inline-flex items-center gap-1 text-[12px] text-gray-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className="fill-amber-400 text-amber-400"
              />
            ))}
            <span className="ml-1 font-semibold text-gray-800">4.9/5</span>
            <span>· +2.400 avaliações</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.article
            key={t.author}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.24) }}
            whileHover={{ y: -2 }}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-gray-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-gray-300 hover:shadow-[0_14px_40px_-20px_rgba(15,23,42,0.25)]"
          >
            <span className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 transition-transform duration-500 group-hover:scale-x-100" />
            <Quote
              size={22}
              className="absolute top-5 right-5 text-gray-200"
              aria-hidden
            />
            <div className="flex items-center gap-1">
              {Array.from({ length: t.rating }).map((_, si) => (
                <Star
                  key={si}
                  size={13}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-gray-700">“{t.quote}”</p>
            <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-xs font-semibold text-white">
                {getInitials(t.author)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {t.author}
                </p>
                <p className="truncate text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Perguntas frequentes
        </p>
        <h2 className="text-xl font-semibold text-balance text-gray-900 md:text-2xl">
          Ainda com dúvida? Bora resolver.
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={cn(
                "overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm transition",
                isOpen
                  ? "border-gray-300 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.25)]"
                  : "border-gray-200/70 hover:border-gray-300",
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {item.q}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-gray-500 transition-transform",
                    isOpen && "rotate-180 text-gray-900",
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SecurityFooter() {
  return (
    <section className="flex flex-col items-start gap-5 rounded-3xl border border-gray-900 bg-gradient-to-br from-gray-900 via-[#111318] to-[#1a1d24] px-6 py-8 text-white md:flex-row md:items-center md:justify-between md:px-10">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
          <Shield size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold">
            Pagamento seguro e cancelamento a qualquer momento
          </p>
          <p className="mt-0.5 text-xs text-white/60">
            Troque ou cancele sem burocracia. Sem contratos longos, sem
            pegadinhas.
          </p>
        </div>
      </div>
      <a
        href="https://wa.me/5541997819114"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-gray-900 shadow-lg shadow-black/20 transition hover:scale-[1.02]"
      >
        Falar com um especialista
        <ArrowRight size={12} />
      </a>
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex h-[560px] animate-pulse flex-col gap-4 rounded-3xl border border-gray-200/60 bg-white/60 p-6",
            i === 1 && "lg:-translate-y-2 lg:scale-[1.02]",
          )}
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
              <div key={j} className="h-3 w-full rounded-full bg-gray-100" />
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
