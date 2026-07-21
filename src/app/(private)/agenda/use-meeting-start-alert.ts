"use client";

import { notificarSistema, piscarTitulo } from "@/lib/avisos";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GoogleEvent } from "./use-google-calendar";

/**
 * Alerta "sua reunião começou e você não está gravando" (visão 13/07).
 *
 * Cruza os eventos do Google com o relógio: evento (não dia-inteiro) cujo
 * início está entre 2 min no futuro e 15 min no passado, sem gravação ativa
 * nesta aba → banner + notificação do sistema (uma vez por evento) + título
 * piscando. Dispensar vale pela sessão.
 */

const ANTES_MS = 2 * 60 * 1000;
const DEPOIS_MS = 15 * 60 * 1000;
const TICK_MS = 30 * 1000;
const CHAVE_DISPENSADOS = "voice.reuniao-comecou.dispensados";

function lerDispensados(): Set<string> {
  try {
    const bruto = sessionStorage.getItem(CHAVE_DISPENSADOS);
    return new Set(bruto ? (JSON.parse(bruto) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function useMeetingStartAlert({
  eventos,
  gravando,
}: {
  eventos: GoogleEvent[];
  gravando: boolean;
}) {
  const [agora, setAgora] = useState(() => Date.now());
  const [dispensados, setDispensados] = useState<Set<string>>(lerDispensados);
  const [notificados, setNotificados] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => setAgora(Date.now()), TICK_MS);
    return () => clearInterval(interval);
  }, []);

  const comecando = useMemo(() => {
    if (gravando) return [];
    return eventos.filter((evento) => {
      if (evento.allDay || !evento.start) return false;
      if (dispensados.has(evento.id)) return false;
      const inicio = new Date(evento.start).getTime();
      return inicio - ANTES_MS <= agora && agora <= inicio + DEPOIS_MS;
    });
  }, [eventos, gravando, dispensados, agora]);

  // Notificação do sistema: uma vez por evento, e só quando ele já COMEÇOU
  useEffect(() => {
    for (const evento of comecando) {
      if (!evento.start || notificados.has(evento.id)) continue;
      if (Date.now() < new Date(evento.start).getTime()) continue;
      setNotificados((prev) => new Set(prev).add(evento.id));
      notificarSistema(
        "Sua reunião começou",
        `"${evento.title}" já começou e você não está gravando.`,
        `reuniao-comecou-${evento.id}`,
      );
      piscarTitulo("🔴 Reunião começou — gravar?");
    }
  }, [comecando, notificados]);

  const dispensar = useCallback((eventoId: string) => {
    setDispensados((prev) => {
      const proximo = new Set(prev).add(eventoId);
      try {
        sessionStorage.setItem(
          CHAVE_DISPENSADOS,
          JSON.stringify([...proximo]),
        );
      } catch {
        // sessionStorage indisponível — dispensa vale só em memória
      }
      return proximo;
    });
  }, []);

  return { comecando, dispensar };
}
