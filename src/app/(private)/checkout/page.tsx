"use client";

import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Loader2,
  QrCode,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/blocks/input";

interface Plan {
  id: string;
  name: string;
  description: string;
  pixMonthlyPrice: number;
  pixYearlyPrice: number;
  creditMonthlyPrice: number;
  creditYearlyPrice: number;
  dailyRecordAvailable: number;
  channels: string[];
}

type BillingCycle = "MONTHLY" | "YEARLY";
type PaymentMethod = "pix" | "credit" | null;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
};

const planIcons = [Star, Sparkles, Star, Star];
const getPlanIcon = (index: number) => planIcons[index % planIcons.length];

const getGridClass = (count: number) => {
  switch (count) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-1 sm:grid-cols-2 gap-4";
    case 3:
      return "grid-cols-1 sm:grid-cols-3 gap-4";
    default:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
  }
};

export default function CheckoutPage() {
  const { GetAPI, PostAPI } = useApiContext();
  const { profile, handleGetAvailableRecording } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

  const [pixLoading, setPixLoading] = useState(false);
  const [pixPayload, setPixPayload] = useState<string | null>(null);
  const pixRequestedRef = useRef(false);

  const [creditLoading, setCreditLoading] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: "",
    holderName: "",
    expiry: "",
    cvv: "",
  });

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GetAPI("/signature-plan/channel/WEB", true);
      if (response.status === 200 && response.body?.plans) {
        const list = response.body.plans as Plan[];
        setPlans(list);
        if (list.length > 0) {
          setSelectedPlan(list[Math.min(1, list.length - 1)].id);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      toast.error("Não foi possível carregar os planos.");
    } finally {
      setLoading(false);
    }
  }, [GetAPI]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (step !== 3 || paymentMethod !== "pix" || !selectedPlan || !profile) {
      if (step !== 3 || paymentMethod !== "pix") pixRequestedRef.current = false;
      return;
    }
    if (pixRequestedRef.current) return;
    pixRequestedRef.current = true;
    const billingInfo =
      profile.cpfCnpj && profile.mobilePhone
        ? {
            name: profile.name,
            email: profile.email,
            cpfCnpj: profile.cpfCnpj,
            mobilePhone: profile.mobilePhone,
          }
        : undefined;
    setPixLoading(true);
    setPixPayload(null);
    PostAPI(`/signature/pix/${selectedPlan}`, { billingCycle, billingInfo }, true)
      .then((res) => {
        if (res.status === 200 && res.body?.payment) {
          setPixPayload(res.body.payment.payload ?? null);
          handleGetAvailableRecording();
        } else {
          toast.error(res.body?.message || "Não foi possível gerar o PIX.");
        }
      })
      .catch(() => toast.error("Erro ao gerar PIX."))
      .finally(() => setPixLoading(false));
  }, [step, paymentMethod, selectedPlan, billingCycle, profile, PostAPI, handleGetAvailableRecording]);

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  const getPrice = (plan: Plan) =>
    billingCycle === "YEARLY" ? plan.creditYearlyPrice : plan.creditMonthlyPrice;
  const getPixPrice = (plan: Plan) =>
    billingCycle === "YEARLY" ? plan.pixYearlyPrice : plan.pixMonthlyPrice;
  const getMonthlyEquiv = (plan: Plan) =>
    billingCycle === "YEARLY" ? plan.creditYearlyPrice / 12 : plan.creditMonthlyPrice;
  const getYearlySavings = (plan: Plan) =>
    plan.creditMonthlyPrice * 12 - plan.creditYearlyPrice;

  const copyPixPayload = async () => {
    if (!pixPayload) return;
    try {
      await navigator.clipboard.writeText(pixPayload);
      toast.success("Código PIX copiado!");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    const [expiryMonth, expiryYearPart] = cardForm.expiry.split("/");
    const expiryYear =
      expiryYearPart?.length === 2 ? `20${expiryYearPart}` : expiryYearPart ?? "";
    const number = cardForm.number.replace(/\D/g, "");
    if (
      !number ||
      !cardForm.holderName.trim() ||
      !expiryMonth ||
      !expiryYear ||
      !cardForm.cvv
    ) {
      toast.error("Preencha todos os campos do cartão.");
      return;
    }
    setCreditLoading(true);
    try {
      const res = await PostAPI(`/signature/credit/${selectedPlan}`, {
        billingCycle,
        card: {
          number,
          holderName: cardForm.holderName.trim(),
          expiryMonth: expiryMonth.padStart(2, "0"),
          expiryYear,
          cvv: cardForm.cvv.replace(/\D/g, ""),
        },
      }, true);
      if (res.status === 200) {
        await handleGetAvailableRecording();
        toast.success("Pagamento realizado com sucesso!");
        router.push("/");
      } else {
        toast.error(res.body?.message ?? "Não foi possível processar o cartão.");
      }
    } catch {
      toast.error("Erro ao processar. Tente novamente.");
    } finally {
      setCreditLoading(false);
    }
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const n = v.replace(/\D/g, "").slice(0, 4);
    return n.length >= 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
  };

  const gridClass = getGridClass(plans.length);

  return (
    <div className="fixed inset-0 flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-10%,rgba(76,77,78,0.12),transparent_50%)]" />

      {/* Header */}
      <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
        <button
          onClick={() => (step === 1 ? router.back() : step === 2 ? setStep(1) : setStep(2))}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/60">
          Checkout
        </div>
      </header>

      {/* Two columns: left summary, right form */}
      <div className="relative z-10 flex min-h-0 flex-1">
        {/* Coluna esquerda — resumo (fixo) */}
        <aside className="hidden w-full shrink-0 border-r border-white/10 bg-white/[0.02] lg:block lg:max-w-[380px]">
          <div className="sticky top-0 flex h-full flex-col overflow-y-auto p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
              Resumo do pedido
            </h3>
            {selectedPlanData ? (
              <>
                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Plano</span>
                    <span className="font-medium text-white">{selectedPlanData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Periodicidade</span>
                    <span className="font-medium text-white">
                      {billingCycle === "YEARLY" ? "Anual" : "Mensal"}
                    </span>
                  </div>
                  {step >= 2 && paymentMethod && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Pagamento</span>
                      <span className="font-medium text-white">
                        {paymentMethod === "pix" ? "PIX" : "Cartão de crédito"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-base font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-white">
                    {paymentMethod === "pix"
                      ? formatCurrency(billingCycle === "YEARLY" ? selectedPlanData.pixYearlyPrice : selectedPlanData.pixMonthlyPrice)
                      : formatCurrency(billingCycle === "YEARLY" ? selectedPlanData.creditYearlyPrice : selectedPlanData.creditMonthlyPrice)}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/45">
                  <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Pagamento seguro</span>
                  <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Ativação imediata</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-white/50">Selecione um plano para ver o resumo.</p>
            )}
          </div>
        </aside>

        {/* Coluna direita — etapas (scroll) */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col p-4 pb-28 sm:p-6 lg:p-8 lg:pb-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50">
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full", step >= 1 ? "bg-primary text-white" : "bg-white/10")}>1</span>
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full", step >= 2 ? "bg-primary text-white" : "bg-white/10")}>2</span>
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full", step >= 3 ? "bg-primary text-white" : "bg-white/10")}>3</span>
                <span className="ml-1">Plano → Pagamento → Confirmar</span>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {/* ——— STEP 1: Plano ——— */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Escolha seu plano
                  </h2>
                  <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                    <button
                      onClick={() => setBillingCycle("MONTHLY")}
                      className={cn(
                        "rounded-lg px-5 py-2.5 text-sm font-semibold transition",
                        billingCycle === "MONTHLY" ? "bg-primary text-white" : "text-white/70 hover:text-white"
                      )}
                    >
                      Mensal
                    </button>
                    <button
                      onClick={() => setBillingCycle("YEARLY")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition",
                        billingCycle === "YEARLY" ? "bg-primary text-white" : "text-white/70 hover:text-white"
                      )}
                    >
                      Anual
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">ECONOMIZE</span>
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : plans.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 py-12 text-center">
                      <Shield className="mx-auto h-12 w-12 text-white/30" />
                      <p className="mt-4 text-white/60">Nenhum plano disponível.</p>
                    </div>
                  ) : (
                    <div className={cn("grid", gridClass)}>
                      {plans.map((plan, i) => {
                        const isSelected = selectedPlan === plan.id;
                        const Icon = getPlanIcon(i);
                        const price = getPrice(plan);
                        const pixPrice = getPixPrice(plan);
                        const monthlyEquiv = getMonthlyEquiv(plan);
                        const savings = getYearlySavings(plan);
                        return (
                          <motion.button
                            key={plan.id}
                            type="button"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={cn(
                              "group relative flex flex-col rounded-2xl border-2 p-5 text-left transition sm:p-6",
                              isSelected ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
                            )}
                          >
                            {isSelected && (
                              <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                            <div className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-xl", isSelected ? "bg-primary/20 text-primary" : "bg-white/10 text-white/70")}>
                              <Icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                            <p className="mt-1 line-clamp-2 text-sm text-white/55">{plan.description}</p>
                            <div className="mt-4">
                              <span className="text-2xl font-bold text-white">{formatCurrency(price)}</span>
                              <span className="ml-1 text-sm text-white/50">/{billingCycle === "YEARLY" ? "ano" : "mês"}</span>
                            </div>
                            {billingCycle === "YEARLY" && (
                              <p className="mt-1 text-xs text-white/45">{formatCurrency(monthlyEquiv)}/mês</p>
                            )}
                            {billingCycle === "YEARLY" && savings > 0 && (
                              <p className="mt-0.5 text-xs font-semibold text-emerald-400">Economia {formatCurrency(savings)}/ano</p>
                            )}
                            {pixPrice < price && (
                              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                                <QrCode className="h-3.5 w-3.5" /> {formatCurrency(pixPrice)} no PIX
                              </p>
                            )}
                            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                              <div className="flex items-center gap-2 text-sm text-white/65">
                                <Zap className="h-3.5 w-3.5 text-primary" />
                                {formatSeconds(plan.dailyRecordAvailable)}/dia
                              </div>
                              <div className="flex items-center gap-2 text-sm text-white/65">
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                Relatórios com IA · Suporte
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => selectedPlan && setStep(2)}
                      disabled={!selectedPlan || loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:min-w-[200px]"
                    >
                      Continuar <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ——— STEP 2: Forma de pagamento ——— */}
              {step === 2 && selectedPlanData && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Forma de pagamento
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setPaymentMethod("pix"); setStep(3); }}
                      className="flex flex-col items-center gap-4 rounded-2xl border-2 border-white/10 bg-white/5 p-6 transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                        <QrCode className="h-7 w-7" />
                      </div>
                      <div className="text-center">
                        <span className="block font-semibold text-white">PIX</span>
                        <span className="mt-1 block text-sm text-white/55">Aprovação instantânea</span>
                        <p className="mt-2 text-lg font-bold text-primary">
                          {formatCurrency(billingCycle === "YEARLY" ? selectedPlanData.pixYearlyPrice : selectedPlanData.pixMonthlyPrice)}
                        </p>
                      </div>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setPaymentMethod("credit"); setStep(3); }}
                      className="flex flex-col items-center gap-4 rounded-2xl border-2 border-white/10 bg-white/5 p-6 transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
                        <CreditCard className="h-7 w-7" />
                      </div>
                      <div className="text-center">
                        <span className="block font-semibold text-white">Cartão de crédito</span>
                        <span className="mt-1 block text-sm text-white/55">Recorrência automática</span>
                        <p className="mt-2 text-lg font-bold text-primary">
                          {formatCurrency(billingCycle === "YEARLY" ? selectedPlanData.creditYearlyPrice : selectedPlanData.creditMonthlyPrice)}
                        </p>
                      </div>
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-white/45">
                    <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Seguro</span>
                    <span className="flex items-center gap-1.5"><Zap className="h-4 w-4" /> Ativação imediata</span>
                  </div>
                </motion.div>
              )}

              {/* ——— STEP 3: PIX ou Cartão ——— */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    {paymentMethod === "pix" ? "Pagamento PIX" : "Dados do cartão"}
                  </h2>

                  {paymentMethod === "pix" && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      {pixLoading ? (
                        <div className="flex flex-col items-center py-8">
                          <Loader2 className="h-10 w-10 animate-spin text-primary" />
                          <p className="mt-3 text-sm text-white/55">Gerando código PIX...</p>
                        </div>
                      ) : pixPayload ? (
                        <div className="space-y-4">
                          <p className="text-sm text-white/65">Copie o código e cole no app do banco.</p>
                          <div className="rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm text-white/90 break-all">
                            {pixPayload}
                          </div>
                          <button
                            type="button"
                            onClick={copyPixPayload}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-white transition hover:opacity-95"
                          >
                            <Copy className="h-5 w-5" /> Copiar código PIX
                          </button>
                        </div>
                      ) : (
                        <p className="py-4 text-center text-white/55">Não foi possível gerar o PIX.</p>
                      )}
                    </div>
                  )}

                  {paymentMethod === "credit" && (
                    <form onSubmit={handleCreditSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-white/80">Número do cartão</label>
                        <Input
                          placeholder="0000 0000 0000 0000"
                          value={cardForm.number}
                          onChange={(e) => setCardForm((p) => ({ ...p, number: formatCardNumber(e.target.value) }))}
                          maxLength={19}
                          className="border-white/20 bg-black/20 text-white placeholder:text-white/40"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-white/80">Nome no cartão</label>
                        <Input
                          placeholder="Como está no cartão"
                          value={cardForm.holderName}
                          onChange={(e) => setCardForm((p) => ({ ...p, holderName: e.target.value }))}
                          className="border-white/20 bg-black/20 text-white placeholder:text-white/40"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-white/80">Validade (MM/AA)</label>
                          <Input
                            placeholder="MM/AA"
                            value={cardForm.expiry}
                            onChange={(e) => setCardForm((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                            maxLength={5}
                            className="border-white/20 bg-black/20 text-white placeholder:text-white/40"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-white/80">CVV</label>
                          <Input
                            type="password"
                            placeholder="***"
                            value={cardForm.cvv}
                            onChange={(e) => setCardForm((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                            maxLength={4}
                            className="border-white/20 bg-black/20 text-white placeholder:text-white/40"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={creditLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
                      >
                        {creditLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <> <CreditCard className="h-5 w-5" /> Confirmar pagamento </>}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Resumo mobile — barra fixa embaixo em telas pequenas */}
        {selectedPlanData && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/90 backdrop-blur-md px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/55">{selectedPlanData.name} · {billingCycle === "YEARLY" ? "Anual" : "Mensal"}</p>
                <p className="text-lg font-bold text-white">
                  {paymentMethod === "pix"
                    ? formatCurrency(billingCycle === "YEARLY" ? selectedPlanData.pixYearlyPrice : selectedPlanData.pixMonthlyPrice)
                    : formatCurrency(billingCycle === "YEARLY" ? selectedPlanData.creditYearlyPrice : selectedPlanData.creditMonthlyPrice)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
