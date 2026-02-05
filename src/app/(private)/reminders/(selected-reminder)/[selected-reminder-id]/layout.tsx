"use client";

import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

export default function ReminderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedReminder, setSelectedReminder, setSelectedRecording } =
    useGeneralContext();
  const { GetAPI } = useApiContext();
  const router = useRouter();
  const params = useParams();
  const idFromUrl = params["selected-reminder-id"] as string | undefined;

  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!idFromUrl) {
      router.push("/reminders");
      return;
    }

    if (!isValidUUID(idFromUrl)) {
      console.warn(
        "[ReminderLayout] ID inválido na URL (formato UUID esperado):",
        idFromUrl
      );
      router.push("/reminders");
      return;
    }

    const alreadyHasContext =
      selectedReminder?.id === idFromUrl ||
      selectedReminder?.recording?.id === idFromUrl;
    if (alreadyHasContext) {
      setLoading(false);
      setResolved(true);
      return;
    }

    let cancelled = false;
    let retryCount = 0;
    const maxRetryOn401 = 1;

    const loadFromApi = async (isRetry = false) => {
      setLoading(true);

      // Tenta primeiro como gravação (id da gravação na URL)
      const recordingResponse = await GetAPI(`/recording/${idFromUrl}`, true);
      if (cancelled) return;

      if (recordingResponse.status === 200 && recordingResponse.body?.id) {
        const recording = recordingResponse.body;
        if (recording.type === "REMINDER" && recording.reminder) {
          const reminderPayload = {
            ...recording.reminder,
            recording: {
              id: recording.id,
              name: recording.name,
              description: recording.description,
              transcription: recording.transcription,
              duration: recording.duration,
              audioUrl: recording.audioUrl,
              userId: recording.userId,
              transcriptionStatus: recording.transcriptionStatus,
              type: recording.type,
              clientId: recording.clientId,
              reminderId: recording.reminderId,
              transcriptionId: recording.transcriptionId,
              summary: recording.summary,
              createdAt: recording.createdAt,
            },
          };
          setSelectedReminder(reminderPayload as Parameters<typeof setSelectedReminder>[0]);
          setSelectedRecording(recording as Parameters<typeof setSelectedRecording>[0]);
          setResolved(true);
          setLoading(false);
          return;
        }
      }

      // Senão, tenta como lembrete (id do reminder na URL)
      const reminderResponse = await GetAPI(`/reminder/${idFromUrl}`, true);
      if (cancelled) return;

      if (reminderResponse.status === 200 && reminderResponse.body?.id) {
        const reminder = reminderResponse.body;
        setSelectedReminder(reminder as Parameters<typeof setSelectedReminder>[0]);
        if (reminder.recording) {
          setSelectedRecording(reminder.recording as Parameters<typeof setSelectedRecording>[0]);
        }
        setResolved(true);
        setLoading(false);
        return;
      }

      // 401: token pode não estar pronto (ex.: acesso direto a /reminders/[id]/chat)
      const got401 =
        recordingResponse.status === 401 || reminderResponse.status === 401;
      if (got401 && !isRetry && retryCount < maxRetryOn401) {
        retryCount += 1;
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) return;
        await loadFromApi(true);
        return;
      }

      if (cancelled) return;
      router.push("/reminders");
    };

    loadFromApi();
    return () => {
      cancelled = true;
    };
  }, [
    idFromUrl,
    selectedReminder?.id,
    selectedReminder?.recording?.id,
    GetAPI,
    router,
    setSelectedReminder,
    setSelectedRecording,
  ]);

  if (!resolved && loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!resolved) {
    return null;
  }

  return <>{children}</>;
}
