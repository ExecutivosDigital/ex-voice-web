"use client";

import { Select } from "./select";

/**
 * Seletor de hora — substituto do `<input type="time">` (que abre o picker
 * nativo do navegador, fora do tema do app).
 *
 * Passos de 15 min, o padrão de agendas (Google Calendar usa o mesmo). Se o
 * valor atual estiver fora do passo (ex.: "09:05" vindo de um registro
 * antigo), ele é injetado como opção — senão o campo pareceria vazio ao editar
 * uma reunião existente, e salvar sem mexer apagaria a hora real.
 */

const PASSO_MIN = 15;

function gerarOpcoes(): string[] {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += PASSO_MIN) {
      out.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      );
    }
  }
  return out;
}

const OPCOES = gerarOpcoes();

export function TimeSelect({
  value,
  onChange,
  placeholder = "--:--",
  className,
  disabled,
}: {
  /** Hora "HH:mm" (o mesmo formato do input nativo) ou vazio. */
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const lista =
    value && !OPCOES.includes(value)
      ? [...OPCOES, value].sort()
      : OPCOES;

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      options={lista.map((t) => ({ value: t, label: t }))}
    />
  );
}
