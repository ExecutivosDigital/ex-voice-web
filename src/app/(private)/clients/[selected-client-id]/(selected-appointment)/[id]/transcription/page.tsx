"use client";

import { useEffect } from "react";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { trackAction, UserActionType } from "@/services/actionTrackingService";
import { ScrollToTop } from "../components/scroll-to-top";
import { Transcription } from "../components/transcription";

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
            screen: 'transcription',
            screenName: 'Transcrição',
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
      {/* Header */}
      <div className="flex w-full items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transcrição</h1>
          <p className="text-sm text-gray-500">
            Visualize a transcrição completa da gravação
          </p>
        </div>
      </div>
      <Transcription />
      <ScrollToTop />
    </div>
  );
}
