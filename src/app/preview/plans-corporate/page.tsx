import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  Loader2,
  PartyPopper,
  QrCode,
  Shield,
  Ticket,
  X,
} from "lucide-react";
import { mockPlans } from "../_mocks/data";

export default function PlansCorporate() {
  return (
    <div
      className="min-h-screen bg-[#0d0d0d] text-white"
      style={{ fontFamily: "var(--preview-font-inter)" }}
    >
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
          <a href="/preview/home-corporate" className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o dashboard
          </a>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5" />
            Transação segura · SSL 256-bit
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
            <Shield className="h-3 w-3" />
            Planos & Preços
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Escolha o plano certo para você
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            Pague apenas pelo que usa. Cancele quando quiser.
          </p>

          <div className="mt-6 inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1 text-sm">
            <button className="rounded-md px-4 py-1.5 text-slate-400 hover:text-white">
              Mensal
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-1.5 font-semibold text-white">
              Anual
              <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {mockPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-xl border bg-[#151515] p-6 ${
                plan.highlight ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]" : "border-white/10"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {plan.badge}
                </span>
              )}
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {plan.name}
              </span>
              <p className="mt-1 text-sm text-slate-400">{plan.subtitle}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  R$ {plan.pricing.yearly}
                </span>
                <span className="text-xs text-slate-400">/mês</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                R$ {plan.pricing.monthly} cobrado mensalmente
              </p>
              <ul className="my-6 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2">
                    {f.included ? (
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </span>
                    ) : (
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/5">
                        <X className="h-2.5 w-2.5 text-slate-500" />
                      </span>
                    )}
                    <span className={f.included ? "text-slate-200" : "text-slate-500 line-through"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-auto w-full rounded-md px-4 py-2.5 text-sm font-semibold ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                Assinar {plan.name.toLowerCase()}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout */}
        <section className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-[1fr_380px]">
          <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Checkout — Plano Ultra Anual
            </span>
            <h2 className="mt-2 text-xl font-bold">Finalize sua assinatura</h2>

            <div className="mt-6 flex items-center gap-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
              <Ticket className="h-8 w-8" />
              <div>
                <div className="text-lg font-bold">100% OFF</div>
                <div className="text-xs">Assinatura Gratuita Garantida (cupom LAUNCH)</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 grid grid-cols-2 gap-1 rounded-md bg-white/5 p-1">
              <button className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                <QrCode className="h-4 w-4" />
                PIX
              </button>
              <button className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-slate-400 hover:text-white">
                <CreditCard className="h-4 w-4" />
                Cartão
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Field label="Nome completo" placeholder="Seu nome" required />
              <Field label="CPF/CNPJ" placeholder="000.000.000-00" required />
              <Field label="Email" placeholder="voce@email.com" required />
              <Field label="Telefone" placeholder="(11) 99999-9999" />
              <Field label="CEP" placeholder="00000-000" />
              <Field label="Estado" placeholder="SP" />
              <Field label="Cidade" placeholder="São Paulo" />
              <Field label="Rua" placeholder="Av. Paulista" />
              <Field label="Número" placeholder="1234" />
              <Field label="Complemento" placeholder="Apto 56" />
            </div>

            <button className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Gerar PIX e assinar
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <Lock className="h-3 w-3" />
              Pagamento processado com SSL 256-bit
            </p>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Resumo
              </span>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Plano</span>
                  <span className="font-semibold">Ultra Anual</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span>R$ 1.188,00</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Desconto (LAUNCH)</span>
                  <span>-R$ 1.089,00</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-base font-bold">
                  <span>Total</span>
                  <span>R$ 99,00</span>
                </div>
              </div>
            </div>

            {/* Card preview */}
            <div className="rounded-xl border border-white/10 bg-[#151515] p-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Preview — Cartão
              </span>
              <div className="mt-3 rounded-lg bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 p-5 text-white shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="h-6 w-10 rounded bg-white/15" />
                  <CreditCard className="h-5 w-5 opacity-60" />
                </div>
                <div className="mt-6 font-mono text-lg tracking-widest">
                  •••• •••• •••• 4242
                </div>
                <div className="mt-4 flex items-end justify-between text-[10px]">
                  <div>
                    <div className="uppercase text-white/60">Titular</div>
                    <div className="mt-0.5 font-semibold">Ricardo Almeida</div>
                  </div>
                  <div>
                    <div className="uppercase text-white/60">Validade</div>
                    <div className="mt-0.5 font-semibold">12/29</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                <Field label="Número do cartão" placeholder="0000 0000 0000 0000" />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Validade" placeholder="MM/AA" />
                  <Field label="CVV" placeholder="000" />
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* PIX Generated */}
        <section className="mb-16 rounded-xl border border-white/10 bg-[#151515] p-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
            <QrCode className="h-3 w-3" />
            PIX Gerado
          </span>
          <h2 className="mt-4 text-3xl font-bold">PIX gerado!</h2>
          <p className="mt-1 text-sm text-slate-400">
            Escaneie o QR Code ou copie o código para pagar.
          </p>
          <div className="mx-auto mt-8 flex flex-col items-center gap-4">
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-white/10 bg-white p-3">
              <QrCode className="h-full w-full text-slate-900" />
            </div>
            <div className="text-3xl font-bold tracking-tight">R$ 99,00</div>
          </div>
          <div className="mx-auto mt-6 max-w-lg rounded-lg border border-dashed border-white/15 bg-black/30 p-4 text-left font-mono text-xs break-all text-slate-300">
            00020126360014br.gov.bcb.pix0114+5511999999999520400005303986540599.005802BR5925EX Voice Servicos LTDA6009Sao Paulo62070503***6304A1B2
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Copiar Código PIX
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-400">
              <Check className="h-4 w-4" />
              Código Copiado!
            </button>
            <button className="rounded-md border border-white/20 px-5 py-2.5 text-sm text-slate-200 hover:bg-white/5">
              Já realizei o pagamento
            </button>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
            Aguardando confirmação do pagamento...
          </div>
        </section>

        {/* Success */}
        <section className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 p-12 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/20">
            <PartyPopper className="h-12 w-12 text-emerald-300" />
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight">Parabéns!</h2>
          <p className="mt-2 text-xl font-semibold text-emerald-200">
            Sua assinatura foi confirmada.
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-300">
            Obrigado por confiar na EX Voice. Sua conta agora tem acesso completo ao
            plano Ultra Anual.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              Voltar para Dashboard
            </button>
            <button className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5">
              Acessar Comunidade
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  placeholder,
  required,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      <input
        className="w-full rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        placeholder={placeholder}
      />
    </label>
  );
}
