"use client";

import { ActionSheet } from "@/components/ui/action-sheet";
import { RequestTranscription } from "@/components/ui/request-transcription";
import { WaveformAudioPlayer } from "@/components/ui/waveform-audio-player";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { buildRowsFromSpeeches } from "@/utils/speeches";
import { Check, Mic, Pencil, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export function Transcription() {
  const { selectedRecording, setSelectedRecording } = useGeneralContext();
  const { PutAPI } = useApiContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainSpeakerId, setMainSpeakerId] = useState<string | null>(null);
  const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null);
  const [tempSpeakerName, setTempSpeakerName] = useState("");

  const rows = useMemo(
    () =>
      buildRowsFromSpeeches(
        selectedRecording?.speeches,
        selectedRecording?.speakers,
      ),
    [selectedRecording?.speeches, selectedRecording?.speakers],
  );

  // Initialize main speaker with the first one if not set
  useEffect(() => {
    if (
      mainSpeakerId === null &&
      selectedRecording?.speakers &&
      selectedRecording.speakers.length > 0
    ) {
      setMainSpeakerId(selectedRecording.speakers[0].id);
    }
  }, [selectedRecording, mainSpeakerId]);

  // Helper to determine if the speaker is likely the professional (right side)
  const isProfessional = (speakerId: string) => {
    return speakerId === mainSpeakerId;
  };

  const getSpeakerColor = (index: number) => {
    const colors = [
      "bg-emerald-100 text-emerald-600",
      "bg-purple-100 text-purple-600",
      "bg-amber-100 text-amber-600",
      "bg-rose-100 text-rose-600",
      "bg-cyan-100 text-cyan-600",
      "bg-indigo-100 text-indigo-600",
      "bg-lime-100 text-lime-600",
      "bg-orange-100 text-orange-600",
    ];
    // Use modulo to cycle through colors if there are many speakers
    // Add logic to handle negative index if any
    const safeIndex = index < 0 ? 0 : index;
    return colors[safeIndex % colors.length];
  };

  const handleSaveSpeakerName = async (speakerId: string) => {
    if (!selectedRecording) return;

    const updatedSpeakers = selectedRecording.speakers?.map((s) =>
      s.id === speakerId ? { ...s, name: tempSpeakerName } : s
    );

    try {
      const resp = await PutAPI(
        `/recording/${selectedRecording.id}`,
        {
          speakers: updatedSpeakers,
        },
        true,
      );

      if (resp.status === 200) {
        setSelectedRecording({
          ...selectedRecording,
          speakers: updatedSpeakers || [],
        });
        toast.success("Nome do locutor atualizado!");
      } else {
        toast.error("Erro ao salvar nome do locutor.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar nome do locutor.");
    } finally {
      setEditingSpeakerId(null);
    }
  };

  const getSpeakerInitials = (name: string) => {
    const match = name.match(/\d+/);
    if (match) return match[0];
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <ActionSheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Organizar Locutores"
        description="Selecione o locutor principal (profissional) para ajustar a visualização da conversa."
      >
        <div className="flex w-full flex-col gap-5">
          <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
            {selectedRecording?.speakers?.map((speaker, index) => {
              const isActive = mainSpeakerId === speaker.id;
              return (
                <div
                  key={speaker.id}
                  className={cn(
                    "group flex items-center justify-between rounded-xl border p-3 transition-all",
                    isActive
                      ? "border-primary bg-zinc-50 ring-1 ring-primary"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <button
                      onClick={() => setMainSpeakerId(speaker.id)}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-transform active:scale-95",
                        isActive
                          ? "bg-zinc-900 text-white"
                          : getSpeakerColor(index),
                      )}
                    >
                      {isActive ? (
                        <Mic className="h-4 w-4" />
                      ) : speaker.name ? (
                        getSpeakerInitials(speaker.name)
                      ) : (
                        index + 1
                      )}
                    </button>

                    {editingSpeakerId === speaker.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          autoFocus
                          type="text"
                          className="w-full rounded border border-slate-300 px-2 py-1 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          value={tempSpeakerName}
                          onChange={(e) => setTempSpeakerName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleSaveSpeakerName(speaker.id);
                            if (e.key === "Escape") setEditingSpeakerId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveSpeakerName(speaker.id)}
                          className="rounded-full p-1 text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingSpeakerId(null)}
                          className="rounded-full p-1 text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-between">
                        <button
                          onClick={() => setMainSpeakerId(speaker.id)}
                          className={cn(
                            "flex-1 text-left text-sm font-medium",
                            isActive ? "text-zinc-900" : "text-slate-700",
                          )}
                        >
                          {speaker.name || `Locutor ${index + 1}`}
                        </button>
                        <button
                          onClick={() => {
                            setEditingSpeakerId(speaker.id);
                            setTempSpeakerName(
                              speaker.name || `Locutor ${index + 1}`,
                            );
                          }}
                          className="ml-2 rounded-full p-1.5 bg-gradient-to-br from-zinc-800/50 to-black/50 text-white shadow-sm transition-all hover:scale-110 active:scale-95"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {isActive && !editingSpeakerId && (
                    <Check className="h-5 w-5 text-zinc-900" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg bg-gradient-to-r from-primary to-black px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-zinc-900/25 active:scale-95"
            >
              Concluir
            </button>
          </div>
        </div>
      </ActionSheet>

      <div className="flex max-h-[calc(100vh-200px)] w-full flex-col gap-6 overflow-y-auto rounded-2xl border border-slate-200 p-4">
        <div className="flex w-full flex-row items-center justify-between border-b border-b-slate-200 px-4 pt-2 pb-2">
          <div className="flex-1" />
          {selectedRecording?.audioUrl && (
            <WaveformAudioPlayer
              audioUrl={selectedRecording.audioUrl}
              videoDuration={selectedRecording.duration}
            />
          )}
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-black px-4 py-2 font-medium text-white transition-all hover:shadow-lg hover:shadow-zinc-900/25 active:scale-95"
            >
              Organizar Locutores
            </button>
          </div>
        </div>
        {selectedRecording?.speeches.length !== 0 ? (
          rows.map((speech) => {
            const isPro = isProfessional(speech.speakerId);
            return (
              <div
                key={speech.id}
                className={cn(
                  "flex w-full gap-3 md:max-w-[85%]",
                  isPro ? "flex-row-reverse self-end" : "flex-row self-start",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-full text-xs font-bold shadow-sm",
                    isPro
                      ? "bg-zinc-100 text-primary"
                      : getSpeakerColor(speech.index),
                  )}
                >
                  {isPro ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    getSpeakerInitials(speech.name)
                  )}
                </div>

                <div
                  className={cn(
                    "flex flex-col gap-1",
                    isPro ? "items-end" : "items-start",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">
                      {speech.name}
                    </span>
                    <span className="text-xs text-gray-400">{speech.t}</span>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                      isPro
                        ? "rounded-tr-none bg-gradient-to-r from-primary to-black text-white"
                        : "rounded-tl-none border border-gray-100 bg-white text-gray-700",
                    )}
                  >
                    {speech.text}
                  </div>
                </div>
              </div>
            );
          })
        ) : selectedRecording?.transcription ? (
          <div className="flex flex-col gap-4 px-10">
            <p className="text-primary m-auto w-full text-justify text-base font-extrabold">
              Transcrição Completa
            </p>
            <div className="m-auto w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-justify text-base leading-relaxed font-medium text-gray-700">
                {selectedRecording.transcription}
              </p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-primary m-auto w-full text-center text-3xl font-extrabold md:w-max">
              Transcrição não disponível
            </h1>
            <div className="prose prose-sm prose-h1:text-center prose-h1:text-primary prose-h2:text-primary w-full max-w-none">
              <RequestTranscription />
            </div>
          </>
        )}
      </div>
    </>
  );
}
