"use client";
import { RecordingDetailsProps } from "@/@types/general-client";
import { TableCell, TableRow } from "@/components/ui/blocks/table";
import { StudyIcon } from "@/components/ui/custom-icons";
import { useGeneralContext } from "@/context/GeneralContext";
import { ChevronRight } from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/navigation";
import { FeatureIcon } from "@/components/ui/feature-icon";

interface Props {
  recording: RecordingDetailsProps;
}

export function GeneralStudiesTableItem({ recording }: Props) {
  const { setSelectedRecording } = useGeneralContext();
  const router = useRouter();

  const handleNavigation = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedRecording(recording);
    router.push(`/studies/${recording.id}`);
  };

  return (
    <TableRow
      onClick={handleNavigation}
      key={recording.id}
      className="group h-20 cursor-pointer border-b border-gray-100 bg-white transition-all duration-300 hover:bg-slate-50 hover:shadow-sm"
    >
      <TableCell className="w-[40%] py-4 pl-6 text-start">
        <div className="flex items-center gap-4">
          <FeatureIcon icon={StudyIcon} className="h-10 w-10 shadow-md shadow-black/5" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 transition-colors group-hover:text-primary">
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
        <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-900">
          {recording.duration || "00:00"}
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
