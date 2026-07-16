"use client";

import { cn } from "@/utils/cn";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { PreviewSegment } from "../mock/conversa-real";
import { calcularMetricas, corDoLocutor, ehBackchannel, tempo } from "../lib/overlap";
import { cruzam } from "../lib/stacking";

/**
 * LAYOUT E — Agenda (ideia do João).
 *
 * "Tem a fala 1. Se a fala 1 só tem ela, ela ocupa o espaço inteiro. Se duas
 * pessoas falaram, essa aqui vem até o momento que a outra começou, e aí a fala
 * da outra começa e as duas descem juntos." — João, 16/07.
 *
 * É o layout C (colunas) COM eixo do tempo: em vez de duas colunas soltas lado a
 * lado, cada bloco fica na ALTURA do instante em que a fala aconteceu. Quando
 * alguém corta no meio, o bloco dele começa exatamente na altura do corte — que
 * é a crítica do Victor ao C ("eu não tenho claro quando que o Gabriel começou a
 * falar no meio dessa minha fala").
 *
 * É a mesma coisa que o Google Calendar faz com dois eventos no mesmo horário, e
 * o João apostou nisso justamente por ser familiar: "a galera já vai estar mais
 * acostumada por questão de agenda".
 *
 * O PREÇO, que o próprio João antecipou: "pode ser problemático se muitas
 * pessoas falarem ao mesmo tempo. Ah, cinco pessoas, vai começar a apertar
 * demais as falas". Com 2 é confortável; com 4+ as colunas ficam estreitas
 * demais para o texto.
 *
 * A ARMADILHA DA ALTURA MÍNIMA: altura proporcional ao tempo faria um "uhum" de
 * 0.7s virar 2 pixels — invisível. A tentação é dar uma altura mínima a todo
 * bloco, mas aí o bloco curto INVADE o seguinte (medido: colisão visível no
 * trecho de 0:44 da gravação de crosstalk). Trocar "sumir" por "colidir" não é
 * melhorar.
 *
 * A saída é a mesma dos outros layouts: interjeição não é turno e não merece um
 * bloco. Ela vira um marcador fino na coluna do locutor, no instante em que
 * aconteceu. Assim a altura continua honesta (é sempre o tempo) e nada colide.
 */

const ESCALAS = [1.5, 3, 6, 12]; // pixels por segundo

/**
 * Piso de VISIBILIDADE, não de leitura: 8px é o bastante para o bloco existir
 * como uma barra colorida.
 *
 * A tentação era dar altura suficiente para o texto (~22px). Mas aí um turno
 * curto invade o seguinte — medido: a fala da Madu de 2.6s (8px a 3px/s) subia
 * para 22px e colidia com o bloco do Bruno em 0:47. Trocar "sumir" por
 * "colidir" não melhora nada, e colisão num layout cuja PROMESSA é mostrar o
 * instante exato do corte é pior: ela mente sobre a coisa que o layout existe
 * para contar.
 *
 * Então a altura é sempre o tempo, e o texto aparece só quando cabe — o zoom
 * revela. Mesma regra do layout D.
 */
const ALTURA_MINIMA = 8;

interface Posicionado {
  seg: PreviewSegment;
  coluna: number;
  colunas: number;
}

/**
 * Agrupa por transitividade e distribui em colunas — o algoritmo clássico de
 * agenda. Se A cruza com B e B cruza com C, os três dividem a largura, mesmo
 * que A e C não se toquem: senão A e C ocupariam o mesmo espaço e B ficaria sem
 * lugar.
 *
 * Só TURNOS entram aqui. Interjeição não disputa coluna: um "uhum" de 0.7s
 * dividiria ao meio a largura de um turno de 26s inteiro — e, como o grupo é
 * conectado por transitividade, espremeria a conversa toda em volta. Ela é
 * desenhada por cima, no seu instante, que é semanticamente o que ela é: fala
 * curta POR CIMA do turno de outro.
 */
function posicionar(segmentos: PreviewSegment[]): Posicionado[] {
  const ordenados = [...segmentos]
    .filter((s) => !ehBackchannel(s))
    .sort((a, b) => a.start - b.start);
  const usados = new Set<PreviewSegment>();
  const out: Posicionado[] = [];

  for (const seg of ordenados) {
    if (usados.has(seg)) continue;

    // fecho transitivo
    const grupo = [seg];
    usados.add(seg);
    let cresceu = true;
    while (cresceu) {
      cresceu = false;
      for (const outro of ordenados) {
        if (usados.has(outro)) continue;
        if (grupo.some((g) => cruzam(g, outro))) {
          grupo.push(outro);
          usados.add(outro);
          cresceu = true;
        }
      }
    }

    // colunas dentro do grupo: primeira coluna livre
    grupo.sort((a, b) => a.start - b.start);
    const fimDaColuna: number[] = [];
    const colunaDe = new Map<PreviewSegment, number>();
    for (const g of grupo) {
      let c = fimDaColuna.findIndex((fim) => fim <= g.start);
      if (c === -1) {
        c = fimDaColuna.length;
        fimDaColuna.push(g.end);
      } else {
        fimDaColuna[c] = g.end;
      }
      colunaDe.set(g, c);
    }

    const colunas = Math.max(1, fimDaColuna.length);
    for (const g of grupo) {
      out.push({ seg: g, coluna: colunaDe.get(g) ?? 0, colunas });
    }
  }

  return out;
}

export function LayoutAgenda({ segmentos }: { segmentos: PreviewSegment[] }) {
  const m = calcularMetricas(segmentos);
  // 6px/s de partida: a 3px/s um turno de 2.6s vira 8px e nem o nome cabe.
  const [escala, setEscala] = useState(ESCALAS[2]);

  const posicionados = useMemo(() => posicionar(segmentos), [segmentos]);
  const altura = m.duracao * escala;

  const marcas = useMemo(() => {
    const passo = m.duracao > 300 ? 60 : 30;
    const out: number[] = [];
    for (let t = 0; t <= m.duracao; t += passo) out.push(t);
    return out;
  }, [m.duracao]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-500">
          A altura é o tempo. Quem corta no meio aparece na altura do corte.
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEscala((e) => ESCALAS[Math.max(0, ESCALAS.indexOf(e) - 1)])}
            disabled={escala === ESCALAS[0]}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
          >
            <Minus size={13} />
          </button>
          <span className="w-12 text-center text-[11px] text-gray-500">
            {escala}px/s
          </span>
          <button
            onClick={() => setEscala((e) => ESCALAS[Math.min(ESCALAS.length - 1, ESCALAS.indexOf(e) + 1)])}
            disabled={escala === ESCALAS[ESCALAS.length - 1]}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto rounded-2xl border border-gray-200 bg-white">
        <div className="relative flex">
          {/* Eixo do tempo */}
          <div className="relative w-12 shrink-0 border-r border-gray-100 bg-gray-50/50" style={{ height: altura }}>
            {marcas.map((t) => (
              <div key={t} className="absolute right-1.5 -translate-y-1/2" style={{ top: t * escala }}>
                <span className="text-[9px] tabular-nums text-gray-400">{tempo(t)}</span>
              </div>
            ))}
          </div>

          {/* Blocos */}
          <div className="relative flex-1" style={{ height: altura }}>
            {/* linhas guia do tempo */}
            {marcas.map((t) => (
              <div
                key={t}
                className="absolute inset-x-0 border-t border-dashed border-gray-100"
                style={{ top: t * escala }}
              />
            ))}

            {posicionados.map(({ seg, coluna, colunas }, i) => {
              const cor = corDoLocutor(seg.speaker, m.locutores);
              const top = seg.start * escala;
              const alturaReal = (seg.end - seg.start) * escala;

              // `alturaDoBloco`, e não `altura`: o container acima já usa esse
              // nome para a altura total da timeline.
              const alturaDoBloco = Math.max(ALTURA_MINIMA, alturaReal);
              const cabeNome = alturaDoBloco >= 18;
              const cabeTexto = alturaDoBloco > 44;

              return (
                <div
                  key={i}
                  title={`${seg.speaker} · ${tempo(seg.start)}–${tempo(seg.end)}\n${seg.text}`}
                  className={cn(
                    "absolute overflow-hidden rounded-lg border",
                    cabeNome ? "px-2 py-1" : "px-0 py-0",
                    cor.bg,
                    cor.border,
                  )}
                  style={{
                    top,
                    height: alturaDoBloco,
                    left: `${(coluna / colunas) * 100}%`,
                    width: `calc(${(1 / colunas) * 100}% - 4px)`,
                  }}
                >
                  {cabeNome && (
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", cor.dot)} />
                      <span className={cn("truncate text-[10px] font-semibold", cor.text)}>
                        {seg.speaker}
                      </span>
                      <span className="shrink-0 text-[9px] tabular-nums text-gray-400">
                        {tempo(seg.start)} – {tempo(seg.end)}
                      </span>
                    </div>
                  )}
                  {cabeTexto && (
                    <p className="mt-0.5 line-clamp-[8] text-[11px] leading-snug text-gray-600">
                      {seg.text}
                    </p>
                  )}
                </div>
              );
            })}

            {/*
              Interjeições por cima, no seu instante. Não disputam coluna (ver
              `posicionar`) e ficam sobre o turno — que é literalmente o que
              elas são: fala curta por cima da fala de outro.
            */}
            {segmentos.filter(ehBackchannel).map((seg, i) => {
              const cor = corDoLocutor(seg.speaker, m.locutores);
              return (
                <div
                  key={`bc-${i}`}
                  title={`${seg.speaker} · ${tempo(seg.start)}
"${seg.text}"`}
                  className="pointer-events-none absolute right-1 flex items-center gap-1 rounded bg-white/85 px-1"
                  style={{ top: seg.start * escala - 6 }}
                >
                  <span className={cn("h-2 w-1 shrink-0 rounded-full", cor.dot)} />
                  <span className="text-[9px] whitespace-nowrap text-gray-500 italic">
                    {seg.speaker}: &ldquo;{seg.text}&rdquo;
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400">
        Duas pessoas falando dividem a largura, como dois compromissos no mesmo
        horário — e a altura é sempre o tempo real. Falas curtas viram barras sem
        texto: aumente a escala para lê-las. Interjeições (&ldquo;uhum&rdquo;)
        aparecem como marcas à direita, sem disputar largura.
      </p>
    </div>
  );
}
