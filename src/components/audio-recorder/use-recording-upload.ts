import { useApiContext } from "@/context/ApiContext";
import { useCallback } from "react";

export function useRecordingUpload() {
  const { PostAPI } = useApiContext();

  const uploadMedia = useCallback(
    async (blob: Blob, mediaType: "audio" | "video"): Promise<string> => {
      try {
        const extension = mediaType === "audio" ? "mp3" : "webm";
        const mimeType = mediaType === "audio" ? "audio/mpeg" : "video/webm";

        // Step 1: Request presigned URL from API
        console.log(`Solicitando presigned URL para ${mediaType}...`);

        const presignedResponse = await PostAPI(
          "/upload/presigned-url",
          {
            fileName: `recording-${Date.now()}.${extension}`,
            fileType: mimeType,
          },
          true,
        );

        if (
          presignedResponse?.status !== 200 &&
          presignedResponse?.status !== 201
        ) {
          throw new Error(
            `Erro ao obter URL de upload: ${presignedResponse?.status}`,
          );
        }

        const presignedData = presignedResponse.body;
        const uploadUrl = presignedData.uploadUrl || presignedData.url;
        const finalUrl = presignedData.finalUrl || presignedData.url;

        if (!uploadUrl) {
          throw new Error("API não retornou URL de upload.");
        }

        console.log(`Enviando ${mediaType} para URL assinada...`);

        // Step 2: Upload file directly to presigned URL
        // Note: Presigned URLs typically use PUT and require the exact Content-Type
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: blob,
          headers: {
            "Content-Type": mimeType,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Erro no upload direto: ${uploadResponse.status} ${uploadResponse.statusText}`,
          );
        }

        console.log(`Upload de ${mediaType} concluído. URL final: ${finalUrl}`);

        return finalUrl;
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
