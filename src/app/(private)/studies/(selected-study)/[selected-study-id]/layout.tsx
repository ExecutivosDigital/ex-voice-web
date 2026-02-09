"use client";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Removido o redirecionamento automático - agora os dados são buscados nas páginas
  return <>{children}</>;
}
