"use client";

import { useGeneralContext } from "@/context/GeneralContext";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Loader2, Mic2, Sparkles } from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useRouter } from "next/navigation";

moment.locale("pt-br");

export function RecentRecordings() {
  const { recordings, isGettingRecordings } = useGeneralContext();
  const router = useRouter();

  const items = recordings.slice(0, 6);

  const handleOpen = (id: string) => {
    router.push(`/recordings/${id}`);
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
            Histórico
          </p>
          <h2 className="mt-1 text-xl font-semibold whitespace-nowrap text-gray-900 md:text-2xl">
            Últimas gravações
          </h2>
        </div>
        <button
          onClick={() => router.push("/recordings")}
          className="group flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          Ver todas
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {isGettingRecordings && items.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/40">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
            <Sparkles size={20} className="text-gray-500" />
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-800">
            Nenhuma gravação ainda
          </p>
          <p className="mt-1 max-w-xs text-xs text-gray-500">
            Comece agora — sua primeira gravação vai aparecer aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((rec, i) => (
            <motion.button
              key={rec.id}
              onClick={() => handleOpen(rec.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className={cn(
                "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 text-left transition",
                "shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-gray-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)]",
              )}
            >
              <div className="absolute inset-x-0 top-0 h-[2px] scale-x-0 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 transition-transform duration-500 group-hover:scale-x-100" />

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white">
                <Mic2 size={16} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {rec.name || "Sem título"}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                  {rec.description || "Sem descrição"}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {rec.duration || "--"}
                </span>
                <span>
                  {rec.createdAt ? moment(rec.createdAt).fromNow() : ""}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
}
