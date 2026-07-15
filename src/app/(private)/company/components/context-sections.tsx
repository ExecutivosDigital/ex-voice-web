"use client";

import { useApiContext } from "@/context/ApiContext";
import { useConfirm } from "@/context/ConfirmContext";
import { translateError } from "@/utils/translate-error";
import {
  BookOpenText,
  Brain,
  ChevronDown,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

/**
 * Fase 2.4 — Business Analytics da empresa + glossário pela tela (Controlador).
 * O businessContext e o glossário alimentam os resumos por IA (Fase 1.3).
 */

/* ==================== Business Analytics da empresa ==================== */

export function BusinessContextCard() {
  const { GetAPI, PatchAPI } = useApiContext();
  const [companyName, setCompanyName] = useState("");
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await GetAPI("/corporate/company", true);
      if (response.status === 200 && response.body) {
        setCompanyName(response.body.name ?? "");
        setText(response.body.businessContext ?? "");
        setSavedText(response.body.businessContext ?? "");
      }
      setLoading(false);
    })();
  }, [GetAPI]);

  async function handleSave() {
    setSaving(true);
    const response = await PatchAPI(
      "/corporate/company",
      { businessContext: text.trim() || undefined },
      true,
    );
    setSaving(false);
    if (response.status === 200) {
      setSavedText(text);
      toast.success("Contexto da empresa salvo — os próximos resumos já usam");
    } else {
      toast.error(response.body?.message || "Não foi possível salvar");
    }
  }

  if (loading) {
    return (
      <div className="h-[140px] animate-pulse rounded-2xl border border-gray-200/60 bg-white/60" />
    );
  }

  const dirty = text !== savedText;

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
          <Brain size={14} /> Contexto da empresa
          {companyName && (
            <span className="normal-case text-gray-400">— {companyName}</span>
          )}
        </h2>
        {dirty && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setText(savedText)}
              disabled={saving}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 transition hover:bg-gray-50 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-1.5 text-xs font-semibold text-white shadow transition hover:scale-[1.02] disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="O que a empresa faz, onde atua, o que vende, diferenciais... Este texto é dado à IA em TODOS os resumos de reunião da empresa — quanto mais fiel, melhores as análises."
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400"
      />
    </section>
  );
}

/* ============================== Glossário ============================== */

interface GlossaryEntry {
  id: string;
  term: string;
  meaning: string;
  departmentId: string | null;
}

export function GlossarySection({
  departments,
}: {
  departments: { id: string; name: string }[];
}) {
  const { GetAPI, PostAPI, DeleteAPI } = useApiContext();
  const confirm = useConfirm();
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState("");
  const [meaning, setMeaning] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.term.toLowerCase().includes(q) || e.meaning.toLowerCase().includes(q),
    );
  }, [entries, filter]);

  const departmentName = useCallback(
    (id: string | null) =>
      id ? (departments.find((d) => d.id === id)?.name ?? "?") : null,
    [departments],
  );

  const load = useCallback(async () => {
    const response = await GetAPI("/corporate/glossary", true);
    if (response.status === 200) setEntries(response.body);
    setLoading(false);
  }, [GetAPI]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd() {
    if (!term.trim() || !meaning.trim()) {
      toast.error("Preencha o termo e o significado");
      return;
    }
    setBusy(true);
    const response = await PostAPI(
      "/corporate/glossary",
      {
        term: term.trim(),
        meaning: meaning.trim(),
        departmentId: departmentId || undefined,
      },
      true,
    );
    setBusy(false);
    if (response.status === 200 || response.status === 201) {
      toast.success("Termo adicionado");
      setTerm("");
      setMeaning("");
      load();
    } else {
      toast.error(
        translateError(response.body?.message, "Não foi possível adicionar (termo repetido?)"),
      );
    }
  }

  async function handleDelete(entry: GlossaryEntry) {
    const ok = await confirm({
      title: `Remover o termo "${entry.term}"?`,
      confirmLabel: "Remover",
      tone: "danger",
    });
    if (!ok) return;
    setBusy(true);
    const response = await DeleteAPI(`/corporate/glossary/${entry.id}`, true);
    setBusy(false);
    if (response.status === 200) {
      toast.success("Termo removido");
      load();
    } else {
      toast.error(translateError(response.body?.message, "Não foi possível remover"));
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
        <BookOpenText size={14} /> Glossário ({entries.length})
      </h2>
      <p className="-mt-1 text-xs text-gray-400">
        Siglas e nomes do negócio (CTE, MDFE, nomes de sistemas...). A IA usa a
        grafia e o significado corretos nas transcrições e resumos. Termos de
        departamento somam-se aos da empresa.
      </p>

      <div className="flex flex-col gap-2 rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Termo (ex.: CTE)"
          className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400 md:w-40"
        />
        <input
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Significado (ex.: Conhecimento de Transporte Eletrônico)"
          className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-400"
        />
        <div className="relative">
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white pr-8 pl-3 text-sm text-gray-800 outline-none md:w-44"
          >
            <option value="">Empresa toda</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                Depto: {d.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={busy}
          className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          <Plus size={15} /> Adicionar
        </button>
      </div>

      {entries.length > 8 && (
        <div className="relative w-full md:max-w-xs">
          <Search
            size={14}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar termos..."
            className="h-9 w-full rounded-full border border-gray-200 bg-white pr-3 pl-9 text-sm text-gray-800 outline-none focus:border-gray-400"
          />
        </div>
      )}

      {loading ? (
        <div className="h-[60px] animate-pulse rounded-2xl border border-gray-200/60 bg-white/60" />
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-400">
          Nenhum termo ainda — comece pelas siglas que mais aparecem nas
          reuniões.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">Nenhum termo com esse filtro.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="group flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm"
              title={entry.meaning}
            >
              <span className="font-semibold text-gray-900">{entry.term}</span>
              <span className="max-w-[280px] truncate text-gray-500">
                {entry.meaning}
              </span>
              {entry.departmentId && (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-indigo-700">
                  {departmentName(entry.departmentId)}
                </span>
              )}
              <button
                onClick={() => handleDelete(entry)}
                disabled={busy}
                className="hidden text-gray-300 transition hover:text-red-500 group-hover:block"
                aria-label={`Remover ${entry.term}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
