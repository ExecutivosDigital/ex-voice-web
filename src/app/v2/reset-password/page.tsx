"use client";

import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PublicShell } from "../_components/public-shell";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <PublicShell
      title={sent ? "Verifique seu email" : "Esqueci minha senha"}
      subtitle={
        sent
          ? "Enviamos um link pra redefinir sua senha."
          : "Insira seu email e vamos enviar um link pra você redefinir sua senha."
      }
      footer={
        <Link
          href="/v2/login"
          className="inline-flex items-center gap-1 font-medium text-neutral-700 hover:text-neutral-900"
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar para login
        </Link>
      }
    >
      {!sent ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
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

          <button
            type="submit"
            disabled={!email.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:hover:shadow-md"
          >
            Enviar link de recuperação
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <strong className="font-semibold">Link enviado!</strong> Verifique o email{" "}
            <b className="font-semibold">{email}</b> e siga as instruções.
          </div>
          <button
            onClick={() => setSent(false)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            Tentar outro email
          </button>
        </div>
      )}
    </PublicShell>
  );
}
