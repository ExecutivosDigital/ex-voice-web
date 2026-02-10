"use client";

import { ReminderProps } from "@/@types/general-client";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { useCallback, useEffect, useState } from "react";

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
              setSelectedReminder(reminder);
              setSelectedRecording(null);
            }
          } catch (recordingErr) {
            console.error("Erro ao buscar gravação do lembrete:", recordingErr);
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
        setError("Lembrete não encontrado");
        setSelectedReminder(null);
        setSelectedRecording(null);
      }
    } catch (err) {
      console.error("Erro ao buscar lembrete:", err);
      setError("Erro ao carregar lembrete");
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
