"use client";

import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  CreditCard,
  Crown,
  Headphones,
  Lock,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Shield,
  Sparkles,
  Tag,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

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

const onlyDigits = (v: string) => v.replace(/\D/g, "");

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v,
  );

function maskCpfCnpj(value: string): string {
  const v = onlyDigits(value);
  if (v.length <= 11) {
    return v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return v
    .substring(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function maskCep(v: string): string {
  return onlyDigits(v).slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
}

function maskPhoneBR(v: string): string {
  let d = onlyDigits(v).slice(0, 13);
  let prefix = "";
  if (d.startsWith("55")) {
    prefix = "+55 ";
    d = d.slice(2);
  }
  if (d.length <= 2) return prefix + d;
  if (d.length <= 6) return `${prefix}(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `${prefix}(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `${prefix}(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

function maskCardNumber(v: string): string {
  return onlyDigits(v)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function maskExpiry(v: string): string {
  const d = onlyDigits(v).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function parseExpiry(value: string): { month: string; year: string } | null {
  const m = value.match(/^(\d{2})[\/\-]?(\d{2}|\d{4})$/);
  if (!m) return null;
  const month = m[1];
  let year = m[2];
  if (Number(month) < 1 || Number(month) > 12) return null;
  if (year.length === 2) year = `20${year}`;
  return { month, year };
}

const UNLIMITED_THRESHOLD = 720;

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

function getIconFor(name: string) {
  const lower = name?.toLowerCase() ?? "";
  if (lower.includes("ultra")) return Crown;
  if (lower.includes("corporat") || lower.includes("team")) return Users;
  return Headphones;
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { GetAPI, PostAPI, PutAPI } = useApiContext();
  const { profile, setProfile, handleGetAvailableRecording } = useSession();

  const planIdParam = searchParams.get("planId");
  const cycleParam = (searchParams.get("cycle") as BillingCycle) || "MONTHLY";
  const methodParam = (searchParams.get("method") as PaymentMethod) || "PIX";

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [cycle, setCycle] = useState<BillingCycle>(cycleParam);
  const [method, setMethod] = useState<PaymentMethod>(methodParam);

  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [house, setHouse] = useState("");
  const [holder, setHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [exp, setExp] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coupon, setCoupon] = useState("");

  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pixPayload, setPixPayload] = useState("");
  const [pixEncodedImage, setPixEncodedImage] = useState<string | null>(null);
  const [pixSignatureId, setPixSignatureId] = useState<string | null>(null);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === planIdParam) ?? null,
    [plans, planIdParam],
  );

  const basePrice = selectedPlan
    ? getPlanPrice(selectedPlan, cycle, method)
    : 0;
  const discounted = basePrice * (1 - discountPercent / 100);
  const isFree = discountPercent === 100;
  const finalPrice = isFree ? 0 : discounted;

  const fetchPlans = useCallback(async () => {
    setIsLoadingPlans(true);
    try {
      const res = await GetAPI("/signature-plan/channel/WEB", true);
      if (res.status === 200 && res.body?.plans) {
        setPlans(res.body.plans as Plan[]);
      }
    } catch {
      toast.error("Não foi possível carregar o plano.");
    } finally {
      setIsLoadingPlans(false);
    }
  }, [GetAPI]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (!profile) return;
    setCpf((v) => v || profile.cpfCnpj || "");
    setCep((v) => v || profile.postalCode || "");
    setAddress((v) => v || profile.address || "");
    setHouse((v) => v || profile.addressNumber || "");
    setHolder((v) => v || profile.name || "");
    setEmail((v) => v || profile.email || "");
    setPhone((v) => v || profile.mobilePhone || "");
  }, [profile]);

  useEffect(() => {
    const cleaned = onlyDigits(cep);
    if (cleaned.length !== 8) return;
    fetch(`https://brasilapi.com.br/api/cep/v2/${cleaned}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data?.cep) return;
        setAddress(
          [data.street, data.neighborhood, data.city]
            .filter(Boolean)
            .join(", ") + (data.state ? ` - ${data.state}` : ""),
        );
      })
      .catch(() => {});
  }, [cep]);

  useEffect(() => {
    if (!pixGenerated || !pixSignatureId || isFree) return;
    let mounted = true;

    const tick = async () => {
      try {
        const res = await GetAPI(`/signature/${pixSignatureId}/status`, true);
        if (!mounted) return;
        if ([200, 201].includes(res.status) && res.body?.isPaid) {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          await handleGetAvailableRecording();
          setIsSuccess(true);
        }
      } catch {
        /* keep trying */
      }
    };

    tick();
    pollingRef.current = setInterval(tick, 5000);
    const timeoutId = setTimeout(() => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }, 900000);

    return () => {
      mounted = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      clearTimeout(timeoutId);
    };
  }, [pixGenerated, pixSignatureId, isFree, GetAPI, handleGetAvailableRecording]);

  const canSubmit = useMemo(() => {
    if (!selectedPlan) return false;
    const cpfOk = onlyDigits(cpf).length >= 11;
    const holderOk = holder.trim().length >= 3;
    const emailOk = email.trim().length > 3 && email.includes("@");
    const phoneOk = onlyDigits(phone).length >= 10;
    const cepOk = onlyDigits(cep).length >= 8;
    const addressOk = address.trim().length > 0;
    const houseOk = house.trim().length > 0;
    const addressSectionOk = cepOk && addressOk && houseOk;

    if (isFree) return cpfOk && holderOk && emailOk && phoneOk;
    if (method === "PIX")
      return cpfOk && holderOk && emailOk && phoneOk && addressSectionOk;

    const cardOk = onlyDigits(cardNumber).length >= 12;
    const cvvOk = onlyDigits(cvv).length >= 3;
    const expOk = !!parseExpiry(exp);
    return (
      cpfOk &&
      holderOk &&
      emailOk &&
      phoneOk &&
      addressSectionOk &&
      cardOk &&
      cvvOk &&
      expOk
    );
  }, [
    selectedPlan,
    cpf,
    holder,
    email,
    phone,
    cep,
    address,
    house,
    cardNumber,
    cvv,
    exp,
    isFree,
    method,
  ]);

  async function updateProfileFromForm(): Promise<boolean> {
    const payload: Record<string, string> = {
      name: holder,
      email: email.trim(),
      cpfCnpj: onlyDigits(cpf),
      mobilePhone: onlyDigits(phone),
    };
    if (!isFree) {
      payload.postalCode = onlyDigits(cep);
      payload.address = address.trim();
      payload.addressNumber = house.trim();
    }
    const result = await PutAPI("/user", payload, true);
    if (result.status === 200 && profile) {
      setProfile({
        ...profile,
        name: payload.name,
        email: payload.email,
        cpfCnpj: payload.cpfCnpj ?? null,
        mobilePhone: payload.mobilePhone ?? null,
        postalCode: payload.postalCode ?? null,
        address: payload.address ?? null,
        addressNumber: payload.addressNumber ?? null,
      });
      return true;
    }
    return false;
  }

  async function submitCard() {
    if (!selectedPlan) return;
    const finalCoupon = coupon.trim();
    const expParsed = parseExpiry(exp);
    if (!expParsed) throw new Error("Data de expiração inválida.");

    const body = {
      planId: selectedPlan.id,
      billingCycle: cycle,
      code: finalCoupon || undefined,
      creditCard: {
        holderName: holder.toUpperCase(),
        number: onlyDigits(cardNumber),
        expiryMonth: expParsed.month,
        expiryYear: expParsed.year,
        ccv: onlyDigits(cvv),
      },
      creditCardHolderInfo: {
        name: holder,
        email: email.trim(),
        cpfCnpj: onlyDigits(cpf),
        postalCode: onlyDigits(cep),
        addressNumber: house.trim(),
        phone: onlyDigits(phone),
      },
      billingInfo: {
        name: holder,
        email: email.trim(),
        cpfCnpj: onlyDigits(cpf),
        mobilePhone: onlyDigits(phone),
        postalCode: onlyDigits(cep),
        address: address.trim(),
        addressNumber: house.trim(),
      },
    };
    const resp = await PostAPI("/signature/credit/new", body, true);
    if ([200, 201].includes(resp.status)) {
      await handleGetAvailableRecording();
      setIsSuccess(true);
    }
    return resp;
  }

  async function submitPix(): Promise<{ status: number; body?: any }> {
    if (!selectedPlan) return { status: 400, body: null };
    const finalCoupon = coupon.trim();
    const body: Record<string, unknown> = {
      billingCycle: cycle,
      code: finalCoupon || undefined,
    };
    if (!isFree) {
      body.billingInfo = {
        name: holder,
        email: email.trim(),
        cpfCnpj: onlyDigits(cpf),
        mobilePhone: onlyDigits(phone),
        postalCode: onlyDigits(cep),
        address: address.trim(),
        addressNumber: house.trim(),
      };
    }
    const resp = await PostAPI(
      `/signature/pix/${selectedPlan.id}`,
      body,
      true,
    );
    if ([200, 201].includes(resp.status)) {
      if (isFree) {
        await handleGetAvailableRecording();
        setIsSuccess(true);
      } else if (resp.body?.payment) {
        setPixPayload(resp.body.payment.payload || "");
        setPixEncodedImage(resp.body.payment.encodedImage || null);
        setPixSignatureId(resp.body.signatureId || null);
        setPixGenerated(true);
      }
    }
    return resp;
  }

  async function handleSubmit() {
    if (!canSubmit) {
      toast.error(
        method === "PIX" || isFree
          ? "Verifique seus dados pessoais."
          : "Verifique os dados do cartão e endereço.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProfileFromForm();
      if (method === "PIX" || isFree) {
        const resp = await submitPix();
        if (resp && ![200, 201].includes(resp.status)) {
          toast.error(
            resp.body?.message ||
              resp.body?.errors?.[0]?.description ||
              "Não foi possível gerar o PIX.",
          );
        }
        return;
      }
      const resp = await submitCard();
      if (resp && ![200, 201].includes(resp.status)) {
        toast.error(
          resp.body?.message ||
            resp.body?.errors?.[0]?.description ||
            "Não foi possível processar o pagamento.",
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function validateCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    setIsValidatingCoupon(true);
    try {
      const resp = await GetAPI(`/coupon/${code}`, false);
      if (resp.status === 200 && resp.body?.discount !== undefined) {
        const discount = Number(resp.body.discount);
        setDiscountPercent(discount);
        toast.success(
          discount === 100
            ? "Cupom 100% OFF aplicado!"
            : `Cupom de ${discount}% aplicado!`,
        );
      } else {
        setDiscountPercent(0);
        toast.error("Cupom não encontrado.");
      }
    } catch {
      setDiscountPercent(0);
      toast.error("Erro ao validar cupom.");
    } finally {
      setIsValidatingCoupon(false);
    }
  }

  function changeMethod(m: PaymentMethod) {
    setMethod(m);
    setPixGenerated(false);
    setPixCopied(false);
    setPixPayload("");
    setPixEncodedImage(null);
    setPixSignatureId(null);
  }

  async function copyPix() {
    if (!pixPayload) return;
    try {
      await navigator.clipboard.writeText(pixPayload);
      setPixCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setPixCopied(false), 3000);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  if (isLoadingPlans) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-sm text-gray-500">Plano não encontrado.</p>
        <button
          onClick={() => router.push("/new-home/plans")}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
        >
          <ArrowLeft size={14} />
          Voltar para planos
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return <SuccessScreen onHome={() => router.push("/new-home")} />;
  }

  const Icon = getIconFor(selectedPlan.name);

  return (
    <div className="flex w-full flex-col gap-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-3"
      >
        <button
          onClick={() => router.push("/new-home/plans")}
          className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={12} />
          Voltar para os planos
        </button>
        <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Checkout
        </p>
        <h1 className="text-balance text-3xl font-semibold text-gray-900 md:text-4xl">
          Falta pouco para liberar o{" "}
          <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
            {selectedPlan.name}
          </span>
          .
        </h1>
      </motion.section>

      <AnimatePresence mode="wait">
        {pixGenerated ? (
          <PixPanel
            key="pix"
            price={fmtBRL(finalPrice)}
            payload={pixPayload}
            encodedImage={pixEncodedImage}
            copied={pixCopied}
            onCopy={copyPix}
            onChangeMethod={() => changeMethod("CREDIT")}
          />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]"
          >
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader title="Como você quer pagar" />
                <div className="grid grid-cols-2 gap-2 p-1">
                  <MethodPill
                    active={method === "PIX"}
                    onClick={() => changeMethod("PIX")}
                    icon={<QrCode size={14} />}
                    label="PIX"
                    hint="Aprovação instantânea"
                  />
                  <MethodPill
                    active={method === "CREDIT"}
                    onClick={() => changeMethod("CREDIT")}
                    icon={<CreditCard size={14} />}
                    label="Cartão"
                    hint={cycle === "YEARLY" ? "Até 12x" : "Recorrente"}
                  />
                </div>
                <div className="mt-4 inline-flex items-center gap-1 rounded-full border border-gray-200/70 bg-white p-1">
                  {(["MONTHLY", "YEARLY"] as BillingCycle[]).map((c) => {
                    const active = cycle === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setCycle(c)}
                        className={cn(
                          "relative rounded-full px-3.5 py-1 text-xs font-medium whitespace-nowrap transition",
                          active
                            ? "text-white"
                            : "text-gray-600 hover:text-gray-900",
                        )}
                      >
                        {active && (
                          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-700" />
                        )}
                        <span className="relative">
                          {c === "MONTHLY" ? "Mensal" : "Anual"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Seus dados"
                  icon={<User size={14} />}
                  hint="Usamos isso para emitir a cobrança."
                />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field
                    label="Nome completo"
                    placeholder="Como no documento"
                    value={holder}
                    onChange={setHolder}
                  />
                  <Field
                    label="CPF / CNPJ"
                    placeholder="000.000.000-00"
                    value={maskCpfCnpj(cpf)}
                    onChange={(v) => setCpf(onlyDigits(v))}
                  />
                  <Field
                    label="E-mail"
                    placeholder="voce@email.com"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    icon={<Mail size={14} />}
                  />
                  <Field
                    label="Telefone"
                    placeholder="(11) 99999-9999"
                    value={maskPhoneBR(phone)}
                    onChange={(v) => setPhone(onlyDigits(v))}
                    icon={<Phone size={14} />}
                  />
                </div>
              </Card>

              {!isFree && (
                <Card>
                  <CardHeader
                    title="Endereço de cobrança"
                    icon={<MapPin size={14} />}
                  />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[140px_1fr_120px]">
                    <Field
                      label="CEP"
                      placeholder="00000-000"
                      value={maskCep(cep)}
                      onChange={(v) => setCep(onlyDigits(v))}
                    />
                    <Field
                      label="Endereço"
                      placeholder="Rua, bairro, cidade"
                      value={address}
                      onChange={setAddress}
                    />
                    <Field
                      label="Número"
                      placeholder="123"
                      value={house}
                      onChange={setHouse}
                    />
                  </div>
                </Card>
              )}

              {method === "CREDIT" && !isFree && (
                <Card>
                  <CardHeader
                    title="Cartão de crédito"
                    icon={<CreditCard size={14} />}
                  />
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px_100px]">
                    <Field
                      label="Número do cartão"
                      placeholder="1234 5678 9012 3456"
                      value={maskCardNumber(cardNumber)}
                      onChange={(v) => setCardNumber(onlyDigits(v))}
                      className="md:col-span-3"
                    />
                    <Field
                      label="Nome impresso"
                      placeholder="Como está no cartão"
                      value={holder}
                      onChange={setHolder}
                      className="md:col-span-1 md:row-start-2"
                    />
                    <Field
                      label="Validade"
                      placeholder="MM/AA"
                      value={maskExpiry(exp)}
                      onChange={setExp}
                    />
                    <Field
                      label="CVV"
                      placeholder="123"
                      value={onlyDigits(cvv).slice(0, 4)}
                      onChange={(v) => setCvv(onlyDigits(v))}
                    />
                  </div>
                </Card>
              )}

              <Card>
                <CardHeader title="Cupom" icon={<Tag size={14} />} />
                <div className="flex items-center gap-2">
                  <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100">
                    <Tag size={14} className="text-gray-400" />
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      placeholder="Tem um cupom?"
                      className="flex-1 bg-transparent text-sm text-gray-800 uppercase placeholder-gray-300 outline-none"
                    />
                    {discountPercent > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <Check size={10} strokeWidth={3} />-{discountPercent}%
                      </span>
                    )}
                  </div>
                  <button
                    onClick={validateCoupon}
                    disabled={isValidatingCoupon || !coupon.trim()}
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-40"
                  >
                    {isValidatingCoupon ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      "Aplicar"
                    )}
                  </button>
                </div>
              </Card>
            </div>

            <OrderSummary
              plan={selectedPlan}
              Icon={Icon}
              cycle={cycle}
              method={method}
              basePrice={basePrice}
              finalPrice={finalPrice}
              discountPercent={discountPercent}
              isFree={isFree}
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4 rounded-2xl border border-gray-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      {children}
    </motion.div>
  );
}

function CardHeader({
  title,
  icon,
  hint,
}: {
  title: string;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            {icon}
          </span>
        )}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

function MethodPill({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition",
        active
          ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg shadow-gray-900/20"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          active ? "bg-white/10 text-white" : "bg-white text-gray-900",
        )}
      >
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold">{label}</span>
        <span
          className={cn("text-[11px]", active ? "text-white/60" : "text-gray-400")}
        >
          {hint}
        </span>
      </span>
      {active && (
        <Check size={14} className="ml-auto" strokeWidth={2.5} />
      )}
    </button>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
  className,
}: {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-xl border bg-white px-3.5 transition",
          focused
            ? "border-gray-400 ring-2 ring-gray-100"
            : "border-gray-200",
        )}
      >
        {icon && <span className="text-gray-400">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-300 outline-none"
        />
      </div>
    </div>
  );
}

function OrderSummary({
  plan,
  Icon,
  cycle,
  method,
  basePrice,
  finalPrice,
  discountPercent,
  isFree,
  canSubmit,
  isSubmitting,
  onSubmit,
}: {
  plan: Plan;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  cycle: BillingCycle;
  method: PaymentMethod;
  basePrice: number;
  finalPrice: number;
  discountPercent: number;
  isFree: boolean;
  canSubmit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  const monthlyEquivalent =
    cycle === "YEARLY" ? finalPrice / 12 : finalPrice;
  const recordLabel = getRecordLabel(plan);

  return (
    <aside className="relative flex h-fit flex-col gap-5 overflow-hidden rounded-3xl border border-transparent bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 text-white shadow-[0_20px_50px_-20px_rgba(17,24,39,0.6)] lg:sticky lg:top-24">
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-amber-400/30 via-orange-500/20 to-transparent blur-3xl" />
      <div className="absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-transparent blur-3xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase">
            Resumo
          </p>
          <p className="text-sm font-semibold">{plan.name}</p>
        </div>
      </div>

      <div className="relative flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
        <Zap size={12} className="text-amber-300" />
        <span className="text-[11px] font-medium text-white/80">
          {recordLabel} · {cycle === "YEARLY" ? "Anual" : "Mensal"} ·{" "}
          {method === "PIX" ? "PIX" : "Cartão"}
        </span>
      </div>

      <div className="relative">
        {isFree ? (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold tracking-tight">
                Grátis
              </span>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Cupom 100% OFF aplicado.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold tracking-tight">
                {fmtBRL(monthlyEquivalent)}
              </span>
              <span className="text-sm text-white/50">/mês</span>
            </div>
            <p className="mt-1 text-xs text-white/50">
              {cycle === "YEARLY"
                ? `${fmtBRL(finalPrice)} cobrado anualmente`
                : method === "PIX"
                  ? "via PIX, cobrança mensal"
                  : "no cartão, cobrança mensal"}
            </p>
          </>
        )}
      </div>

      {discountPercent > 0 && !isFree && (
        <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
          <span className="text-white/60">Desconto</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
            -{discountPercent}% ({fmtBRL(basePrice - finalPrice)})
          </span>
        </div>
      )}

      <div className="relative h-px w-full bg-white/10" />

      <ul className="relative flex flex-col gap-2 text-xs text-white/70">
        <li className="flex items-center gap-2">
          <Shield size={12} className="text-white/50" />
          Pagamento processado com criptografia
        </li>
        <li className="flex items-center gap-2">
          <Sparkles size={12} className="text-white/50" />
          Cancele quando quiser, sem fidelidade
        </li>
        <li className="flex items-center gap-2">
          <Lock size={12} className="text-white/50" />
          Seus dados ficam protegidos
        </li>
      </ul>

      <button
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting}
        className={cn(
          "relative inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition",
          canSubmit && !isSubmitting
            ? "shadow-lg shadow-black/20 hover:scale-[1.02]"
            : "opacity-60",
        )}
      >
        {isSubmitting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        ) : (
          <>
            {isFree
              ? "Ativar assinatura grátis"
              : method === "PIX"
                ? "Gerar PIX"
                : "Finalizar pagamento"}
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </aside>
  );
}

function PixPanel({
  price,
  payload,
  encodedImage,
  copied,
  onCopy,
  onChangeMethod,
}: {
  price: string;
  payload: string;
  encodedImage: string | null;
  copied: boolean;
  onCopy: () => void;
  onChangeMethod: () => void;
}) {
  const qrUri = encodedImage
    ? encodedImage.startsWith("data:")
      ? encodedImage
      : `data:image/png;base64,${encodedImage}`
    : null;

  return (
    <motion.div
      key="pix-panel"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]"
    >
      <Card>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-md">
            <QrCode size={20} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Escaneie para pagar
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Abra o app do seu banco e aponte a câmera para o QR Code.
            </p>
          </div>

          <div className="flex h-56 w-56 items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {qrUri ? (
              <img
                src={qrUri}
                alt="QR Code PIX"
                className="h-full w-full object-contain"
              />
            ) : (
              <QrCode size={140} className="text-gray-300" strokeWidth={1} />
            )}
          </div>

          <div className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
              Valor
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{price}</p>
          </div>

          <button
            onClick={onCopy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.01]"
          >
            {copied ? (
              <>
                <ClipboardCheck size={14} /> Código copiado
              </>
            ) : (
              <>
                <Copy size={14} /> Copiar código PIX
              </>
            )}
          </button>

          <p className="max-w-md truncate rounded-full bg-white px-3 py-1.5 text-[11px] text-gray-400 ring-1 ring-gray-100">
            {payload || "—"}
          </p>
        </div>
      </Card>

      <aside className="relative flex h-fit flex-col gap-5 overflow-hidden rounded-3xl border border-transparent bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 text-white shadow-[0_20px_50px_-20px_rgba(17,24,39,0.6)] lg:sticky lg:top-24">
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-amber-400/30 via-orange-500/20 to-transparent blur-3xl" />

        <div className="relative flex items-center gap-2">
          <span className="flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <p className="text-xs font-medium text-white/80">
            Aguardando pagamento
          </p>
        </div>

        <p className="relative text-sm leading-relaxed text-white/70">
          Assim que o pagamento for confirmado, sua assinatura é liberada
          automaticamente. Você pode deixar essa aba aberta.
        </p>

        <div className="relative h-px w-full bg-white/10" />

        <ul className="relative flex flex-col gap-2 text-xs text-white/60">
          <li className="flex items-center gap-2">
            <Check size={12} className="text-emerald-300" />
            QR Code gerado
          </li>
          <li className="flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/40" />
            </span>
            Aguardando confirmação do banco
          </li>
          <li className="flex items-center gap-2 opacity-40">
            <span className="h-3 w-3" />
            Assinatura ativada
          </li>
        </ul>

        <button
          onClick={onChangeMethod}
          className="relative inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          Pagar com cartão
        </button>
      </aside>
    </motion.div>
  );
}

function SuccessScreen({ onHome }: { onHome: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-[60vh] flex-col items-center justify-center gap-8 overflow-hidden rounded-3xl border border-gray-200/70 bg-white p-10 text-center shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]"
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-300/40 via-emerald-200/30 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-amber-300/30 to-transparent blur-3xl" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/40"
      >
        <CheckCircle2 size={36} strokeWidth={2.2} />
      </motion.div>

      <div className="relative flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
          Pagamento confirmado
        </p>
        <h2 className="text-balance text-3xl font-semibold text-gray-900 md:text-4xl">
          Sua assinatura está{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            ativa
          </span>
          .
        </h2>
        <p className="mt-1 max-w-md text-sm leading-relaxed text-gray-500">
          Tudo pronto. Você já pode aproveitar todos os recursos do seu plano —
          comece pela sua próxima gravação.
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-3">
        <button
          onClick={onHome}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
        >
          Ir para o painel
          <ArrowRight size={14} />
        </button>
        <a
          href="https://wa.me/5541997819114"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-gray-500 transition hover:text-gray-900"
        >
          Falar com suporte
        </a>
      </div>
    </motion.div>
  );
}
