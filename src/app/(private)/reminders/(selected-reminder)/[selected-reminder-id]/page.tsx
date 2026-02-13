"use client";

import { General } from "./components/general";
import { useReminderData } from "@/hooks/useReminderData";
import { useGeneralContext } from "@/context/GeneralContext";
import { useParams, useRouter } from "next/navigation";

export default function SelectedReminder() {
  const params = useParams();
  const router = useRouter();
  const reminderId = params["selected-reminder-id"] as string | undefined;
  const { selectedReminder } = useGeneralContext();
  
  // Buscar dados da API sempre que entrar na tela
  const { loading, error } = useReminderData(reminderId);

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-gray-500">Carregando lembrete...</p>
      </div>
    );
  }

  if (error || (!loading && !selectedReminder)) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 py-12">
        <p className="text-red-500">{error || "Lembrete não encontrado"}</p>
        <button
          onClick={() => router.push("/reminders")}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Voltar para Lembretes
        </button>
      </div>
    );
  }

  return (
    <div>
      <General />
    </div>
  );
}
