import { useApiContext } from "@/context/ApiContext";
import { useCallback } from "react";

export function useRecordingUpload() {
  const { PostAPI } = useApiContext();

  const uploadMedia = useCallback(
    async (blob: Blob, mediaType: "audio" | "video"): Promise<string> => {
      try {
        const extension = mediaType === "audio" ? "mp3" : "webm";
        const mimeType = mediaType === "audio" ? "audio/mpeg" : "video/webm";

        // Step 1: Request presigned URL
        const presignedResponse = await PostAPI(
          "/upload/presigned-url",
          {
            fileName: `recording-${Date.now()}.${extension}`, // e.g., "recording-1234567890.mp3"
            fileType: mimeType, // "audio/mpeg" for audio, "video/webm" for video
          },
          true, // Requires authentication
        );

        if (!presignedResponse || presignedResponse.status >= 400) {
          throw new Error(`Falha ao obter URL de upload para ${mediaType}.`);
        }

        const presignedData = presignedResponse.body;
        const uploadUrl = presignedData.uploadUrl || presignedData.url;
        const finalUrl = presignedData.finalUrl || presignedData.url;

        if (!uploadUrl) {
          throw new Error(`Presigned URL não retornou URL de upload.`);
        }

        // Step 2: Direct upload to presigned URL
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT", // Presigned URLs use PUT method
          body: blob, // The recorded media blob
          headers: {
            "Content-Type": mimeType, // Must match the exact MIME type
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Falha no upload de ${mediaType}.`);
        }

        if (!finalUrl) {
          throw new Error(`Upload não retornou URL final do ${mediaType}.`);
        }

        return finalUrl;
      } catch (error) {
        // Network errors
        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new Error(
            "Erro de conexão. Verifique sua internet e tente novamente.",
          );
        }
        console.error(`Erro no upload de ${mediaType}:`, error);
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
