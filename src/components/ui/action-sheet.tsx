"use client";

import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ActionSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;
  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/20 backdrop-blur-[1px] transition-all"
    >
      <div
        className={cn(
          "animate-slide-up w-full max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl",
          className,
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
