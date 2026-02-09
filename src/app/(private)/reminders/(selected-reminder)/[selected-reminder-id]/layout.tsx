"use client";

import { useReminderData } from "@/hooks/useReminderData";
import { useParams } from "next/navigation";

export default function ReminderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const reminderId = params["selected-reminder-id"] as string | undefined;
  
  // Buscar dados do reminder e da gravação associada
  // O redirecionamento será tratado na página se necessário
  useReminderData(reminderId);

  return <>{children}</>;
}
