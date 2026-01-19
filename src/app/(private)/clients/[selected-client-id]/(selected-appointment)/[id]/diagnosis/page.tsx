"use client";

import { Diagnosis } from "../components/diagnosis";

export default function DiagnosisPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes</h1>
          <p className="text-sm text-gray-500">
            Visualize os detalhes da Reunião.
          </p>
        </div>
      </div>
      <div>
        <Diagnosis />
      </div>
    </div>
  );
}
