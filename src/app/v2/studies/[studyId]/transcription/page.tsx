"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { RecorderModal } from "../../../_components/recorder-modal";
import { RecordingHeader } from "../../../_components/recording-header";
import { RecordingTabs } from "../../../_components/recording-tabs";
import { SectionTranscription } from "../../../_components/section-transcription";
import { Shell } from "../../../_components/shell";
import { mockStudies } from "../../../_mocks";

export default function StudyTranscriptionPage() {
  const params = useParams();
  const studyId = (params?.studyId as string) ?? "e1";
  const study = mockStudies.find((s) => s.id === studyId) ?? mockStudies[0];
  const [open, setOpen] = useState(false);

  const base = `/v2/studies/${studyId}`;
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
          { label: "Estudos", href: "/v2/studies" },
          { label: study.title, href: base },
          { label: "Transcrição" },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <RecordingHeader
            eyebrow="Transcrição completa"
            title={study.title}
            date={study.date}
            duration={study.duration}
          />
          <RecordingTabs tabs={tabs} active="transcription" />
          <SectionTranscription duration={study.duration} />
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
