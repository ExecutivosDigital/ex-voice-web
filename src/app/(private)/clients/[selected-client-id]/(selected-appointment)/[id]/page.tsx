"use client";

import { useEffect } from "react";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { trackAction, UserActionType } from "@/services/actionTrackingService";
import { General } from "./components/general";

export default function SelectedAppointment() {
  const { PostAPI } = useApiContext();
  const { selectedRecording } = useGeneralContext();

  // Tracking quando a página é visualizada
  useEffect(() => {
    if (selectedRecording?.id) {
      trackAction(
        {
          actionType: UserActionType.SCREEN_VIEWED,
          recordingId: selectedRecording.id,
          metadata: {
            screen: 'summary',
            screenName: 'Resumo',
          },
        },
        PostAPI
      ).catch((error) => {
        console.warn('Erro ao registrar tracking de visualização:', error);
      });
    }
  }, [selectedRecording?.id, PostAPI]);

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
