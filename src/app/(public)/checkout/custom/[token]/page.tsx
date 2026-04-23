"use client";

import { useSession } from "@/context/auth";
import { cn } from "@/utils/cn";
import { maskCard, maskCpfCnpj, maskExpiryDate, maskPhone } from "@/utils/masks";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  CreditCard,
  Loader2,
  Lock,
  QrCode,
  Timer,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type PaymentType = "PIX" | "CREDIT_CARD";
type BillingCycle = "MONTHLY" | "YEARLY";

interface ResolvedCustomPlan {
  id: string;
  name: string | null;
  basePlanId: string;
  userId: string;
  pixMonthlyPrice: number;
  pixYearlyPrice: number;
  creditMonthlyPrice: number;
  creditYearlyPrice: number;
  dailyRecordAvailable: number;
  pixMonthlyEnabled: boolean;
  pixYearlyEnabled: boolean;
  creditMonthlyEnabled: boolean;
  creditYearlyEnabled: boolean;
  status: string;
  expiresAt: string;
  basePlan?: { id: string; name: string; description?: string };
  user?: {
    id: string;
    name: string;
    email: string;
    mobilePhone?: string | null;
    cpfCnpj?: string | null;
  };
  hasCustomerId?: boolean;
}

type PageState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; plan: ResolvedCustomPlan }
  | {
      kind: "pix_awaiting";
      plan: ResolvedCustomPlan;
      qrCode: { encodedImage: string; payload: string };
      pollingToken: string;
    }
  | { kind: "success"; plan: ResolvedCustomPlan; redirecting: boolean };

function formatRemaining(expiresAt: string, now: number): string {
  const diff = new Date(expiresAt).getTime() - now;
  if (diff <= 0) return "expirado";
  const totalSeconds = Math.floor(diff / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0)
    return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function onlyDigits(s: string): string {
  return s.replace(/\D/g, "");
}

export default function CustomCheckoutPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { handleGetProfile, handleGetAvailableRecording } = useSession();
  const token = decodeURIComponent(params?.token || "");

  const [state, setState] = useState<PageState>({ kind: "loading" });
  const [paymentType, setPaymentType] = useState<PaymentType>("PIX");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Billing info (coletado se o user não tem cpfCnpj)
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingCpf, setBillingCpf] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingPostal, setBillingPostal] = useState("");
  const [billingAddressNumber, setBillingAddressNumber] = useState("");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const fetchedRef = useRef(false);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}/custom-plan/by-token/resolve?token=${encodeURIComponent(token)}`,
        { method: "GET" },
      );
      if (res.status === 410) {
        const body = await res.json().catch(() => ({}));
        setState({
          kind: "error",
          message: body.message || "Link de checkout indisponível",
        });
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setState({
          kind: "error",
          message: body.message || "Não foi possível validar o link.",
        });
        return;
      }
      const plan = (await res.json()) as ResolvedCustomPlan;
      setState({ kind: "ready", plan });

      // Seleciona automaticamente a primeira combinação habilitada
      if (plan.pixMonthlyEnabled) {
        setPaymentType("PIX");
        setBillingCycle("MONTHLY");
      } else if (plan.pixYearlyEnabled) {
        setPaymentType("PIX");
        setBillingCycle("YEARLY");
      } else if (plan.creditMonthlyEnabled) {
        setPaymentType("CREDIT_CARD");
        setBillingCycle("MONTHLY");
      } else if (plan.creditYearlyEnabled) {
        setPaymentType("CREDIT_CARD");
        setBillingCycle("YEARLY");
      }

      // Pré-preenche billing com dados do plan (user)
      setBillingName(plan.user?.name || "");
      setBillingEmail(plan.user?.email || "");
      setBillingPhone(plan.user?.mobilePhone ? maskPhone(plan.user.mobilePhone) : "");
      if (plan.user?.cpfCnpj) setBillingCpf(maskCpfCnpj(plan.user.cpfCnpj));
    } catch {
      setState({
        kind: "error",
        message: "Erro de conexão. Verifique sua internet e recarregue.",
      });
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setState({ kind: "error", message: "Token ausente na URL." });
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchPlan();
  }, [token, fetchPlan]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // PIX polling
  useEffect(() => {
    if (state.kind !== "pix_awaiting") return;
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/checkout/custom/poll?pollingToken=${encodeURIComponent(state.pollingToken)}`,
          { method: "GET" },
        );
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Sessão de pagamento expirou. Contate seu atendente.");
            setState({
              kind: "error",
              message: "Sessão de pagamento expirou.",
            });
          }
          return;
        }
        if (body.status === "ACTIVE") {
          setState({ kind: "success", plan: state.plan, redirecting: true });
          toast.success("Pagamento confirmado!");
          // Força refresh do profile + availability antes de navegar. Sem isso
          // o AuthGuard trava em loading e o widget de plano fica mostrando trial.
          await Promise.all([handleGetProfile(true), handleGetAvailableRecording()]);
          setTimeout(() => router.push("/"), 1500);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };
    pollTimerRef.current = setInterval(poll, 3000);
    // First poll immediate
    poll();
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [state, router]);

  const plan =
    state.kind === "ready" ||
    state.kind === "pix_awaiting" ||
    state.kind === "success"
      ? state.plan
      : null;

  const priceLabel = useMemo(() => {
    if (!plan) return formatBRL(0);
    if (paymentType === "PIX" && billingCycle === "MONTHLY")
      return formatBRL(plan.pixMonthlyPrice);
    if (paymentType === "PIX" && billingCycle === "YEARLY")
      return formatBRL(plan.pixYearlyPrice);
    if (paymentType === "CREDIT_CARD" && billingCycle === "MONTHLY")
      return formatBRL(plan.creditMonthlyPrice);
    return formatBRL(plan.creditYearlyPrice);
  }, [plan, paymentType, billingCycle]);

  const isExpired = !!plan && new Date(plan.expiresAt).getTime() <= now;
  const needsBillingInfo = !!plan && !plan.hasCustomerId;

  const validateBilling = (): string | null => {
    if (!billingName.trim()) return "Nome é obrigatório";
    if (!billingEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail))
      return "E-mail inválido";
    if (onlyDigits(billingCpf).length < 11) return "CPF/CNPJ inválido";
    if (onlyDigits(billingPhone).length < 10) return "Telefone inválido";
    return null;
  };

  const validateCard = (): string | null => {
    if (!cardHolder.trim()) return "Nome do titular obrigatório";
    if (onlyDigits(cardNumber).length < 13) return "Número de cartão inválido";
    const [mm, yy] = cardExpiry.split("/");
    if (!mm || !yy || mm.length !== 2 || yy.length < 2)
      return "Data de validade inválida";
    const monthNum = parseInt(mm, 10);
    if (monthNum < 1 || monthNum > 12) return "Mês da validade inválido";
    if (onlyDigits(cardCvv).length < 3) return "CVV inválido";
    if (onlyDigits(billingPostal).length < 8) return "CEP obrigatório";
    if (!billingAddressNumber.trim()) return "Número obrigatório";
    return null;
  };

  const buildBillingInfo = () =>
    needsBillingInfo
      ? {
          name: billingName.trim(),
          email: billingEmail.trim().toLowerCase(),
          cpfCnpj: onlyDigits(billingCpf),
          mobilePhone: onlyDigits(billingPhone),
          postalCode: onlyDigits(billingPostal) || undefined,
          addressNumber: billingAddressNumber.trim() || undefined,
        }
      : undefined;

  const handleConfirm = async () => {
    if (!plan || isExpired || state.kind !== "ready") return;

    if (needsBillingInfo || paymentType === "CREDIT_CARD") {
      const billErr = validateBilling();
      if (billErr) {
        toast.error(billErr);
        return;
      }
    }

    if (paymentType === "CREDIT_CARD") {
      const cardErr = validateCard();
      if (cardErr) {
        toast.error(cardErr);
        return;
      }
    }

    setSubmitting(true);
    try {
      if (paymentType === "PIX") {
        const res = await fetch("/api/checkout/custom/consume-pix", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            billingCycle,
            billingInfo: buildBillingInfo(),
          }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(body.message || "Erro ao iniciar pagamento PIX");
          return;
        }
        setState({
          kind: "pix_awaiting",
          plan,
          qrCode: body.qrCode,
          pollingToken: body.pollingToken,
        });
      } else {
        const [mm, yy] = cardExpiry.split("/");
        const expiryYear = yy.length === 2 ? `20${yy}` : yy;

        const res = await fetch("/api/checkout/custom/consume-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            token,
            billingCycle,
            creditCard: {
              holderName: cardHolder.trim(),
              number: onlyDigits(cardNumber),
              expiryMonth: mm,
              expiryYear,
              ccv: onlyDigits(cardCvv),
            },
            creditCardHolderInfo: {
              name: billingName.trim(),
              email: billingEmail.trim().toLowerCase(),
              cpfCnpj: onlyDigits(billingCpf),
              postalCode: onlyDigits(billingPostal),
              addressNumber: billingAddressNumber.trim(),
              phone: onlyDigits(billingPhone),
            },
            billingInfo: buildBillingInfo(),
          }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(body.message || "Erro ao processar cartão");
          return;
        }
        setState({ kind: "success", plan, redirecting: true });
        toast.success("Pagamento aprovado!");
        // Força refresh do profile no SessionProvider antes de navegar,
        // senão o AuthGuard do layout privado trava no loading.
        await handleGetProfile(true);
        setTimeout(() => router.push("/"), 1500);
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPix = async () => {
    if (state.kind !== "pix_awaiting") return;
    try {
      await navigator.clipboard.writeText(state.qrCode.payload);
      toast.success("Código PIX copiado");
    } catch {
      toast.error("Não foi possível copiar. Copie manualmente.");
    }
  };

  // ─── Render ──────────────────────────────────────────────────────

  if (state.kind === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full rounded-2xl bg-white shadow-xl p-8 flex flex-col items-center text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Link indisponível
          </h1>
          <p className="text-sm text-gray-600">{state.message}</p>
          <p className="text-xs text-gray-400 mt-6">
            Entre em contato com seu atendente para receber um novo link.
          </p>
        </div>
      </div>
    );
  }

  if (state.kind === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full rounded-2xl bg-white shadow-xl p-8 flex flex-col items-center text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tudo certo, {state.plan.user?.name?.split(" ")[0] || "bem-vindo"}!
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Sua assinatura está ativa. Redirecionando para a plataforma...
          </p>
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (state.kind === "pix_awaiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <QrCode className="h-7 w-7" />
                Pague com PIX
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                Escaneie o QR Code abaixo ou copie o código. Você será redirecionado assim que o pagamento for confirmado.
              </p>
            </div>
            <div className="p-6 md:p-8 flex flex-col items-center gap-4">
              {state.qrCode.encodedImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`data:image/png;base64,${state.qrCode.encodedImage}`}
                  alt="QR Code PIX"
                  className="w-64 h-64 rounded-xl border border-gray-200 shadow-sm"
                />
              ) : (
                <div className="w-64 h-64 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-500">
                  QR Code indisponível
                </div>
              )}
              <div className="w-full">
                <label className="text-xs font-semibold text-gray-500">
                  Ou copie o código PIX (copia e cola)
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <textarea
                    readOnly
                    value={state.qrCode.payload}
                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs font-mono resize-none h-20"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="flex flex-col items-center gap-1 rounded-lg bg-gray-800 text-white px-3 py-2 text-xs font-medium hover:bg-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </button>
                </div>
              </div>
              <div className="w-full rounded-lg bg-blue-50 border border-blue-200 p-3 flex items-center gap-2 text-xs text-blue-800">
                <Loader2 className="h-4 w-4 animate-spin" />
                Aguardando confirmação do pagamento...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // state === "ready"
  const p = state.plan;
  const formDisabled = submitting || isExpired;
  const pixAnyEnabled = p.pixMonthlyEnabled || p.pixYearlyEnabled;
  const cardAnyEnabled = p.creditMonthlyEnabled || p.creditYearlyEnabled;
  const monthlyEnabledForCurrent =
    paymentType === "PIX" ? p.pixMonthlyEnabled : p.creditMonthlyEnabled;
  const yearlyEnabledForCurrent =
    paymentType === "PIX" ? p.pixYearlyEnabled : p.creditYearlyEnabled;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 md:p-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-300">
                Plano personalizado
              </span>
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  isExpired
                    ? "bg-red-500/20 text-red-200"
                    : "bg-emerald-500/20 text-emerald-200",
                )}
              >
                <Timer className="h-3.5 w-3.5" />
                {isExpired
                  ? "Link expirado"
                  : `Expira em ${formatRemaining(p.expiresAt, now)}`}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {p.name || p.basePlan?.name || "Plano personalizado"}
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Para {p.user?.name} ({p.user?.email})
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Payment method — só mostra se mais de uma opção habilitada */}
            {pixAnyEnabled && cardAnyEnabled && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Forma de pagamento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setPaymentType("PIX");
                      // ao trocar método, auto-seleciona ciclo disponível
                      if (!p.pixMonthlyEnabled && p.pixYearlyEnabled)
                        setBillingCycle("YEARLY");
                      else if (p.pixMonthlyEnabled) setBillingCycle("MONTHLY");
                    }}
                    disabled={formDisabled}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all",
                      paymentType === "PIX"
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                      formDisabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <QrCode className="h-4 w-4" />
                    PIX
                  </button>
                  <button
                    onClick={() => {
                      setPaymentType("CREDIT_CARD");
                      if (!p.creditMonthlyEnabled && p.creditYearlyEnabled)
                        setBillingCycle("YEARLY");
                      else if (p.creditMonthlyEnabled) setBillingCycle("MONTHLY");
                    }}
                    disabled={formDisabled}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all",
                      paymentType === "CREDIT_CARD"
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                      formDisabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <CreditCard className="h-4 w-4" />
                    Cartão
                  </button>
                </div>
              </div>
            )}

            {/* Billing cycle — só mostra se houver mais de um ciclo disponível para o método atual */}
            {monthlyEnabledForCurrent && yearlyEnabledForCurrent && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Ciclo de cobrança
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBillingCycle("MONTHLY")}
                    disabled={formDisabled}
                    className={cn(
                      "rounded-xl border-2 p-3 text-sm font-medium transition-all",
                      billingCycle === "MONTHLY"
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                      formDisabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    Mensal
                  </button>
                  <button
                    onClick={() => setBillingCycle("YEARLY")}
                    disabled={formDisabled}
                    className={cn(
                      "rounded-xl border-2 p-3 text-sm font-medium transition-all",
                      billingCycle === "YEARLY"
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                      formDisabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    Anual
                  </button>
                </div>
              </div>
            )}

            {/* Billing info (sempre mostra se for cartão, ou se user não tem cpfCnpj) */}
            {(paymentType === "CREDIT_CARD" || needsBillingInfo) && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">
                  Dados do titular
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    disabled={formDisabled}
                  />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    disabled={formDisabled}
                  />
                  <input
                    type="text"
                    placeholder="CPF ou CNPJ"
                    value={billingCpf}
                    onChange={(e) => setBillingCpf(maskCpfCnpj(e.target.value))}
                    maxLength={18}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    disabled={formDisabled}
                  />
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(maskPhone(e.target.value))}
                    maxLength={16}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    disabled={formDisabled}
                  />
                  {paymentType === "CREDIT_CARD" && (
                    <>
                      <input
                        type="text"
                        placeholder="CEP (8 dígitos)"
                        value={billingPostal}
                        onChange={(e) =>
                          setBillingPostal(onlyDigits(e.target.value).slice(0, 8))
                        }
                        maxLength={8}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                        disabled={formDisabled}
                      />
                      <input
                        type="text"
                        placeholder="Número"
                        value={billingAddressNumber}
                        onChange={(e) => setBillingAddressNumber(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                        disabled={formDisabled}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Credit card fields */}
            {paymentType === "CREDIT_CARD" && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 block">
                  Dados do cartão
                </label>
                <input
                  type="text"
                  placeholder="Nome impresso no cartão"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                  disabled={formDisabled}
                />
                <input
                  type="text"
                  placeholder="Número do cartão"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(maskCard(e.target.value))}
                  maxLength={19}
                  inputMode="numeric"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                  disabled={formDisabled}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(maskExpiryDate(e.target.value))}
                    maxLength={5}
                    inputMode="numeric"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    disabled={formDisabled}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(onlyDigits(e.target.value).slice(0, 4))}
                    maxLength={4}
                    inputMode="numeric"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    disabled={formDisabled}
                  />
                </div>
              </div>
            )}

            {/* Price summary */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-600">Total a pagar</span>
                <span className="text-3xl font-bold text-gray-900">
                  {priceLabel}
                </span>
              </div>
            </div>

            {/* Confirm */}
            <button
              onClick={handleConfirm}
              disabled={formDisabled}
              className="w-full rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 py-4 text-sm font-bold text-white shadow-xl transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : isExpired ? (
                "Link expirou"
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  {paymentType === "PIX"
                    ? "Gerar QR Code PIX"
                    : "Pagar com cartão"}
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              Pagamento processado pela Asaas. Seus dados estão protegidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
