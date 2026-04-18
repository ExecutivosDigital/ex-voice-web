"use client";

import { ChevronRight, LogOut, Lock, Mail, Phone, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RecorderModal } from "../_components/recorder-modal";
import { Shell } from "../_components/shell";
import { mockProfile } from "../_mocks";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(mockProfile.name);
  const [email, setEmail] = useState(mockProfile.email);
  const [phone, setPhone] = useState(mockProfile.phone);

  return (
    <>
      <Shell breadcrumbs={[{ label: "Meu perfil" }]} onRecordClick={() => setOpen(true)}>
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Header */}
          <header className="flex items-center gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-500 to-neutral-900 text-xl font-semibold text-white">
              {mockProfile.initials}
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                {mockProfile.name}
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500">
                Membro desde {mockProfile.memberSince}
              </p>
            </div>
          </header>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Informações pessoais
              </h2>
              <div className="space-y-3">
                <Field
                  icon={User}
                  label="Nome"
                  value={name}
                  onChange={setName}
                />
                <Field
                  icon={Mail}
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  type="email"
                />
                <Field
                  icon={Phone}
                  label="Telefone"
                  value={phone}
                  onChange={setPhone}
                />
              </div>
            </div>

            {/* Plan */}
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Plano
              </h2>
              <Link
                href="/v2/plans"
                className="group flex items-center gap-4 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100/50 p-4 transition hover:from-neutral-100 hover:to-neutral-200/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neutral-500 to-neutral-900 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-neutral-900">
                    {mockProfile.plan}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {mockProfile.credits} créditos · renovação em 12 abr 2027
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Security */}
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Segurança
              </h2>
              <button className="flex w-full items-center gap-4 rounded-xl border border-neutral-100 bg-white px-4 py-3 text-left transition hover:bg-neutral-50">
                <Lock className="h-4 w-4 text-neutral-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">
                    Alterar senha
                  </div>
                  <div className="text-xs text-neutral-500">
                    Última alteração há 3 meses
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </button>
            </div>

            {/* Save */}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-6">
              <button className="inline-flex items-center gap-1.5 text-sm text-rose-600 transition hover:text-rose-700">
                <LogOut className="h-3.5 w-3.5" />
                Sair da conta
              </button>
              <button className="rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]">
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100">
      <Icon className="h-4 w-4 shrink-0 text-neutral-400" />
      <div className="flex-1">
        <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500">
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-neutral-900 outline-none"
        />
      </div>
    </div>
  );
}
