"use client";

import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/blocks/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ArrowRight,
  Check,
  Clock,
  Copy,
  CreditCard,
  Crown,
  Loader2,
  QrCode,
  Rocket,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

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
type ViewState = "plans" | "checkout";

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

const EASE = [0.32, 0.72, 0, 1] as const;

export default function Plans2Page() {
  const { GetAPI, PostAPI } = useApiContext();
  const { profile, isTrial, handleGetAvailableRecording } = useSession();
  const router = useRouter();

  const [viewState, setViewState] = useState<ViewState>("plans");
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
      const res = await GetAPI("/signature-plan/channel/WEB", true);
      if (res.status === 200 && res.body?.plans) {
        const list = res.body.plans as Plan[];
        setPlans(list);
        if (list.length > 0) {
          setSelectedPlan(list[Math.min(1, list.length - 1)].id);
        }
      }
    } catch {
      console.error("Erro ao buscar planos");
    } finally {
      setLoading(false);
    }
  }, [GetAPI]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (
      viewState !== "checkout" ||
      paymentMethod !== "pix" ||
      !selectedPlan ||
      !profile
    ) {
      if (viewState !== "checkout" || paymentMethod !== "pix")
        pixRequestedRef.current = false;
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
    PostAPI(
      `/signature/pix/${selectedPlan}`,
      { billingCycle, billingInfo },
      true,
    )
      .then((r) => {
        if (r.status === 200 && r.body?.payment) {
          setPixPayload(r.body.payment.payload ?? null);
          handleGetAvailableRecording();
        } else toast.error(r.body?.message || "Não foi possível gerar o PIX.");
      })
      .catch(() => toast.error("Erro ao gerar PIX."))
      .finally(() => setPixLoading(false));
  }, [
    viewState,
    paymentMethod,
    selectedPlan,
    billingCycle,
    profile,
    PostAPI,
    handleGetAvailableRecording,
  ]);

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const getPrice = (p: Plan) =>
    billingCycle === "YEARLY" ? p.creditYearlyPrice : p.creditMonthlyPrice;
  const getPixPrice = (p: Plan) =>
    billingCycle === "YEARLY" ? p.pixYearlyPrice : p.pixMonthlyPrice;

  const copyPix = async () => {
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
    const [exM, exYP] = cardForm.expiry.split("/");
    const exY = exYP?.length === 2 ? `20${exYP}` : (exYP ?? "");
    const num = cardForm.number.replace(/\D/g, "");
    if (!num || !cardForm.holderName.trim() || !exM || !exY || !cardForm.cvv) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setCreditLoading(true);
    try {
      const r = await PostAPI(
        `/signature/credit/${selectedPlan}`,
        {
          billingCycle,
          card: {
            number: num,
            holderName: cardForm.holderName.trim(),
            expiryMonth: exM.padStart(2, "0"),
            expiryYear: exY,
            cvv: cardForm.cvv.replace(/\D/g, ""),
          },
        },
        true,
      );
      if (r.status === 200) {
        await handleGetAvailableRecording();
        toast.success("Pagamento realizado!");
        router.push("/");
      } else toast.error(r.body?.message ?? "Erro ao processar.");
    } catch {
      toast.error("Erro ao processar.");
    } finally {
      setCreditLoading(false);
    }
  };

  const fmtCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();
  const fmtExp = (v: string) => {
    const n = v.replace(/\D/g, "").slice(0, 4);
    return n.length >= 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
  };

  const handleBack = () => {
    if (viewState === "checkout" && paymentMethod) {
      setPaymentMethod(null);
      pixRequestedRef.current = false;
    } else if (viewState === "checkout") setViewState("plans");
    else router.push("/");
  };

  const isCheckout = viewState === "checkout";

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-[#111]">
      <motion.div
        layout
        animate={{
          width: isCheckout ? "85%" : "100%",
          height: isCheckout ? "88%" : "100%",
          borderRadius: isCheckout ? 28 : 0,
        }}
        transition={{ duration: 0.65, ease: EASE }}
        className="relative flex overflow-hidden bg-white"
        style={{
          boxShadow: isCheckout
            ? "0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)"
            : "none",
        }}
      >
        {/* ═══ Crossing patterns — span both panels ═══ */}
        <div className="pointer-events-none absolute inset-0 z-[5]">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[45%] h-[500px] w-[500px] rounded-full opacity-[0.06]"
            style={{
              background:
                "radial-gradient(circle, rgba(100,100,100,0.5) 0%, transparent 70%)",
            }}
          />
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-[42%] h-[600px] w-[600px] rounded-full opacity-[0.05]"
            style={{
              background:
                "radial-gradient(circle, rgba(82,82,91,0.4) 0%, transparent 70%)",
            }}
          />
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute top-[30%] left-[47%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-400/[0.06]"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute top-[60%] left-[48%] h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gray-400/[0.06]"
          />
        </div>

        {/* ═══ LEFT — Video panel ═══ */}
        <div className="relative hidden w-1/2 shrink-0 flex-col overflow-hidden bg-black lg:flex">
          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 z-0 h-full w-full object-cover opacity-[0.4]"
          >
            <source src="/B-Rolls.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay */}
          <div className="absolute inset-0 z-[1] bg-black/70" />

          {/* Gradient overlays */}
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          <div className="from-primary/10 absolute inset-0 z-[2] bg-gradient-to-br to-transparent" />

          {/* Left panel patterns */}
          <div className="pointer-events-none absolute inset-0 z-[3]">
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Diagonal lines */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)",
              }}
            />

            {/* Floating orbs */}
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -left-20 h-[28rem] w-[28rem] rounded-full bg-neutral-400/[0.12] blur-[100px]"
            />
            <motion.div
              animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-16 bottom-[20%] h-[24rem] w-[24rem] rounded-full bg-zinc-400/[0.10] blur-[100px]"
            />
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[40%] left-[20%] h-[16rem] w-[16rem] rounded-full bg-emerald-500/[0.06] blur-[80px]"
            />

            {/* Geometric rings */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute top-[10%] right-[10%] h-48 w-48"
            >
              <div className="h-full w-full rounded-full border border-white/[0.08]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-white/[0.06]" />
            </motion.div>
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[15%] left-[5%] h-32 w-32"
            >
              <div className="h-full w-full rounded-full border border-white/[0.06]" />
            </motion.div>

            {/* Horizontal scan line */}
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 4,
              }}
              className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-white/[0.10] to-transparent"
            />

            {/* Corner accents */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-white/[0.04] to-transparent" />
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-gradient-to-tr from-white/[0.04] to-transparent" />

            {/* Small floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`particle-left-${i}`}
                animate={{
                  y: [0, -20 - i * 5, 0],
                  x: [0, 10 + i * 3, 0],
                  opacity: [0.04, 0.12, 0.04],
                }}
                transition={{
                  duration: 6 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.5,
                }}
                className="absolute h-1 w-1 rounded-full bg-white"
                style={{ top: `${15 + i * 14}%`, left: `${10 + i * 12}%` }}
              />
            ))}
          </div>

          {/* Content over the video */}
          <div className="relative z-10 flex h-full flex-col justify-center gap-6 p-10">
            {/* Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isTrial
                      ? "Desbloqueie o potencial completo"
                      : "Escolha o plano ideal"}
                  </h2>
                  <p className="text-sm text-white/95">
                    Gravações inteligentes com IA
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  "Relatórios inteligentes com IA",
                  "Suporte prioritário dedicado",
                ].map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2.5 text-sm text-white"
                  >
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                    {feat}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Selected plan info */}
            <AnimatePresence mode="wait">
              {selectedPlanData && (
                <motion.div
                  key={selectedPlanData.id + billingCycle + paymentMethod}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-xl"
                >
                  {/* Header com nome do plano */}
                  <div className="flex items-center gap-4 border-b border-white/10 px-7 py-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
                        Plano selecionado
                      </p>
                      <h3 className="text-xl font-bold text-white">
                        {selectedPlanData.name}
                      </h3>
                    </div>
                  </div>

                  {/* Preço destaque */}
                  <div className="px-7 pt-6 pb-5">
                    {billingCycle === "YEARLY" ? (
                      <>
                        <span className="text-sm font-semibold text-white/60">
                          12x de
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold tracking-tight text-white">
                            {paymentMethod === "pix"
                              ? formatCurrency(
                                  getPixPrice(selectedPlanData) / 12,
                                )
                              : formatCurrency(getPrice(selectedPlanData) / 12)}
                          </span>
                          <span className="text-base font-medium text-white/60">
                            /mês
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold tracking-tight text-white">
                          {paymentMethod === "pix"
                            ? formatCurrency(getPixPrice(selectedPlanData))
                            : formatCurrency(getPrice(selectedPlanData))}
                        </span>
                        <span className="text-base font-medium text-white/60">
                          /mês
                        </span>
                      </div>
                    )}
                    {paymentMethod === "pix" &&
                      getPixPrice(selectedPlanData) <
                        getPrice(selectedPlanData) && (
                        <p className="mt-1.5 text-sm font-medium text-emerald-400">
                          Economia de{" "}
                          {formatCurrency(
                            getPrice(selectedPlanData) -
                              getPixPrice(selectedPlanData),
                          )}{" "}
                          com PIX
                        </p>
                      )}
                  </div>

                  {/* Detalhes */}
                  <div className="mx-7 space-y-0 divide-y divide-white/[0.06]">
                    <div className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-white/50" />
                        <span className="text-[15px] text-white/80">Ciclo</span>
                      </div>
                      <span className="text-[15px] font-semibold text-white">
                        {billingCycle === "YEARLY" ? "Anual" : "Mensal"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-white/50" />
                        <span className="text-[15px] text-white/80">
                          Gravação/dia
                        </span>
                      </div>
                      <span className="text-[15px] font-semibold text-white">
                        {formatSeconds(selectedPlanData.dailyRecordAvailable)}
                      </span>
                    </div>
                    {paymentMethod && (
                      <div className="flex items-center justify-between py-3.5">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-4 w-4 text-white/50" />
                          <span className="text-[15px] text-white/80">
                            Pagamento
                          </span>
                        </div>
                        <span className="text-[15px] font-semibold text-white">
                          {paymentMethod === "pix" ? "PIX" : "Cartão"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Trust badges */}
                  <div className="mt-4 flex items-center gap-5 border-t border-white/10 px-7 py-4">
                    <span className="flex items-center gap-2 text-xs font-medium text-white/70">
                      <Shield className="h-3.5 w-3.5" /> Seguro
                    </span>
                    <span className="flex items-center gap-2 text-xs font-medium text-white/70">
                      <Zap className="h-3.5 w-3.5" /> Imediato
                    </span>
                    <span className="flex items-center gap-2 text-xs font-medium text-white/70">
                      <Clock className="h-3.5 w-3.5" /> Cancele quando quiser
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 backdrop-blur-md"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm text-[#F7CE46]">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-bold text-white">4.9</span>
              <div className="h-4 w-px bg-white/20" />
              <span className="text-sm text-white/90">
                +10.000 profissionais confiam
              </span>
            </motion.div>
          </div>
        </div>

        {/* ═══ RIGHT — Content panel ═══ */}
        <div className="relative flex flex-1 flex-col overflow-hidden bg-[#fafafa]">
          {/* Right panel patterns */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Mesh gradient background */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse 80% 50% at 20% 20%, rgba(212,212,216,0.12) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 60% at 80% 80%, rgba(228,228,231,0.1) 0%, transparent 50%),
                    radial-gradient(ellipse 50% 40% at 60% 40%, rgba(212,212,216,0.08) 0%, transparent 50%),
                    radial-gradient(ellipse 70% 50% at 10% 90%, rgba(228,228,231,0.08) 0%, transparent 50%)
                  `,
                }}
              />
            </div>

            {/* Animated aurora ribbons */}
            <motion.div
              animate={{ x: ["-5%", "5%", "-5%"], y: ["-3%", "3%", "-3%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[10%] -left-[5%] h-[60%] w-[120%]"
              style={{
                background:
                  "linear-gradient(135deg, transparent 25%, rgba(161,161,170,0.08) 38%, rgba(161,161,170,0.02) 50%, transparent 60%)",
                filter: "blur(35px)",
              }}
            />
            <motion.div
              animate={{ x: ["3%", "-3%", "3%"], y: ["2%", "-4%", "2%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-[5%] -bottom-[5%] h-[50%] w-[110%]"
              style={{
                background:
                  "linear-gradient(-45deg, transparent 30%, rgba(113,113,122,0.05) 42%, rgba(113,113,122,0.015) 55%, transparent 65%)",
                filter: "blur(35px)",
              }}
            />
            <motion.div
              animate={{ x: ["-2%", "4%", "-2%"], y: ["3%", "-2%", "3%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[30%] -left-[10%] h-[40%] w-[100%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 15%, rgba(161,161,170,0.04) 35%, rgba(161,161,170,0.01) 55%, transparent 75%)",
                filter: "blur(40px)",
              }}
            />

            {/* Noise texture overlay for depth */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
              }}
            />

            {/* Concentric arcs — top right */}
            <svg
              className="absolute -top-16 -right-16 h-[400px] w-[400px] opacity-[0.04]"
              viewBox="0 0 400 400"
            >
              <motion.circle
                cx="200"
                cy="200"
                r="80"
                fill="none"
                stroke="#71717a"
                strokeWidth="1"
                animate={{ r: [80, 90, 80] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke="#71717a"
                strokeWidth="0.8"
                strokeDasharray="8 12"
                animate={{ r: [120, 130, 120] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx="200"
                cy="200"
                r="160"
                fill="none"
                stroke="#71717a"
                strokeWidth="0.8"
                animate={{ r: [160, 175, 160] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx="200"
                cy="200"
                r="195"
                fill="none"
                stroke="#71717a"
                strokeWidth="0.6"
                strokeDasharray="4 16"
                animate={{ r: [195, 185, 195] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>

            {/* Concentric arcs — bottom left */}
            <svg
              className="absolute -bottom-20 -left-20 h-[350px] w-[350px] opacity-[0.03]"
              viewBox="0 0 350 350"
            >
              <motion.circle
                cx="175"
                cy="175"
                r="60"
                fill="none"
                stroke="#71717a"
                strokeWidth="1"
                animate={{ r: [60, 70, 60] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx="175"
                cy="175"
                r="100"
                fill="none"
                stroke="#71717a"
                strokeWidth="0.8"
                strokeDasharray="6 10"
                animate={{ r: [100, 110, 100] }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx="175"
                cy="175"
                r="140"
                fill="none"
                stroke="#71717a"
                strokeWidth="0.8"
                animate={{ r: [140, 150, 140] }}
                transition={{
                  duration: 11,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>

            {/* Flowing bezier curves */}
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.025]"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <motion.path
                d="M-10,30 Q25,10 50,30 T110,30"
                fill="none"
                stroke="#52525b"
                strokeWidth="0.2"
                animate={{
                  d: [
                    "M-10,30 Q25,10 50,30 T110,30",
                    "M-10,35 Q25,50 50,25 T110,35",
                    "M-10,30 Q25,10 50,30 T110,30",
                  ],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.path
                d="M-10,55 Q30,40 55,55 T110,55"
                fill="none"
                stroke="#52525b"
                strokeWidth="0.2"
                animate={{
                  d: [
                    "M-10,55 Q30,40 55,55 T110,55",
                    "M-10,50 Q30,70 55,45 T110,50",
                    "M-10,55 Q30,40 55,55 T110,55",
                  ],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.path
                d="M-10,78 Q35,65 60,78 T110,78"
                fill="none"
                stroke="#52525b"
                strokeWidth="0.18"
                animate={{
                  d: [
                    "M-10,78 Q35,65 60,78 T110,78",
                    "M-10,82 Q35,90 60,72 T110,82",
                    "M-10,78 Q35,65 60,78 T110,78",
                  ],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>

            {/* Floating glass orbs */}
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[12%] right-[15%] h-24 w-24 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(161,161,170,0.04) 50%, rgba(161,161,170,0.01) 75%, transparent 100%)",
                boxShadow:
                  "inset 0 -2px 6px rgba(0,0,0,0.01), 0 3px 14px rgba(113,113,122,0.02)",
              }}
            />
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
              transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[18%] left-[10%] h-16 w-16 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(161,161,170,0.03) 50%, rgba(161,161,170,0.008) 75%, transparent 100%)",
                boxShadow:
                  "inset 0 -2px 6px rgba(0,0,0,0.008), 0 3px 14px rgba(113,113,122,0.02)",
              }}
            />
            <motion.div
              animate={{ y: [0, -12, 0], x: [0, -6, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[55%] right-[8%] h-12 w-12 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), rgba(161,161,170,0.02) 50%, rgba(161,161,170,0.005) 75%, transparent 100%)",
                boxShadow:
                  "inset 0 -1px 4px rgba(0,0,0,0.008), 0 2px 10px rgba(113,113,122,0.015)",
              }}
            />

            {/* Soft vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 60%, rgba(250,250,250,0.5) 100%)",
              }}
            />
          </div>

          {/* Top bar */}
          <div className="absolute z-90 flex w-full shrink-0 items-center justify-between px-6 py-4 sm:px-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:text-black hover:shadow-md"
            >
              <ChevronLeft className="h-4 w-4" /> Voltar
            </button>
            <Image
              src="/logos/logo-dark.svg"
              alt="EX Voice"
              width={200}
              height={60}
              className="h-5 w-auto object-contain lg:hidden"
            />
            {isCheckout && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold tracking-wider text-gray-500 uppercase shadow-sm sm:flex"
              >
                <Shield className="h-3 w-3" /> Checkout seguro
              </motion.div>
            )}
          </div>

          {/* Scrollable */}
          <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 sm:px-8">
              <AnimatePresence mode="wait">
                {/* ═══ PLANS ═══ */}
                {viewState === "plans" && (
                  <motion.div
                    key="plans"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-1 flex-col items-center justify-center gap-8 py-8"
                  >
                    <div className="w-full text-center">
                      <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                        Escolha seu plano
                      </h1>
                      <p className="mt-2 text-base text-gray-500">
                        Selecione o plano ideal e desbloqueie todo o potencial
                        do EX Voice.
                      </p>
                    </div>

                    {/* Billing toggle */}
                    <div className="inline-flex rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5">
                      <button
                        onClick={() => setBillingCycle("MONTHLY")}
                        className={cn(
                          "rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
                          billingCycle === "MONTHLY"
                            ? "bg-black text-white shadow-md"
                            : "text-gray-500 hover:text-gray-700",
                        )}
                      >
                        Mensal
                      </button>
                      <button
                        onClick={() => setBillingCycle("YEARLY")}
                        className={cn(
                          "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all",
                          billingCycle === "YEARLY"
                            ? "bg-black text-white shadow-md"
                            : "text-gray-500 hover:text-gray-700",
                        )}
                      >
                        Anual
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold text-black",
                            billingCycle === "YEARLY"
                              ? "bg-gradient-to-r from-[#F7CE46] to-[#FFCC00]"
                              : "bg-gradient-to-r from-[#F7CE46] to-[#FFCC00]",
                          )}
                        >
                          -20%
                        </span>
                      </button>
                    </div>

                    {/* Plan cards — always 2 columns */}
                    {loading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      </div>
                    ) : (
                      <div className="grid w-full grid-cols-2 gap-5">
                        {plans.map((plan, i) => {
                          const isSelected = selectedPlan === plan.id;
                          const price = getPrice(plan);
                          const pixPrice = getPixPrice(plan);
                          const isPopular = plans.length >= 2 && i === 1;

                          return (
                            <motion.button
                              key={plan.id}
                              type="button"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.08 }}
                              whileHover={{
                                y: -4,
                                transition: { duration: 0.2 },
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedPlan(plan.id)}
                              className={cn(
                                "group relative flex flex-col items-center rounded-3xl p-8 text-center transition-all duration-300",
                                isSelected
                                  ? "bg-black shadow-2xl ring-2 shadow-black/20 ring-black"
                                  : "bg-white shadow-lg ring-1 shadow-gray-200/50 ring-gray-100 hover:shadow-xl hover:ring-gray-200",
                                isPopular &&
                                  !isSelected &&
                                  "ring-2 ring-[#F7CE46]/40",
                              )}
                            >
                              {isPopular && (
                                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                                  <span className="inline-flex items-center gap-1 rounded-b-xl bg-gradient-to-r from-[#F7CE46] to-[#FFCC00] px-4 py-1 text-[10px] font-bold tracking-wide text-[#0a0a0a] shadow-lg shadow-amber-200/40">
                                    <Crown className="h-3 w-3" /> POPULAR
                                  </span>
                                </div>
                              )}

                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white"
                                >
                                  <Check className="h-4 w-4 text-black" />
                                </motion.div>
                              )}

                              {isSelected && (
                                <div className="pointer-events-none absolute inset-0 rounded-3xl">
                                  <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                                  <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
                                </div>
                              )}

                              <div
                                className={cn(
                                  "relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
                                  isSelected
                                    ? "bg-white/15 text-white"
                                    : "bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600",
                                )}
                              >
                                {i === 0 && <Zap className="h-6 w-6" />}
                                {i === 1 && <Sparkles className="h-6 w-6" />}
                                {i === 2 && <Crown className="h-6 w-6" />}
                                {i >= 3 && <Zap className="h-6 w-6" />}
                              </div>

                              <h3
                                className={cn(
                                  "text-xl font-bold transition-colors",
                                  isSelected ? "text-white" : "text-black",
                                )}
                              >
                                {plan.name}
                              </h3>

                              <div className="mt-4">
                                {billingCycle === "YEARLY" ? (
                                  <>
                                    <span
                                      className={cn(
                                        "text-sm font-semibold",
                                        isSelected
                                          ? "text-white/60"
                                          : "text-gray-400",
                                      )}
                                    >
                                      12x de
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                      <span
                                        className={cn(
                                          "text-4xl font-extrabold tracking-tight",
                                          isSelected
                                            ? "text-white"
                                            : "text-black",
                                        )}
                                      >
                                        {formatCurrency(
                                          (pixPrice > 0 ? pixPrice : price) /
                                            12,
                                        )}
                                      </span>

                                      {pixPrice > 0 && pixPrice < price && (
                                        <span
                                          className={cn(
                                            "ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                                            isSelected
                                              ? "bg-gradient-to-r from-[#F7CE46] to-[#FFCC00]"
                                              : "bg-gradient-to-r from-[#F7CE46] to-[#FFCC00]",
                                          )}
                                        >
                                          <QrCode className="h-2.5 w-2.5" />
                                          PIX
                                        </span>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <span
                                      className={cn(
                                        "invisible text-sm font-semibold",
                                        isSelected
                                          ? "text-white/60"
                                          : "text-gray-400",
                                      )}
                                    >
                                      1x de
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                      <span
                                        className={cn(
                                          "text-4xl font-extrabold tracking-tight",
                                          isSelected
                                            ? "text-white"
                                            : "text-black",
                                        )}
                                      >
                                        {formatCurrency(
                                          pixPrice > 0 ? pixPrice : price,
                                        )}
                                      </span>

                                      {pixPrice > 0 && pixPrice < price && (
                                        <span
                                          className={cn(
                                            "ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                                            isSelected
                                              ? "bg-gradient-to-r from-[#F7CE46] to-[#FFCC00]"
                                              : "bg-gradient-to-r from-[#F7CE46] to-[#FFCC00]",
                                          )}
                                        >
                                          <QrCode className="h-2.5 w-2.5" />
                                          PIX
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>

                              {pixPrice > 0 && pixPrice < price && (
                                <div
                                  className={cn(
                                    "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                                    isSelected
                                      ? "bg-white/10 text-white/60"
                                      : "bg-gray-100 text-gray-500",
                                  )}
                                >
                                  <CreditCard className="h-3 w-3" />
                                  {billingCycle === "YEARLY"
                                    ? `12x de ${formatCurrency(price / 12)}`
                                    : `${formatCurrency(price)}`}{" "}
                                  no Cartão
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectedPlan && setViewState("checkout")}
                      disabled={!selectedPlan || loading}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-black py-4 text-base font-bold text-white shadow-xl shadow-black/20 transition-all hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
                      Continuar para pagamento
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </motion.button>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                          <Shield className="h-3 w-3 text-gray-500" />
                        </div>
                        Pagamento seguro
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                          <Zap className="h-3 w-3 text-gray-500" />
                        </div>
                        Ativação imediata
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                          <Clock className="h-3 w-3 text-gray-500" />
                        </div>
                        Cancele quando quiser
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* ═══ CHECKOUT ═══ */}
                {viewState === "checkout" && selectedPlanData && (
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 40, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="flex flex-1 flex-col justify-center space-y-6 py-8"
                  >
                    {/* Mobile summary */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 lg:hidden">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] text-gray-400">Plano</p>
                          <p className="font-bold text-black">
                            {selectedPlanData.name}
                          </p>
                        </div>
                        <p className="text-xl font-bold text-black">
                          {formatCurrency(getPrice(selectedPlanData))}
                          <span className="text-xs font-normal text-gray-400">
                            /{billingCycle === "YEARLY" ? "ano" : "mês"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="mt-8 flex items-center gap-0">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                            paymentMethod
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                              : "bg-black text-white shadow-md shadow-black/20",
                          )}
                        >
                          {paymentMethod ? <Check className="h-4 w-4" /> : "1"}
                        </div>
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            paymentMethod ? "text-black" : "text-black",
                          )}
                        >
                          Método de Pagamento
                        </span>
                      </div>

                      <div className="mx-4 h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                            paymentMethod
                              ? "bg-black text-white shadow-md shadow-black/20"
                              : "bg-gray-100 text-gray-400",
                          )}
                        >
                          2
                        </div>
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            paymentMethod ? "text-black" : "text-gray-400",
                          )}
                        >
                          Confirmação
                        </span>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {!paymentMethod && (
                        <motion.div
                          key="pm-select"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-5"
                        >
                          <div>
                            <h2 className="text-2xl font-bold text-black">
                              Como deseja pagar?
                            </h2>
                            <p className="mt-1.5 text-sm text-gray-500">
                              Escolha a forma de pagamento para o plano{" "}
                              <span className="font-semibold text-gray-700">
                                {selectedPlanData.name}
                              </span>
                            </p>
                          </div>
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* PIX Card */}
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.015, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setPaymentMethod("pix")}
                              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:border-black/20 hover:shadow-lg"
                            >
                              {getPixPrice(selectedPlanData) <
                                getPrice(selectedPlanData) && (
                                <span className="absolute top-4 right-4 z-10 flex flex-row gap-2 rounded-full bg-gradient-to-r from-[#F7CE46] to-[#FFCC00] px-2.5 py-1 text-[11px] font-bold tracking-wide text-black">
                                  <Crown className="h-3 w-3" /> MELHOR PREÇO
                                </span>
                              )}
                              {/* PIX Banner — fixed h-[130px] to match credit card visual */}
                              <div className="relative mx-6 mt-6 flex h-[130px] items-center justify-between overflow-hidden rounded-xl bg-gradient-to-r from-[#4DB6AC] to-[#26A69A] px-5 shadow-lg">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.12),transparent_60%)]" />
                                {/* PIX Logo SVG */}
                                <div className="relative z-10 flex items-center gap-3">
                                  <svg
                                    viewBox="0 0 120 40"
                                    className="h-8 w-auto"
                                  >
                                    <g fill="white">
                                      <path d="M29.2 11.2L22.5 17.9c-.8.8-.8 2.1 0 2.9l6.7 6.7c.4.4.4 1 0 1.4l-2.8 2.8c-.4.4-1 .4-1.4 0l-6.7-6.7c-1.6-1.6-4.1-1.6-5.7 0L5.9 31.7c-.4.4-1 .4-1.4 0L1.7 28.9c-.4-.4-.4-1 0-1.4l6.7-6.7c.8-.8.8-2.1 0-2.9L1.7 11.2c-.4-.4-.4-1 0-1.4L4.5 7c.4-.4 1-.4 1.4 0l6.7 6.7c1.6 1.6 4.1 1.6 5.7 0L25 7c.4-.4 1-.4 1.4 0l2.8 2.8c.4.4.4 1 0 1.4z" />
                                    </g>
                                    <text
                                      x="38"
                                      y="28"
                                      fill="white"
                                      fontFamily="system-ui, sans-serif"
                                      fontSize="22"
                                      fontWeight="700"
                                      letterSpacing="1"
                                    >
                                      pix
                                    </text>
                                  </svg>
                                </div>
                                {/* Mini QR Code */}
                                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
                                  <svg
                                    viewBox="0 0 64 64"
                                    className="h-full w-full"
                                  >
                                    <rect
                                      x="4"
                                      y="4"
                                      width="18"
                                      height="18"
                                      rx="2"
                                      fill="none"
                                      stroke="#1a1a1a"
                                      strokeWidth="2.5"
                                    />
                                    <rect
                                      x="8"
                                      y="8"
                                      width="10"
                                      height="10"
                                      rx="1"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="42"
                                      y="4"
                                      width="18"
                                      height="18"
                                      rx="2"
                                      fill="none"
                                      stroke="#1a1a1a"
                                      strokeWidth="2.5"
                                    />
                                    <rect
                                      x="46"
                                      y="8"
                                      width="10"
                                      height="10"
                                      rx="1"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="4"
                                      y="42"
                                      width="18"
                                      height="18"
                                      rx="2"
                                      fill="none"
                                      stroke="#1a1a1a"
                                      strokeWidth="2.5"
                                    />
                                    <rect
                                      x="8"
                                      y="46"
                                      width="10"
                                      height="10"
                                      rx="1"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="26"
                                      y="4"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="34"
                                      y="4"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="26"
                                      y="12"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="26"
                                      y="26"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="34"
                                      y="26"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="26"
                                      y="34"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="34"
                                      y="34"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="42"
                                      y="26"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="50"
                                      y="26"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="42"
                                      y="34"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="56"
                                      y="34"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="26"
                                      y="42"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="34"
                                      y="46"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="42"
                                      y="42"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="50"
                                      y="50"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="56"
                                      y="42"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="42"
                                      y="56"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                    <rect
                                      x="56"
                                      y="56"
                                      width="4"
                                      height="4"
                                      rx="0.5"
                                      fill="#1a1a1a"
                                    />
                                  </svg>
                                </div>
                              </div>
                              {/* Info */}
                              <div className="flex flex-1 flex-col px-6 pt-4 pb-6">
                                <h3 className="text-lg font-bold text-black">
                                  PIX
                                </h3>
                                <p className="mt-0.5 text-xs text-gray-400">
                                  Aprovação instantânea
                                </p>
                                <div className="mt-auto pt-4">
                                  <p className="text-2xl font-extrabold text-black">
                                    {billingCycle === "YEARLY"
                                      ? `12x ${formatCurrency(getPixPrice(selectedPlanData) / 12)}`
                                      : formatCurrency(
                                          getPixPrice(selectedPlanData),
                                        )}
                                    <span className="text-sm font-medium text-gray-400">
                                      /mês
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </motion.button>

                            {/* Credit Card */}
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.015, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setPaymentMethod("credit")}
                              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:border-black/20 hover:shadow-lg"
                            >
                              {/* Card visual — fixed h-[130px] to match PIX banner */}
                              <div className="relative mx-6 mt-6 flex h-[130px] flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-5 shadow-lg">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
                                <div className="flex items-start justify-between">
                                  <div className="flex h-8 w-10 items-center justify-center rounded bg-gradient-to-br from-amber-300 to-amber-500">
                                    <div className="h-5 w-7 rounded-sm border border-amber-600/30 bg-gradient-to-br from-amber-200 to-amber-400" />
                                  </div>
                                  <svg
                                    viewBox="0 0 48 32"
                                    className="h-6 w-9 opacity-70"
                                  >
                                    <circle
                                      cx="16"
                                      cy="16"
                                      r="14"
                                      fill="#eb001b"
                                      fillOpacity="0.8"
                                    />
                                    <circle
                                      cx="32"
                                      cy="16"
                                      r="14"
                                      fill="#f79e1b"
                                      fillOpacity="0.8"
                                    />
                                    <path
                                      d="M24 5.4a14 14 0 010 21.2 14 14 0 000-21.2z"
                                      fill="#ff5f00"
                                      fillOpacity="0.9"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-mono text-[13px] tracking-[0.2em] text-white/60">
                                    •••• •••• •••• ••••
                                  </p>
                                  <div className="mt-1.5 flex items-end justify-between">
                                    <p className="font-mono text-[10px] tracking-wider text-white/40 uppercase">
                                      Seu nome
                                    </p>
                                    <p className="font-mono text-[10px] text-white/40">
                                      MM/AA
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* Info */}
                              <div className="flex flex-1 flex-col px-6 pt-4 pb-6">
                                <h3 className="text-lg font-bold text-black">
                                  Cartão de crédito
                                </h3>
                                <p className="mt-0.5 text-xs text-gray-400">
                                  Recorrência automática
                                </p>
                                <div className="mt-auto pt-4">
                                  <p className="text-2xl font-extrabold text-black">
                                    {billingCycle === "YEARLY"
                                      ? `12x ${formatCurrency(getPrice(selectedPlanData) / 12)}`
                                      : formatCurrency(
                                          getPrice(selectedPlanData),
                                        )}
                                    <span className="text-sm font-medium text-gray-400">
                                      /mês
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "pix" && (
                        <motion.div
                          key="pix"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-5"
                        >
                          <div>
                            <h2 className="text-2xl font-bold text-black">
                              Pagamento PIX
                            </h2>
                            <p className="mt-1.5 text-sm text-gray-500">
                              Copie o código e cole no app do seu banco
                            </p>
                          </div>
                          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            {pixLoading ? (
                              <div className="flex flex-col items-center py-12">
                                <Loader2 className="text-primary h-10 w-10 animate-spin" />
                                <p className="mt-3 text-sm text-gray-500">
                                  Gerando código PIX...
                                </p>
                              </div>
                            ) : pixPayload ? (
                              <div>
                                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                                  <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                    Código PIX
                                  </p>
                                </div>
                                <div className="p-6">
                                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-relaxed break-all text-gray-600">
                                    {pixPayload}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={copyPix}
                                    className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-black py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all hover:bg-gray-800 hover:shadow-xl"
                                  >
                                    <Copy className="h-4 w-4" /> Copiar código
                                    PIX
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="py-8 text-center text-gray-500">
                                Não foi possível gerar o PIX.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "credit" && (
                        <motion.div
                          key="credit"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-5"
                        >
                          <div>
                            <h2 className="text-2xl font-bold text-black">
                              Dados do cartão
                            </h2>
                            <p className="mt-1.5 text-sm text-gray-500">
                              Insira os dados do seu cartão de crédito abaixo
                            </p>
                          </div>
                          <form
                            onSubmit={handleCreditSubmit}
                            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                          >
                            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-emerald-500" />
                                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                  Dados protegidos
                                </p>
                              </div>
                            </div>
                            <div className="space-y-5 p-6">
                              <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                  Número do cartão
                                </label>
                                <div className="relative">
                                  <CreditCard className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="0000 0000 0000 0000"
                                    value={cardForm.number}
                                    onChange={(e) =>
                                      setCardForm((p) => ({
                                        ...p,
                                        number: fmtCard(e.target.value),
                                      }))
                                    }
                                    maxLength={19}
                                    className="h-12 rounded-xl border-gray-200 bg-gray-50 pl-10 text-base transition-colors focus:border-gray-400 focus:bg-white"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                  Nome no cartão
                                </label>
                                <Input
                                  placeholder="Como está impresso no cartão"
                                  value={cardForm.holderName}
                                  onChange={(e) =>
                                    setCardForm((p) => ({
                                      ...p,
                                      holderName: e.target.value,
                                    }))
                                  }
                                  className="h-12 rounded-xl border-gray-200 bg-gray-50 text-base transition-colors focus:border-gray-400 focus:bg-white"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Validade
                                  </label>
                                  <Input
                                    placeholder="MM/AA"
                                    value={cardForm.expiry}
                                    onChange={(e) =>
                                      setCardForm((p) => ({
                                        ...p,
                                        expiry: fmtExp(e.target.value),
                                      }))
                                    }
                                    maxLength={5}
                                    className="h-12 rounded-xl border-gray-200 bg-gray-50 text-base transition-colors focus:border-gray-400 focus:bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    CVV
                                  </label>
                                  <Input
                                    type="password"
                                    placeholder="•••"
                                    value={cardForm.cvv}
                                    onChange={(e) =>
                                      setCardForm((p) => ({
                                        ...p,
                                        cvv: e.target.value
                                          .replace(/\D/g, "")
                                          .slice(0, 4),
                                      }))
                                    }
                                    maxLength={4}
                                    className="h-12 rounded-xl border-gray-200 bg-gray-50 text-base transition-colors focus:border-gray-400 focus:bg-white"
                                  />
                                </div>
                              </div>
                              <button
                                type="submit"
                                disabled={creditLoading}
                                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-black py-4 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all hover:bg-gray-800 hover:shadow-xl disabled:opacity-60"
                              >
                                {creditLoading ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                  <>
                                    <CreditCard className="h-4 w-4" /> Confirmar
                                    pagamento
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
