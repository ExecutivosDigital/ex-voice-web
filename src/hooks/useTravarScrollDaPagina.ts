"use client";

import { useEffect } from "react";

/**
 * Trava o scroll da PÁGINA enquanto uma modal está aberta (bug apontado pelo
 * Victor 22/07: rolar dentro da modal rolava a tela de trás). Reserva o espaço
 * da barra de rolagem para a página não "pular" ao abrir.
 */
export function useTravarScrollDaPagina(ativo: boolean) {
  useEffect(() => {
    if (!ativo) return;
    const overflowAnterior = document.body.style.overflow;
    const paddingAnterior = document.body.style.paddingRight;
    const larguraBarra = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (larguraBarra > 0) document.body.style.paddingRight = `${larguraBarra}px`;
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.body.style.paddingRight = paddingAnterior;
    };
  }, [ativo]);
}
