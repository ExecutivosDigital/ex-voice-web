"use client";

import { NextAppointmentsCardData } from "../../types/component-types";
import { TruncatedTooltip } from "../core/TruncatedTooltip";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface NextAppointmentsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: NextAppointmentsCardData;
}

const MONTH_NAMES = [
  "JAN","FEV","MAR","ABR","MAI","JUN",
  "JUL","AGO","SET","OUT","NOV","DEZ",
];

function parseDate(dateStr: string) {
  const parts = dateStr.split("/");
  if (parts.length >= 2) {
    const day = parts[0]?.trim() || "";
    const month = parts[1]?.trim() || "";
    const valid =
      day && month && !isNaN(parseInt(day)) && !isNaN(parseInt(month)) &&
      parseInt(month) >= 1 && parseInt(month) <= 12;
    if (valid) return { day, month };
  }
  return null;
}

export function NextAppointmentsCard({
  title,
  variant = "rose",
  data,
}: NextAppointmentsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("calendar-clock");

  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = isGenericFormat ? data.items || [] : [];

  const legacyItems =
    data.appointments && Array.isArray(data.appointments)
      ? data.appointments.map((appt) => ({
          id: appt.id,
                        primary: appt.type || "",
          secondary: appt.doctor,
          metadata: [
            appt.date ? { label: "Data", value: appt.date } : null,
            appt.time ? { label: "Hora", value: appt.time } : null,
          ].filter(Boolean) as Array<{ label: string; value: string }>,
          tags: appt.notes ? [appt.notes] : [],
        }))
      : [];

  const displayItems = isGenericFormat ? items : legacyItems;

  return (
    <div
      className={`h-full w-full overflow-hidden rounded-2xl border ${styles.border} bg-white shadow-sm flex flex-col`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${styles.border}`}>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <TruncatedTooltip content={title}>
            <h3 className="font-semibold text-gray-900 leading-snug truncate">{title}</h3>
          </TruncatedTooltip>
          {displayItems.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{displayItems.length} agendamento(s)</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        {displayItems.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            Nenhum agendamento disponível
          </div>
        ) : (
          displayItems.map((item, idx) => {
            const dateMeta = item.metadata?.find(
              (m: { label: string; value: string }) =>
                m.label && typeof m.label === "string" && m.label.toLowerCase().includes("data")
            );
            const timeMeta = item.metadata?.find(
              (m: { label: string; value: string }) =>
                m.label && typeof m.label === "string" && m.label.toLowerCase().includes("hora")
            );
            const parsedDate = dateMeta?.value ? parseDate(dateMeta.value) : null;

            return (
              <div
                key={item.id || idx}
                className={`flex items-stretch gap-4 rounded-xl border ${styles.border} ${styles.bg} p-4 overflow-hidden`}
              >
                {/* Mini calendário */}
                {parsedDate ? (
                  <div
                    className={`flex w-14 shrink-0 flex-col items-center justify-center rounded-xl border ${styles.border} bg-white py-2`}
                  >
                    <span className={`text-xl font-bold leading-none ${styles.text}`}>
                      {parsedDate.day}
                    </span>
                    <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {MONTH_NAMES[parseInt(parsedDate.month) - 1] || parsedDate.month}
                    </span>
                  </div>
                ) : dateMeta?.value ? (
                  <div
                    className={`flex shrink-0 items-center justify-center rounded-xl border ${styles.border} bg-white px-3`}
                  >
                    <span className={`text-xs font-bold ${styles.text} whitespace-nowrap`}>
                      {dateMeta.value}
                    </span>
                  </div>
                ) : null}

                {/* Detalhes */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="font-semibold text-gray-900 leading-snug break-words">
                    {item.primary}
                  </p>
                  {(timeMeta || item.secondary) && (
                    <p className={`mt-0.5 text-sm font-medium ${styles.text} leading-snug`}>
                      {timeMeta?.value}
                      {timeMeta && item.secondary && " · "}
                      {item.secondary}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <p className="mt-1.5 text-xs text-gray-500 leading-relaxed break-words">
                      <span className="font-medium">Obs:</span> {item.tags[0]}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
