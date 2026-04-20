"use client";

import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function SelectedClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedClient, setSelectedClient } = useGeneralContext();
  const { GetAPI } = useApiContext();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const clientId = params["selected-client-id"] as string | undefined;

  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState(false);

  // Só carrega cliente quando estamos na lista do cliente (ex: /clients/xxx), não na gravação (ex: /clients/xxx/yyy)
  const pathSegments = pathname?.split("/").filter(Boolean) ?? [];
  const isClientListPage = pathSegments.length === 2 && pathSegments[0] === "clients";

  useEffect(() => {
    if (!clientId) {
      router.push("/clients");
      return;
    }

    // Na tela de uma gravação, o layout interno já carrega cliente + gravação; não precisamos fazer nada aqui
    if (!isClientListPage) {
      setResolved(true);
      setLoading(false);
      return;
    }

    const alreadyHasContext = selectedClient?.id === clientId;
    if (alreadyHasContext) {
      setLoading(false);
      setResolved(true);
      return;
    }

    let cancelled = false;

    const loadFromApi = async () => {
      setLoading(true);
      const response = await GetAPI(`/client/${clientId}`, true);
      if (cancelled) return;

      if (response.status !== 200 || !response.body?.id) {
        router.push("/clients");
        return;
      }

      setSelectedClient(response.body as Parameters<typeof setSelectedClient>[0]);
      setResolved(true);
      setLoading(false);
    };

    loadFromApi();
    return () => {
      cancelled = true;
    };
  }, [clientId, isClientListPage, selectedClient?.id, GetAPI, router, setSelectedClient]);

  if (!resolved && loading && isClientListPage) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!resolved && isClientListPage) {
    return null;
  }

  return <>{children}</>;
}
