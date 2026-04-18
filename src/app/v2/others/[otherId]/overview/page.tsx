"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { RecorderModal } from "../../../_components/recorder-modal";
import { RecordingHeader } from "../../../_components/recording-header";
import { RecordingTabs } from "../../../_components/recording-tabs";
import { SectionInsights } from "../../../_components/section-insights";
import { Shell } from "../../../_components/shell";
import { mockOthers } from "../../../_mocks";

export default function OtherOverviewPage() {
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
          { label: "Insights" },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-3xl space-y-8">
          <RecordingHeader
            eyebrow="Insights"
            title={other.title}
            date={other.date}
            duration={other.duration}
          />
          <RecordingTabs tabs={tabs} active="overview" />
          <SectionInsights />
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
