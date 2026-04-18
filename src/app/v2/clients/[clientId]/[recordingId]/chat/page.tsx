"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { RecorderModal } from "../../../../_components/recorder-modal";
import { RecordingHeader } from "../../../../_components/recording-header";
import { RecordingTabs } from "../../../../_components/recording-tabs";
import { SectionChat } from "../../../../_components/section-chat";
import { Shell } from "../../../../_components/shell";
import { allClients, mockRecording } from "../../../../_mocks";

export default function ClientRecordingChatPage() {
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
          { label: "Chat" },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <RecordingHeader
            eyebrow="Converse com a IA"
            title={mockRecording.title}
            client={client.name}
            date={mockRecording.date}
            duration={mockRecording.duration}
          />

          <RecordingTabs tabs={tabs} active="chat" />

          <SectionChat recordingName={mockRecording.title} />
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
