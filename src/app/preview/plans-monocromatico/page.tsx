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

export default function PlansMonocromatico() {
  return (
    <div
      className="min-h-screen bg-neutral-50 text-neutral-900"
      style={{ fontFamily: "var(--preview-font-inter)" }}
    >
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-10 py-6">
          <a href="/preview/home-monocromatico" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
            <ArrowLeft className="h-4 w-4" />
            <span className="italic" style={{ fontFamily: "var(--preview-font-instrument)" }}>
              Voltar
            </span>
          </a>
          <span
            className="text-sm text-neutral-500"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Planos & <em>Assinatura</em>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-10 py-20">
        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Planos
          </span>
          <h1
            className="mx-auto mt-8 max-w-3xl text-6xl text-neutral-900"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Escolha o plano <em className="text-neutral-500">certo</em> para você.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-neutral-500">
            Pague apenas pelo que usa. Cancele quando quiser. Sem letras miúdas.
          </p>
          <div className="mt-10 inline-flex items-center gap-8 border-b border-neutral-300 pb-1">
            <button className="text-sm text-neutral-500 hover:text-neutral-900">
              Mensal
            </button>
            <button
              className="border-b border-neutral-900 pb-1 text-sm text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Anual <em className="text-neutral-500">— 25% off</em>
            </button>
          </div>
        </div>

        {/* Plans grid — editorial */}
        <div className="mb-24 grid grid-cols-1 divide-neutral-200 border-y border-neutral-200 md:grid-cols-3 md:divide-x">
          {mockPlans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col p-10 ${plan.highlight ? "bg-neutral-100" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                  {plan.name}
                </span>
                {plan.highlight && (
                  <span
                    className="italic text-neutral-600"
                    style={{ fontFamily: "var(--preview-font-instrument)" }}
                  >
                    — {plan.badge}
                  </span>
                )}
              </div>
              <p
                className="mt-3 text-lg text-neutral-700"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                {plan.subtitle}.
              </p>
              <div className="mt-8 flex items-baseline gap-1">
                <span
                  className="text-6xl text-neutral-900"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  R${plan.pricing.yearly}
                </span>
                <span className="text-sm italic text-neutral-500">/mês</span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                R$ {plan.pricing.monthly} mensalmente
              </p>
              <ul className="my-10 space-y-4 text-sm">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-3">
                    {f.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    )}
                    <span className={f.included ? "text-neutral-800" : "text-neutral-400"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-auto border px-5 py-3 text-sm font-medium ${
                  plan.highlight
                    ? "border-neutral-900 bg-neutral-900 text-neutral-50 hover:bg-neutral-800"
                    : "border-neutral-300 text-neutral-900 hover:border-neutral-900"
                }`}
              >
                Assinar {plan.name.toLowerCase()} →
              </button>
            </div>
          ))}
        </div>

        {/* Checkout */}
        <section className="mb-24 grid grid-cols-1 gap-16 md:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Checkout — Ultra Anual
            </span>
            <h2
              className="mt-4 text-4xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              Finalize sua <em>assinatura</em>.
            </h2>

            <div className="mt-8 flex items-center gap-4 border-y border-neutral-200 py-5">
              <Ticket className="h-10 w-10 text-neutral-700" />
              <div>
                <div
                  className="text-2xl text-neutral-900"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  100% OFF
                </div>
                <div className="text-xs italic text-neutral-500">
                  Assinatura Gratuita Garantida (cupom LAUNCH)
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="mt-10 flex items-center gap-8 border-b border-neutral-300">
              <button className="flex items-center gap-2 border-b border-neutral-900 pb-2 text-sm text-neutral-900">
                <QrCode className="h-4 w-4" />
                PIX
              </button>
              <button className="flex items-center gap-2 pb-2 text-sm text-neutral-500 hover:text-neutral-900">
                <CreditCard className="h-4 w-4" />
                Cartão
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
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

            <button className="mt-8 w-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
              Gerar PIX e assinar →
            </button>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Preview — Cartão
            </span>
            <div className="mt-4 rounded-sm bg-neutral-900 p-8 text-neutral-50">
              <div className="flex items-start justify-between">
                <div className="h-6 w-10 bg-neutral-600" />
                <span
                  className="text-xs italic text-neutral-400"
                  style={{ fontFamily: "var(--preview-font-instrument)" }}
                >
                  EX Voice
                </span>
              </div>
              <div
                className="mt-12 text-2xl tracking-widest"
                style={{ fontFamily: "var(--preview-font-instrument)" }}
              >
                •••• •••• •••• 4242
              </div>
              <div className="mt-8 flex items-end justify-between text-xs">
                <div>
                  <div className="uppercase tracking-widest text-neutral-500">
                    Titular
                  </div>
                  <div
                    className="mt-1"
                    style={{ fontFamily: "var(--preview-font-instrument)" }}
                  >
                    Ricardo Almeida
                  </div>
                </div>
                <div>
                  <div className="uppercase tracking-widest text-neutral-500">
                    Validade
                  </div>
                  <div
                    className="mt-1"
                    style={{ fontFamily: "var(--preview-font-instrument)" }}
                  >
                    12/29
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-6">
              <Field label="Número do cartão" placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-6">
                <Field label="Validade" placeholder="MM/AA" />
                <Field label="CVV" placeholder="000" />
              </div>
            </div>
          </div>
        </section>

        {/* PIX Generated */}
        <section className="mb-24 border-y border-neutral-200 py-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Estado — PIX Gerado
          </span>
          <h2
            className="mt-6 text-5xl text-neutral-900"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            PIX gerado!
          </h2>
          <p className="mt-3 italic text-neutral-500" style={{ fontFamily: "var(--preview-font-instrument)" }}>
            Escaneie o QR Code ou copie o código para pagar.
          </p>
          <div className="mx-auto mt-10 flex flex-col items-center gap-6">
            <div className="flex h-48 w-48 items-center justify-center border border-neutral-300 bg-white">
              <QrCode className="h-32 w-32 text-neutral-900" />
            </div>
            <div
              className="text-5xl text-neutral-900"
              style={{ fontFamily: "var(--preview-font-instrument)" }}
            >
              R$ 99,00
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-md border-t border-b border-dashed border-neutral-300 py-4 text-left font-mono text-xs break-all text-neutral-600">
            00020126360014br.gov.bcb.pix0114+5511999999999520400005303986540599.005802BR5925EX Voice Servicos LTDA6009Sao Paulo62070503***6304A1B2
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
              Copiar Código PIX
            </button>
            <button className="inline-flex items-center gap-2 border border-neutral-300 px-5 py-2.5 text-sm text-neutral-700">
              <Check className="h-4 w-4" />
              Código Copiado!
            </button>
            <button className="border-b border-neutral-400 pb-1 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900">
              Já realizei o pagamento →
            </button>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-xs italic text-neutral-500" style={{ fontFamily: "var(--preview-font-instrument)" }}>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Aguardando confirmação do pagamento...
          </div>
        </section>

        {/* Success */}
        <section className="py-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Estado — Sucesso
          </span>
          <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full border border-neutral-300 bg-white">
            <PartyPopper className="h-12 w-12 text-neutral-900" />
          </div>
          <h2
            className="mt-8 text-6xl text-neutral-900"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Parabéns!
          </h2>
          <p
            className="mt-2 text-2xl italic text-neutral-700"
            style={{ fontFamily: "var(--preview-font-instrument)" }}
          >
            Sua assinatura foi confirmada.
          </p>
          <p className="mx-auto mt-6 max-w-lg text-neutral-500">
            Obrigado por confiar na EX Voice. Sua conta agora tem acesso completo ao
            plano Ultra Anual.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <button className="inline-flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-50 hover:bg-neutral-800">
              <CheckCircle2 className="h-4 w-4" />
              Voltar para Dashboard
            </button>
            <button className="border-b border-neutral-400 pb-0.5 text-sm text-neutral-700 hover:border-neutral-900 hover:text-neutral-900">
              Acessar Comunidade →
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
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </span>
      <input
        className="w-full border-b border-neutral-300 bg-transparent px-0 py-2 text-sm placeholder:italic placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
        placeholder={placeholder}
        style={{ fontFamily: "var(--preview-font-instrument)" }}
      />
    </label>
  );
}
