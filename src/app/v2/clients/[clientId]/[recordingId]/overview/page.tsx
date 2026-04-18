"use client";

import { MoreHorizontal, Share2, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { RecorderModal } from "../../../../_components/recorder-modal";
import { RecordingHeader } from "../../../../_components/recording-header";
import { RecordingTabs } from "../../../../_components/recording-tabs";
import { SectionInsights } from "../../../../_components/section-insights";
import { Shell } from "../../../../_components/shell";
import { allClients, mockRecording } from "../../../../_mocks";

export default function ClientRecordingOverviewPage() {
  const params = useParams();
  const clientId = (params?.clientId as string) ?? "c1";
  const recordingId = (params?.recordingId as string) ?? "r1";
  const client = allClients.find((c) => c.id === clientId) ?? allClients[0];
  const [open, setOpen] = useState(false);

  const base = `/v2/clients/${clientId}/${recordingId}`;
  const tabs = [
    { key: "resumo", label: "Resumo", href: base },
    { key: "overview", label: "Insights", href: `${base}/overview` },
    { key: "chat", label: "Chat", href: `${base}/chat` },
    { key: "transcription", label: "Transcrição", href: `${base}/transcription` },
  ];

  return (
    <>
      <Shell
        breadcrumbs={[
          { label: "Contatos", href: "/v2/clients" },
          { label: client.name, href: `/v2/clients/${clientId}` },
          { label: mockRecording.title, href: base },
          { label: "Insights" },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-3xl space-y-8">
          <RecordingHeader
            eyebrow="Insights da consulta"
            title={mockRecording.title}
            client={client.name}
            date={mockRecording.date}
            duration={mockRecording.duration}
            actions={
              <>
                <button className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-xs font-medium text-amber-800 transition hover:bg-amber-50">
                  <Sparkles className="h-3.5 w-3.5" />
                  Personalizar
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50">
                  <Share2 className="h-3.5 w-3.5" />
                  Compartilhar
                </button>
                <button
                  aria-label="Mais ações"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </>
            }
          />

          <RecordingTabs tabs={tabs} active="overview" />

          <SectionInsights />
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
