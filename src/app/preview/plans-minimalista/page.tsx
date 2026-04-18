import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  PartyPopper,
  QrCode,
  Ticket,
  X,
} from "lucide-react";
import { mockPlans } from "../_mocks/data";

export default function PlansMinimalista() {
  return (
    <div
      className="min-h-screen bg-white text-neutral-900"
      style={{ fontFamily: "var(--preview-font-geist)" }}
    >
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-5">
          <a href="/preview/home-minimalista" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o dashboard
          </a>
          <span className="text-sm text-neutral-500">Planos & Assinatura</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-8 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-neutral-200 px-3 py-0.5 text-xs uppercase tracking-widest text-neutral-500">
            Planos
          </span>
          <h1 className="mt-6 text-4xl font-medium tracking-tight text-neutral-900">
            Escolha o plano certo para você
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-neutral-500">
            Pague apenas pelo que usa. Cancele quando quiser. Sem letras miúdas.
          </p>
          <div className="mt-8 inline-flex items-center gap-0 rounded-md border border-neutral-200 p-1 text-sm">
            <button className="rounded-md px-4 py-1.5 text-neutral-500 hover:text-neutral-900">
              Mensal
            </button>
            <button className="rounded-md bg-neutral-900 px-4 py-1.5 text-white">
              Anual <span className="ml-1 text-xs opacity-70">— 25% off</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="mb-20 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 md:grid-cols-3">
          {mockPlans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col bg-white p-8 ${plan.highlight ? "ring-2 ring-inset ring-neutral-900" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-neutral-500">
                  {plan.name}
                </span>
                {plan.highlight && (
                  <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-neutral-500">{plan.subtitle}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-medium tracking-tight text-neutral-900">
                  R$ {plan.pricing.yearly}
                </span>
                <span className="text-sm text-neutral-500">/mês</span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                R$ {plan.pricing.monthly} cobrado mensalmente
              </p>
              <ul className="my-8 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2.5">
                    {f.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300" />
                    )}
                    <span className={f.included ? "text-neutral-700" : "text-neutral-400 line-through"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-auto w-full rounded-md px-4 py-2.5 text-sm font-medium ${
                  plan.highlight
                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                    : "border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                Assinar {plan.name.toLowerCase()}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout preview */}
        <section className="mb-20 grid grid-cols-1 gap-8 rounded-md border border-neutral-200 bg-white p-8 md:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Checkout — Plano Ultra Anual
            </span>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              Finalize sua assinatura
            </h2>

            {/* Free plan banner */}
            <div className="mt-6 flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4">
              <Ticket className="h-8 w-8 text-emerald-700" />
              <div>
                <div className="text-sm font-medium text-emerald-900">
                  100% OFF
                </div>
                <div className="text-xs text-emerald-700">
                  Assinatura Gratuita Garantida (cupom LAUNCH)
                </div>
              </div>
            </div>

            {/* Payment method tabs */}
            <div className="mt-8 grid grid-cols-2 gap-2 rounded-md bg-neutral-100 p-1">
              <button className="flex items-center justify-center gap-1.5 rounded-md bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-sm">
                <QrCode className="h-4 w-4" />
                PIX
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900">
                <CreditCard className="h-4 w-4" />
                Cartão
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Field label="Nome completo" placeholder="Seu nome" />
              <Field label="CPF/CNPJ" placeholder="000.000.000-00" />
              <Field label="Email" placeholder="voce@email.com" />
              <Field label="Telefone" placeholder="(11) 99999-9999" />
              <Field label="CEP" placeholder="00000-000" />
              <Field label="Estado" placeholder="SP" />
              <Field label="Cidade" placeholder="São Paulo" />
              <Field label="Rua" placeholder="Av. Paulista" />
              <Field label="Número" placeholder="1234" />
              <Field label="Complemento" placeholder="Apto 56" />
            </div>

            <button className="mt-6 w-full rounded-md bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800">
              Gerar PIX e assinar
            </button>
          </div>

          {/* Card preview */}
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Preview — Cartão
            </span>
            <div className="mt-2 rounded-md bg-gradient-to-br from-neutral-800 to-neutral-950 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="h-6 w-10 rounded bg-white/10" />
                <CreditCard className="h-6 w-6 opacity-50" />
              </div>
              <div className="mt-10 font-mono text-xl tracking-widest">
                •••• •••• •••• 4242
              </div>
              <div className="mt-6 flex items-end justify-between text-xs">
                <div>
                  <div className="uppercase text-white/50">Titular</div>
                  <div className="mt-1 font-medium">Ricardo Almeida</div>
                </div>
                <div>
                  <div className="uppercase text-white/50">Validade</div>
                  <div className="mt-1 font-medium">12/29</div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Número do cartão" placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Validade" placeholder="MM/AA" />
                <Field label="CVV" placeholder="000" />
              </div>
            </div>
          </div>
        </section>

        {/* PIX Generated */}
        <section className="mb-20 rounded-md border border-neutral-200 bg-white p-10 text-center">
          <span className="text-xs uppercase tracking-widest text-neutral-500">
            Estado — PIX Gerado
          </span>
          <h2 className="mt-4 text-2xl font-medium tracking-tight">PIX gerado!</h2>
          <p className="mt-2 text-neutral-500">
            Escaneie o QR Code ou copie o código para pagar.
          </p>
          <div className="mx-auto mt-8 flex flex-col items-center gap-4">
            <div className="flex h-48 w-48 items-center justify-center rounded-md border border-neutral-200 bg-white">
              <QrCode className="h-32 w-32 text-neutral-900" />
            </div>
            <div className="text-3xl font-medium tracking-tight">R$ 99,00</div>
          </div>
          <div className="mx-auto mt-6 max-w-md rounded-md border border-dashed border-neutral-300 p-3 text-left font-mono text-xs break-all text-neutral-600">
            00020126360014br.gov.bcb.pix0114+5511999999999520400005303986540599.005802BR5925EX Voice Servicos LTDA6009Sao Paulo62070503***6304A1B2
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
              Copiar Código PIX
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" />
              Código Copiado!
            </button>
            <button className="rounded-md border border-neutral-200 px-5 py-2.5 text-sm text-neutral-700 hover:border-neutral-900">
              Já realizei o pagamento
            </button>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-xs text-neutral-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Aguardando confirmação do pagamento...
          </div>
        </section>

        {/* Success */}
        <section className="rounded-md border border-neutral-200 bg-neutral-50 p-12 text-center">
          <span className="text-xs uppercase tracking-widest text-neutral-500">
            Estado — Sucesso
          </span>
          <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-inner">
            <PartyPopper className="h-12 w-12 text-neutral-900" />
          </div>
          <h2 className="mt-6 text-4xl font-medium tracking-tight">Parabéns!</h2>
          <p className="mt-2 text-xl text-neutral-700">
            Sua assinatura foi confirmada.
          </p>
          <p className="mx-auto mt-4 max-w-md text-neutral-500">
            Obrigado por confiar na EX Voice. Sua conta agora tem acesso completo ao
            plano Ultra Anual.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
              <CheckCircle2 className="h-4 w-4" />
              Voltar para Dashboard
            </button>
            <button className="rounded-md border border-neutral-200 px-5 py-2.5 text-sm text-neutral-700 hover:border-neutral-900">
              Acessar Comunidade
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <input
        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
        placeholder={placeholder}
      />
    </label>
  );
}
