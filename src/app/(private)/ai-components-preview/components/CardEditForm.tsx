"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AIComponent, FieldConfig } from "../types/component-types";

const inputClass =
  "w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-none";
const labelClass = "mb-1 block text-xs font-medium text-gray-500";

// ——— Campos label + valor (ex: diagnóstico, biometria) ———
function FieldsEditor({
  fields,
  onChange,
}: {
  fields: Array<{ label: string; value: string }>;
  onChange: (fields: Array<{ label: string; value: string }>) => void;
}) {
  const update = (i: number, key: "label" | "value", value: string) => {
    const next = [...fields];
    if (!next[i]) next[i] = { label: "", value: "" };
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  };
  const add = () => onChange([...fields, { label: "", value: "" }]);
  const remove = (i: number) => onChange(fields.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={labelClass}>Campos</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {fields.map((f, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-100 bg-white p-2"
        >
          <input
            type="text"
            value={f.label}
            onChange={(e) => update(i, "label", e.target.value)}
            placeholder="Label"
            className={`${inputClass} max-w-[180px]`}
          />
          <input
            type="text"
            value={f.value}
            onChange={(e) => update(i, "value", e.target.value)}
            placeholder="Valor"
            className={`${inputClass} min-w-0 flex-1`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            title="Remover"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ——— Lista de textos (orientações, fatores de risco) ———
function ListOfStringsEditor({
  items,
  onChange,
  label = "Itens",
  placeholder = "Novo item",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  label?: string;
  placeholder?: string;
}) {
  const update = (i: number, value: string) => {
    const next = [...items];
    next[i] = value;
    onChange(next);
  };
  const add = () => onChange([...items, ""]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={labelClass}>{label}</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            title="Remover"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ——— Bloco de texto (justificativa, observações, conteúdo único) ———
function ContentEditor({
  value,
  onChange,
  label = "Conteúdo",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`${inputClass} resize-y`}
      />
    </div>
  );
}

// ——— Seções com título + conteúdo (notas clínicas) ———
function SectionsEditor({
  sections,
  onChange,
}: {
  sections: Array<{ title?: string; content: string }>;
  onChange: (sections: Array<{ title?: string; content: string }>) => void;
}) {
  const update = (i: number, key: "title" | "content", value: string) => {
    const next = [...sections];
    if (!next[i]) next[i] = { content: "" };
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  };
  const add = () => onChange([...sections, { content: "" }]);
  const remove = (i: number) =>
    onChange(sections.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className={labelClass}>Seções / Notas</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {sections.map((sec, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-gray-200 bg-white p-3"
        >
          <input
            type="text"
            value={sec.title ?? ""}
            onChange={(e) => update(i, "title", e.target.value)}
            placeholder="Título (opcional)"
            className={inputClass}
          />
          <textarea
            value={sec.content}
            onChange={(e) => update(i, "content", e.target.value)}
            placeholder="Conteúdo"
            rows={3}
            className={`${inputClass} resize-y`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" /> Remover seção
          </button>
        </div>
      ))}
    </div>
  );
}

// ——— Itens com texto principal + metadados (sintomas, alergias, medicamentos) ———
function ItemsEditor({
  items,
  onChange,
}: {
  items: Array<{
    primary: string;
    secondary?: string;
    metadata?: Array<{ label: string; value: string }>;
  }>;
  onChange: (
    items: Array<{
      primary: string;
      secondary?: string;
      metadata?: Array<{ label: string; value: string }>;
    }>,
  ) => void;
}) {
  const updatePrimary = (i: number, value: string) => {
    const next = [...items];
    if (!next[i]) next[i] = { primary: "" };
    next[i] = { ...next[i], primary: value };
    onChange(next);
  };
  const updateSecondary = (i: number, value: string) => {
    const next = [...items];
    if (!next[i]) next[i] = { primary: "" };
    next[i] = { ...next[i], secondary: value };
    onChange(next);
  };
  const add = () => onChange([...items, { primary: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={labelClass}>Itens</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={item.primary}
              onChange={(e) => updatePrimary(i, e.target.value)}
              placeholder="Nome / Descrição principal"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <input
            type="text"
            value={item.secondary ?? ""}
            onChange={(e) => updateSecondary(i, e.target.value)}
            placeholder="Detalhe opcional"
            className={inputClass}
          />
        </div>
      ))}
    </div>
  );
}

// ——— Histórico familiar: relação, condição, idade ———
function FamilyHistoryEditor({
  items,
  onChange,
}: {
  items: Array<{ relation: string; condition: string; age: string }>;
  onChange: (
    items: Array<{ relation: string; condition: string; age: string }>,
  ) => void;
}) {
  const update = (
    i: number,
    key: "relation" | "condition" | "age",
    value: string,
  ) => {
    const next = [...items];
    if (!next[i]) next[i] = { relation: "", condition: "", age: "" };
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  };
  const add = () =>
    onChange([...items, { relation: "", condition: "", age: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={labelClass}>Histórico familiar</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-100 bg-white p-2"
        >
          <input
            type="text"
            value={item.relation}
            onChange={(e) => update(i, "relation", e.target.value)}
            placeholder="Parentesco"
            className={`${inputClass} max-w-[120px]`}
          />
          <input
            type="text"
            value={item.condition}
            onChange={(e) => update(i, "condition", e.target.value)}
            placeholder="Condição"
            className={`${inputClass} min-w-0 flex-1`}
          />
          <input
            type="text"
            value={item.age}
            onChange={(e) => update(i, "age", e.target.value)}
            placeholder="Idade"
            className={`${inputClass} max-w-[80px]`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ——— Condições crônicas: nome, desde, status ———
function ChronicConditionsEditor({
  items,
  onChange,
}: {
  items: Array<{ name: string; since: string; status: string }>;
  onChange: (
    items: Array<{ name: string; since: string; status: string }>,
  ) => void;
}) {
  const update = (
    i: number,
    key: "name" | "since" | "status",
    value: string,
  ) => {
    const next = [...items];
    if (!next[i]) next[i] = { name: "", since: "", status: "" };
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  };
  const add = () => onChange([...items, { name: "", since: "", status: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={labelClass}>Condições crônicas</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-100 bg-white p-2"
        >
          <input
            type="text"
            value={item.name}
            onChange={(e) => update(i, "name", e.target.value)}
            placeholder="Condição"
            className={`${inputClass} min-w-0 flex-1`}
          />
          <input
            type="text"
            value={item.since}
            onChange={(e) => update(i, "since", e.target.value)}
            placeholder="Desde"
            className={`${inputClass} max-w-[100px]`}
          />
          <input
            type="text"
            value={item.status}
            onChange={(e) => update(i, "status", e.target.value)}
            placeholder="Status"
            className={`${inputClass} max-w-[120px]`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ——— Timeline / histórico: data, tipo, médico, especialidade, nota ———
function HistoryTimelineEditor({
  items,
  onChange,
}: {
  items: Array<{
    date: string;
    type: string;
    doctor: string;
    specialty: string;
    note: string;
  }>;
  onChange: (
    items: Array<{
      date: string;
      type: string;
      doctor: string;
      specialty: string;
      note: string;
    }>,
  ) => void;
}) {
  const keys = ["date", "type", "doctor", "specialty", "note"] as const;
  const labels: Record<(typeof keys)[number], string> = {
    date: "Data",
    type: "Tipo",
    doctor: "Usuário",
    specialty: "Especialidade",
    note: "Observação",
  };
  const update = (i: number, key: (typeof keys)[number], value: string) => {
    const next = [...items];
    if (!next[i])
      next[i] = { date: "", type: "", doctor: "", specialty: "", note: "" };
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  };
  const add = () =>
    onChange([
      ...items,
      { date: "", type: "", doctor: "", specialty: "", note: "" },
    ]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={labelClass}>Eventos / Histórico</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-gray-200 bg-white p-3"
        >
          {keys.map((key) => (
            <div key={key}>
              <label className={labelClass}>{labels[key]}</label>
              <input
                type="text"
                value={(item as Record<string, string>)[key] ?? ""}
                onChange={(e) => update(i, key, e.target.value)}
                placeholder={labels[key]}
                className={inputClass}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" /> Remover
          </button>
        </div>
      ))}
    </div>
  );
}

// ——— Certificados: data, tipo, descrição, período ———
function CertificatesEditor({
  items,
  onChange,
}: {
  items: Array<{
    date: string;
    type: string;
    description: string;
    period: string;
  }>;
  onChange: (
    items: Array<{
      date: string;
      type: string;
      description: string;
      period: string;
    }>,
  ) => void;
}) {
  const update = (
    i: number,
    key: "date" | "type" | "description" | "period",
    value: string,
  ) => {
    const next = [...items];
    if (!next[i]) next[i] = { date: "", type: "", description: "", period: "" };
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  };
  const add = () =>
    onChange([...items, { date: "", type: "", description: "", period: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const labels = {
    date: "Data",
    type: "Tipo",
    description: "Descrição",
    period: "Período",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={labelClass}>Certificados</span>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-gray-200 bg-white p-3"
        >
          {(["date", "type", "description", "period"] as const).map((key) => (
            <div key={key}>
              <label className={labelClass}>{labels[key]}</label>
              <input
                type="text"
                value={item[key] ?? ""}
                onChange={(e) => update(i, key, e.target.value)}
                placeholder={labels[key]}
                className={inputClass}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" /> Remover
          </button>
        </div>
      ))}
    </div>
  );
}

// Normaliza e detecta formato dos dados para edição
function normalizeDataForEdit(component: AIComponent): Record<string, unknown> {
  const d = (component.data ?? {}) as Record<string, unknown>;

  // Orientations: array de strings
  if (component.type === "orientations_card") {
    const list = Array.isArray(d.orientations)
      ? (d.orientations as string[])
      : [];
    return { orientations: list.length ? list : [""] };
  }

  // Risk factors: array de strings
  if (component.type === "risk_factors_card") {
    const list = Array.isArray(d.riskFactors)
      ? (d.riskFactors as string[])
      : [];
    return { riskFactors: list.length ? list : [""] };
  }

  // Observations: texto único
  if (component.type === "observations_card") {
    return {
      observations: typeof d.observations === "string" ? d.observations : "",
    };
  }

  // Clinical notes: content ou sections
  if (component.type === "clinical_notes_card") {
    const sections = Array.isArray(d.sections)
      ? (d.sections as Array<{ title?: string; content: string }>)
      : [];
    const content =
      typeof d.content === "string"
        ? d.content
        : typeof (d as any).notes === "string"
          ? (d as any).notes
          : "";
    if (sections.length > 0) return { sections };
    return { content: content || "" };
  }

  // Main diagnosis: fields + content/justification
  if (component.type === "main_diagnosis_card") {
    const fields = Array.isArray(d.fields)
      ? (d.fields as FieldConfig[]).map((f) => ({
          label: f.label,
          value: f.value,
        }))
      : [];
    const legacy = [
      (d.mainCondition as string) && {
        label: "Condição Principal",
        value: d.mainCondition as string,
      },
      (d.cid as string) && { label: "CID", value: d.cid as string },
      (d.confidence as string) && {
        label: "Confiança",
        value: d.confidence as string,
      },
      (d.severity as string) && {
        label: "Severidade",
        value: d.severity as string,
      },
      (d.evolution as string) && {
        label: "Evolução",
        value: d.evolution as string,
      },
    ].filter(Boolean) as Array<{ label: string; value: string }>;
    const displayFields = fields.length ? fields : legacy;
    const content = (d.content as string) || (d.justification as string) || "";
    return {
      fields: displayFields.length ? displayFields : [{ label: "", value: "" }],
      content,
    };
  }

  // Biometrics / Social: fields
  if (
    component.type === "biometrics_card" ||
    component.type === "social_history_card"
  ) {
    const fields = Array.isArray(d.fields)
      ? (d.fields as FieldConfig[]).map((f) => ({
          label: f.label,
          value: f.value,
        }))
      : [];
    const personal =
      (d.personal as Record<string, string>) ||
      (d.socialHistory as Record<string, string>);
    const fromPersonal = personal
      ? Object.entries(personal)
          .filter(([, v]) => v)
          .map(([k, v]) => ({ label: k, value: v }))
      : [];
    const display = fields.length ? fields : fromPersonal;
    return { fields: display.length ? display : [{ label: "", value: "" }] };
  }

  // Family history
  if (component.type === "family_history_card") {
    const list = Array.isArray(d.familyHistory)
      ? (d.familyHistory as Array<{
          relation: string;
          condition: string;
          age: string;
        }>)
      : [];
    return {
      familyHistory: list.length
        ? list
        : [{ relation: "", condition: "", age: "" }],
    };
  }

  // Chronic conditions
  if (component.type === "chronic_conditions_card") {
    const list = Array.isArray(d.chronicConditions)
      ? (d.chronicConditions as Array<{
          name: string;
          since: string;
          status: string;
        }>)
      : [];
    return {
      chronicConditions: list.length
        ? list
        : [{ name: "", since: "", status: "" }],
    };
  }

  // Medical history timeline
  if (component.type === "medical_history_timeline_card") {
    const list = Array.isArray(d.history)
      ? (d.history as Array<{
          date: string;
          type: string;
          doctor: string;
          specialty: string;
          note: string;
        }>)
      : [];
    return {
      history: list.length
        ? list
        : [{ date: "", type: "", doctor: "", specialty: "", note: "" }],
    };
  }

  // Certificates
  if (component.type === "certificates_card") {
    const list = Array.isArray(d.certificates)
      ? (d.certificates as Array<{
          date: string;
          type: string;
          description: string;
          period: string;
        }>)
      : [];
    return {
      certificates: list.length
        ? list
        : [{ date: "", type: "", description: "", period: "" }],
    };
  }

  // Items genéricos (sintomas, alergias, medicamentos, exames, etc.)
  const itemsKey = "items";
  if (Array.isArray(d[itemsKey])) {
    const items = (
      d[itemsKey] as Array<{
        primary?: string;
        secondary?: string;
        metadata?: Array<{ label: string; value: string }>;
      }>
    ).map((it) => ({
      primary: (it as any).primary ?? (it as any).name ?? "",
      secondary: (it as any).secondary,
      metadata: (it as any).metadata,
    }));
    return { items: items.length ? items : [{ primary: "" }] };
  }

  // Legado: symptoms, allergies, medications, etc.
  const legacyArrays: Record<string, string> = {
    symptoms_card: "symptoms",
    allergies_card: "allergies",
    medications_card: "medications",
    differential_diagnosis_card: "differentials",
    suggested_exams_card: "suggestedExams",
  };
  const key = legacyArrays[component.type];
  if (key && Array.isArray(d[key])) {
    const arr = d[key] as Array<Record<string, string>>;
    const items = arr.map((it) => ({
      primary: it.name ?? it.primary ?? "",
      secondary: it.frequency ?? it.reaction ?? it.probability ?? "",
    }));
    return { items: items.length ? items : [{ primary: "" }] };
  }

  // Fallback: campos soltos (content, observations, etc.)
  if (typeof d.content === "string") return { content: d.content };
  if (typeof d.observations === "string")
    return { observations: d.observations };
  return { fields: [{ label: "Campo", value: "" }] };
}

export interface CardEditFormProps {
  component: AIComponent;
  onSave: (updated: AIComponent) => void;
  onCancel: () => void;
  onCopy?: () => void;
}

export function CardEditForm({
  component,
  onSave,
  onCancel,
  onCopy,
}: CardEditFormProps) {
  const [title, setTitle] = useState(component.title);
  const [editData, setEditData] = useState<Record<string, unknown>>(() =>
    normalizeDataForEdit(component),
  );

  const buildData = (): Record<string, unknown> => {
    return { ...editData };
  };

  const handleSave = () => {
    onSave({
      ...component,
      title: title.trim() || component.title,
      data: buildData() as AIComponent["data"],
    });
  };

  const d = editData;
  const type = component.type;

  return (
    <div className="flex w-full max-w-full min-w-0 flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className={labelClass}>Título do card</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Orientations */}
      {type === "orientations_card" && Array.isArray(d.orientations) && (
        <ListOfStringsEditor
          items={d.orientations as string[]}
          onChange={(v) => setEditData({ ...d, orientations: v })}
          label="Orientações"
          placeholder="Nova orientação"
        />
      )}

      {/* Risk factors */}
      {type === "risk_factors_card" && Array.isArray(d.riskFactors) && (
        <ListOfStringsEditor
          items={d.riskFactors as string[]}
          onChange={(v) => setEditData({ ...d, riskFactors: v })}
          label="Fatores de risco"
          placeholder="Fator de risco"
        />
      )}

      {/* Observations */}
      {type === "observations_card" && (
        <ContentEditor
          value={(d.observations as string) ?? ""}
          onChange={(v) => setEditData({ ...d, observations: v })}
          label="Observações"
        />
      )}

      {/* Clinical notes: sections ou content */}
      {type === "clinical_notes_card" && (
        <>
          {Array.isArray(d.sections) ? (
            <SectionsEditor
              sections={
                d.sections as Array<{ title?: string; content: string }>
              }
              onChange={(v) => setEditData({ ...d, sections: v })}
            />
          ) : (
            <ContentEditor
              value={(d.content as string) ?? ""}
              onChange={(v) => setEditData({ ...d, content: v })}
              label="Notas"
            />
          )}
        </>
      )}

      {/* Main diagnosis: fields + justificativa */}
      {type === "main_diagnosis_card" && (
        <>
          <FieldsEditor
            fields={(d.fields as Array<{ label: string; value: string }>) ?? []}
            onChange={(v) => setEditData({ ...d, fields: v })}
          />
          <ContentEditor
            value={(d.content as string) ?? ""}
            onChange={(v) => setEditData({ ...d, content: v })}
            label="Justificativa"
          />
        </>
      )}

      {/* Biometrics / Social: só fields */}
      {(type === "biometrics_card" || type === "social_history_card") && (
        <FieldsEditor
          fields={(d.fields as Array<{ label: string; value: string }>) ?? []}
          onChange={(v) => setEditData({ ...d, fields: v })}
        />
      )}

      {/* Family history */}
      {type === "family_history_card" && Array.isArray(d.familyHistory) && (
        <FamilyHistoryEditor
          items={
            d.familyHistory as Array<{
              relation: string;
              condition: string;
              age: string;
            }>
          }
          onChange={(v) => setEditData({ ...d, familyHistory: v })}
        />
      )}

      {/* Chronic conditions */}
      {type === "chronic_conditions_card" &&
        Array.isArray(d.chronicConditions) && (
          <ChronicConditionsEditor
            items={
              d.chronicConditions as Array<{
                name: string;
                since: string;
                status: string;
              }>
            }
            onChange={(v) => setEditData({ ...d, chronicConditions: v })}
          />
        )}

      {/* Medical history timeline */}
      {type === "medical_history_timeline_card" && Array.isArray(d.history) && (
        <HistoryTimelineEditor
          items={
            d.history as Array<{
              date: string;
              type: string;
              doctor: string;
              specialty: string;
              note: string;
            }>
          }
          onChange={(v) => setEditData({ ...d, history: v })}
        />
      )}

      {/* Certificates */}
      {type === "certificates_card" && Array.isArray(d.certificates) && (
        <CertificatesEditor
          items={
            d.certificates as Array<{
              date: string;
              type: string;
              description: string;
              period: string;
            }>
          }
          onChange={(v) => setEditData({ ...d, certificates: v })}
        />
      )}

      {/* Items genéricos (symptoms, allergies, medications, exams, referrals, etc.) */}
      {Array.isArray(d.items) &&
        ![
          "orientations_card",
          "risk_factors_card",
          "observations_card",
          "clinical_notes_card",
          "main_diagnosis_card",
          "biometrics_card",
          "social_history_card",
          "family_history_card",
          "chronic_conditions_card",
          "medical_history_timeline_card",
          "certificates_card",
        ].includes(type) && (
          <ItemsEditor
            items={
              d.items as Array<{
                primary: string;
                secondary?: string;
                metadata?: Array<{ label: string; value: string }>;
              }>
            }
            onChange={(v) => setEditData({ ...d, items: v })}
          />
        )}

      {/* Fallback: fields genéricos (quando não há editor específico nem items) */}
      {![
        "orientations_card",
        "risk_factors_card",
        "observations_card",
        "clinical_notes_card",
        "main_diagnosis_card",
        "biometrics_card",
        "social_history_card",
        "family_history_card",
        "chronic_conditions_card",
        "medical_history_timeline_card",
        "certificates_card",
      ].includes(type) &&
        !Array.isArray(d.items) &&
        (Array.isArray(d.fields) || !d.fields) && (
          <FieldsEditor
            fields={(
              (d.fields as Array<{ label: string; value: string }>) ?? [
                { label: "Conteúdo", value: "" },
              ]
            ).filter(Boolean)}
            onChange={(v) => setEditData({ ...d, fields: v })}
          />
        )}

      <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-3">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
        >
          Cancelar
        </button>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100"
          >
            Copiar
          </button>
        )}
      </div>
    </div>
  );
}
