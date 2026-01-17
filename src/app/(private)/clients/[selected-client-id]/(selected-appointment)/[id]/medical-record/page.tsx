"use client";

import { MedicalRecord } from "../components/medical-record";

export default function MedicalRecordPage() {
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
