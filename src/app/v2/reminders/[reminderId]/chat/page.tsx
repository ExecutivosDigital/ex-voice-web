"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { RecorderModal } from "../../../_components/recorder-modal";
import { RecordingHeader } from "../../../_components/recording-header";
import { RecordingTabs } from "../../../_components/recording-tabs";
import { SectionChat } from "../../../_components/section-chat";
import { Shell } from "../../../_components/shell";
import { mockReminders } from "../../../_mocks";

export default function ReminderChatPage() {
  const params = useParams();
  const reminderId = (params?.reminderId as string) ?? "l1";
  const reminder = mockReminders.find((r) => r.id === reminderId) ?? mockReminders[0];
  const [open, setOpen] = useState(false);

  const base = `/v2/reminders/${reminderId}`;
  const tabs = [
    { key: "overview", label: "Insights", href: base },
    { key: "chat", label: "Chat", href: `${base}/chat` },
  ];

  return (
    <>
      <Shell
        breadcrumbs={[
          { label: "Lembretes", href: "/v2/reminders" },
          { label: reminder.title, href: base },
          { label: "Chat" },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <RecordingHeader
            eyebrow="Converse com a IA"
            title={reminder.title}
            date={reminder.due}
            duration={reminder.duration}
          />
          <RecordingTabs tabs={tabs} active="chat" />
          <SectionChat recordingName={reminder.title} />
        </div>
      </Shell>

      <RecorderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
