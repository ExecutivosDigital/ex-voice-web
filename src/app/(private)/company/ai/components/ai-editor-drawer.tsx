"use client";

import { SectionRenderer } from "@/app/(private)/ai-components-preview/components/core/SectionRenderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { useApiContext } from "@/context/ApiContext";
import { cn } from "@/utils/cn";
import { translateError } from "@/utils/translate-error";
import {
  ChevronDown,
  FlaskConical,
  Loader2,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

moment.locale("pt-br");

export interface CompanyAi {
  id: string;
  name: string;
  content: string;
  structuredPrompt: string | null;
  specificPrompt: string | null;
  icon: string | null;
  departmentId: string | null;
  department: { id: string; name: string } | null;
  scope: "COMPANY" | "DEPARTMENT";
}

interface SampleRecording {
  id: string;
  name: string;
  duration: string;
  createdAt: string;
  department: { name: string } | null;
  user: { name: string };
}

interface PreviewResult {
  summary: string | null;
  structuredSummary: { sections?: unknown[] } | null;
  specificSummary: { sections?: unknown[] } | null;
}

export function AiEditorDrawer({
  ai,
  departments,
  onClose,
  onSaved,
}: {
  ai: CompanyAi | null;
  departments: { id: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { GetAPI, PostAPI, PatchAPI } = useApiContext();

  const [name, setName] = useState(ai?.name ?? "");
  const [content, setContent] = useState(ai?.content ?? "");
  const [structuredPrompt, setStructuredPrompt] = useState(
    ai?.structuredPrompt ?? "",
  );
  const [specificPrompt, setSpecificPrompt] = useState(
    ai?.specificPrompt ?? "",
  );
  const [departmentId, setDepartmentId] = useState(ai?.departmentId ?? "");
  const [saving, setSaving] = useState(false);

  // Painel de teste
  const [samples, setSamples] = useState<SampleRecording[]>([]);
  const [sampleId, setSampleId] = useState("");
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<PreviewResult | null>(null);

  // Gerar com IA a partir de descrição (facilitador)
  const [genOpen, setGenOpen] = useState(!ai); // já abre no modo criar
  const [description, setDescription] = useState("");
  const [genLoading, setGenLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await GetAPI("/corporate/ai/sample-recordings", true);
      if (res.status === 200) {
        setSamples(res.body);
        if (res.body[0]) setSampleId(res.body[0].id);
      }
    })();
  }, [GetAPI]);

  async function handleGenerate() {
    if (description.trim().length < 10) {
      toast.error("Descreva a área em pelo menos uma frase");
      return;
    }
    setGenLoading(true);
    const deptName = departments.find((d) => d.id === departmentId)?.name;
    const res = await PostAPI(
      "/corporate/ai/generate-from-description",
      { description: description.trim(), departmentName: deptName },
      true,
    );
    setGenLoading(false);
    if (res.status === 200 || res.status === 201) {
      setName(res.body.name ?? name);
      setContent(res.body.content ?? "");
      setStructuredPrompt(res.body.structuredPrompt ?? "");
      setSpecificPrompt(res.body.specificPrompt ?? "");
      setGenOpen(false);
      toast.success("IA gerada — revise e ajuste antes de salvar");
    } else {
      toast.error(translateError(res.body?.message, "Não foi possível gerar"));
    }
  }

  async function handleSave() {
    if (!name.trim() || !content.trim()) {
      toast.error("Dê um nome e escreva as instruções principais da IA");
      return;
    }
    setSaving(true);
    const payload = {
      name: name.trim(),
      content: content.trim(),
      structuredPrompt: structuredPrompt.trim() || undefined,
      specificPrompt: specificPrompt.trim() || undefined,
      departmentId: departmentId || undefined,
    };
    const res = ai
      ? await PatchAPI(`/corporate/ai/${ai.id}`, payload, true)
      : await PostAPI("/corporate/ai", payload, true);
    setSaving(false);
    if (res.status === 200 || res.status === 201) {
      toast.success(ai ? "IA atualizada" : "IA criada");
      onSaved();
    } else {
      toast.error(res.body?.message || "Não foi possível salvar");
    }
  }

  const handleTest = useCallback(async () => {
    if (!sampleId) {
      toast.error("Escolha uma gravação de amostra para testar");
      return;
    }
    if (!content.trim()) {
      toast.error("Escreva as instruções principais antes de testar");
      return;
    }
    setTesting(true);
    setResult(null);
    const res = await PostAPI(
      "/corporate/ai/preview",
      {
        recordingId: sampleId,
        content: content.trim(),
        structuredPrompt: structuredPrompt.trim() || undefined,
        specificPrompt: specificPrompt.trim() || undefined,
        departmentId: departmentId || undefined,
      },
      true,
    );
    setTesting(false);
    if (res.status === 200 || res.status === 201) {
      setResult(res.body);
    } else {
      toast.error(res.body?.message || "Não foi possível testar");
    }
  }, [
    PostAPI,
    sampleId,
    content,
    structuredPrompt,
    specificPrompt,
    departmentId,
  ]);

  return (
    <Dialog open onOpenChange={(o) => !o && !saving && onClose()}>
      {/* flex-col + min-h-0 nas colunas: sem isso o grid usa a altura do
          conteúdo (não a da modal), a coluna não rola e o rodapé com o botão
          Salvar fica fora da tela. Ver o print modal-nao-tem-scroll. */}
      <DialogContent className="flex max-h-[92vh] max-w-5xl flex-col overflow-hidden bg-white p-0">
        <DialogHeader className="shrink-0 border-b border-gray-100 px-6 py-4">
          <DialogTitle>{ai ? "Editar IA" : "Nova IA"}</DialogTitle>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-2">
          {/* Coluna esquerda: editor */}
          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto border-r border-gray-100 p-6">
            {/* Facilitador: gerar com IA a partir de uma descrição */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
              {genOpen ? (
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-indigo-800">
                    <Wand2 size={13} /> Gerar com IA
                  </p>
                  <p className="text-[11px] text-indigo-700/80">
                    Descreva a área ou etapa em poucas linhas e a IA monta as
                    instruções pra você — depois é só revisar.
                  </p>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Ex.: Reuniões de vendas de fretes dedicados. Quero acompanhar objeções de preço e prazo, e cobrar os próximos passos de cada negociação."
                    className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-indigo-400"
                  />
                  <div className="flex justify-end gap-2">
                    {!!ai && (
                      <button
                        onClick={() => setGenOpen(false)}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-white"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      onClick={handleGenerate}
                      disabled={genLoading}
                      className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {genLoading ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Sparkles size={13} />
                      )}
                      Gerar instruções
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setGenOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  <Wand2 size={13} /> Gerar com IA a partir de uma descrição
                </button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  Nome
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Vendas — Etapa Proposta"
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
                />
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
            </div>

            <PromptField
              label="Instruções principais (resumo)"
              hint="Como a IA deve resumir a conversa. Ex.: foque em objeções do cliente e nos próximos passos."
              value={content}
              onChange={setContent}
              rows={6}
            />
            <PromptField
              label="Análise estruturada (opcional)"
              hint="Instruções para a análise em cards (ações, decisões, métricas). Deixe vazio para usar o padrão."
              value={structuredPrompt}
              onChange={setStructuredPrompt}
              rows={4}
            />
            <PromptField
              label="Pontos de atenção (opcional)"
              hint="Instruções para destacar riscos e pontos críticos."
              value={specificPrompt}
              onChange={setSpecificPrompt}
              rows={4}
            />

            <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-2 border-t border-gray-100 bg-white px-6 py-3">
              <button
                onClick={onClose}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {ai ? "Salvar" : "Criar"}
              </button>
            </div>
          </div>

          {/* Coluna direita: teste */}
          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto bg-gray-50/50 p-6">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">
                Testar a IA
              </h3>
            </div>
            <p className="text-xs text-gray-500">
              Rode esta IA sobre uma gravação já transcrita para ver o resultado
              antes de salvar. Não altera a gravação.
            </p>

            {samples.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 bg-white px-3 py-6 text-center text-xs text-gray-400">
                Nenhuma gravação transcrita ainda para testar. Grave e transcreva
                uma conversa primeiro.
              </p>
            ) : (
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={sampleId}
                      onChange={(e) => setSampleId(e.target.value)}
                      className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-800 outline-none focus:border-gray-400"
                    >
                      {samples.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} · {moment(s.createdAt).format("DD/MM")}
                          {s.department ? ` · ${s.department.name}` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleTest}
                    disabled={testing}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
                  >
                    {testing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <FlaskConical size={14} />
                    )}
                    Testar
                  </button>
                </div>

                {testing && (
                  <div className="flex flex-col items-center gap-2 py-10 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <p className="text-xs text-gray-500">
                      A IA está resumindo a conversa...
                    </p>
                  </div>
                )}

                {result && !testing && (
                  <div className="flex flex-col gap-4">
                    {result.summary && (
                      <div>
                        <p className="mb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                          Resumo
                        </p>
                        <div className="prose prose-sm max-w-none rounded-xl border border-gray-100 bg-white p-3 text-gray-800">
                          <ReactMarkdown>{result.summary}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {result.structuredSummary?.sections && (
                      <PreviewSections
                        label="Análise estruturada"
                        sections={result.structuredSummary.sections}
                      />
                    )}
                    {result.specificSummary?.sections && (
                      <PreviewSections
                        label="Pontos de atenção"
                        sections={result.specificSummary.sections}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PromptField({
  label,
  hint,
  value,
  onChange,
  rows,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-500">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400"
      />
      <p className="mt-1 text-[11px] text-gray-400">{hint}</p>
    </div>
  );
}

function PreviewSections({
  label,
  sections,
}: {
  label: string;
  sections: unknown[];
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </p>
      <div className={cn("flex flex-col gap-3")}>
        {(sections as { title?: string }[]).map((section, i) => (
          <SectionRenderer
            key={i}
            section={section as never}
            sectionIndex={i}
          />
        ))}
      </div>
    </div>
  );
}
