"use client";

import { cn } from "@/utils/cn";
import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
  const scrollYRef = useRef(0);

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    if (isOpen) {
      scrollYRef.current = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.position = "fixed";
      document.documentElement.style.top = `-${scrollYRef.current}px`;
      document.documentElement.style.left = "0";
      document.documentElement.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.top = "";
      document.documentElement.style.left = "";
      document.documentElement.style.right = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollYRef.current);
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.top = "";
      document.documentElement.style.left = "";
      document.documentElement.style.right = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlay = (
    <div
      className="fixed inset-0 z-[990] flex min-h-screen w-full cursor-pointer items-center justify-center overflow-hidden bg-black/20 p-4 backdrop-blur-[4px] transition-opacity duration-300 ease-in-out"
      style={{ height: "100dvh" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "relative z-20 flex max-h-[90vh] flex-col overflow-hidden rounded-md border border-stone-700 bg-stone-800 shadow-md",
          size ?? "h-[85vh] w-[90vw] xl:w-[50vw]",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
