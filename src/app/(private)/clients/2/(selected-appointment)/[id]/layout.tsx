"use client";

import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedClient, selectedRecording, setSelectedClient, setSelectedRecording } =
    useGeneralContext();
  const { GetAPI } = useApiContext();
  const router = useRouter();
  const params = useParams();
  const clientId = params["selected-client-id"] as string | undefined;
  const recordingId = params["id"] as string | undefined;

  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!clientId || !recordingId) {
      router.push("/clients");
      return;
    }

    const alreadyHasContext =
      selectedRecording?.id === recordingId && selectedClient?.id === clientId;
    if (alreadyHasContext) {
      setLoading(false);
      setResolved(true);
      return;
    }

    let cancelled = false;

    const loadFromApi = async () => {
      setLoading(true);
      const response = await GetAPI(`/recording/${recordingId}`, true);
      if (cancelled) return;

      if (response.status !== 200 || !response.body?.id) {
        router.push("/clients");
        return;
      }

      const recording = response.body;
      setSelectedRecording(recording as Parameters<typeof setSelectedRecording>[0]);
      if (recording.client) {
        setSelectedClient(recording.client as Parameters<typeof setSelectedClient>[0]);
      }
      setResolved(true);
      setLoading(false);
    };

    loadFromApi();
    return () => {
      cancelled = true;
    };
  }, [
    clientId,
    recordingId,
    selectedRecording?.id,
    selectedClient?.id,
    GetAPI,
    router,
    setSelectedRecording,
    setSelectedClient,
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
