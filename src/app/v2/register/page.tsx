"use client";

import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PublicShell } from "../_components/public-shell";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PublicShell
      title="Criar sua conta"
      subtitle="Comece grátis. Leva menos de 1 minuto."
      footer={
        <>
          Já tem uma conta?{" "}
          <Link
            href="/v2/login"
            className="font-semibold text-neutral-900 hover:underline"
          >
            Entrar
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <InputField
          icon={User}
          label="Nome completo"
          value={name}
          onChange={setName}
          placeholder="Seu nome"
        />
        <InputField
          icon={Mail}
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="seu@email.com"
        />
        <InputField
          icon={Phone}
          label="Telefone"
          value={phone}
          onChange={setPhone}
          placeholder="(11) 99999-9999"
        />
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Senha
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100">
            <Lock className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full bg-transparent py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="text-neutral-400 hover:text-neutral-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <p className="text-xs text-neutral-500">
          Ao criar a conta você concorda com os{" "}
          <Link href="#" className="text-neutral-700 underline">
            Termos
          </Link>{" "}
          e a{" "}
          <Link href="#" className="text-neutral-700 underline">
            Política de Privacidade
          </Link>
          .
        </p>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]"
        >
          Criar conta grátis
        </button>
      </form>
    </PublicShell>
  );
}

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100">
        <Icon className="h-4 w-4 shrink-0 text-neutral-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}
