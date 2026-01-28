"use client";

import { NextAppointmentsCardData } from "../../types/component-types";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface NextAppointmentsCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: NextAppointmentsCardData;
}

const monthNames = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

export function NextAppointmentsCard({
  title,
  variant = "rose",
  data,
}: NextAppointmentsCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("calendar-clock");

  const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
  const items = isGenericFormat ? (data.items || []) : [];
  const legacyItems = data.appointments && Array.isArray(data.appointments) ? data.appointments : [];

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} text-white shadow-md ${styles.shadow}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2">
        {/* Detectar formato: genérico (items[]) ou legado (appointments[]) */}
        {(() => {
          const isGenericFormat = data.items && Array.isArray(data.items) && data.items.length > 0;
          const items = isGenericFormat ? data.items : [];
          
          // Converter formato legado para genérico
          const legacyItems = data.appointments && Array.isArray(data.appointments)
            ? data.appointments.map((appt) => ({
                id: appt.id,
                primary: appt.type || 'Agendamento',
                secondary: appt.doctor,
                metadata: [
                  appt.date && { label: "Data", value: appt.date },
                  appt.time && { label: "Hora", value: appt.time },
                ].filter(Boolean) as Array<{ label: string; value: string }>,
                tags: appt.notes ? [appt.notes] : [],
                status: undefined,
              }))
            : [];

          const displayItems = isGenericFormat ? items : legacyItems;

          if (!displayItems || displayItems.length === 0) {
            return (
              <div className="col-span-full min-h-[120px] w-full rounded-2xl border border-gray-100 bg-gray-50/50 py-8 text-center text-sm text-gray-500">
                Nenhum agendamento disponível
              </div>
            );
          }

          return displayItems.map((item, idx) => {
            const dateMeta = item.metadata?.find((m: { label: string; value: string }) => 
              m.label.toLowerCase().includes('data')
            );
            const timeMeta = item.metadata?.find((m: { label: string; value: string }) => 
              m.label.toLowerCase().includes('hora')
            );
            
            const dateStr = dateMeta?.value || '';
            const isShortDate = dateStr.includes("/") && dateStr.split("/").length >= 2;
            const [day, month] = isShortDate ? dateStr.split("/") : ['', ''];
            
            return (
              <div
                key={item.id || idx}
                className={`grid min-h-[100px] w-full grid-cols-1 gap-4 rounded-2xl border ${styles.border} bg-gradient-to-r ${styles.bg} to-white p-5 shadow-sm transition-shadow hover:shadow-md sm:grid-cols-[auto_1fr] sm:gap-5`}
              >
                {dateStr && (
                  isShortDate ? (
                    <div
                      className={`flex h-fit w-16 flex-shrink-0 flex-col items-center justify-center self-start rounded-xl border ${styles.border} bg-white p-3 shadow-sm`}
                    >
                      <span className={`text-2xl font-bold leading-tight ${styles.text}`}>
                        {day}
                      </span>
                      {month && (
                        <span className="mt-0.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                          {monthNames[parseInt(month, 10) - 1] || month}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Data prevista
                      </span>
                      <p className="text-sm font-medium leading-snug text-gray-700">
                        {dateStr}
                      </p>
                    </div>
                  )
                )}
                <div
                  className={`flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1 ${!dateStr || !isShortDate ? "sm:col-span-2" : ""}`}
                >
                  <p className="font-bold text-gray-900">{item.primary}</p>
                  {item.status && (
                    <p className="text-sm font-medium text-gray-600">{item.status}</p>
                  )}
                  {(timeMeta?.value || item.secondary) && (
                    <p className={`text-sm font-medium ${styles.text}`}>
                      {[timeMeta?.value, item.secondary].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <p className="mt-2 inline-flex w-fit max-w-full flex-wrap rounded-lg border border-gray-100 bg-white/80 px-2.5 py-1 text-xs text-gray-600">
                      <span className="font-medium text-gray-500">Obs:</span>{" "}{item.tags[0]}
                    </p>
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </section>
  );
}
