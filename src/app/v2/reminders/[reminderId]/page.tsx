"use client";

import { MoreHorizontal, Share2, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { RecorderModal } from "../../_components/recorder-modal";
import { RecordingHeader } from "../../_components/recording-header";
import { RecordingTabs } from "../../_components/recording-tabs";
import { SectionInsights } from "../../_components/section-insights";
import { Shell } from "../../_components/shell";
import { mockReminders } from "../../_mocks";

export default function ReminderDetailPage() {
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
          { label: reminder.title },
        ]}
        onRecordClick={() => setOpen(true)}
      >
        <div className="mx-auto max-w-3xl space-y-8">
          <RecordingHeader
            eyebrow={`Lembrete · Prioridade ${reminder.priority}`}
            title={reminder.title}
            date={reminder.due}
            duration={reminder.duration}
            actions={
              <>
                <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50">
                  <Share2 className="h-3.5 w-3.5" />
                  Compartilhar
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-neutral-500 to-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-neutral-900/15 transition hover:shadow-lg active:scale-[0.98]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Personalizar IA
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
