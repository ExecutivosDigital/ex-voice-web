"use client";

import { useApiContext } from "@/context/ApiContext";
import { useCorporate } from "@/context/corporateContext";
import { cn } from "@/utils/cn";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Receipt,
  XCircle,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { CompanyTabs } from "../components/company-tabs";

moment.locale("pt-br");

/**
 * Fase 2.6 — faturas e assinatura da empresa (migrado do client-dashboard).
 * Só Controlador. Leitura: GET /company-adm/signature e /company-adm/invoices.
 */

interface Invoice {
  id: string;
  name: string;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELED" | "OVERDUE";
  dueDate: string;
  paidAt: string | null;
  pdfUrl: string | null;
  paymentLink: string | null;
  invoiceFileUrl: string | null;
  createdAt: string;
}

function statusMeta(status: Invoice["status"]) {
  switch (status) {
    case "PAID":
      return {
        label: "Paga",
        cls: "bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
      };
    case "PENDING":
      return { label: "Pendente", cls: "bg-amber-50 text-amber-700", icon: Clock };
    case "OVERDUE":
      return { label: "Vencida", cls: "bg-red-50 text-red-600", icon: XCircle };
    default:
      return {
        label: "Cancelada",
        cls: "bg-gray-100 text-gray-500",
        icon: XCircle,
      };
  }
}

export default function CompanyBillingPage() {
  const { loaded, isController } = useCorporate();
  const { GetAPI } = useApiContext();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [signature, setSignature] = useState<Record<string, unknown> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loaded || !isController) return;
    (async () => {
      const [invoicesRes, signatureRes] = await Promise.all([
        GetAPI("/company-adm/invoices", true),
        GetAPI("/company-adm/signature", true),
      ]);
      if (invoicesRes.status === 200) {
        const body = invoicesRes.body;
        setInvoices(Array.isArray(body) ? body : (body?.items ?? []));
      }
      if (signatureRes.status === 200) setSignature(signatureRes.body);
      setLoading(false);
    })();
  }, [loaded, isController, GetAPI]);

  if (loaded && !isController) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
        <p className="text-sm text-gray-500">
          Somente o controlador da empresa acessa esta área.
        </p>
      </div>
    );
  }

  const plan =
    (signature as any)?.signaturePlan?.name ??
    (signature as any)?.plan?.name ??
    null;
  const expiration =
    (signature as any)?.expirationDate ?? (signature as any)?.expiresAt ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          Faturas
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Assinatura e histórico de cobranças da empresa.
        </p>
      </div>

      <CompanyTabs />

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl border border-gray-200/60 bg-white/60"
            />
          ))}
        </div>
      ) : (
        <>
          {(plan || expiration) && (
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200/70 bg-white p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dim text-white">
                <Receipt size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {plan ? `Plano: ${plan}` : "Assinatura ativa"}
                </p>
                {expiration && (
                  <p className="text-xs text-gray-500">
                    Vigência até {moment(expiration).format("DD/MM/YYYY")}
                  </p>
                )}
              </div>
            </div>
          )}

          {invoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Nenhuma fatura registrada ainda.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {invoices.map((invoice) => {
                const status = statusMeta(invoice.status);
                const StatusIcon = status.icon;
                const link =
                  invoice.invoiceFileUrl ||
                  invoice.pdfUrl ||
                  invoice.paymentLink;
                return (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-white px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <FileText size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {invoice.name || "Fatura"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Vencimento{" "}
                          {moment(invoice.dueDate).format("DD/MM/YYYY")}
                          {invoice.paidAt &&
                            ` · paga em ${moment(invoice.paidAt).format("DD/MM/YYYY")}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {invoice.amount?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
                          status.cls,
                        )}
                      >
                        <StatusIcon size={11} />
                        {status.label}
                      </span>
                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
                          aria-label="Abrir fatura"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
