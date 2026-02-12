"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { trackAction, UserActionType } from "@/services/actionTrackingService";
import { General } from "./components/general";

export default function SelectedAppointment() {
  const pathname = usePathname();
  const { PostAPI } = useApiContext();
  const { selectedRecording } = useGeneralContext();

  // Tracking quando a página é visualizada (pathname garante disparo a cada acesso à tela)
  useEffect(() => {
    if (selectedRecording?.id) {
      console.log('[Tracking] Disparando SCREEN_VIEWED: summary (Resumo)');
      trackAction(
        {
          actionType: UserActionType.SCREEN_VIEWED,
          recordingId: selectedRecording.id,
          metadata: {
            screen: 'summary',
            screenName: 'Resumo',
            recordingId: selectedRecording.id,
          },
        },
        PostAPI
      ).catch((err: { status?: number; body?: unknown }) => {
        console.warn('[Tracking] Falha ao registrar Resumo:', err?.status ?? err, err?.body ?? err);
      });
    }
  }, [selectedRecording?.id, PostAPI, pathname]);

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
