"use client";

import { useSession } from "@/context/auth";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MeetingStartBanner } from "./agenda/components/meeting-start-banner";
import {
  gravacaoDeEvento,
  GoogleEvent,
  useGoogleCalendar,
} from "./agenda/use-google-calendar";
import { useMeetingStartAlert } from "./agenda/use-meeting-start-alert";
import { EscolherModoModal } from "./agenda/components/escolher-modo-modal";
import { ImmersiveRecorder } from "./_components/immersive-recorder";
import { ModeCards, RecordMode } from "./_components/mode-cards";
import { NotificationPermissionBanner } from "./_components/notification-permission-banner";
import { RecentRecordings } from "./_components/recent-recordings";
import { UpcomingMeetings } from "./_components/upcoming-meetings";
import { UploadRecordingCta } from "./_components/upload-recording-dialog";

const WEEKDAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function getGreeting(hour: number) {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function NewHome() {
  const { profile } = useSession();
  const google = useGoogleCalendar();
  const [activeMode, setActiveMode] = useState<RecordMode | null>(null);
  const [preSelected, setPreSelected] = useState<{
    clientIds: string[];
    title: string;
  } | null>(null);

  // Gravação disparada de fora (ex.: evento da Agenda/Google): abre o gravador
  // com contato e título já preenchidos via ?gravar=online&contato=..&titulo=..
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gravar = params.get("gravar");
    if (gravar !== "online" && gravar !== "presencial") return;
    const contato = params.get("contato");
    setPreSelected({
      clientIds: contato ? contato.split(",").filter(Boolean) : [],
      title: params.get("titulo") ?? "",
    });
    setActiveMode(gravar);
    window.history.replaceState(null, "", "/");
  }, []);

  const [escolherModoDe, setEscolherModoDe] = useState<GoogleEvent | null>(
    null,
  );

  // Gravar a partir de um card de evento da própria home (sem navegação).
  // Com Meet = online direto; sem Meet o usuário escolhe (call João 21/07).
  const iniciarGravacao = (
    evento: GoogleEvent,
    modo?: "online" | "presencial",
  ) => {
    const { mode, clientIds, title } = gravacaoDeEvento(evento, modo);
    setPreSelected({ clientIds, title });
    setActiveMode(mode);
  };

  const gravarEvento = (evento: GoogleEvent) => {
    if (evento.meetLink) {
      iniciarGravacao(evento);
    } else {
      setEscolherModoDe(evento);
    }
  };

  const alertaInicio = useMeetingStartAlert({
    eventos: google.eventos,
    gravando: activeMode !== null,
  });

  const firstName = profile?.name?.split(" ")[0] || "";
  const now = new Date();
  const formattedDate = `${WEEKDAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]}`;
  const greeting = getGreeting(now.getHours());

  // Reuniões de HOJE vindas do Google Agenda (0 quando não conectado)
  const appointmentsToday = useMemo(() => {
    const hoje = new Date();
    return google.eventos.filter((e) => {
      if (!e.start) return false;
      const d = new Date(e.start);
      return (
        d.getFullYear() === hoje.getFullYear() &&
        d.getMonth() === hoje.getMonth() &&
        d.getDate() === hoje.getDate()
      );
    }).length;
  }, [google.eventos]);

  return (
    <div className="flex w-full flex-col gap-10">
      <NotificationPermissionBanner />

      <MeetingStartBanner
        eventos={alertaInicio.comecando}
        onGravar={gravarEvento}
        onDispensar={alertaInicio.dispensar}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-2"
      >
        <p className="text-xs font-medium tracking-[0.18em] text-gray-400 capitalize">
          {formattedDate}
        </p>
        <h1 className="text-2xl font-semibold text-balance text-gray-900 md:text-3xl">
          {greeting}
          {firstName ? `, ${firstName}.` : "."}
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
          {google.conectado ? (
            <>
              Você tem{" "}
              <span className="font-medium text-gray-700">
                {appointmentsToday}{" "}
                {appointmentsToday === 1 ? "reunião" : "reuniões"}
              </span>{" "}
              hoje no seu Google Agenda.
            </>
          ) : (
            <>Grave, transcreva e transforme suas conversas em decisões.</>
          )}
        </p>
      </motion.section>

      <div className="flex flex-col gap-3">
        <ModeCards onSelect={(mode) => setActiveMode(mode)} />
        <UploadRecordingCta />
      </div>

      <UpcomingMeetings google={google} onGravar={gravarEvento} />

      <RecentRecordings />

      <AnimatePresence>
        {activeMode && (
          <ImmersiveRecorder
            key={activeMode}
            mode={activeMode}
            onClose={() => {
              setActiveMode(null);
              setPreSelected(null);
            }}
            preSelectedClientIds={preSelected?.clientIds}
            initialTitle={preSelected?.title}
          />
        )}
      </AnimatePresence>

      <EscolherModoModal
        evento={escolherModoDe}
        onClose={() => setEscolherModoDe(null)}
        onEscolher={(modo) => {
          const evento = escolherModoDe;
          setEscolherModoDe(null);
          if (evento) iniciarGravacao(evento, modo);
        }}
      />
    </div>
  );
}
