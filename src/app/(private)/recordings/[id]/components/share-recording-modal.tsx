"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { useApiContext } from "@/context/ApiContext";
import { ChevronDown, Trash2, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * Fase 2.3 — dono compartilha a gravação (tudo: áudio + transcrição +
 * análises) com qualquer colega da empresa; destinatário é notificado in-app.
 */

interface Colleague {
  id: string;
  name: string;
  email: string;
}

interface ShareView {
  id: string;
  sharedWithId: string;
  sharedWith: { id: string; name: string; email: string };
}

export function ShareRecordingModal({
  recordingId,
  open,
  onClose,
}: {
  recordingId: string;
  open: boolean;
  onClose: () => void;
}) {
  const { GetAPI, PostAPI, DeleteAPI } = useApiContext();
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [shares, setShares] = useState<ShareView[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [colleaguesRes, sharesRes] = await Promise.all([
      GetAPI("/corporate/users/colleagues", true),
      GetAPI(`/corporate/recordings/${recordingId}/shares`, true),
    ]);
    if (colleaguesRes.status === 200) setColleagues(colleaguesRes.body);
    if (sharesRes.status === 200) setShares(sharesRes.body);
    setLoading(false);
  }, [GetAPI, recordingId]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      loadData();
    }
  }, [open, loadData]);

  async function handleShare() {
    if (!selectedId) return;
    setBusy(true);
    const response = await PostAPI(
      "/corporate/recordings/shares",
      { recordingId, sharedWithId: selectedId },
      true,
    );
    setBusy(false);
    if (response.status === 200 || response.status === 201) {
      toast.success("Gravação compartilhada — o colega foi notificado");
      setSelectedId("");
      loadData();
    } else {
      toast.error(response.body?.message || "Não foi possível compartilhar");
    }
  }

  async function handleRevoke(share: ShareView) {
    setBusy(true);
    const response = await DeleteAPI(
      `/corporate/recordings/${recordingId}/shares/${share.sharedWithId}`,
      true,
    );
    setBusy(false);
    if (response.status === 200) {
      toast.success("Compartilhamento revogado");
      loadData();
    } else {
      toast.error(response.body?.message || "Não foi possível revogar");
    }
  }

  const sharedIds = new Set(shares.map((s) => s.sharedWithId));
  const candidates = colleagues.filter((c) => !sharedIds.has(c.id));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Compartilhar gravação</DialogTitle>
          <DialogDescription>
            O colega passa a ver tudo desta gravação: áudio, transcrição e
            análises. Ele recebe uma notificação.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto">
              {shares.length === 0 && (
                <p className="py-3 text-center text-sm text-gray-400">
                  Ainda não compartilhada com ninguém.
                </p>
              )}
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {share.sharedWith.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {share.sharedWith.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevoke(share)}
                    disabled={busy}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label={`Revogar de ${share.sharedWith.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {candidates.length > 0 ? (
              <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                <div className="relative flex-1">
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white pr-8 pl-3 text-sm text-gray-800 outline-none focus:border-gray-400"
                  >
                    <option value="">Compartilhar com...</option>
                    {candidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                  />
                </div>
                <button
                  onClick={handleShare}
                  disabled={!selectedId || busy}
                  className="flex h-10 items-center gap-1.5 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                >
                  <UserPlus size={15} /> Enviar
                </button>
              </div>
            ) : (
              colleagues.length > 0 && (
                <p className="border-t border-gray-100 pt-3 text-xs text-gray-400">
                  Já compartilhada com todos os colegas.
                </p>
              )
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
