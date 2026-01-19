"use client";

import { CustomPagination } from "@/components/ui/blocks/custom-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/blocks/table";
import { useGeneralContext } from "@/context/GeneralContext";
import { useEffect } from "react";
import { GeneralStudiesTableItem } from "./general-studies-table-row";

export function GeneralStudiesTable() {
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
      type: "STUDY",
      clientId: undefined,
      page: 1,
    }));
  }, [setRecordingsFilters]);

  const columns = [
    { label: "Título da Gravação", width: "40%" },
    { label: "Horário", width: "15%" },
    { label: "Duração", width: "15%" },
    { label: "Ações", width: "30%", align: "text-end" as const },
  ];

  if (isGettingRecordings) {
    return (
      <div className="w-full space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-50" />
        ))}
      </div>
    );
  }

  if (!isGettingRecordings && recordings.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-white p-12 text-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Nenhum estudo encontrado</h3>
          <p className="mt-2 text-gray-500">
            Você ainda não possui gravações de estudos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Table wrapperClass="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            {columns.map((col, i) => (
              <TableHead
                key={i}
                className={`py-4 text-xs font-bold tracking-wider text-gray-400 uppercase ${i === 0 ? "pl-6" : ""
                  } ${i === columns.length - 1 ? "pr-6 text-end" : "text-start"}`}
                style={{ width: col.width }}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {recordings.map((recording) => (
            <GeneralStudiesTableItem key={recording.id} recording={recording} />
          ))}
        </TableBody>
      </Table>

      {!isGettingRecordings && recordingsTotalPages > 1 && (
        <div className="mt-2 flex justify-center border-t border-gray-100 pt-4">
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
