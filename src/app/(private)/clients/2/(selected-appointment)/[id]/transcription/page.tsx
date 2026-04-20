"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { trackAction, UserActionType } from "@/services/actionTrackingService";
import { ScrollToTop } from "../components/scroll-to-top";
import { Transcription } from "../components/transcription";

export default function SelectedAppointment() {
  const pathname = usePathname();
  const { PostAPI } = useApiContext();
  const { selectedRecording } = useGeneralContext();

  // Tracking quando a página é visualizada (pathname garante disparo a cada acesso à tela)
  useEffect(() => {
    if (selectedRecording?.id) {
      console.log('[Tracking] Disparando SCREEN_VIEWED: transcription (Transcrição)');
      trackAction(
        {
          actionType: UserActionType.SCREEN_VIEWED,
          recordingId: selectedRecording.id,
          metadata: {
            screen: 'transcription',
            screenName: 'Transcrição',
            recordingId: selectedRecording.id,
          },
        },
        PostAPI
      ).catch((err: { status?: number; body?: unknown }) => {
        console.warn('[Tracking] Falha ao registrar Transcrição:', err?.status ?? err, err?.body ?? err);
      });
    }
  }, [selectedRecording?.id, PostAPI, pathname]);

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
