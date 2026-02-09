"use client";

import { RecordingDetailsProps } from "@/@types/general-client";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { useCallback, useEffect, useState } from "react";

export function useRecordingData(recordingId: string | string[] | undefined) {
  const { GetAPI } = useApiContext();
  const { setSelectedRecording } = useGeneralContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecording = useCallback(async () => {
    if (!recordingId) {
      setLoading(false);
      return;
    }

    const id = Array.isArray(recordingId) ? recordingId[0] : recordingId;

    try {
      setLoading(true);
      setError(null);
      
      const response = await GetAPI(`/recording/${id}`, true);
      
      if (response.status === 200 && response.body) {
        const recording = response.body as RecordingDetailsProps;
        
        // Atualizar o contexto com os dados da API
        setSelectedRecording(recording);
      } else {
        setError("Gravação não encontrada");
        setSelectedRecording(null);
      }
    } catch (err) {
      console.error("Erro ao buscar gravação:", err);
      setError("Erro ao carregar gravação");
      setSelectedRecording(null);
    } finally {
      setLoading(false);
    }
  }, [recordingId, GetAPI, setSelectedRecording]);

  useEffect(() => {
    fetchRecording();
  }, [fetchRecording]);

  return { loading, error, refresh: fetchRecording };
}
