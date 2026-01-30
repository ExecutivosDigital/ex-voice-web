"use client";

import type { NotificationProps } from "@/@types/general-client";
import { CustomPagination } from "@/components/ui/blocks/custom-pagination";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/utils/cn";
import { Bell, Loader2 } from "lucide-react";
import moment from "moment";

function NotificationCard({
  notification,
  onMarkAsRead,
}: {
  notification: NotificationProps;
  onMarkAsRead: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm",
        !notification.opened && "border-primary/20 bg-primary/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-sm font-medium text-neutral-800",
              !notification.opened && "font-semibold",
            )}
          >
            {notification.title}
          </h3>
          {notification.subtitle && (
            <p className="mt-0.5 text-xs text-neutral-500">
              {notification.subtitle}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-neutral-400">
            {moment(notification.createdAt).format("DD/MM/YYYY HH:mm")}
          </span>
          {!notification.opened && (
            <button
              type="button"
              onClick={() => onMarkAsRead(notification.id)}
              className="bg-primary/10 text-primary hover:bg-primary/20 rounded-lg px-2 py-1 text-xs font-medium"
            >
              Marcar como lida
            </button>
          )}
        </div>
      </div>
      {notification.content && (
        <p className="text-sm text-neutral-600">{notification.content}</p>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const {
    notifications,
    pages,
    page,
    loading,
    error,
    fetchNotifications,
    markAsRead,
  } = useNotifications({ poll: false });

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Notificações</h1>
        <p className="text-sm text-neutral-500">
          Todas as suas notificações em um só lugar
        </p>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-sm text-neutral-500">Carregando notificações...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 py-16">
          <Bell className="h-12 w-12 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-600">
            Nenhuma notificação
          </p>
          <p className="text-xs text-neutral-500">
            Novas notificações aparecerão aqui
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>
          {pages > 1 && (
            <CustomPagination
              pages={pages}
              currentPage={page}
              setCurrentPage={(p) => fetchNotifications(p)}
            />
          )}
        </>
      )}
    </div>
  );
}
