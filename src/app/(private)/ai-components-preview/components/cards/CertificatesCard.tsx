"use client";

import { CertificatesCardData } from "../../types/component-types";
import { TruncatedTooltip } from "../core/TruncatedTooltip";
import { getIcon, getVariantStyles } from "../../utils/icon-mapper";

interface CertificatesCardProps {
  title: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "teal" | "gray" | "rose";
  data: CertificatesCardData;
}

export function CertificatesCard({
  title,
  variant = "amber",
  data,
}: CertificatesCardProps) {
  const styles = getVariantStyles(variant);
  const Icon = getIcon("file-signature");

  const certs = data.certificates && Array.isArray(data.certificates) ? data.certificates : [];

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
          {certs.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{certs.length} atestado(s)</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        {certs.length > 0 ? (
          certs.map((cert) => (
            <div
              key={cert.id}
              className={`rounded-xl border ${styles.border} bg-white p-4 transition-shadow hover:shadow-sm`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 leading-snug break-words">
                    {cert.type}
                  </p>
                  {cert.description && (
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed break-words">
                      {cert.description}
                    </p>
                  )}
                  {cert.period && (
                    <p className="mt-2 text-xs text-gray-400">Período: {cert.period}</p>
                  )}
                </div>
                {cert.date && (
                  <span
                    className={`shrink-0 rounded-lg border ${styles.border} ${styles.bg} px-2.5 py-1 text-xs font-semibold ${styles.text} whitespace-nowrap`}
                  >
                    {cert.date}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm text-gray-400">
            Nenhum item disponível
          </div>
        )}
      </div>
    </div>
  );
}
