"use client";

import type { NotificationProps } from "@/@types/general-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/blocks/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/utils/cn";
import { convertAppRouteToWeb } from "@/utils/route-mapper";
import { Bell, BellRing, Loader2 } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

function Item({
  notification,
  onMarkAsRead,
}: {
  notification: NotificationProps;
  onMarkAsRead: (id: string) => void;
}) {
  const router = useRouter();
  const handleClick = () => {
    if (!notification.opened) onMarkAsRead(notification.id);
    if (notification.route) {
      router.push(convertAppRouteToWeb(notification.route, notification.params));
    } else {
      router.push("/notifications");
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50",
        !notification.opened && "bg-gray-900/[0.03]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "text-sm text-gray-800",
            !notification.opened && "font-semibold",
          )}
        >
          {notification.title}
        </span>
        <span className="shrink-0 text-[11px] text-gray-400">
          {moment(notification.createdAt).fromNow()}
        </span>
      </div>
      {notification.content && (
        <p className="line-clamp-2 text-xs text-gray-500">
          {notification.content}
        </p>
      )}
    </button>
  );
}

export function MinimalNotificationBell() {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    markingAllAsRead,
    fetchNotifications,
  } = useNotifications({ poll: true });
  const router = useRouter();

  const hasUnread = unreadCount > 0;
  const Icon = hasUnread ? BellRing : Bell;

  return (
    <DropdownMenu onOpenChange={(open) => open && fetchNotifications(1)}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notificações"
          className={cn(
            "group relative flex h-10 w-10 items-center justify-center rounded-full border text-gray-700 transition-all",
            hasUnread
              ? "border-gray-900/10 bg-white shadow-[0_4px_14px_-4px_rgba(17,24,39,0.25)] hover:shadow-[0_6px_20px_-6px_rgba(17,24,39,0.35)]"
              : "border-gray-200 bg-white/70 backdrop-blur-sm hover:border-gray-300 hover:bg-white",
          )}
        >
          {hasUnread && (
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-gray-900/5 to-gray-900/0" />
          )}
          <Icon
            size={18}
            className={cn(
              "relative transition-transform",
              hasUnread && "animate-[swing_2.4s_ease-in-out_infinite] text-gray-900",
            )}
          />
          {hasUnread && (
            <>
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 px-1 text-[10px] font-bold text-white shadow-[0_2px_8px_-1px_rgba(239,68,68,0.5)] ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 animate-ping rounded-full bg-red-500/30" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="flex max-h-[min(460px,85vh)] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-xl shadow-gray-300/40"
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
          {hasUnread && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
              {unreadCount} novas
            </span>
          )}
        </div>

        <div
          className="max-h-[340px] min-h-0 overflow-y-auto overscroll-contain"
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
        >
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">
              {error}
            </p>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                <Bell size={20} />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                Sem notificações
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Avisos importantes aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.slice(0, 10).map((n) => (
                <Item
                  key={n.id}
                  notification={n}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1 border-t border-gray-100 p-2">
          {hasUnread && (
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={markingAllAsRead}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors",
                markingAllAsRead
                  ? "cursor-not-allowed text-gray-400"
                  : "text-gray-700 hover:bg-gray-50",
              )}
            >
              {markingAllAsRead && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {markingAllAsRead ? "Marcando..." : "Marcar todas como lidas"}
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/notifications")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 py-2 text-sm font-semibold text-white transition hover:scale-[1.01]"
          >
            Ver todas
          </button>
        </div>
      </DropdownMenuContent>

      <style jsx global>{`
        @keyframes swing {
          0%, 100% { transform: rotate(0); }
          20% { transform: rotate(-14deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-6deg); }
          80% { transform: rotate(3deg); }
        }
      `}</style>
    </DropdownMenu>
  );
}
