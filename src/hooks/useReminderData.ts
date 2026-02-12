"use client";

import { ReminderProps } from "@/@types/general-client";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { handleApiError } from "@/utils/error-handler";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useReminderData(reminderId: string | string[] | undefined) {
  const { GetAPI } = useApiContext();
  const { setSelectedReminder, setSelectedRecording } = useGeneralContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminder = useCallback(async () => {
    if (!reminderId) {
      setLoading(false);
      return;
    }

    const id = Array.isArray(reminderId) ? reminderId[0] : reminderId;

    try {
      setLoading(true);
      setError(null);
      
      // Buscar o reminder
      const reminderResponse = await GetAPI(`/reminder/${id}`, true);
      
      if (reminderResponse.status === 200 && reminderResponse.body) {
        const reminder = reminderResponse.body as ReminderProps;
        
        // Se o reminder tiver uma gravação associada, buscar os dados completos da gravação
        // O reminder.recording pode ter apenas dados básicos, então buscamos a gravação completa
        if (reminder.recording?.id) {
          try {
            const recordingResponse = await GetAPI(`/recording/${reminder.recording.id}`, true);
            if (recordingResponse.status === 200 && recordingResponse.body) {
              const fullRecording = recordingResponse.body;
              
              // Atualizar o contexto com a gravação completa
              setSelectedRecording(fullRecording);
              
              // Atualizar o reminder com a gravação completa dentro dele
              // Isso mantém a estrutura esperada pelo componente General
              // Mesclamos os dados da gravação completa com os dados básicos do reminder.recording
              setSelectedReminder({
                ...reminder,
                recording: {
                  ...reminder.recording,
                  // Adicionar campos adicionais da gravação completa que podem não estar no ReminderRecordingProps
                  summary: fullRecording.summary,
                  structuredSummary: fullRecording.structuredSummary,
                  specificSummary: fullRecording.specificSummary,
                  speeches: fullRecording.speeches || [],
                  speakers: fullRecording.speakers || [],
                } as any, // Usar 'as any' para permitir campos extras que o componente pode usar
              });
            } else {
              // Se não conseguir buscar a gravação completa, mantém a básica do reminder
              const errorMessage = handleApiError(
                recordingResponse,
                "Não foi possível carregar a gravação do lembrete.",
              );
              console.error("Erro ao buscar gravação do lembrete:", errorMessage);
              setSelectedReminder(reminder);
              setSelectedRecording(null);
            }
          } catch (recordingErr) {
            console.error("Erro ao buscar gravação do lembrete:", recordingErr);
            toast.error("Erro ao carregar gravação do lembrete. Tente novamente.");
            // Em caso de erro, mantém o reminder com a gravação básica
            setSelectedReminder(reminder);
            setSelectedRecording(null);
          }
        } else {
          // Se não houver gravação, apenas seta o reminder
          setSelectedReminder(reminder);
          setSelectedRecording(null);
        }
      } else {
        const errorMessage = handleApiError(
          reminderResponse,
          "Lembrete não encontrado.",
        );
        setError(errorMessage);
        toast.error(errorMessage);
        setSelectedReminder(null);
        setSelectedRecording(null);
      }
    } catch (err) {
      console.error("Erro ao buscar lembrete:", err);
      const errorMessage = "Erro ao carregar lembrete. Tente novamente.";
      setError(errorMessage);
      toast.error(errorMessage);
      setSelectedReminder(null);
      setSelectedRecording(null);
    } finally {
      setLoading(false);
    }
  }, [reminderId, GetAPI, setSelectedReminder, setSelectedRecording]);

  useEffect(() => {
    fetchReminder();
  }, [fetchReminder]);

  return { loading, error, refresh: fetchReminder };
}
