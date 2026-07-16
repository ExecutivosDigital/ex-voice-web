import type { PreviewSegment } from "../mock/conversa-real";

/**
 * Lógica de sobreposição — compartilhada pelos 3 layouts.
 *
 * Fica fora dos componentes porque a pergunta em avaliação é "qual layout se lê
 * melhor", não "qual implementação está certa". Se cada layout calculasse
 * overlap do seu jeito, a comparação estaria medindo a diferença errada.
 */

/** Dois trechos se cruzam no tempo? */
export function cruzam(a: PreviewSegment, b: PreviewSegment): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Fala curta que não toma a palavra ("Isso.", "uhum", "pode ser também").
 *
 * A distinção importa: backchannel e interrupção são fenômenos diferentes e
 * merecem peso visual diferente. Um "uhum" de 0.7s tratado como turno inteiro
 * polui a leitura; uma interrupção de 20s tratada como nota de rodapé esconde
 * o que aconteceu.
 *
 * 1.5s + poucas palavras: medido na gravação real, os backchannels dela têm
 * 0.7s ("Isso.", "pode ser também") e os turnos mais curtos têm 2.3s.
 */
export function ehBackchannel(seg: PreviewSegment): boolean {
  const duracao = seg.end - seg.start;
  const palavras = seg.text.trim().split(/\s+/).length;
  return duracao < 1.5 && palavras <= 4;
}

/** Todos os trechos que cruzam com este (exceto ele mesmo). */
export function sobreposicoesDe(
  seg: PreviewSegment,
  todos: PreviewSegment[],
): PreviewSegment[] {
  return todos.filter((o) => o !== seg && cruzam(seg, o));
}

/** Interseção em segundos entre dois trechos. */
export function segundosCruzados(a: PreviewSegment, b: PreviewSegment): number {
  return Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));
}

export interface Metricas {
  duracao: number;
  overlapSegundos: number;
  overlapPct: number;
  backchannels: number;
  turnosSobrepostos: number;
  locutores: string[];
}

/**
 * Números da conversa, exibidos no preview para dar contexto a quem escolhe.
 *
 * O overlap conta LOCUTORES DISTINTOS ativos no mesmo instante — não segmentos.
 * Dois trechos do mesmo locutor se cruzando (o anotador/motor pode produzir
 * isso) não é conversa cruzada e inflaria o número.
 */
export function calcularMetricas(segs: PreviewSegment[]): Metricas {
  if (!segs.length) {
    return {
      duracao: 0,
      overlapSegundos: 0,
      overlapPct: 0,
      backchannels: 0,
      turnosSobrepostos: 0,
      locutores: [],
    };
  }

  const locutores = [...new Set(segs.map((s) => s.speaker))];
  const duracao = Math.max(...segs.map((s) => s.end));

  // Varredura de eventos, fundindo os trechos de cada locutor antes — assim um
  // locutor nunca conta duas vezes no mesmo instante.
  const eventos: [number, number][] = [];
  for (const loc of locutores) {
    const proprios = segs
      .filter((s) => s.speaker === loc)
      .sort((a, b) => a.start - b.start);
    let ini = proprios[0].start;
    let fim = proprios[0].end;
    for (const s of proprios.slice(1)) {
      if (s.start <= fim) {
        fim = Math.max(fim, s.end);
      } else {
        eventos.push([ini, 1], [fim, -1]);
        ini = s.start;
        fim = s.end;
      }
    }
    eventos.push([ini, 1], [fim, -1]);
  }
  eventos.sort((a, b) => a[0] - b[0]);

  let ativos = 0;
  let overlapSegundos = 0;
  let anterior = 0;
  for (const [t, delta] of eventos) {
    if (ativos >= 2) overlapSegundos += t - anterior;
    ativos += delta;
    anterior = t;
  }

  const sobrepostos = segs.filter((s) => sobreposicoesDe(s, segs).length > 0);

  return {
    duracao,
    overlapSegundos,
    overlapPct: duracao ? (overlapSegundos / duracao) * 100 : 0,
    backchannels: sobrepostos.filter(ehBackchannel).length,
    turnosSobrepostos: sobrepostos.filter((s) => !ehBackchannel(s)).length,
    locutores,
  };
}

/** mm:ss */
export function tempo(s: number): string {
  const m = Math.floor(s / 60);
  const seg = Math.floor(s % 60);
  return `${m}:${String(seg).padStart(2, "0")}`;
}

/** Cor estável por locutor (mesma nos 3 layouts, para não enviesar a escolha). */
const PALETA = [
  { bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-500", text: "text-indigo-700" },
  { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", text: "text-emerald-700" },
  { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", text: "text-amber-700" },
  { bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500", text: "text-rose-700" },
];

export function corDoLocutor(locutor: string, locutores: string[]) {
  const i = Math.max(0, locutores.indexOf(locutor));
  return PALETA[i % PALETA.length];
}
