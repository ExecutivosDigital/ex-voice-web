import { useApiContext } from "@/context/ApiContext";
import { useCallback } from "react";

export function useRecordingUpload() {
  const { PostAPI } = useApiContext();

  const uploadMedia = useCallback(
    async (blob: Blob, mediaType: "audio" | "video"): Promise<string> => {
      try {
        const extension = mediaType === "audio" ? "mp3" : "webm";
        const mimeType = mediaType === "audio" ? "audio/mpeg" : "video/webm";

        const file = new File([blob], `${mediaType}.${extension}`, {
          type: mimeType,
        });
        const formData = new FormData();
        formData.append("file", file);

        const response = await PostAPI("/convert", formData, false);

        if (!response || response.status >= 400) {
          const statusText =
            response?.status === 413
              ? "Arquivo muito grande para upload."
              : response?.status === 500
                ? "Erro no servidor. Tente novamente."
                : `Falha no upload de ${mediaType}.`;
          throw new Error(statusText);
        }

        const url = response?.body?.url || response?.body?.[`${mediaType}Url`];

        if (!url) {
          throw new Error(`Upload não retornou URL do ${mediaType}.`);
        }

        return url;
      } catch (error) {
        console.error(`Erro no upload de ${mediaType}:`, error);

        // Check if it's a network error
        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new Error(
            "Erro de conexão. Verifique sua internet e tente novamente.",
          );
        }

        // Re-throw the error with the existing message
        throw error;
      }
    },
    [PostAPI],
  );

  const formatDurationForAPI = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  }, []);

  return {
    uploadMedia,
    formatDurationForAPI,
  };
}
