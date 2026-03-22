"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { cn } from "@/utils/cn";
import { Apple, ExternalLink, Smartphone } from "lucide-react";
import Image from "next/image";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.executivos.exvoice";
const APP_STORE_URL =
  "https://apps.apple.com/br/app/executivos-voice/id6754694679";

const QR_ANDROID_SRC = "/qrcode/androidqrcode.svg";
const QR_IOS_SRC = "/qrcode/iodqrcode.svg";

interface DownloadAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function QrImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[240px] rounded-3xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:max-w-[260px] lg:max-w-[280px]",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
        <Image
          src={src}
          alt={alt}
          width={400}
          height={400}
          className="h-full w-full object-contain"
          sizes="(max-width: 640px) 240px, (max-width: 1024px) 260px, 280px"
        />
      </div>
    </div>
  );
}

function StoreZone({
  platform,
  title,
  description,
  href,
  buttonLabel,
  accent,
  children,
}: {
  platform: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  accent: "android" | "ios";
  children: ReactNode;
}) {
  const isAndroid = accent === "android";

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col items-center rounded-[1.75rem] p-6 sm:p-8",
        "bg-white/[0.65] shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] ring-1 backdrop-blur-md transition",
        isAndroid
          ? "ring-emerald-500/15 hover:ring-emerald-500/25"
          : "ring-neutral-800/10 hover:ring-neutral-800/20",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-[0.55]",
          isAndroid
            ? "bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(42, 40, 45, 0.14),transparent_55%)]"
            : "bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(62, 60, 45, 0.08),transparent_55%)]",
        )}
      />
      <div className="relative flex w-full flex-col items-center">
        <div className="mb-6 flex w-full flex-col items-center gap-2 text-center sm:mb-8">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase",
              isAndroid
                ? "bg-emerald-500/10 text-emerald-800 ring-1 ring-emerald-600/20"
                : "bg-neutral-900/[0.06] text-neutral-800 ring-1 ring-neutral-800/12",
            )}
          >
            {isAndroid ? (
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                aria-hidden
              />
            ) : (
              <Apple className="h-3.5 w-3.5 opacity-90" aria-hidden />
            )}
            {platform}
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
            {title}
          </h3>
          <p className="max-w-[280px] text-sm leading-relaxed text-neutral-500 sm:max-w-none">
            {description}
          </p>
        </div>

        <div className="mb-8 flex w-full justify-center sm:mb-10">{children}</div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "relative inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold shadow-lg transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            isAndroid
              ? "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500"
              : "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-500",
          )}
        >
          {buttonLabel}
          <ExternalLink className="h-4 w-4 opacity-90" aria-hidden />
        </a>
      </div>
    </div>
  );
}

export function DownloadAppModal({
  open,
  onOpenChange,
}: DownloadAppModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden border-0 p-0 shadow-[0_25px_80px_-12px_rgba(0,0,0,0.45)]",
          "max-h-[min(92vh,880px)] max-w-[calc(100vw-1.25rem)]",
          "sm:max-w-[min(96vw,42rem)] md:max-w-[min(96vw,52rem)] lg:max-w-[min(96vw,64rem)]",
          "rounded-3xl",
        )}
      >
        {/* Hero */}
        <div className="relative overflow-hidden bg-neutral-950 px-6 pt-9 pb-8 text-white sm:px-10 sm:pt-10 sm:pb-9">
          <div
            className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-gray-500/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gray-500/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          <DialogHeader className="relative space-y-3 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 shadow-inner ring-1 ring-white/15 backdrop-blur-sm">
                  <Smartphone className="h-6 w-6" aria-hidden />
                </div>
                <div className="space-y-1.5">
                  <DialogTitle className="text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem] sm:leading-tight">
                    Baixar o aplicativo
                  </DialogTitle>
                  <DialogDescription className="max-w-xl text-[15px] leading-relaxed text-white/70">
                    Cada QR fica em uma área separada — aproxime o celular de{" "}
                    <span className="font-medium text-white/90">um de cada vez</span>{" "}
                    para a leitura ser precisa.
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Zonas amplas: muito espaço lateral entre os dois QRs em telas grandes */}
        <div className="relative bg-gradient-to-b from-neutral-100/90 via-neutral-50 to-white">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 to-transparent" />

          <div className="max-h-[min(62vh,560px)] overflow-y-auto px-4 py-8 sm:px-8 sm:py-10 lg:max-h-none lg:overflow-visible">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-12 xl:gap-20 2xl:gap-24">
              <StoreZone
                platform="Android"
                title="Google Play"
                description="Use o leitor de QR do Android. Mantenha só este código no enquadramento."
                href={PLAY_STORE_URL}
                buttonLabel="Abrir na Play Store"
                accent="android"
              >
                <QrImage
                  src={QR_ANDROID_SRC}
                  alt="QR Code para abrir o app na Google Play"
                  className="border-emerald-200/90 shadow-emerald-900/5"
                />
              </StoreZone>

              {/* Divisor só em desktop — reforça separação visual */}
              <div
                className="hidden shrink-0 lg:block lg:w-px lg:self-stretch lg:bg-gradient-to-b lg:from-transparent lg:via-neutral-300/70 lg:to-transparent"
                aria-hidden
              />

              <StoreZone
                platform="iOS"
                title="App Store"
                description="No iPhone ou iPad, use a Câmera ou o Centro de Controle. Isole um QR por vez."
                href={APP_STORE_URL}
                buttonLabel="Abrir na App Store"
                accent="ios"
              >
                <QrImage
                  src={QR_IOS_SRC}
                  alt="QR Code para abrir o app na App Store"
                  className="border-neutral-300/90"
                />
              </StoreZone>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
