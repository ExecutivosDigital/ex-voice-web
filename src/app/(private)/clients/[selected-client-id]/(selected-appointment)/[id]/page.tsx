import { General } from "./components/general";

export default function SelectedAppointment() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumo</h1>
          <p className="text-sm text-gray-500">
            Resumo em texto da consulta gerado pela IA.
          </p>
        </div>
      </div>
      <div>
        <General />
      </div>
    </div>
  );
}
