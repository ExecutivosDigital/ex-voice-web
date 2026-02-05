"use client";

import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface PromptIconProps {
  icon?: string;
  className?: string;
  size?: number;
}

/**
 * Renderiza o ícone de um prompt
 * Suporta:
 * - Nome de ícone Lucide (ex: "Camera", "FileText")
 * - SVG string (começa com "<svg")
 * - Fallback para logo quando não houver ícone
 */
export function PromptIcon({ icon, className = "", size = 20 }: PromptIconProps) {
  // Se não houver ícone, usa a logo como fallback
  if (!icon || icon.trim() === "") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Image
          src="/logos/iconWhite.png"
          alt="EX Voice"
          width={size}
          height={size}
          className="h-full w-full object-contain"
          unoptimized
        />
      </div>
    );
  }

  // Se for SVG string, renderiza diretamente
  if (icon.trim().startsWith("<svg")) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        dangerouslySetInnerHTML={{ __html: icon }}
        style={{ width: size, height: size }}
      />
    );
  }

  // Se for nome de ícone Lucide, tenta encontrar e renderizar
  const IconComponent = (LucideIcons as any)[icon] as LucideIcon | undefined;

  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }

  // Fallback final: logo
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/logos/iconWhite.png"
        alt="EX Voice"
        width={size}
        height={size}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
