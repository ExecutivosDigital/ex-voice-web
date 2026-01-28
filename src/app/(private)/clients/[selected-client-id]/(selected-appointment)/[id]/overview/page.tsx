"use client";

import { Overview } from "../components/overview";

export default function OverviewPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumo Geral</h1>
          <p className="text-sm text-gray-500">
            Resumo estruturado da consulta com componentes gerados pela IA.
          </p>
        </div>
      </div>
      <div className="w-full">
        <Overview />
      </div>
    </div>
  );
}
