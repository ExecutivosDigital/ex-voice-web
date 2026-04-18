"use client";

import { useApiContext } from "@/context/ApiContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewHomeClientDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedClient, setSelectedClient } = useGeneralContext();
  const { GetAPI } = useApiContext();
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!clientId) {
      router.push("/new-home/clients");
      return;
    }

    if (selectedClient?.id === clientId) {
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
        router.push("/new-home/clients");
        return;
      }

      setSelectedClient(
        response.body as Parameters<typeof setSelectedClient>[0],
      );
      setResolved(true);
      setLoading(false);
    };

    loadFromApi();
    return () => {
      cancelled = true;
    };
  }, [clientId, selectedClient?.id, GetAPI, router, setSelectedClient]);

  if (!resolved && loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!resolved) return null;

  return <>{children}</>;
}
