// context/auth.tsx
"use client";
import { Amplify } from "aws-amplify";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import config from "../utils/amplify.json";
import { useApiContext } from "./ApiContext";

export interface User {
  id: string;
  email: string;
  name: string;
  cpfCnpj?: string | null;
  address?: string | null;
  addressNumber?: string | null;
  postalCode?: string | null;
  mobilePhone?: string | null;
}

interface SessionContextValue {
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  availableRecording: number;
  totalRecording: number;
  isTrial: boolean;
  handleGetProfile: (forceRefresh?: boolean) => Promise<void>;
  handleGetAvailableRecording: () => Promise<void>;
  checkSession: (forceRefresh?: boolean) => Promise<boolean>;
  clearSession: () => Promise<void>;
  forceSignOut: () => Promise<void>;
  waitForTokens: () => Promise<boolean>;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx)
    throw new Error("useSession deve ser usado dentro de <SessionProvider>");
  return ctx;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const { GetAPI } = useApiContext();
  Amplify.configure(config);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [availableRecording, setAvailableRecording] = useState(0);
  const [totalRecording, setTotalRecording] = useState(0);
  const [isTrial, setIsTrial] = useState(false);

  const isLoadingProfile = useRef(false);
  const sessionCheckPromise = useRef<Promise<boolean> | null>(null);
  const sessionCacheRef = useRef<{
    value: boolean;
    timestamp: number;
  } | null>(null);

  const CACHE_TTL = 2000; // 2 segundos

  /**
   * Invalida o cache de sessão
   */
  const invalidateSessionCache = useCallback(() => {
    sessionCacheRef.current = null;
    sessionCheckPromise.current = null;
  }, []);

  /**
   * Aguarda até que os tokens estejam disponíveis (com retry)
   */
  const waitForTokens = useCallback(async (): Promise<boolean> => {
    const maxRetries = 10;
    const retryDelay = 300; // 300ms entre tentativas

    for (let i = 0; i < maxRetries; i++) {
      try {
        const { tokens } = await fetchAuthSession({ forceRefresh: false });

        if (tokens?.accessToken) {
          return true;
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } catch (error) {
        console.error(`⚠️ Erro na tentativa ${i + 1}:`, error);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    console.error("❌ Timeout: tokens não foram propagados");
    return false;
  }, []);

  const checkSession = useCallback(
    async (forceRefresh = false): Promise<boolean> => {
      const reqId = Math.floor(Math.random() * 1000);
      console.log(
        `[AUTH_DEBUG] #${reqId} - Iniciando checkSession. forceRefresh:`,
        forceRefresh,
      );

      if (forceRefresh) {
        invalidateSessionCache();
      }

      const now = Date.now();
      if (
        !forceRefresh &&
        sessionCacheRef.current &&
        now - sessionCacheRef.current.timestamp < CACHE_TTL
      ) {
        return sessionCacheRef.current.value;
      }

      if (sessionCheckPromise.current && !forceRefresh) {
        console.log(`[AUTH_DEBUG] #${reqId} - Retornando Promise existente.`);
        return sessionCheckPromise.current;
      }

      sessionCheckPromise.current = (async () => {
        try {
          console.log(
            `[AUTH_DEBUG] #${reqId} - Aguardando APIs com TIMEOUT de 10s...`,
          );

          // --- MUDANÇA PRINCIPAL AQUI ---
          // Criamos uma promessa que rejeita automaticamente após 10 segundos
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("TIMEOUT_EXCEEDED")), 2000),
          );

          const authCallsPromise = Promise.allSettled([
            fetchAuthSession({ forceRefresh }),
            getCurrentUser(),
          ]);

          // Promise.race vai pegar quem terminar primeiro: a resposta ou o erro de timeout
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result: any = await Promise.race([
            authCallsPromise,
            timeoutPromise,
          ]);
          // ------------------------------

          // Se chegou aqui, é porque não deu timeout. 'result' é o array do allSettled
          const [sessionResult, userResult] = result as [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            PromiseSettledResult<any>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            PromiseSettledResult<any>,
          ];

          console.log(`[AUTH_DEBUG] #${reqId} - APIs responderam a tempo!`);

          const hasTokens =
            sessionResult.status === "fulfilled" &&
            !!sessionResult.value.tokens?.accessToken;

          const hasUser = userResult.status === "fulfilled";
          const isValid = hasTokens && hasUser;

          sessionCacheRef.current = {
            value: isValid,
            timestamp: Date.now(),
          };

          return isValid;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          // Se der timeout, vai cair aqui com erro "TIMEOUT_EXCEEDED"
          console.error(
            `[AUTH_DEBUG] #${reqId} - ❌ Erro ou Timeout:`,
            error.message || error,
          );

          // Se deu erro ou timeout, assumimos que não está logado para destravar a UI
          sessionCacheRef.current = {
            value: false,
            timestamp: Date.now(),
          };

          return false;
        } finally {
          setTimeout(() => {
            sessionCheckPromise.current = null;
          }, 100);
        }
      })();

      return sessionCheckPromise.current;
    },
    [invalidateSessionCache],
  );

  /**
   * Força o logout completo
   */
  /**
   * Força o logout completo
   */
  const forceSignOut = useCallback(async () => {
    try {
      // ✅ Limpa estado local ANTES do signOut
      setProfile(null);
      setAvailableRecording(0);
      setTotalRecording(0);
      setIsTrial(false);
      invalidateSessionCache();

      try {
        const session = await fetchAuthSession();
        if (session.tokens) {
          await signOut({ global: true });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (signOutError: any) {
        console.error(
          "⚠️ Erro ao fazer signOut (ignorado):",
          signOutError.message,
        );
        // Ignora erro, pois o estado já foi limpo
      }

      // ✅ Aguarda um pouco para garantir que tudo foi limpo
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("❌ Erro ao fazer sign out:", error);

      // Mesmo com erro, limpa estado local
      setProfile(null);
      setAvailableRecording(0);
      setTotalRecording(0);
      setIsTrial(false);
      invalidateSessionCache();
    } finally {
      // Evita loading eterno no AuthGuard após logout
      setLoading(false);
    }
  }, [invalidateSessionCache]);

  /**
   * Busca o perfil do usuário
   */
  const handleGetProfile = useCallback(
    async (forceRefresh = false, retryCount = 0): Promise<void> => {
      if (isLoadingProfile.current) {
        return;
      }

      isLoadingProfile.current = true;
      setLoading(true);

      try {
        // Se forceRefresh, aguarda tokens antes de verificar sessão
        if (forceRefresh) {
          const tokensReady = await waitForTokens();

          if (!tokensReady) {
            console.error("❌ Tokens não disponíveis após timeout");
            setProfile(null);
            return;
          }

          // Invalida cache para forçar nova verificação
          invalidateSessionCache();
        }

        const hasSession = await checkSession(forceRefresh);
        console.log("hasSession?", hasSession)

        if (!hasSession) {
          setProfile(null);
          return;
        }
        console.log("buscando usuario ")
        const response = await GetAPI("/user", true);
        console.log("🚀 ~ handleGetProfile ~ response:", response);
        if (response.status === 200) {
          setProfile(response.body.profile);
        } else if (response.status === 401 && retryCount < 1) {
          invalidateSessionCache();
          await fetchAuthSession({ forceRefresh: true });

          await new Promise((resolve) => setTimeout(resolve, 500));
          return handleGetProfile(true, retryCount + 1);
        } else {
          console.error("❌ Erro ao buscar perfil:", response.status);
          setProfile(null);

          if (response.status === 401) {
            await forceSignOut();
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("❌ Erro no handleGetProfile:", error);

        if (
          error?.message?.includes("authentication") ||
          error?.message?.includes("unauthorized")
        ) {
          await forceSignOut();
        }

        setProfile(null);
      } finally {
        setLoading(false);
        isLoadingProfile.current = false;
      }
    },
    [GetAPI, checkSession, forceSignOut, invalidateSessionCache, waitForTokens],
  );

  /**
   * Busca gravações disponíveis
   */
  const handleGetAvailableRecording = useCallback(async () => {
    try {
      const response = await GetAPI("/signature/available-recording", true);
      console.log(response.body)
      if (response.status === 200) {
        setAvailableRecording(response.body.available);
        setTotalRecording(response.body.total);
        setIsTrial(response.body.isTrial ?? false);
      } else {
        setAvailableRecording(0);
        setTotalRecording(0);
        setIsTrial(false);
      }
    } catch (error) {
      console.error("❌ Erro ao buscar gravações:", error);
      setAvailableRecording(0);
      setTotalRecording(0);
      setIsTrial(false);
    }
  }, [GetAPI]);

  /**
   * Limpa a sessão local
   */
  const clearSession = useCallback(async () => {
    await forceSignOut();
  }, [forceSignOut]);

  /**
   * Inicialização do provider
   */
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      if (!mounted) return;

      try {
        const hasSession = await checkSession();

        if (!mounted) return;

        if (hasSession) {
          await Promise.all([
            handleGetProfile(),
            handleGetAvailableRecording(),
          ]);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Erro na inicialização:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const initTimeout = setTimeout(() => {
      initializeSession();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(initTimeout);
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        handleGetProfile,
        loading,
        profile,
        setProfile,
        availableRecording,
        handleGetAvailableRecording,
        totalRecording,
        isTrial,
        checkSession,
        clearSession,
        forceSignOut,
        waitForTokens,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
