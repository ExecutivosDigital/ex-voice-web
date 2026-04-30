"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { handleApiError } from "@/utils/error-handler";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Fix #4: estados transitórios — enquanto a recording estiver em algum
// destes, o hook faz polling automático para a UI atualizar sem F5.
const TRANSIENT_STATUSES = new Set([
  "PENDING",
  "TRANSCRIBING",
  "TRANSCRIBING_SUMMARIZING",
]);
const POLL_INTERVAL_MS = 10_000;

export function useRecordingData(recordingId: string | string[] | undefined) {
  const { GetAPI } = useApiContext();
  const { selectedRecording, setSelectedRecording } = useGeneralContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecording = useCallback(
    async (silent = false) => {
      if (!recordingId) {
        setLoading(false);
        return;
      }

      const id = Array.isArray(recordingId) ? recordingId[0] : recordingId;

      try {
        if (!silent) setLoading(true);
        setError(null);

        const response = await GetAPI(`/recording/${id}`, true);

        if (response.status === 200 && response.body) {
          const recording = response.body as RecordingDetailsProps;

          // Atualizar o contexto com os dados da API
          setSelectedRecording(recording);
        } else if (!silent) {
          // Erros silenciosos no polling não devem mostrar toast — pode ser
          // só um blip de rede; próxima iteração tenta de novo.
          const errorMessage = handleApiError(
            response,
            "Gravação não encontrada.",
          );
          setError(errorMessage);
          toast.error(errorMessage);
          setSelectedRecording(null);
        }
      } catch (err) {
        if (!silent) {
          console.error("Erro ao buscar gravação:", err);
          const errorMessage = "Erro ao carregar gravação. Tente novamente.";
          setError(errorMessage);
          toast.error(errorMessage);
          setSelectedRecording(null);
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [recordingId, GetAPI, setSelectedRecording],
  );

  useEffect(() => {
    fetchRecording();
  }, [fetchRecording]);

  // Polling enquanto status for transitório. Para automaticamente quando
  // a transcrição finalizar (DONE / DONE_NO_SUMMARY / NOT_REQUESTED).
  useEffect(() => {
    const status = selectedRecording?.transcriptionStatus;
    if (!status || !TRANSIENT_STATUSES.has(status)) return;

    const interval = setInterval(() => {
      fetchRecording(true); // silent — sem loading flicker / toast
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [selectedRecording?.transcriptionStatus, fetchRecording]);

  return { loading, error, refresh: fetchRecording };
}
