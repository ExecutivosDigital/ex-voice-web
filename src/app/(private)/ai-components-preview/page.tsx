"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DynamicComponentRenderer } from "./components/core/DynamicComponentRenderer";
import { mockAIGeneratedData } from "./mock/ai-generated-data";
import {
  transcriptionExamples,
  getTranscriptionExample,
  getAvailableExampleKeys,
  type ExampleKey,
} from "./utils/transcription-examples";

export default function AIComponentsPreviewPage() {
  const [selectedExample, setSelectedExample] = useState<ExampleKey>(
    "Caso Completo",
  );
  const availableExamples = getAvailableExampleKeys();

  // Calcular índice atual e funções de navegação
  const currentIndex = useMemo(() => {
    return availableExamples.findIndex((key) => key === selectedExample);
  }, [selectedExample, availableExamples]);

  const totalExamples = availableExamples.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalExamples - 1;

  const goToPrevious = () => {
    if (!isFirst && currentIndex > 0) {
      setSelectedExample(availableExamples[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (!isLast && currentIndex < totalExamples - 1) {
      setSelectedExample(availableExamples[currentIndex + 1]);
    }
  };

  // Usar o exemplo selecionado ou o mock padrão
  const currentData =
    selectedExample && transcriptionExamples[selectedExample]
      ? getTranscriptionExample(selectedExample)
      : mockAIGeneratedData;

  return (
    <div className="flex w-full max-w-full min-w-0 flex-col gap-6 overflow-x-hidden">
      <div className="flex w-full min-w-0 items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold break-words text-gray-900">
            {currentData.pageTitle}
          </h1>
          <p className="text-sm break-words text-gray-500">
            Visualização de todos os componentes gerados pela IA com dados mock.
            Esta página demonstra como os componentes serão renderizados quando
            receberem dados da API. A IA pode criar seções e escolher livremente
            quais componentes usar dentro de cada seção.
          </p>
        </div>
      </div>

      {/* Seletor de Exemplos */}
      <div className="flex w-full min-w-0 flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <label
          htmlFor="example-selector"
          className="text-sm font-medium text-gray-700"
        >
          Selecione um exemplo de transcrição para testar:
        </label>
        <select
          id="example-selector"
          value={selectedExample}
          onChange={(e) => setSelectedExample(e.target.value as ExampleKey)}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {availableExamples.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500">
          Use este seletor para testar diferentes modelos e estruturas de dados
          que a IA pode gerar, garantindo que os componentes se adequem a
          qualquer situação.
        </p>
      </div>

      <div className="min-w-0 overflow-x-hidden">
        <DynamicComponentRenderer response={currentData} />
      </div>

      {/* Botões de Navegação Flutuantes */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={goToPrevious}
          disabled={isFirst}
          className="flex items-center justify-center rounded-full bg-white p-3 shadow-lg ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-lg"
          title="Exemplo anterior"
          aria-label="Exemplo anterior"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg ring-1 ring-gray-200">
          <span className="text-sm font-medium text-gray-700">
            {currentIndex + 1} / {totalExamples}
          </span>
        </div>

        <button
          type="button"
          onClick={goToNext}
          disabled={isLast}
          className="flex items-center justify-center rounded-full bg-white p-3 shadow-lg ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-lg"
          title="Próximo exemplo"
          aria-label="Próximo exemplo"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
