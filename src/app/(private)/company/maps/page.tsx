"use client";

import { useApiContext } from "@/context/ApiContext";
import { useCorporate } from "@/context/corporateContext";
import { translateError } from "@/utils/translate-error";
import {
  Check,
  ChevronDown,
  Copy,
  FileDown,
  Loader2,
  Map as MapIcon,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { CompanyTabs } from "../components/company-tabs";

/**
 * Mapas da verdade (Fase 4) — o Controlador gera um documento analítico do
 * período a partir das conversas transcritas: objeções, gatilhos, eficiência
 * do time, cobranças, panorama. Escopo empresa ou departamento.
 */

interface MapTypeOption {
  key: string;
  titulo: string;
}

interface Department {
  id: string;
  name: string;
}

interface MapResult {
  titulo: string;
  markdown: string;
  stats: { recordingsInPeriod: number; recordingsIncluded: number; truncated: boolean };
  period: { startDate: string; endDate: string };
}

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export default function CompanyMapsPage() {
  const { loaded, isController } = useCorporate();
  const { GetAPI, PostAPI } = useApiContext();

  const [types, setTypes] = useState<MapTypeOption[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [mapType, setMapType] = useState("objecoes");
  const [departmentId, setDepartmentId] = useState("");
  const [startDate, setStartDate] = useState(isoDaysAgo(30));
  const [endDate, setEndDate] = useState(isoDaysAgo(0));
  const [customFocus, setCustomFocus] = useState("");

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<MapResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loaded || !isController) return;
    (async () => {
      const [typesRes, deptRes] = await Promise.all([
        GetAPI("/corporate/maps/types", true),
        GetAPI("/corporate/departments", true),
      ]);
      if (typesRes.status === 200) setTypes(typesRes.body);
      if (deptRes.status === 200)
        setDepartments(
          deptRes.body.map((d: { id: string; name: string }) => ({
            id: d.id,
            name: d.name,
          })),
        );
    })();
  }, [loaded, isController, GetAPI]);

  const generate = useCallback(async () => {
    setGenerating(true);
    setResult(null);
    const response = await PostAPI(
      "/corporate/maps/generate",
      {
        mapType,
        startDate,
        endDate,
        departmentId: departmentId || undefined,
        customFocus: customFocus.trim() || undefined,
      },
      true,
    );
    setGenerating(false);
    if (response.status === 200 || response.status === 201) {
      setResult(response.body);
    } else {
      toast.error(
        translateError(
          response.body?.message,
          "Não foi possível gerar o mapa (há gravações transcritas no período?)",
        ),
      );
    }
  }, [PostAPI, mapType, startDate, endDate, departmentId, customFocus]);

  async function copyMap() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  function printMap() {
    if (!result) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>${result.titulo}</title>` +
        `<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 20px;color:#111;line-height:1.6}h1,h2,h3{color:#111}</style>` +
        `</head><body><pre style="white-space:pre-wrap;font-family:inherit">${result.markdown
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</pre></body></html>`,
    );
    win.document.close();
    win.print();
  }

  if (loaded && !isController) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
        <p className="text-sm text-gray-500">
          Somente o controlador da empresa acessa esta área.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          Mapas
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          A IA lê as conversas transcritas do período e monta um documento
          analítico — objeções, gatilhos, cobranças, panorama.
        </p>
      </div>

      <CompanyTabs />

      {/* Configuração */}
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Tipo de mapa
            </label>
            <div className="relative">
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-800 outline-none focus:border-gray-400"
              >
                {types.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.titulo}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Escopo
            </label>
            <div className="relative">
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-800 outline-none focus:border-gray-400"
              >
                <option value="">Empresa toda</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    Departamento: {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              De
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">
              Até
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            Recorte adicional (opcional)
          </label>
          <input
            value={customFocus}
            onChange={(e) => setCustomFocus(e.target.value)}
            placeholder="Ex.: foque no que os clientes falaram sobre prazo de entrega"
            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={generate}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02] disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Gerando mapa...
              </>
            ) : (
              <>
                <Sparkles size={15} /> Gerar mapa
              </>
            )}
          </button>
        </div>
      </section>

      {generating && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200/60 bg-white/60 py-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">
            Lendo as conversas do período e montando o mapa. Pode levar até um
            minuto.
          </p>
        </div>
      )}

      {result && !generating && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapIcon size={18} className="text-gray-500" />
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {result.titulo}
                </h2>
                <p className="text-xs text-gray-400">
                  {result.stats.recordingsIncluded} de{" "}
                  {result.stats.recordingsInPeriod} conversa(s) do período
                  {result.stats.truncated && " (amostra — período muito grande)"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyMap}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  copied
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copiado" : "Copiar"}
              </button>
              <button
                onClick={printMap}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <FileDown size={13} /> PDF
              </button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none rounded-2xl border border-gray-200/70 bg-white p-6 text-gray-800 shadow-sm prose-headings:text-gray-900">
            <ReactMarkdown>{result.markdown}</ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}
