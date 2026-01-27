"use client";

import { MedicalRecord } from "../components/medical-record";

export default function MedicalRecordPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prontuário Médico</h1>
          <p className="text-sm text-gray-500">
            Resumo específico com pontos de atenção e informações críticas gerados pela IA.
          </p>
        </div>
      </div>
      <div>
        <MedicalRecord />
      </div>
    </div>
  );
}
