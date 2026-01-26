"use client";
import { cn } from "@/utils/cn";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: string;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  size,
  children,
  className,
}: ModalProps & { className?: string }) {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-0 z-[990] flex w-full cursor-pointer items-center justify-center bg-black/20 p-4 text-center backdrop-blur-[4px] transition-opacity duration-300 ease-in-out"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "relative z-20 flex flex-col overflow-hidden rounded-md border border-stone-700 bg-stone-800 shadow-md",
          size ? size : "h-[85vh] w-[90vw] xl:w-[50vw]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
