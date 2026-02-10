"use client";

import { General } from "./components/general";
import { useRecordingData } from "@/hooks/useRecordingData";
import { useParams } from "next/navigation";

export default function SelectedOther() {
  const params = useParams();
  const recordingId = params["selected-other-id"] as string | undefined;
  
  // Buscar dados da API sempre que entrar na tela
  const { loading, error } = useRecordingData(recordingId);

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-gray-500">Carregando gravação...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 py-12">
        <p className="text-red-500">{error || "Gravação não encontrada"}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes</h1>
          <p className="text-sm text-gray-500">
            Visualize os detalhes da gravação
          </p>
        </div>
      </div>
      <General />
    </div>
  );
}
