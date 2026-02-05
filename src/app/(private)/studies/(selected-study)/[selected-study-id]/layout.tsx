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
  const { selectedRecording, setSelectedRecording } = useGeneralContext();
  const { GetAPI } = useApiContext();
  const router = useRouter();
  const params = useParams();
  const recordingId = params["selected-study-id"] as string | undefined;

  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!recordingId) {
      router.push("/studies");
      return;
    }

    const alreadyHasContext = selectedRecording?.id === recordingId;
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
        router.push("/studies");
        return;
      }

      const recording = response.body;
      if (recording.type !== "STUDY") {
        router.push("/studies");
        return;
      }

      setSelectedRecording(recording as Parameters<typeof setSelectedRecording>[0]);
      setResolved(true);
      setLoading(false);
    };

    loadFromApi();
    return () => {
      cancelled = true;
    };
  }, [recordingId, selectedRecording?.id, GetAPI, router, setSelectedRecording]);

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
