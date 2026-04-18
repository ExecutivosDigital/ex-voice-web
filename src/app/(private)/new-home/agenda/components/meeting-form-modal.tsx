"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Monitor, Video, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Meeting, MeetingType, useAgendaStore } from "../use-agenda-store";

interface MeetingFormModalProps {
  open: boolean;
  onClose: () => void;
  editing?: Meeting | null;
  defaultDate?: string;
}

const TYPES: { value: MeetingType; label: string; icon: typeof Video; accent: string }[] = [
  { value: "meet", label: "Google Meet", icon: Video, accent: "from-emerald-500 to-emerald-600" },
  { value: "zoom", label: "Zoom", icon: Video, accent: "from-sky-500 to-sky-600" },
  { value: "teams", label: "Teams", icon: Monitor, accent: "from-indigo-500 to-indigo-600" },
  { value: "presencial", label: "Presencial", icon: MapPin, accent: "from-gray-700 to-gray-900" },
];

function emptyForm(defaultDate?: string): Omit<Meeting, "id" | "source"> {
  const today = defaultDate ?? new Date().toISOString().slice(0, 10);
  return {
    title: "",
    client: "",
    date: today,
    startTime: "09:00",
    endTime: "10:00",
    type: "meet",
    notes: "",
    location: "",
  };
}

export function MeetingFormModal({
  open,
  onClose,
  editing,
  defaultDate,
}: MeetingFormModalProps) {
  const addMeeting = useAgendaStore((s) => s.addMeeting);
  const updateMeeting = useAgendaStore((s) => s.updateMeeting);
  const googleConnected = useAgendaStore((s) => s.googleConnected);

  const [form, setForm] = useState(emptyForm(defaultDate));

  useEffect(() => {
    if (open) {
      setForm(editing ? { ...editing } : emptyForm(defaultDate));
    }
  }, [open, editing, defaultDate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const canSubmit = form.title.trim() && form.client.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (editing) {
      updateMeeting(editing.id, form);
    } else {
      addMeeting(form);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)]"
          >
            <div className="flex items-start justify-between border-b border-gray-100 px-6 pt-6 pb-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.3em] text-gray-400 uppercase">
                  {editing ? "Editar reunião" : "Nova reunião"}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">
                  {editing ? "Atualize os detalhes" : "Adicione um compromisso"}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-5 px-6 py-5">
              <Field label="Título">
                <input
                  autoFocus
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Sessão de acompanhamento"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                />
              </Field>

              <Field label="Cliente / Participante">
                <input
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="Nome do cliente"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                />
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Data">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                  />
                </Field>
                <Field label="Início">
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                  />
                </Field>
                <Field label="Fim">
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                  />
                </Field>
              </div>

              <Field label="Formato">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {TYPES.map((t) => {
                    const Icon = t.icon;
                    const active = form.type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setForm({ ...form, type: t.value })}
                        className={cn(
                          "group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl border px-2 py-3 text-[11px] font-semibold transition",
                          active
                            ? "border-gray-900 bg-gray-900 text-white shadow-[0_4px_14px_-4px_rgba(17,24,39,0.45)]"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900",
                        )}
                      >
                        <Icon size={15} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {form.type === "presencial" ? (
                <Field label="Endereço / Sala">
                  <input
                    value={form.location ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Ex: Consultório - Sala 2"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                  />
                </Field>
              ) : null}

              <Field label="Observações (opcional)">
                <textarea
                  value={form.notes ?? ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Pauta, lembretes, links úteis..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                />
              </Field>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
              <p className="text-[11px] text-gray-500">
                {googleConnected
                  ? "Será sincronizado com o seu Google Agenda."
                  : "Conecte o Google Agenda para sincronizar automaticamente."}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition",
                    canSubmit
                      ? "hover:bg-gray-700"
                      : "cursor-not-allowed opacity-50",
                  )}
                >
                  {editing ? "Salvar alterações" : "Adicionar reunião"}
                </button>
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-500 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
