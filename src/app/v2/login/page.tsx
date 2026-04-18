"use client";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PublicShell } from "../_components/public-shell";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PublicShell
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para continuar"
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link
            href="/v2/register"
            className="font-semibold text-neutral-900 hover:underline"
          >
            Criar conta grátis
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
            Email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100">
            <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-transparent py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-700">Senha</label>
            <Link
              href="/v2/reset-password"
              className="text-xs text-neutral-500 hover:text-neutral-900"
            >
              Esqueci a senha
            </Link>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-100">
            <Lock className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
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

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]"
        >
          Entrar
        </button>

        <div className="relative py-2 text-center text-xs text-neutral-400">
          <span className="relative z-10 bg-white px-3">ou</span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-neutral-200" />
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          <GoogleIcon />
          Entrar com Google
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          <AppleIcon />
          Entrar com Apple
        </button>
      </form>
    </PublicShell>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
