"use client";

import { Points } from "../components/points";

export default function PointsPage() {
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
