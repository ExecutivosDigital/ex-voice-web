import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function PublicShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="flex h-16 items-center px-6">
        <Link href="/v2">
          <Image
            src="/logos/logo-dark.svg"
            alt="EX Voice"
            width={120}
            height={32}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl bg-white px-8 py-10 shadow-sm ring-1 ring-neutral-100">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
          {footer && (
            <div className="mt-6 text-center text-sm text-neutral-500">{footer}</div>
          )}
        </div>
      </main>
      <footer className="px-6 py-4 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} EX Voice · Todos os direitos reservados
      </footer>
    </div>
  );
}
