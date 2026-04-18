import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { handleApiError } from "@/utils/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Plus, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm, UseFormReturn } from "react-hook-form";
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

interface CreateClientSheetProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClientCreated?: (client: any) => void;
}

const FormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional().nullable(),
});

function showSuccessToast(name: string) {
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
          <p className="text-sm font-semibold text-gray-900">
            Contato adicionado!
          </p>
          <p className="truncate text-xs text-gray-500">
            <span className="font-medium text-gray-700">{name}</span> foi
            salvo na sua agenda.
          </p>
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

export function CreateClientSheet({
  isOpen,
  onClose,
  className,
  onClientCreated,
}: CreateClientSheetProps) {
  const { PostAPI } = useApiContext();
  const { GetClients, setClients } = useGeneralContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const useFormSteps = (form: UseFormReturn<z.infer<typeof FormSchema>>) => {
    const [activeStep, setActiveStep] = useState(0);

    const stepFields = {
      0: ["name", "description"] as const,
    };

    const validateStep = async (step: number) => {
      const fields = stepFields[step as keyof typeof stepFields];
      if (!fields) return true;
      return await form.trigger(fields);
    };

    return { activeStep, validateStep, setActiveStep };
  };

  const { validateStep } = useFormSteps(form);

  const handleNext = async (
    form: UseFormReturn<z.infer<typeof FormSchema>>,
  ) => {
    const isValid = await validateStep(0);
    if (!isValid) {
      const errors = form.formState.errors;

      const fieldLabels: Record<keyof z.infer<typeof FormSchema>, string> = {
        name: "Nome",
        description: "Descrição",
      };

      const firstErrorField = Object.keys(
        errors,
      )[0] as keyof typeof fieldLabels;
      const firstError = errors[firstErrorField];

      if (firstError?.message && firstErrorField in fieldLabels) {
        const fieldLabel = fieldLabels[firstErrorField];
        return toast.error(`${fieldLabel}: ${firstError.message}`);
      }

      return toast.error("Por favor, corrija os erros no formulário.");
    } else {
      setIsLoading(true);
      const formName = form.getValues().name;
      const data = await PostAPI("/client", form.getValues(), true);
      if (data.status === 200) {
        // Optimistic update
        // Check if response body has a client property or is the client itself
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawClient = (data.body.client || data.body) as any;
        console.log("DEBUG: Full data object:", JSON.stringify(data, null, 2));
        console.log(
          "DEBUG: Raw client from API:",
          JSON.stringify(rawClient, null, 2),
        );

        const newClient = {
          ...rawClient,
          id: rawClient.id || rawClient._id,
        };
        console.log("DEBUG: Normalized newClient:", newClient);

        setClients((prev) => [newClient, ...prev]);

        // Strategy: Force fetch clients to ensure we get the real ID from DB
        await GetClients();

        // Pass the form values effectively primarily for the name
        const finalClient = {
          ...newClient,
          name: formName, // Ensure accurate name from input
        };

        if (onClientCreated) {
          console.log("DEBUG: Calling onClientCreated with:", finalClient);
          onClientCreated(finalClient);
        }

        setIsLoading(false);
        form.reset();
        showSuccessToast(formName);
        return onClose();
      }
      const errorMessage = handleApiError(
        data,
        "Falha ao enviar o formulário. Tente novamente.",
      );
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
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
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between px-6 pt-6 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-500 to-neutral-900 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.55)]">
                  <UserPlus
                    size={20}
                    strokeWidth={2.2}
                    className="text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Adicionar Contato
                  </h2>
                  <p className="text-xs text-gray-500">
                    Cadastre um novo contato na sua agenda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-px shrink-0 bg-gray-100" />

            {/* Form body */}
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
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
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
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            className="min-h-28 resize-none rounded-xl border-gray-200 bg-gray-50/80 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                            autoComplete="off"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-7 flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNext(form)}
                    disabled={isLoading}
                    className="group relative flex h-11 min-w-[180px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-900 px-5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(17,24,39,0.55)] transition-all hover:shadow-[0_6px_18px_-4px_rgba(17,24,39,0.7)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.18)_50%,transparent_75%)] bg-[length:250%_100%] opacity-0 transition-opacity group-hover:animate-[shimmer_2.8s_ease-in-out_infinite] group-hover:opacity-100" />
                    {isLoading ? (
                      <Loader2 className="relative h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="relative h-4 w-4" strokeWidth={2.5} />
                        <span className="relative">Adicionar Contato</span>
                      </>
                    )}
                  </button>
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
