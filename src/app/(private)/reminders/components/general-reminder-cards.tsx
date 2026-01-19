"use client";

import { useGeneralContext } from "@/context/GeneralContext";
import { useEffect } from "react";
import { GeneralReminderCardItem } from "./general-reminder-card-item";
import { CustomPagination } from "@/components/ui/blocks/custom-pagination";

export function GeneralRemindersCards() {
  const {
    recordings,
    isGettingRecordings,
    recordingsFilters,
    setRecordingsFilters,
    recordingsTotalPages,
  } = useGeneralContext();

  useEffect(() => {
    setRecordingsFilters((prev) => ({
      ...prev,
      clientId: undefined,
      type: "REMINDER",
      page: 1,
    }));
  }, [setRecordingsFilters]);

  if (isGettingRecordings) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!isGettingRecordings && recordings.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-white p-12 text-center">
        <h3 className="text-xl font-bold text-gray-900">Nenhum lembrete encontrado</h3>
        <p className="mt-2 text-gray-500">
          Você ainda não possui lembretes gravados. Comece criando um novo!
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recordings.map((recording, index) => (
          <GeneralReminderCardItem
            key={recording.id}
            reminder={recording}
            index={index}
          />
        ))}
      </div>

      {!isGettingRecordings && recordingsTotalPages > 1 && (
        <div className="mt-4 flex justify-center border-t border-gray-100 pt-6">
          <CustomPagination
            currentPage={recordingsFilters.page}
            setCurrentPage={(page) =>
              setRecordingsFilters((prev) => ({ ...prev, page }))
            }
            pages={recordingsTotalPages}
          />
        </div>
      )}
    </div>
  );
}
