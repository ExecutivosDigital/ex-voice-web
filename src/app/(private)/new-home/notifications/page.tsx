"use client";

import type { NotificationProps } from "@/@types/general-client";
import { CustomPagination } from "@/components/ui/blocks/custom-pagination";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/utils/cn";
import { convertAppRouteToWeb } from "@/utils/route-mapper";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  BellOff,
  CalendarDays,
  Check,
  CheckCheck,
  FileText,
  Loader2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

moment.locale("pt-br");

type FilterKey = "ALL" | "UNREAD" | "READ";

type IconComp = React.ComponentType<{ size?: number; className?: string }>;

interface Accent {
  icon: IconComp;
  bar: string;
  chip: string;
  dot: string;
}

const DEFAULT_ACCENT: Accent = {
  icon: Bell,
  bar: "bg-gray-400",
  chip: "bg-gray-50 text-gray-700 ring-gray-200",
  dot: "bg-gray-400",
};

const TYPE_ACCENTS: Record<string, Accent> = {
  meeting: {
    icon: CalendarDays,
    bar: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    dot: "bg-emerald-500",
  },
  recording: {
    icon: FileText,
    bar: "bg-sky-500",
    chip: "bg-sky-50 text-sky-700 ring-sky-100",
    dot: "bg-sky-500",
  },
  client: {
    icon: Users,
    bar: "bg-indigo-500",
    chip: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    dot: "bg-indigo-500",
  },
  plan: {
    icon: Sparkles,
    bar: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 ring-amber-100",
    dot: "bg-amber-500",
  },
  system: {
    icon: Zap,
    bar: "bg-gray-700",
    chip: "bg-gray-100 text-gray-700 ring-gray-200",
    dot: "bg-gray-700",
  },
};

function getAccent(notification: NotificationProps): Accent {
  const key = notification.type?.toLowerCase() ?? "";
  for (const k of Object.keys(TYPE_ACCENTS)) {
    if (key.includes(k)) return TYPE_ACCENTS[k];
  }
  return DEFAULT_ACCENT;
}

function typeLabel(type?: string) {
  const map: Record<string, string> = {
    meeting: "Reunião",
    recording: "Gravação",
    client: "Cliente",
    plan: "Assinatura",
    system: "Sistema",
  };
  if (!type) return "Aviso";
  const key = type.toLowerCase();
  for (const k of Object.keys(map)) {
    if (key.includes(k)) return map[k];
  }
  return "Aviso";
}

function isToday(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

export default function MinimalNotificationsPage() {
  const {
    notifications,
    pages,
    page,
    loading,
    error,
    unreadCount,
    markingAllAsRead,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ poll: false });

  const [filter, setFilter] = useState<FilterKey>("ALL");

  const filtered = useMemo(() => {
    if (filter === "UNREAD") return notifications.filter((n) => !n.opened);
    if (filter === "READ") return notifications.filter((n) => n.opened);
    return notifications;
  }, [filter, notifications]);

  const todayCount = useMemo(
    () => notifications.filter((n) => isToday(n.createdAt)).length,
    [notifications],
  );
  const readCount = notifications.length - unreadCount;

  const filterCounts: Record<FilterKey, number> = {
    ALL: notifications.length,
    UNREAD: unreadCount,
    READ: readCount,
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <Hero unreadCount={unreadCount} />

      <StatsRow
        total={notifications.length}
        unread={unreadCount}
        read={readCount}
        today={todayCount}
      />

      <Toolbar
        filter={filter}
        counts={filterCounts}
        onFilter={setFilter}
        onMarkAll={markAllAsRead}
        hasUnread={unreadCount > 0}
        marking={markingAllAsRead}
      />

      <section>
        {loading && notifications.length === 0 ? (
          <SkeletonList />
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="flex flex-col gap-2.5">
            <AnimatePresence mode="popLayout">
              {filtered.map((n, i) => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  index={i}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {!loading && pages > 1 && (
        <div className="pt-2">
          <CustomPagination
            pages={pages}
            currentPage={page}
            setCurrentPage={(p) => fetchNotifications(p)}
          />
        </div>
      )}
    </div>
  );
}

function Hero({ unreadCount }: { unreadCount: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium tracking-[0.18em] text-gray-400 uppercase">
          Central
        </p>
        {unreadCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-red-700 uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            {unreadCount} {unreadCount === 1 ? "nova" : "novas"}
          </span>
        )}
      </div>
      <h1 className="text-balance text-2xl font-semibold text-gray-900 md:text-3xl">
        Suas notificações.
      </h1>
      <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
        Tudo que acontece nas suas reuniões, gravações e conta em um só lugar.
        Clique em uma notificação para ir direto pro que importa.
      </p>
    </motion.section>
  );
}

function StatsRow({
  total,
  unread,
  read,
  today,
}: {
  total: number;
  unread: number;
  read: number;
  today: number;
}) {
  const items: {
    label: string;
    value: number;
    hint: string;
    tone?: "accent";
  }[] = [
    { label: "Total", value: total, hint: "registradas" },
    { label: "Não lidas", value: unread, hint: "aguardando você", tone: "accent" },
    { label: "Lidas", value: read, hint: "no histórico" },
    { label: "Hoje", value: today, hint: "nas últimas 24h" },
  ];
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.label}
          className={cn(
            "flex flex-col justify-between rounded-3xl border p-5",
            it.tone === "accent"
              ? "border-gray-900 bg-gradient-to-br from-gray-900 via-[#111318] to-[#1a1d24] text-white shadow-[0_12px_40px_-20px_rgba(17,24,39,0.6)]"
              : "border-gray-200/70 bg-white/80 backdrop-blur-sm",
          )}
        >
          <p
            className={cn(
              "text-[10px] font-semibold tracking-[0.28em] uppercase",
              it.tone === "accent" ? "text-white/60" : "text-gray-400",
            )}
          >
            {it.label}
          </p>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span
              className={cn(
                "text-3xl font-semibold tabular-nums",
                it.tone === "accent" ? "text-white" : "text-gray-900",
              )}
            >
              {it.value}
            </span>
            <span
              className={cn(
                "text-[11px] font-medium",
                it.tone === "accent" ? "text-white/60" : "text-gray-400",
              )}
            >
              {it.hint}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}

function Toolbar({
  filter,
  counts,
  onFilter,
  onMarkAll,
  hasUnread,
  marking,
}: {
  filter: FilterKey;
  counts: Record<FilterKey, number>;
  onFilter: (f: FilterKey) => void;
  onMarkAll: () => void;
  hasUnread: boolean;
  marking: boolean;
}) {
  const filters: { key: FilterKey; label: string }[] = [
    { key: "ALL", label: "Todas" },
    { key: "UNREAD", label: "Não lidas" },
    { key: "READ", label: "Lidas" },
  ];

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="inline-flex items-center gap-1 self-start rounded-full border border-gray-200/70 bg-white/70 p-1 backdrop-blur-md">
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => onFilter(f.key)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                active ? "text-white" : "text-gray-600 hover:text-gray-900",
              )}
            >
              {active && (
                <motion.span
                  layoutId="notif-filter-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-[0_4px_14px_-4px_rgba(17,24,39,0.5)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600",
                  )}
                >
                  {counts[f.key]}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onMarkAll}
        disabled={!hasUnread || marking}
        className={cn(
          "inline-flex h-10 items-center gap-2 self-start rounded-full border px-4 text-xs font-semibold transition",
          !hasUnread || marking
            ? "cursor-not-allowed border-gray-200 bg-white/40 text-gray-400"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900",
        )}
      >
        {marking ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <CheckCheck size={13} />
        )}
        {marking ? "Marcando..." : "Marcar todas como lidas"}
      </button>
    </section>
  );
}

function NotificationRow({
  notification,
  index,
  onMarkAsRead,
}: {
  notification: NotificationProps;
  index: number;
  onMarkAsRead: (id: string) => void;
}) {
  const router = useRouter();
  const accent = getAccent(notification);
  const Icon = accent.icon;
  const unread = !notification.opened;

  const handleClick = () => {
    if (unread) onMarkAsRead(notification.id);
    if (notification.route) {
      router.push(convertAppRouteToWeb(notification.route, notification.params));
    }
  };

  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.24) }}
      whileHover={{ y: -1 }}
      className={cn(
        "group relative flex items-stretch gap-3 overflow-hidden rounded-2xl border p-3 text-left transition md:gap-4 md:p-4",
        unread
          ? "border-gray-300 bg-white shadow-[0_4px_16px_-10px_rgba(15,23,42,0.2)] hover:border-gray-400 hover:shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]"
          : "border-gray-200/70 bg-white/70 backdrop-blur-sm hover:border-gray-300 hover:bg-white",
      )}
    >
      <div
        className={cn(
          "w-1 shrink-0 rounded-full",
          unread ? accent.bar : "bg-gray-200",
        )}
      />

      <div
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 md:h-11 md:w-11",
          unread
            ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white ring-gray-900/20"
            : "bg-gray-50 text-gray-500 ring-gray-200",
        )}
      >
        <Icon size={16} />
        {unread && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-70",
                accent.dot,
              )}
            />
            <span
              className={cn(
                "relative inline-flex h-3 w-3 rounded-full ring-2 ring-white",
                accent.dot,
              )}
            />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase ring-1",
              accent.chip,
            )}
          >
            {typeLabel(notification.type)}
          </span>
          <p
            className={cn(
              "truncate text-sm",
              unread
                ? "font-semibold text-gray-900"
                : "font-medium text-gray-700",
            )}
          >
            {notification.title}
          </p>
        </div>
        {notification.subtitle && (
          <p className="mt-0.5 truncate text-[11px] text-gray-500">
            {notification.subtitle}
          </p>
        )}
        {notification.content && (
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-gray-600">
            {notification.content}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        <span
          className={cn(
            "text-[10px] whitespace-nowrap tabular-nums",
            unread ? "text-gray-600" : "text-gray-400",
          )}
        >
          {moment(notification.createdAt).fromNow()}
        </span>
        <div className="flex items-center gap-1.5">
          {unread && (
            <span
              onClick={handleMarkRead}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }
              }}
              className="hidden h-7 items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 text-[10px] font-semibold tracking-wider text-gray-600 uppercase transition hover:border-gray-300 hover:text-gray-900 md:inline-flex"
            >
              <Check size={10} />
              Marcar lida
            </span>
          )}
          {notification.route && (
            <ArrowRight
              size={14}
              className="text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-900"
            />
          )}
        </div>
      </div>
    </motion.button>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-stretch gap-3 rounded-2xl border border-gray-200/60 bg-white/60 p-4 md:gap-4"
        >
          <div className="w-1 shrink-0 rounded-full bg-gray-100" />
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-gray-100" />
            <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-gray-100" />
            <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-gray-100" />
          </div>
          <div className="h-3 w-12 animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ filter }: { filter: FilterKey }) {
  const Icon = filter === "UNREAD" ? BellOff : Bell;
  const title =
    filter === "UNREAD"
      ? "Tudo em dia"
      : filter === "READ"
        ? "Nenhuma notificação lida"
        : "Sem notificações";
  const body =
    filter === "UNREAD"
      ? "Você leu todas as novidades. Respira, tá tudo certo por aqui."
      : filter === "READ"
        ? "Quando você ler suas notificações, elas aparecem neste filtro."
        : "Avisos de reuniões, gravações e da sua conta aparecerão aqui.";
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg">
        <Icon size={26} />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{body}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/60 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg">
        <BellOff size={20} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-red-800">
        Não consegui carregar as notificações
      </h3>
      <p className="mt-1 max-w-sm text-xs text-red-700/80">{message}</p>
    </div>
  );
}
