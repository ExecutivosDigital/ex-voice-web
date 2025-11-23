// components/AuthGuard.tsx
"use client";

import { useSession } from "@/context/auth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Opcional: loading customizado
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { profile, loading, checkSession } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false); // ← Evita múltiplos redirecionamentos

  useEffect(() => {
    const validateSession = async () => {
      console.log("entrou aqui");
      // ✅ Aguarda loading inicial

      // ✅ Evita redirecionar múltiplas vezes
      if (hasRedirected.current) return;

      console.log("passou 1");

      // ✅ Verifica sessão
      const isValid = await checkSession();

      console.log("passou 2");
      console.log("isValid: ", isValid);

      if (!isValid || !profile) {
        console.log("entrou aqui 2");
        // ✅ Pequeno delay para dar tempo do login finalizar
        await new Promise((resolve) => setTimeout(resolve, 100));

        // ✅ Revalida após o delay
        const recheckValid = await checkSession();

        console.log("recheckValid: ", recheckValid);

        console.log("passou 3");

        if (!recheckValid) {
          console.log("entrou aqui 3");
          hasRedirected.current = true;
          router.push("/login");
        }
      }
    };

    validateSession();
  }, [profile, loading, checkSession, router, pathname]);

  if (loading) {
    return (
      fallback || (
        <div className="flex h-screen w-full items-center justify-center gap-2 bg-neutral-200">
          <Image
            src="/logos/icon.png"
            alt=""
            width={500}
            height={500}
            className="h-max w-16 object-contain"
          />
          <div className="text-center">
            <div className="loader mb-4" /> {/* Seu spinner */}
            <p>Carregando...</p>
          </div>
        </div>
      )
    );
  }

  // Se não tem perfil, mostra loading (vai redirecionar)
  // if (!profile) {
  //   return fallback || null;
  // }

  // Usuário autenticado, mostra conteúdo
  return <>{children}</>;
}
