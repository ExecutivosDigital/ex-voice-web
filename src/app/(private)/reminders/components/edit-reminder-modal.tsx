"use client";

import { ReminderProps } from "@/@types/general-client";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { getCurrentPlatform } from "@/utils/platform";
import { handleApiError } from "@/utils/error-handler";
import { Check, X, Bell, Clock, Type, Calendar } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";

interface EditReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    reminder: ReminderProps;
}

export function EditReminderModal({
    isOpen,
    onClose,
    reminder,
}: EditReminderModalProps) {
    const { PutAPI } = useApiContext();
    const { GetReminders } = useGeneralContext();
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(reminder.time || "");
    const [date, setDate] = useState(moment.utc(reminder.date).format("YYYY-MM-DD"));
    const [name, setName] = useState(reminder.name || "");
    const [description, setDescription] = useState(reminder.description || "");

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            const response = await PutAPI(`/reminder/${reminder.id}`, {
                time,
                date: `${date}T12:00:00.000Z`,
                name,
                description,
                platform: getCurrentPlatform(),
            }, true);

            if (response.status === 200) {
                toast.success("Lembrete atualizado com sucesso!");
                GetReminders();
                onClose();
            } else {
                const errorMessage = handleApiError(
                    response,
                    "Erro ao atualizar lembrete. Tente novamente.",
                );
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocorreu um erro inesperado. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-3xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Editar Lembrete</h2>
                            <p className="text-sm text-gray-500 text-pretty">Ajuste o horário e o conteúdo</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="flex flex-col gap-5">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Type className="h-4 w-4 text-blue-500" />
                            Nome do Lembrete
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                            placeholder="Nome do lembrete..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                Data
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Clock className="h-4 w-4 text-blue-500" />
                                Horário
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Type className="h-4 w-4 text-blue-500" />
                            Descrição
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                            placeholder="Descreva o que deve ser lembrado..."
                            required
                        />
                    </div>

                    <div className="mt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-2xl border border-gray-200 py-3.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    <Check className="h-4 w-4" />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
