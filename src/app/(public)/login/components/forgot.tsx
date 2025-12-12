import { useApiContext } from "@/context/ApiContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, LockIcon, LockKeyhole, Mail } from "lucide-react";

import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import Field from "./field";
import { Form, FormField, FormItem, FormMessage } from "./form";

type ForgotPasswordProps = {
  onClick: () => void;
};

const EmailFormSchema = z.object({
  email: z.email({ message: "Email Inválido" }),
});

const CodeFormSchema = z.object({
  code: z.string().min(6, "Código deve ter pelo menos 6 caracteres"),
});

const PasswordFormSchema = z.object({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const FormSchema = z.object({
  ...EmailFormSchema.shape,
  ...CodeFormSchema.shape,
  ...PasswordFormSchema.shape,
});

const ForgotPassword = ({ onClick }: ForgotPasswordProps) => {
  const { GetAPI, PostAPI, PutAPI } = useApiContext();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      code: "",
      password: "",
    },
  });

  const useFormSteps = (form: UseFormReturn<z.infer<typeof FormSchema>>) => {
    const [activeStep, setActiveStep] = useState(0);

    const stepFields = {
      0: ["email"] as const,
      1: ["code"] as const,
      2: ["password"] as const,
    };

    const validateStep = async (step: number) => {
      const fields = stepFields[step as keyof typeof stepFields];
      if (!fields) return true;
      return await form.trigger(fields);
    };

    return { activeStep, validateStep, setActiveStep };
  };

  const { validateStep } = useFormSteps(form);

  const handleNext = (form: UseFormReturn<z.infer<typeof FormSchema>>) => {
    if (currentStep === 0) {
      return HandleSendCode(form);
    } else if (currentStep === 1) {
      return HandleValidateCode(form);
    } else if (currentStep === 2) {
      return HandleNewPassword(form);
    }
  };

  async function HandleSendCode(
    form: UseFormReturn<z.infer<typeof FormSchema>>,
  ) {
    const isValid = await validateStep(0);
    if (!isValid) {
      const errors = form.formState.errors;

      // Define field labels with proper typing
      const fieldLabels: Record<keyof z.infer<typeof EmailFormSchema>, string> =
        {
          email: "Email",
        };

      // Get first error with type safety
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
      const send = await PostAPI(
        "/password-code",
        {
          ...form.getValues(),
          type: "CLIENT",
        },
        true,
      );
      if (send.status === 200) {
        setCurrentStep(1);
        toast.success("Enviamos um código para o seu email.");
        return setIsLoading(false);
      }
      toast.error("Ocorreu um erro ao enviar o código.");
      return setIsLoading(false);
    }
  }

  async function HandleValidateCode(
    form: UseFormReturn<z.infer<typeof FormSchema>>,
  ) {
    const isValid = await validateStep(1);
    if (!isValid) {
      const errors = form.formState.errors;

      // Define field labels with proper typing
      const fieldLabels: Record<keyof z.infer<typeof CodeFormSchema>, string> =
        {
          code: "Código",
        };

      // Get first error with type safety
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
      const send = await GetAPI(
        `/password-code/${form.getValues().code}`,
        true,
      );
      if (send.status === 200) {
        setCurrentStep(2);
        toast.success("Código validado com sucesso.");
        return setIsLoading(false);
      }
      toast.error("Ocorreu um erro ao validar o código.");
      return setIsLoading(false);
    }
  }

  async function HandleNewPassword(
    form: UseFormReturn<z.infer<typeof FormSchema>>,
  ) {
    const isValid = await validateStep(2);
    if (!isValid) {
      const errors = form.formState.errors;

      // Define field labels with proper typing
      const fieldLabels: Record<
        keyof z.infer<typeof PasswordFormSchema>,
        string
      > = {
        password: "Senha",
      };

      // Get first error with type safety
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
      const send = await PutAPI(
        "/client/edit-password",
        {
          password: form.getValues().password,
          code: form.getValues().code,
        },
        true,
      );
      if (send.status === 200) {
        toast.success("Senha alterada com sucesso.");
        onClick();
        return setIsLoading(false);
      }
      toast.error("Ocorreu um erro ao alterar a senha.");
      return setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext(form);
    }
  };

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => onClick()}
          className="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-800"
        >
          <ArrowLeft size={16} />
          Voltar para o login
        </button>
      </div>

      <Form {...form}>
        <div className="flex flex-col gap-4" onKeyDown={handleKeyPress}>
          {currentStep === 0 ? (
            <FormField
              key="email"
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field
                    placeholder="nome@exemplo.com"
                    Svg={<Mail size={20} />}
                    value={field.value}
                    onChange={field.onChange}
                    required
                    invalid={!!fieldState.error}
                  />
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          ) : currentStep === 1 ? (
            <FormField
              key="code"
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field
                    placeholder="Código"
                    Svg={<LockKeyhole size={20} />}
                    value={field.value}
                    onChange={field.onChange}
                    required
                    invalid={!!fieldState.error}
                  />
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          ) : currentStep === 2 ? (
            <FormField
              key="password"
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field
                    placeholder="Nova senha"
                    Svg={<LockIcon size={20} />}
                    type="password"
                    value={field.value}
                    onChange={field.onChange}
                    required
                    invalid={!!fieldState.error}
                  />
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          ) : (
            <></>
          )}
        </div>
        <div className="mt-6 flex w-full items-center justify-center gap-4">
          <button
            onClick={() => handleNext(form)}
            className="bg-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
              </>
            ) : currentStep === 0 ? (
              "Enviar código"
            ) : currentStep === 1 ? (
              "Verificar"
            ) : (
              "Alterar senha"
            )}
          </button>
        </div>
      </Form>
    </>
  );
};

export default ForgotPassword;
