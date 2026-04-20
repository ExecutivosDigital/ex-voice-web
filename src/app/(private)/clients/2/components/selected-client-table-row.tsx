"use client";
import { RecordingDetailsProps } from "@/@types/general-client";
import { TableCell, TableRow } from "@/components/ui/blocks/table";
import { ContactsIcon } from "@/components/ui/custom-icons";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { CheckCircle2, ChevronRight, Clock, Loader2 } from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  recording: RecordingDetailsProps;
}

export function SelectedPatientTableItem({ recording }: Props) {
  const { setSelectedRecording } = useGeneralContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = () => {
    setSelectedRecording(recording);
    router.push(`${pathname}/${recording.id}`);
  };

  const getTranscriptionStatus = () => {
    switch (recording.transcriptionStatus) {
      case "DONE":
        return {
          label: "Concluída",
          icon: CheckCircle2,
          dotClass: "bg-emerald-500",
          textClass: "text-emerald-700",
          bgClass: "bg-emerald-50 border-emerald-200",
        };
      case "TRANSCRIBING":
        return {
          label: "Transcrevendo",
          icon: Loader2,
          dotClass: "bg-amber-500 animate-pulse",
          textClass: "text-amber-700",
          bgClass: "bg-amber-50 border-amber-200",
        };
      case "PENDING":
      case "NOT_REQUESTED":
      default:
        return {
          label: "Pendente",
          icon: Clock,
          dotClass: "bg-gray-400",
          textClass: "text-gray-600",
          bgClass: "bg-gray-50 border-gray-200",
        };
    }
  };

  const transcriptionStatus = getTranscriptionStatus();

  return (
    <TableRow
      onClick={handleNavigation}
      key={recording.id}
      className="group h-20 cursor-pointer border-b border-gray-100 bg-white transition-all duration-300 hover:bg-slate-50 hover:shadow-sm"
    >
      <TableCell className="w-[40%] py-4 pl-6 text-start">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 shadow-md shadow-gray-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-gray-500/30">
            <ContactsIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 transition-colors group-hover:text-gray-600">
              {recording.name || "Sem título"}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {moment(recording.createdAt).format("DD [de] MMMM [de] YYYY")}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4 text-start text-sm font-medium whitespace-nowrap text-gray-600">
        {moment(recording.createdAt).format("HH:mm")}
      </TableCell>
      <TableCell className="py-4 text-start">
        <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 group-hover:bg-gray-50 group-hover:text-gray-700">
          {recording.duration || "00:00"}
        </span>
      </TableCell>
      <TableCell className="py-4 text-start">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            transcriptionStatus.bgClass,
            transcriptionStatus.textClass,
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              transcriptionStatus.dotClass,
            )}
          />
          {transcriptionStatus.label}
        </span>
      </TableCell>
      <TableCell className="py-4 pr-6 text-end">
        <div className="flex items-center justify-end">
          <button
            onClick={handleNavigation}
            className="group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary hover:!bg-primary hover:shadow-primary/25 flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition-all duration-300 hover:!text-white"
          >
            <span>Acessar</span>
            <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
