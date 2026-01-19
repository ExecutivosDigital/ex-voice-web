"use client";
import { useGeneralContext } from "@/context/GeneralContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MedicalRecord } from "../components/medical-record";

export default function MedicalRecordPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Prontuário</h1>
          <p className="text-sm text-gray-500">
            Histórico completo e informações de saúde.
          </p>
        </div>
      </div>
      <div>
        <MedicalRecord />
      </div>
    </div>
  );
}

