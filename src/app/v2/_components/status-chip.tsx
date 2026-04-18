import { Check, Clock, Loader2, Sparkles } from "lucide-react";
import type { RecordingStatus } from "../_mocks";

export function StatusChip({ status }: { status: RecordingStatus }) {
  if (status === "PRONTO") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
        <Check className="h-3 w-3" strokeWidth={3} />
        Pronto
      </span>
    );
  }
  if (status === "TRANSCRIBING") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
        <Loader2 className="h-3 w-3 animate-spin" />
        Transcrevendo
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700">
        <Clock className="h-3 w-3" />
        Pendente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
      <Sparkles className="h-3 w-3" />
      Solicitar
    </span>
  );
}
