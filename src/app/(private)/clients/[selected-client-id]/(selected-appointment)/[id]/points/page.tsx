"use client";
import { useGeneralContext } from "@/context/GeneralContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Points } from "../components/points";

export default function PointsPage() {
  const isEnabled = false; // To enable, change to true
  const { selectedClient, selectedRecording } = useGeneralContext();
  const router = useRouter();

  useEffect(() => {
    if (!isEnabled && selectedClient?.id && selectedRecording?.id) {
      router.push(`/clients/${selectedClient.id}/${selectedRecording.id}`);
    }
  }, [isEnabled, selectedClient?.id, selectedRecording?.id, router]);

  if (!isEnabled) return null;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pontos de Atenção
          </h1>
          <p className="text-sm text-gray-500">
            Receituários, exames, encaminhamentos e documentos.
          </p>
        </div>
      </div>
      <div>
        <Points />
      </div>
    </div>
  );
}

