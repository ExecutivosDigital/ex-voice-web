import { ClientProps } from "@/@types/general-client";
import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { handleApiError } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Save,
  Trash2,
  UserCog,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./blocks/form";
import { Input } from "./blocks/input";
import { Textarea } from "./blocks/textarea";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProps | null;
  className?: string;
}

const FormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof FormSchema>;

function showSuccessToast(title: string, description: string) {
  toast.custom(
    (t) => (
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 shadow-[0_10px_40px_-10px_rgba(17,24,39,0.25)]",
          t.visible ? "animate-in fade-in" : "animate-out fade-out",
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_4px_14px_-4px_rgba(16,185,129,0.55)]">
          <CheckCircle2 size={20} strokeWidth={2.4} className="text-white" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="truncate text-xs text-gray-500">{description}</p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Fechar notificação"
        >
          <X size={14} />
        </button>
      </div>
    ),
    { duration: 3500, position: "top-right" },
  );
}

export function EditClientModal({
  isOpen,
  onClose,
  client,
  className,
}: EditClientModalProps) {
  const { PutAPI, DeleteAPI } = useApiContext();
  const { setClients, selectedClient, setSelectedClient } =
    useGeneralContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && client) {
      form.reset({
        name: client.name ?? "",
        description: client.description ?? "",
      });
      setConfirmDelete(false);
    }
  }, [isOpen, client, form]);

  if (!client) return null;

  const handleSave = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      const firstError = Object.values(form.formState.errors)[0];
      return toast.error(
        firstError?.message?.toString() || "Corrija os erros no formulário.",
      );
    }

    setIsSaving(true);
    const values = form.getValues();
    const response = await PutAPI(`/client/${client.id}`, values, true);

    if (response.status === 200) {
      const updated: ClientProps = {
        ...client,
        name: values.name,
        description: values.description ?? null,
      };
      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, ...updated } : c)),
      );
      if (selectedClient?.id === client.id) {
        setSelectedClient({ ...selectedClient, ...updated });
      }
      showSuccessToast("Contato atualizado!", values.name);
      setIsSaving(false);
      return onClose();
    }

    const errorMessage = handleApiError(
      response,
      "Falha ao atualizar o contato. Tente novamente.",
    );
    toast.error(errorMessage);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    const response = await DeleteAPI(`/client/${client.id}`, true);

    if (response.status === 200) {
      setClients((prev) => prev.filter((c) => c.id !== client.id));
      if (selectedClient?.id === client.id) {
        setSelectedClient(null);
      }
      showSuccessToast("Contato removido!", client.name);
      setIsDeleting(false);
      setConfirmDelete(false);
      return onClose();
    }

    const errorMessage = handleApiError(
      response,
      "Falha ao remover o contato. Tente novamente.",
    );
    toast.error(errorMessage);
    setIsDeleting(false);
    setConfirmDelete(false);
  };

  const isBusy = isSaving || isDeleting;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isBusy) {
              onClose();
            }
          }}
          className={cn(
            "fixed inset-0 z-[9999999] flex items-center justify-center overflow-y-auto overscroll-contain bg-gray-900/40 p-4 backdrop-blur-sm",
            className,
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-[0_20px_60px_-12px_rgba(17,24,39,0.35)]"
          >
            <div className="flex shrink-0 items-start justify-between px-6 pt-6 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-500 to-neutral-900 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.55)]">
                  <UserCog
                    size={20}
                    strokeWidth={2.2}
                    className="text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Editar Contato
                  </h2>
                  <p className="text-xs text-gray-500">
                    Atualize as informações ou remova este contato
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-px shrink-0 bg-gray-100" />

            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-7">
              <Form {...form}>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
                          Nome do Contato
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex. Maria Silva"
                            type="text"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className={cn(
                              "h-11 rounded-xl border-gray-200 bg-gray-50/80 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5",
                              {
                                "border-red-400 focus:border-red-500 focus:ring-red-500/10":
                                  form.formState.errors.name,
                              },
                            )}
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage className="px-0 py-0 text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
                          Descrição
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium tracking-normal text-gray-500 normal-case">
                            opcional
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Adicione anotações, cargo, empresa ou contexto do contato..."
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="min-h-28 resize-none rounded-xl border-gray-200 bg-gray-50/80 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                            autoComplete="off"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {confirmDelete && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                      <AlertTriangle size={16} strokeWidth={2.2} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-red-900">
                        Tem certeza que deseja apagar este contato?
                      </p>
                      <p className="text-xs text-red-700/80">
                        Essa ação não pode ser desfeita. Clique novamente em
                        &ldquo;Apagar contato&rdquo; para confirmar.
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-7 flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isBusy}
                    className={cn(
                      "flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100",
                      confirmDelete
                        ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                        : "border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100",
                    )}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={16} strokeWidth={2.2} />
                        <span>
                          {confirmDelete ? "Confirmar exclusão" : "Apagar contato"}
                        </span>
                      </>
                    )}
                  </button>

                  <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isBusy}
                      className="flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isBusy}
                      className="group relative flex h-11 min-w-[160px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(17,24,39,0.55)] transition-all hover:shadow-[0_6px_18px_-4px_rgba(17,24,39,0.7)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                    >
                      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.18)_50%,transparent_75%)] bg-[length:250%_100%] opacity-0 transition-opacity group-hover:animate-[shimmer_2.8s_ease-in-out_infinite] group-hover:opacity-100" />
                      {isSaving ? (
                        <Loader2 className="relative h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="relative h-4 w-4" strokeWidth={2.4} />
                          <span className="relative">Salvar alterações</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
