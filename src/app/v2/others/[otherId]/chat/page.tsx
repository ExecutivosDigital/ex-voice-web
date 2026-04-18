"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { RecorderModal } from "../../../_components/recorder-modal";
import { RecordingHeader } from "../../../_components/recording-header";
import { RecordingTabs } from "../../../_components/recording-tabs";
import { SectionChat } from "../../../_components/section-chat";
import { Shell } from "../../../_components/shell";
import { mockOthers } from "../../../_mocks";

export default function OtherChatPage() {
  const params = useParams();
  const otherId = (params?.otherId as string) ?? "o1";
  const other = mockOthers.find((o) => o.id === otherId) ?? mockOthers[0];
  const [open, setOpen] = useState(false);

  const base = `/v2/others/${otherId}`;
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
          { label: "Outros", href: "/v2/others" },
          { label: other.title, href: base },
          { label: "Chat" },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <RecordingHeader
            eyebrow="Converse com a IA"
            title={other.title}
            date={other.date}
            duration={other.duration}
          />
          <RecordingTabs tabs={tabs} active="chat" />
          <SectionChat recordingName={other.title} />
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
