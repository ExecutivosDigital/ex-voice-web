"use client";
import { useSession } from "@/context/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ForgotPassword from "./components/forgot";
import SignIn from "./components/login";
import LoginAnimation from "./components/LoginAnimation";

const REMEMBER_ME_KEY = "login_remember_me";

export default function Login() {
  const router = useRouter();
  const { checkSession } = useSession();
  const [forgot, setForgot] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Se já estiver logado, redireciona para home (não precisa digitar email/senha de novo)
  useEffect(() => {
    let cancelled = false;
    const go = async () => {
      try {
        const isAuthenticated = await checkSession();
        if (!cancelled && isAuthenticated) {
          router.replace("/");
        }
      } catch {
        // ignorar
      }
    };
    go();
    return () => {
      cancelled = true;
    };
  }, [checkSession, router]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(REMEMBER_ME_KEY) === "true") {
        setRememberMe(true);
      }
    } catch {
      // ignorar
    }
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Lado Esquerdo - Branding / Marketing */}
      <div className="from-primary relative hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br to-black p-12 lg:flex">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] -left-[10%] h-[30rem] w-[30rem] rounded-full bg-white/10 blur-[120px]" />
          <div className="absolute -right-[10%] bottom-[20%] h-[30rem] w-[30rem] rounded-full bg-black/20 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-12">
          <LoginAnimation />

          <div className="max-w-md text-center">
            <h2 className="mb-2 text-2xl font-bold text-white">
              Seu Assistente Inteligente
            </h2>
            <p className="text-gray-50">
              Grave suas reuniões e deixe nossa IA gerar resumos perfeitos
              automaticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-6 flex justify-center lg:justify-start">
              <Image
                src="/logos/logo-dark.svg"
                alt="Health Voice"
                width={200}
                height={60}
                className="h-max w-1/2 object-contain"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              {forgot ? "Recuperar senha" : "Acesse sua conta"}
            </h2>
            <p className="mt-2 text-gray-500">
              {forgot
                ? "Digite seu email para receber o código"
                : "Bem-vindo de volta! Por favor, insira seus dados."}
            </p>
          </div>

          <div className="w-full">
            {forgot ? (
              <ForgotPassword onClick={() => setForgot(false)} />
            ) : (
              <SignIn onClick={() => setForgot(true)} rememberMe={rememberMe} setRememberMe={setRememberMe} />
            )}

            <div className="mt-8 text-center text-sm text-gray-600">
              {!forgot && (
                <p>
                  Não tem uma conta?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-primary hover:text-gray-700 transition-colors"
                  >
                    Cadastre-se
                  </Link>
                </p>
              )}
              {forgot && (
                <button
                  onClick={() => setForgot(false)}
                  className="font-semibold text-primary hover:text-gray-700 transition-colors"
                >
                  Voltar ao login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
