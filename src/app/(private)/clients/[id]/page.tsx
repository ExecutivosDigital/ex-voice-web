"use client";

import { ClientProps, RecordingDetailsProps } from "@/@types/general-client";
import { AudioRecorder } from "@/components/audio-recorder/audio-recorder";
import { ComingSoonOverlay } from "@/components/coming-soon-overlay";
import { CustomPagination } from "@/components/ui/blocks/custom-pagination";
import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ActivitySquare,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CakeSlice,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Flame,
  Gauge,
  IdCard,
  Lightbulb,
  Loader2,
  Mail,
  MapPin,
  MessageSquareQuote,
  Mic2,
  Phone,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  User as UserIcon,
  Video,
  Waves,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

moment.locale("pt-br");

type ViewMode = "recordings" | "about" | "intelligence";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("");
}

export default function ClientDetailPage() {
  const { selectedClient } = useGeneralContext();
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("recordings");

  if (!selectedClient) return null;

  return (
    <div className="flex w-full flex-col gap-8">
      <MinimalHeader
        client={selectedClient}
        onBack={() => router.push("/clients")}
      />

      <ViewSwitcher view={view} onChange={setView} />

      <AnimatePresence mode="wait">
        {view === "recordings" && (
          <motion.div
            key="recordings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <RecordingsView client={selectedClient} />
          </motion.div>
        )}
        {view === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <ComingSoonOverlay>
              <AboutView client={selectedClient} />
            </ComingSoonOverlay>
          </motion.div>
        )}
        {view === "intelligence" && (
          <motion.div
            key="intelligence"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <ComingSoonOverlay>
              <IntelligenceView client={selectedClient} />
            </ComingSoonOverlay>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MinimalHeader({
  client,
  onBack,
}: {
  client: ClientProps;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="group inline-flex w-max items-center gap-2 text-xs font-semibold tracking-[0.28em] text-gray-400 uppercase transition hover:text-gray-900"
      >
        <ArrowLeft
          size={14}
          className="transition-transform group-hover:-translate-x-0.5"
        />
        Clientes
      </button>

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-xs font-semibold text-white shadow-sm">
            {initials(client.name) || "?"}
          </div>
          <h1 className="truncate text-2xl font-semibold text-gray-900 md:text-3xl">
            {client.name}
          </h1>
        </div>

        <AudioRecorder
          buttonClassName="inline-flex shrink-0 h-10 items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-4 text-xs font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
          skipToClient
          customLabel="Nova gravação"
          customIcon={Plus}
          initialClientId={client.id}
        />
      </div>
    </div>
  );
}

function ViewSwitcher({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const tabs: { key: ViewMode; label: string; icon: typeof Mic2 }[] = [
    { key: "recordings", label: "Gravações", icon: Mic2 },
    { key: "about", label: "Sobre", icon: IdCard },
    { key: "intelligence", label: "Inteligência", icon: Sparkles },
  ];

  return (
    <div className="flex w-full items-center">
      <div className="relative inline-flex items-center gap-1 overflow-x-auto rounded-full border border-gray-200/80 bg-white/70 p-1 shadow-sm backdrop-blur-md">
        {tabs.map((t) => {
          const active = view === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active ? "text-white" : "text-gray-600 hover:text-gray-900",
              )}
            >
              {active && (
                <motion.span
                  layoutId="client-view-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)]"
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                />
              )}
              <span className="relative inline-flex items-center gap-2">
                <Icon size={14} />
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function statusMeta(status: RecordingDetailsProps["transcriptionStatus"]) {
  switch (status) {
    case "DONE":
      return {
        label: "Concluída",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        icon: CheckCircle2,
        spin: false,
      };
    case "TRANSCRIBING":
      return {
        label: "Transcrevendo",
        text: "text-amber-700",
        bg: "bg-amber-50",
        icon: Loader2,
        spin: true,
      };
    default:
      return {
        label: "Pendente",
        text: "text-gray-600",
        bg: "bg-gray-50",
        icon: Clock,
        spin: false,
      };
  }
}

function RecordingsView({ client }: { client: ClientProps }) {
  const {
    recordings,
    isGettingRecordings,
    recordingsFilters,
    setRecordingsFilters,
    recordingsTotalPages,
    setSelectedRecording,
  } = useGeneralContext();
  const router = useRouter();

  useEffect(() => {
    setRecordingsFilters((prev) => ({
      ...prev,
      type: "CLIENT",
      clientId: client.id,
      query: undefined,
      sortBy: undefined,
      sortDirection: undefined,
      page: 1,
    }));
  }, [client.id, setRecordingsFilters]);

  const handleOpen = (rec: RecordingDetailsProps) => {
    setSelectedRecording(rec);
    router.push(`/recordings/${rec.id}`);
  };

  return (
    <section className="flex flex-col gap-5">
      {isGettingRecordings ? (
        <SkeletonList />
      ) : recordings.length === 0 ? (
        <EmptyRecordings clientId={client.id} />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {recordings.map((rec, i) => (
              <RecordingRow
                key={rec.id}
                recording={rec}
                onOpen={() => handleOpen(rec)}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!isGettingRecordings && recordingsTotalPages > 1 && (
        <div className="pt-2">
          <CustomPagination
            currentPage={recordingsFilters.page}
            setCurrentPage={(page) =>
              setRecordingsFilters((prev) => ({ ...prev, page }))
            }
            pages={recordingsTotalPages}
          />
        </div>
      )}
    </section>
  );
}

function RecordingRow({
  recording,
  onOpen,
  index,
}: {
  recording: RecordingDetailsProps;
  onOpen: () => void;
  index: number;
}) {
  const status = statusMeta(recording.transcriptionStatus);
  const StatusIcon = status.icon;

  return (
    <motion.button
      onClick={onOpen}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.25) }}
      whileHover={{ y: -1 }}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm transition hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]"
    >
      <span className="absolute inset-y-0 left-0 w-[3px] scale-y-0 bg-gradient-to-b from-gray-900 to-gray-500 transition-transform duration-300 group-hover:scale-y-100" />

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-sm">
        <Video size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">
          {recording.name || "Sem título"}
        </p>
        <p className="mt-0.5 truncate text-xs text-gray-500">
          {recording.description || "Sem descrição"}
        </p>
      </div>

      <div className="hidden flex-col items-end gap-1 md:flex">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
            status.bg,
            status.text,
          )}
        >
          <StatusIcon size={11} className={cn(status.spin && "animate-spin")} />
          {status.label}
        </span>
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {recording.duration || "--"}
          </span>
          <span className="text-gray-300">•</span>
          <span>
            {recording.createdAt
              ? moment(recording.createdAt).format("DD/MM/YYYY HH:mm")
              : ""}
          </span>
        </div>
      </div>

      <div className="ml-2 hidden h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition group-hover:bg-gray-900 group-hover:text-white md:flex">
        <ArrowRight size={16} />
      </div>
    </motion.button>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex h-[80px] w-full animate-pulse items-center gap-4 rounded-2xl border border-gray-200/60 bg-white/60 p-4"
        >
          <div className="h-12 w-12 rounded-2xl bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded-full bg-gray-100" />
            <div className="h-2.5 w-2/3 rounded-full bg-gray-100" />
          </div>
          <div className="hidden h-6 w-20 rounded-full bg-gray-100 md:block" />
        </div>
      ))}
    </div>
  );
}

function EmptyRecordings({ clientId }: { clientId: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
        <Mic2 size={26} />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        Nenhuma reunião ainda
      </h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        Quando você gravar a próxima conversa com esse contato, ela vai aparecer
        aqui.
      </p>
      <div className="mt-6">
        <AudioRecorder
          buttonClassName="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:scale-[1.02]"
          skipToClient
          customLabel="Começar gravação"
          customIcon={Plus}
          initialClientId={clientId}
        />
      </div>
    </div>
  );
}

// ================= SOBRE =================

function AboutView({ client }: { client: ClientProps }) {
  const enrichment = useMemo(() => buildEnrichment(client), [client.id]);

  return (
    <section className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricTile
          icon={Mic2}
          label="Gravações"
          value={enrichment.metrics.recordings}
          hint="Reuniões registradas"
        />
        <MetricTile
          icon={Clock}
          label="Tempo total"
          value={enrichment.metrics.totalTime}
          hint="Duração acumulada"
        />
        <MetricTile
          icon={ActivitySquare}
          label="Última conversa"
          value={enrichment.metrics.lastInteraction}
          hint="Baseado no histórico"
        />
        <MetricTile
          icon={Calendar}
          label="Cliente desde"
          value={
            client.createdAt
              ? moment(client.createdAt).format("MMM/YY")
              : "Novo"
          }
          hint={
            client.createdAt
              ? moment(client.createdAt).fromNow()
              : "Recém adicionado"
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Section
          icon={UserIcon}
          eyebrow="Identidade"
          title="Dados principais"
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field icon={UserIcon} label="Nome completo" value={client.name} />
            <Field
              icon={Briefcase}
              label="Cargo"
              value={enrichment.identity.role}
              mock
            />
            <Field
              icon={Building2}
              label="Empresa"
              value={enrichment.identity.company}
              mock
            />
            <Field
              icon={MapPin}
              label="Localização"
              value={enrichment.identity.location}
              mock
            />
            <Field
              icon={CakeSlice}
              label="Aniversário"
              value={
                client.birthDate
                  ? moment(client.birthDate).format("DD [de] MMMM")
                  : enrichment.identity.birthDate
              }
              mock={!client.birthDate}
            />
            <Field
              icon={Calendar}
              label="Data de cadastro"
              value={
                client.createdAt
                  ? moment(client.createdAt).format("DD/MM/YYYY")
                  : "—"
              }
            />
          </div>
        </Section>

        <Section icon={Phone} eyebrow="Contato" title="Como falar">
          <div className="flex flex-col gap-3">
            <Field
              icon={Mail}
              label="E-mail"
              value={enrichment.contact.email}
              mock
              copy
            />
            <Field
              icon={Phone}
              label="Telefone"
              value={enrichment.contact.phone}
              mock
              copy
            />
            <Field
              icon={MessageSquareQuote}
              label="Canal preferido"
              value={enrichment.contact.preferredChannel}
              mock
            />
          </div>
        </Section>
      </div>

      <Section
        icon={FileText}
        eyebrow="Contexto"
        title="Descrição"
        description={
          client.description
            ? "Anotação interna vinculada a este contato."
            : "Nenhuma descrição ainda — adicione na edição do cliente."
        }
      >
        <p className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 text-sm leading-relaxed text-gray-700">
          {client.description || enrichment.fallbackDescription}
        </p>
      </Section>

      <Section icon={Sparkles} eyebrow="Atributos" title="Tags e relações">
        <div className="flex flex-wrap gap-2">
          {enrichment.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-gray-900 to-gray-500" />
              {tag}
            </span>
          ))}
        </div>
      </Section>

      <p className="text-center text-[11px] tracking-wider text-gray-400 uppercase">
        Campos marcados como estimados são exemplos até o cadastro completo
      </p>
    </section>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 p-4 backdrop-blur-sm transition hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.2)]">
      <span className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 transition-transform duration-500 group-hover:scale-x-100" />
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900/5 text-gray-700">
          <Icon size={14} />
        </span>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
          {label}
        </p>
      </div>
      <p className="mt-3 text-xl font-semibold text-gray-900 md:text-2xl">
        {value}
      </p>
      {hint && (
        <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500">{hint}</p>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  icon: typeof Gauge;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-gray-200/70 bg-white/80 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm md:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900/5 text-gray-700">
          <Icon size={15} />
        </span>
        <div className="flex-1">
          <p className="text-[10px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
            {eyebrow}
          </p>
          <h3 className="mt-0.5 text-base font-semibold text-gray-900">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  mock = false,
  copy = false,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  mock?: boolean;
  copy?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition hover:border-gray-200 hover:bg-white">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-gray-400 uppercase">
            {label}
          </p>
          {mock && (
            <span className="rounded-full bg-gray-900/5 px-1.5 py-px text-[9px] font-semibold tracking-wide text-gray-500 uppercase">
              Estimado
            </span>
          )}
        </div>
        <p className="truncate text-sm font-medium text-gray-900">{value}</p>
      </div>
      {copy && (
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-full border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold tracking-wider text-gray-500 uppercase transition hover:border-gray-900 hover:text-gray-900"
        >
          {copied ? "OK" : "Copiar"}
        </button>
      )}
    </div>
  );
}

type EnrichmentData = {
  metrics: {
    recordings: string;
    totalTime: string;
    lastInteraction: string;
  };
  identity: {
    role: string;
    company: string;
    location: string;
    birthDate: string;
  };
  contact: {
    email: string;
    phone: string;
    preferredChannel: string;
  };
  tags: string[];
  fallbackDescription: string;
};

function buildEnrichment(client: ClientProps): EnrichmentData {
  const first = client.name.split(" ")[0] || "contato";
  const slug = first
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return {
    metrics: {
      recordings: "12",
      totalTime: "3h 42m",
      lastInteraction: "há 4 dias",
    },
    identity: {
      role: "Diretor Comercial",
      company: "Empresa Exemplo S.A.",
      location: "São Paulo, SP",
      birthDate: "Não informado",
    },
    contact: {
      email: `${slug}@empresa.com`,
      phone: "+55 (11) 99999-0000",
      preferredChannel: "WhatsApp e videochamada",
    },
    tags: [
      "Decisor",
      "Ticket alto",
      "Follow-up mensal",
      "Parceria estratégica",
      "Expansão 2026",
    ],
    fallbackDescription: `${first} está no radar há alguns meses. Sem anotações registradas — abra a edição do cliente para adicionar um resumo rápido do contexto, objetivos e histórico de conversas.`,
  };
}

// ================= INTELIGÊNCIA =================

function IntelligenceView({ client }: { client: ClientProps }) {
  const profile = useMemo(() => buildMockProfile(client), [client.id]);

  return (
    <section className="flex flex-col gap-6">
      <SignatureCard profile={profile} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <StatTile
          icon={Gauge}
          label="Ritmo de fala"
          value={profile.pace.label}
          hint={profile.pace.hint}
        />
        <StatTile
          icon={Waves}
          label="Tom predominante"
          value={profile.dominantTone}
          hint="Detectado nas últimas 6 conversas"
        />
        <StatTile
          icon={TrendingUp}
          label="Sentimento médio"
          value={profile.sentiment.label}
          hint={profile.sentiment.hint}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          icon={MessageSquareQuote}
          eyebrow="Como ele fala"
          title="Jeito de se comunicar"
          description="Padrões observados no discurso, entonação e escolha de palavras."
        >
          <div className="flex flex-col gap-3">
            {profile.styleTraits.map((trait) => (
              <TraitRow key={trait.label} trait={trait} />
            ))}
          </div>
        </Panel>

        <Panel
          icon={Waves}
          eyebrow="Tons detectados"
          title="Espectro emocional"
          description="Mistura de tons que costumam aparecer nas conversas."
        >
          <div className="flex flex-col gap-3">
            {profile.tones.map((t) => (
              <ToneBar key={t.label} tone={t} />
            ))}
          </div>
        </Panel>

        <Panel
          icon={Compass}
          eyebrow="Temas recorrentes"
          title="O que ele costuma falar"
          description="Assuntos e preocupações que mais se repetem."
        >
          <div className="flex flex-wrap gap-2">
            {profile.topics.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-gray-900 to-gray-500" />
                {topic}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
              Frase frequente
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 italic">
              “{profile.signaturePhrase}”
            </p>
          </div>
        </Panel>

        <Panel
          icon={Flame}
          eyebrow="Gatilhos de persuasão"
          title="O que convence ele"
          description="O que desbloqueia decisões e move a conversa adiante."
        >
          <div className="flex flex-col gap-3">
            {profile.persuasionTriggers.map((trigger) => (
              <TriggerRow key={trigger.title} trigger={trigger} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        icon={Lightbulb}
        eyebrow="Jogada estratégica"
        title="Como avançar na próxima conversa"
        description="Recomendações geradas com base no histórico deste contato."
        accent
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {profile.playbook.map((p, i) => (
            <div
              key={p.title}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 p-4 transition hover:border-gray-300 hover:bg-white"
            >
              <span className="absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-gray-900 to-gray-500 opacity-80" />
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-xs font-semibold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {p.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <p className="text-center text-[11px] tracking-wider text-gray-400 uppercase">
        Insights gerados por IA · Refinados a cada nova gravação
      </p>
    </section>
  );
}

function SignatureCard({ profile }: { profile: MockProfile }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-gray-200/70 bg-gradient-to-br from-white via-white to-gray-50 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-7">
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 opacity-[0.05] blur-3xl" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
            <Target size={15} />
          </span>
          <p className="text-xs font-semibold tracking-[0.28em] text-gray-400 uppercase">
            Retrato Comunicacional
          </p>
        </div>
        <p className="text-lg leading-relaxed font-medium text-balance text-gray-800 md:text-xl">
          {profile.signature}
        </p>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 p-5 backdrop-blur-sm transition hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.2)]">
      <span className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 transition-transform duration-500 group-hover:scale-x-100" />
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900/5 text-gray-700">
          <Icon size={16} />
        </span>
        <p className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
          {label}
        </p>
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Panel({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
  accent = false,
}: {
  icon: typeof Gauge;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm md:p-6",
        accent
          ? "border-gray-200/70 bg-gradient-to-br from-gray-50/80 via-white to-white"
          : "border-gray-200/70 bg-white/80",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl shadow-sm",
            accent
              ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white"
              : "bg-gray-900/5 text-gray-700",
          )}
        >
          <Icon size={15} />
        </span>
        <div className="flex-1">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-gray-400 uppercase">
            {eyebrow}
          </p>
          <h3 className="mt-0.5 text-base font-semibold text-gray-900">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function TraitRow({ trait }: { trait: StyleTrait }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">{trait.label}</p>
        <span className="text-[11px] font-medium text-gray-500">
          {trait.poles[0]} ↔ {trait.poles[1]}
        </span>
      </div>
      <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/80">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${trait.value}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-500"
        />
        <span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-gray-900 shadow"
          style={{ left: `calc(${trait.value}% - 6px)` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">{trait.note}</p>
    </div>
  );
}

function ToneBar({ tone }: { tone: ToneEntry }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 font-medium text-gray-800">
          <span className={cn("h-2 w-2 rounded-full", tone.color)} />
          {tone.label}
        </span>
        <span className="text-[11px] font-semibold text-gray-500">
          {tone.value}%
        </span>
      </div>
      <div className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: `${tone.value}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={cn("absolute inset-y-0 left-0 rounded-full", tone.bar)}
        />
      </div>
    </div>
  );
}

function TriggerRow({ trigger }: { trigger: PersuasionTrigger }) {
  return (
    <div className="group relative flex gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white/70 p-4 transition hover:border-gray-200 hover:bg-white">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <Flame size={15} />
      </span>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{trigger.title}</p>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-gray-600 uppercase">
            {trigger.intensity}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          {trigger.body}
        </p>
      </div>
    </div>
  );
}

type StyleTrait = {
  label: string;
  poles: [string, string];
  value: number;
  note: string;
};

type ToneEntry = {
  label: string;
  value: number;
  color: string;
  bar: string;
};

type PersuasionTrigger = {
  title: string;
  body: string;
  intensity: "Forte" | "Médio" | "Leve";
};

type PlaybookEntry = { title: string; body: string };

type MockProfile = {
  signature: string;
  signaturePhrase: string;
  dominantTone: string;
  pace: { label: string; hint: string };
  sentiment: { label: string; hint: string };
  styleTraits: StyleTrait[];
  tones: ToneEntry[];
  topics: string[];
  persuasionTriggers: PersuasionTrigger[];
  playbook: PlaybookEntry[];
};

function buildMockProfile(client: ClientProps): MockProfile {
  const first = client.name.split(" ")[0] || "Contato";

  return {
    signature: `${first} é analítico e racional, mas decide pelo instinto quando sente segurança. Gosta de dados claros, detesta rodeios e dá peso para quem entrega o que promete.`,
    signaturePhrase: "Faz sentido, mas me mostra o número antes.",
    dominantTone: "Analítico calmo",
    pace: { label: "Moderado", hint: "Pausas estratégicas entre ideias" },
    sentiment: { label: "Positivo", hint: "+18% vs. últimas 10 conversas" },
    styleTraits: [
      {
        label: "Formalidade",
        poles: ["Informal", "Formal"],
        value: 62,
        note: "Usa tratamento cordial, mas relaxa rápido quando a relação evolui.",
      },
      {
        label: "Direcionamento",
        poles: ["Exploratório", "Direto"],
        value: 78,
        note: "Gosta de ir ao ponto — perguntas curtas, respostas assertivas.",
      },
      {
        label: "Densidade técnica",
        poles: ["Simples", "Técnico"],
        value: 70,
        note: "Conforto com termos técnicos; espera o mesmo do interlocutor.",
      },
      {
        label: "Racional ↔ Emocional",
        poles: ["Racional", "Emocional"],
        value: 35,
        note: "Decide no dado, mas emocional aparece quando o tema é time e pessoas.",
      },
    ],
    tones: [
      {
        label: "Analítico",
        value: 38,
        color: "bg-indigo-500",
        bar: "bg-indigo-500",
      },
      {
        label: "Confiante",
        value: 26,
        color: "bg-emerald-500",
        bar: "bg-emerald-500",
      },
      {
        label: "Cético",
        value: 18,
        color: "bg-amber-500",
        bar: "bg-amber-500",
      },
      { label: "Curioso", value: 12, color: "bg-sky-500", bar: "bg-sky-500" },
      {
        label: "Impaciente",
        value: 6,
        color: "bg-rose-500",
        bar: "bg-rose-500",
      },
    ],
    topics: [
      "Metas do trimestre",
      "Previsibilidade de receita",
      "Performance do time",
      "Pipeline e funil",
      "ROI e payback",
      "Automação de processos",
      "Relacionamento com parceiros",
    ],
    persuasionTriggers: [
      {
        title: "Prova social com números",
        body: "Responde bem quando você traz cases com métricas claras — antes e depois, em empresas do mesmo porte.",
        intensity: "Forte",
      },
      {
        title: "Segurança de execução",
        body: "Pergunta sempre por prazos e responsáveis. Ganhar a conversa é mostrar plano, não promessa.",
        intensity: "Forte",
      },
      {
        title: "Ganho de tempo",
        body: "Ativa quando se fala em tirar trabalho manual do time dele. Gosta de eficiência visível.",
        intensity: "Médio",
      },
      {
        title: "Exclusividade",
        body: "Reage a ofertas limitadas ou condições especiais, mas só se o racional já estiver fechado.",
        intensity: "Leve",
      },
    ],
    playbook: [
      {
        title: "Comece com um dado, não com contexto",
        body: "Abra a conversa com um número que ele reconheça — historial ou benchmark do setor.",
      },
      {
        title: "Traga um plano, não uma ideia",
        body: "Ele valoriza clareza de próximos passos: quem faz, quando e como você mede sucesso.",
      },
      {
        title: "Antecipe a objeção de risco",
        body: "Explicite o que pode dar errado e como você mitiga antes que ele pergunte.",
      },
      {
        title: "Feche com compromisso pequeno",
        body: "Evite grandes saltos. Proponha um próximo passo objetivo — reunião focada ou piloto curto.",
      },
    ],
  };
}
