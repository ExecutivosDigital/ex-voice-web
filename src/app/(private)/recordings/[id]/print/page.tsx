"use client";

import { useGeneralContext } from "@/context/GeneralContext";
import { useRecordingData } from "@/hooks/useRecordingData";
import { FileDown, Loader2, X } from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { gerarPdfGravacao } from "./gerar-pdf";

moment.locale("pt-br");

/**
 * Exportação de PDF da gravação (trilha IA — "PDF bonito"): o usuário escolhe
 * as seções e baixa um A4 gerado por código (jsPDF, ver gerar-pdf.ts) — sem a
 * janela de impressão do navegador, que carimbava URL/numeração no papel
 * (fluxo de impressão removido a pedido do Victor, 20/07). A página serve de
 * pré-visualização do conteúdo.
 */

interface BusinessItem {
  primary: string;
  secondary?: string;
  metadata?: { label: string; value: string }[];
  status?: string;
}

const BUSINESS_TYPES = new Set([
  "actions_card",
  "decisions_card",
  "commitments_card",
]);

export default function RecordingPrintPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const router = useRouter();
  const { loading, error } = useRecordingData(id);
  const { selectedRecording: recording } = useGeneralContext();

  // O usuário escolhe o que entra no PDF (feedback 20/07: "se ele quiser
  // apenas transcrição, por exemplo").
  const [incluirDetalhes, setIncluirDetalhes] = useState(true);
  const [incluirResumo, setIncluirResumo] = useState(true);
  const [incluirAcoes, setIncluirAcoes] = useState(true);
  const [incluirTranscricao, setIncluirTranscricao] = useState(true);

  if (loading && !recording) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !recording) {
    return (
      <p className="py-16 text-center text-sm text-gray-500">
        Gravação não encontrada.
      </p>
    );
  }

  const speakerName = (speakerId: string) =>
    recording.speakers?.find((s) => s.id === speakerId)?.name ?? "Locutor";

  // Extrai cards de negócio (ações/decisões/compromissos) dos resumos estruturados
  const businessCards: { title: string; items: BusinessItem[] }[] = [];
  for (const summary of [recording.structuredSummary, recording.specificSummary]) {
    for (const section of summary?.sections ?? []) {
      for (const component of section.components ?? []) {
        if (
          BUSINESS_TYPES.has(component.type) &&
          Array.isArray((component.data as { items?: BusinessItem[] })?.items)
        ) {
          businessCards.push({
            title: component.title,
            items: (component.data as { items: BusinessItem[] }).items,
          });
        }
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl bg-white px-2 py-4">
      {/* Barra de ações — some na impressão */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-600">
          Escolha o que entra no documento e clique em <strong>Baixar PDF</strong>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/recordings/${id}`)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            <X size={13} /> Voltar
          </button>
          <button
            onClick={() =>
              gerarPdfGravacao(recording, businessCards, {
                detalhes: incluirDetalhes,
                resumo: incluirResumo,
                acoes: incluirAcoes,
                transcricao: incluirTranscricao,
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
          >
            <FileDown size={13} /> Baixar PDF
          </button>
        </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-3">
          {(
            [
              ["Detalhes da gravação", incluirDetalhes, setIncluirDetalhes],
              ["Resumo", incluirResumo, setIncluirResumo],
              ["Ações e próximos passos", incluirAcoes, setIncluirAcoes],
              ["Transcrição", incluirTranscricao, setIncluirTranscricao],
            ] as const
          ).map(([rotulo, ativo, set]) => (
            <label
              key={rotulo}
              className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700"
            >
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => set(e.target.checked)}
                className="h-3.5 w-3.5 accent-gray-900"
              />
              {rotulo}
            </label>
          ))}
          <span className="ml-auto text-[11px] text-gray-400">
            A pré-visualização abaixo mostra o conteúdo; o arquivo baixado sai
            formatado como documento.
          </span>
        </div>
      </div>

      {/* Cabeçalho do documento */}
      <header className="border-b-2 border-gray-900 pb-4">
        {/* título sempre sai; os metadados respeitam o toggle */}
        <p className="text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
          Executivos Voice · Registro de reunião
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {recording.name || "Gravação sem título"}
        </h1>
        <div
          className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600"
          hidden={!incluirDetalhes}
        >
          <span>
            <strong>Data:</strong>{" "}
            {moment(recording.createdAt).format("DD [de] MMMM [de] YYYY, HH:mm")}
          </span>
          <span>
            <strong>Duração:</strong> {recording.duration || "--"}
          </span>
          {recording.client && (
            <span>
              <strong>Contato:</strong> {recording.client.name}
            </span>
          )}
          {recording.department && (
            <span>
              <strong>Departamento:</strong> {recording.department.name}
            </span>
          )}
          {(recording.speakers?.length ?? 0) > 0 && (
            <span>
              <strong>Participantes:</strong>{" "}
              {recording.speakers.map((s) => s.name).join(", ")}
            </span>
          )}
        </div>
        {incluirDetalhes && recording.description && (
          <p className="mt-2 text-sm text-gray-600">{recording.description}</p>
        )}
      </header>

      {/* Resumo */}
      {incluirResumo && recording.summary && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
            Resumo
          </h2>
          <div className="prose prose-sm max-w-none text-gray-800 prose-headings:text-gray-900 prose-headings:font-semibold prose-li:my-0.5">
            <ReactMarkdown>{recording.summary}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* Ações / decisões / compromissos */}
      {incluirAcoes && businessCards.length > 0 && (
        <section className="mt-6 break-inside-avoid">
          <h2 className="mb-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
            Ações e Próximos Passos
          </h2>
          {businessCards.map((card, ci) => (
            <div key={ci} className="mb-3 break-inside-avoid">
              <h3 className="text-[13px] font-semibold text-gray-800">
                {card.title}
              </h3>
              <ul className="mt-1 list-disc pl-5">
                {card.items.map((item, ii) => (
                  <li key={ii} className="mb-1 text-sm text-gray-800">
                    {item.primary}
                    {item.secondary && (
                      <span className="text-gray-500"> — {item.secondary}</span>
                    )}
                    {(item.metadata?.length ?? 0) > 0 && (
                      <span className="text-xs text-gray-500">
                        {" "}
                        (
                        {item.metadata!
                          .map((m) => `${m.label}: ${m.value}`)
                          .join(" · ")}
                        )
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Transcrição */}
      {incluirTranscricao && (recording.speeches?.length ?? 0) > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
            Transcrição
          </h2>
          <div className="flex flex-col gap-2.5">
            {recording.speeches.map((speech, si) => (
              <p key={si} className="text-[13px] leading-relaxed text-gray-800">
                <span className="font-semibold text-gray-900">
                  {speakerName(speech.speakerId)}
                </span>
                <span className="ml-1.5 font-mono text-[10px] text-gray-400">
                  {moment
                    .utc(Math.max(0, speech.startTime) * 1000)
                    .format("HH:mm:ss")}
                </span>
                <br />
                {speech.transcription}
              </p>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-8 border-t border-gray-200 pt-3 text-center text-[10px] text-gray-400">
        Documento gerado pelo Executivos Voice em{" "}
        {moment().format("DD/MM/YYYY [às] HH:mm")}. Conteúdo transcrito e
        analisado por IA a partir do áudio original.
      </footer>
    </div>
  );
}
