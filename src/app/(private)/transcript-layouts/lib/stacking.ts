import type { PreviewSegment } from "../mock/conversa-real";
import { cruzam } from "./overlap";

/**
 * Empilhamento de trechos em linhas — o truque do Audacity.
 *
 * Numa timeline horizontal, dois trechos que se cruzam no tempo ocupariam o
 * mesmo espaço. O Audacity resolve empurrando o segundo para a linha de baixo
 * (é o que se vê no print da sessão de anotação do Victor: os rótulos vão
 * "descendo" conforme a conversa se cruza).
 *
 * Este é o algoritmo clássico de "interval graph coloring" por varredura:
 * para cada trecho, usa a PRIMEIRA linha livre — ou seja, a primeira linha cujo
 * último trecho já terminou. Trechos que não se cruzam reaproveitam a linha, e
 * o número de linhas acaba sendo exatamente o máximo de vozes simultâneas.
 *
 * Isso importa: o número de linhas VIRA um dado visual. Uma conversa tranquila
 * ocupa 1 linha; o trecho onde os três se atropelam ocupa 3. A altura conta a
 * história sem ninguém precisar ler.
 */

export interface TrechoEmpilhado {
  seg: PreviewSegment;
  linha: number;
}

export interface Empilhamento {
  trechos: TrechoEmpilhado[];
  /** Quantas linhas foram necessárias = máximo de vozes simultâneas. */
  linhas: number;
}

export function empilhar(segmentos: PreviewSegment[]): Empilhamento {
  const ordenados = [...segmentos].sort((a, b) => a.start - b.start);
  const fimDaLinha: number[] = []; // fim do último trecho de cada linha
  const trechos: TrechoEmpilhado[] = [];

  for (const seg of ordenados) {
    // primeira linha cujo último trecho não cruza com este
    let linha = fimDaLinha.findIndex((fim) => fim <= seg.start);
    if (linha === -1) {
      linha = fimDaLinha.length;
      fimDaLinha.push(seg.end);
    } else {
      fimDaLinha[linha] = seg.end;
    }
    trechos.push({ seg, linha });
  }

  return { trechos, linhas: Math.max(1, fimDaLinha.length) };
}

/**
 * Empilha mantendo cada locutor na SUA faixa (uma raia por pessoa).
 *
 * Diferença para `empilhar`: ali a linha é só "onde coube"; aqui a raia É a
 * pessoa. Fica mais fácil seguir um locutor específico ao longo do tempo, ao
 * custo de altura fixa (uma raia por pessoa, mesmo quem fala pouco).
 *
 * Dentro da raia de um locutor, os trechos dele ainda podem se cruzar (o motor
 * pode emitir isso), então cada raia empilha internamente.
 */
export function empilharPorLocutor(
  segmentos: PreviewSegment[],
  locutores: string[],
): { raias: { locutor: string; trechos: TrechoEmpilhado[]; linhas: number }[] } {
  return {
    raias: locutores.map((locutor) => {
      const meus = segmentos.filter((s) => s.speaker === locutor);
      const { trechos, linhas } = empilhar(meus);
      return { locutor, trechos, linhas };
    }),
  };
}

/**
 * Trechos onde 2+ locutores DISTINTOS falam juntos — para pintar a régua.
 *
 * Distintos importa: dois trechos do mesmo locutor se cruzando não é conversa
 * cruzada e não deve acender a marca.
 */
export function faixasDeOverlap(
  segmentos: PreviewSegment[],
): { start: number; end: number; locutores: string[] }[] {
  const pontos = [
    ...new Set(segmentos.flatMap((s) => [s.start, s.end])),
  ].sort((a, b) => a - b);

  const faixas: { start: number; end: number; locutores: string[] }[] = [];
  for (let i = 0; i < pontos.length - 1; i++) {
    const a = pontos[i];
    const b = pontos[i + 1];
    if (b - a < 0.01) continue;
    const meio = (a + b) / 2;
    const ativos = [
      ...new Set(
        segmentos.filter((s) => s.start <= meio && meio < s.end).map((s) => s.speaker),
      ),
    ];
    if (ativos.length < 2) continue;

    // funde com a faixa anterior se for contínua e com os mesmos locutores
    const ultima = faixas[faixas.length - 1];
    if (
      ultima &&
      Math.abs(ultima.end - a) < 0.01 &&
      ultima.locutores.length === ativos.length &&
      ultima.locutores.every((l) => ativos.includes(l))
    ) {
      ultima.end = b;
    } else {
      faixas.push({ start: a, end: b, locutores: ativos });
    }
  }
  return faixas;
}

export { cruzam };
