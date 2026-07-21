"use client";

import { useApiContext } from "@/context/ApiContext";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * Conexão Google Agenda do usuário (v1 — leitura sob demanda).
 *
 * O OAuth acontece nas rotas /api/auth/google-calendar/* (Next); aqui só
 * consumimos a API: status da conexão, eventos futuros (com convidados já
 * casados aos contatos por e-mail) e desconectar.
 */

export interface GoogleEventAttendee {
  email: string | null;
  name: string | null;
  responseStatus: string | null;
  contactId: string | null;
  contactName: string | null;
}

export interface GoogleEvent {
  id: string;
  title: string;
  start: string | null;
  end: string | null;
  allDay: boolean;
  meetLink: string | null;
  attendees: GoogleEventAttendee[];
}

/**
 * Parâmetros para abrir o gravador a partir de um evento: reunião com Meet =
 * online (captura de aba), sem = presencial; contatos reconhecidos já entram
 * vinculados e o título vem do evento.
 */
export function gravacaoDeEvento(evento: GoogleEvent) {
  return {
    mode: (evento.meetLink ? "online" : "presencial") as "online" | "presencial",
    clientIds: evento.attendees
      .map((c) => c.contactId)
      .filter((id): id is string => Boolean(id)),
    title: evento.title,
  };
}

/** URL que abre a home com o gravador já configurado para o evento. */
export function urlDeGravacao(evento: GoogleEvent) {
  const { mode, clientIds, title } = gravacaoDeEvento(evento);
  const params = new URLSearchParams({ gravar: mode, titulo: title });
  if (clientIds.length) params.set("contato", clientIds.join(","));
  return `/?${params.toString()}`;
}

export function useGoogleCalendar() {
  const { GetAPI, DeleteAPI } = useApiContext();

  const [carregando, setCarregando] = useState(true);
  const [conectado, setConectado] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [eventos, setEventos] = useState<GoogleEvent[]>([]);
  const [eventosCarregando, setEventosCarregando] = useState(false);

  const carregarEventos = useCallback(async () => {
    setEventosCarregando(true);
    const response = await GetAPI("/calendar/google/events?days=14", true);
    if (response.status === 200 && Array.isArray(response.body)) {
      setEventos(response.body as GoogleEvent[]);
    } else if (response.status === 400) {
      // invalid_grant: a API já apagou a conexão — refletir e avisar
      setConectado(false);
      setEmail(null);
      setEventos([]);
      toast.error("A conexão com o Google expirou — conecte a agenda novamente");
    }
    setEventosCarregando(false);
  }, [GetAPI]);

  useEffect(() => {
    let ativo = true;
    (async () => {
      const response = await GetAPI("/calendar/google/status", true);
      if (!ativo) return;
      if (response.status === 200 && response.body?.connected) {
        setConectado(true);
        setEmail(response.body.accountEmail ?? null);
      }
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, [GetAPI]);

  useEffect(() => {
    if (conectado) carregarEventos();
  }, [conectado, carregarEventos]);

  const conectar = useCallback(() => {
    window.location.href = "/api/auth/google-calendar/start";
  }, []);

  const desconectar = useCallback(async () => {
    const response = await DeleteAPI("/calendar/google", true);
    if (response.status === 200) {
      setConectado(false);
      setEmail(null);
      setEventos([]);
      toast.success("Google Agenda desconectada");
    } else {
      toast.error("Não foi possível desconectar — tente novamente");
    }
  }, [DeleteAPI]);

  return {
    carregando,
    conectado,
    email,
    eventos,
    eventosCarregando,
    conectar,
    desconectar,
    recarregarEventos: carregarEventos,
  };
}
