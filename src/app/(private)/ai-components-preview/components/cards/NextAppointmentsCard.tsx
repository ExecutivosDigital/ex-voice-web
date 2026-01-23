"use client";

import { CalendarClock } from "lucide-react";
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

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} text-white shadow-md ${styles.shadow}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.appointments.map((appt) => {
          const [day, month] = appt.date.split("/");
          return (
            <div
              key={appt.id}
              className={`flex items-start gap-5 rounded-2xl border ${styles.border} bg-gradient-to-r ${styles.bg} to-white p-5 transition-all hover:shadow-md`}
            >
              <div
                className={`flex min-w-[70px] flex-col items-center justify-center rounded-xl border ${styles.border} bg-white p-3 shadow-sm`}
              >
                <span className={`text-2xl font-bold ${styles.text}`}>
                  {day}
                </span>
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  {monthNames[parseInt(month) - 1]}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{appt.type}</p>
                <p className={`text-sm font-medium ${styles.text}`}>
                  {appt.time} • {appt.doctor}
                </p>
                {appt.notes && (
                  <p className="mt-2 inline-block rounded border border-gray-100 bg-white/50 px-2 py-1 text-xs text-gray-500">
                    <span className="font-medium">Obs:</span> {appt.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
