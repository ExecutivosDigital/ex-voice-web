"use client";

import { DynamicComponentRenderer } from "./components/DynamicComponentRenderer";
import { mockAIGeneratedData } from "./mock/ai-generated-data";

export default function AIComponentsPreviewPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mockAIGeneratedData.pageTitle}
          </h1>
          <p className="text-sm text-gray-500">
            Visualização de todos os componentes gerados pela IA com dados mock.
            Esta página demonstra como os componentes serão renderizados quando
            receberem dados da API. A IA pode criar seções e escolher livremente
            quais componentes usar dentro de cada seção.
          </p>
        </div>
      </div>
      <div className="animate-in fade-in duration-500">
        <DynamicComponentRenderer response={mockAIGeneratedData} />
      </div>
    </div>
  );
}
