"use client";

import { Check, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";
import { mockPlans, mockProfile } from "../_mocks";

export default function PlansPage() {
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  return (
    <>
      <Shell breadcrumbs={[{ label: "Planos" }]} onRecordClick={() => setOpen(true)}>
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Header */}
          <header className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
              <Sparkles className="h-3 w-3" />
              Planos & Preços
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-900">
              Escolha o plano certo pra você
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-500">
              Você está no plano{" "}
              <strong className="font-semibold text-neutral-900">{mockProfile.plan}</strong>.
              Atualize quando precisar.
            </p>

            <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 text-sm">
              <button
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-4 py-1.5 font-medium transition ${
                  billing === "monthly"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium transition ${
                  billing === "yearly"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Anual
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    billing === "yearly"
                      ? "bg-emerald-400 text-neutral-900"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  -25%
                </span>
              </button>
            </div>
          </header>

          {/* Plans grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {mockPlans.map((plan) => {
              const price = billing === "yearly" ? plan.yearly : plan.monthly;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-6 ${
                    plan.highlight
                      ? "border-neutral-900 bg-white shadow-lg shadow-neutral-900/10"
                      : "border-neutral-100 bg-white"
                  }`}
                >
                  {plan.highlight && plan.badge && (
                    <span className="absolute -top-2.5 left-6 rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {plan.badge}
                    </span>
                  )}
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {plan.name}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{plan.subtitle}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-neutral-900">
                      R$ {price}
                    </span>
                    <span className="text-xs text-neutral-500">/mês</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-neutral-500">
                    {billing === "yearly" ? "Cobrado anualmente" : "Cobrado mensalmente"}
                  </p>
                  <ul className="my-6 space-y-2.5 text-sm">
                    {plan.features.map((f) => (
                      <li key={f.label} className="flex items-start gap-2.5">
                        {f.included ? (
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                            <Check className="h-2.5 w-2.5 text-emerald-700" strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                            <X className="h-2.5 w-2.5 text-neutral-400" />
                          </span>
                        )}
                        <span className={f.included ? "text-neutral-700" : "text-neutral-400"}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      plan.highlight
                        ? "bg-gradient-to-r from-neutral-500 to-neutral-900 text-white shadow-md shadow-neutral-900/20 hover:shadow-lg active:scale-[0.98]"
                        : "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    {plan.id === "ultra" ? "Manter atual" : "Assinar " + plan.name}
                  </button>
                </div>
              );
            })}
          </div>

          {/* FAQ-ish */}
          <section className="rounded-2xl bg-neutral-50 p-8">
            <h3 className="text-sm font-semibold text-neutral-900">
              Perguntas frequentes
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <strong className="font-semibold text-neutral-900">Posso cancelar?</strong>{" "}
                <span className="text-neutral-600">
                  Sim, a qualquer momento. Você mantém acesso até o fim do ciclo pago.
                </span>
              </li>
              <li>
                <strong className="font-semibold text-neutral-900">
                  Pagamento via PIX?
                </strong>{" "}
                <span className="text-neutral-600">
                  Sim, aceitamos PIX e Cartão de Crédito.
                </span>
              </li>
              <li>
                <strong className="font-semibold text-neutral-900">E se eu mudar de ideia?</strong>{" "}
                <span className="text-neutral-600">
                  Você pode fazer downgrade ou upgrade a qualquer momento.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
