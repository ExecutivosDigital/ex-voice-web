import type { RecordingDetailsProps } from "@/@types/general-client";
import { jsPDF } from "jspdf";
import moment from "moment";

/**
 * Gera o PDF da gravação por código (jsPDF), sem passar pela janela de
 * impressão — era o único jeito de sumir com a URL e o "1/13" que o navegador
 * carimba no papel (feedback 20/07). Tipografia de documento, paginação nossa
 * no rodapé, texto selecionável.
 */

export interface OpcoesPdf {
  detalhes: boolean;
  resumo: boolean;
  acoes: boolean;
  transcricao: boolean;
}

interface CardDeNegocio {
  title: string;
  items: {
    primary: string;
    secondary?: string;
    metadata?: { label: string; value: string }[];
  }[];
}

// A4 em pontos (jsPDF default): 595 × 842
const MARGEM = 48;
const LARGURA = 595 - MARGEM * 2;
const LIMITE_Y = 842 - 64;

class Documento {
  doc = new jsPDF({ unit: "pt", format: "a4" });
  y = MARGEM;

  private quebraSePreciso(alturaLinha: number) {
    if (this.y + alturaLinha > LIMITE_Y) {
      this.doc.addPage();
      this.y = MARGEM;
    }
  }

  texto(
    conteudo: string,
    {
      tamanho = 10,
      negrito = false,
      cor = 40,
      espacoDepois = 4,
      recuo = 0,
    }: {
      tamanho?: number;
      negrito?: boolean;
      cor?: number;
      espacoDepois?: number;
      recuo?: number;
    } = {},
  ) {
    this.doc.setFont("helvetica", negrito ? "bold" : "normal");
    this.doc.setFontSize(tamanho);
    this.doc.setTextColor(cor);
    const linhas: string[] = this.doc.splitTextToSize(conteudo, LARGURA - recuo);
    const alturaLinha = tamanho * 1.35;
    for (const linha of linhas) {
      this.quebraSePreciso(alturaLinha);
      this.doc.text(linha, MARGEM + recuo, this.y);
      this.y += alturaLinha;
    }
    this.y += espacoDepois;
  }

  tituloDeSecao(rotulo: string) {
    this.y += 10;
    this.quebraSePreciso(24);
    this.texto(rotulo.toUpperCase(), { tamanho: 10, negrito: true, espacoDepois: 2 });
    this.doc.setDrawColor(30);
    this.doc.setLineWidth(0.8);
    this.doc.line(MARGEM, this.y - 2, MARGEM + LARGURA, this.y - 2);
    this.y += 8;
  }

  rodapes() {
    const paginas = this.doc.getNumberOfPages();
    const gerado = `Documento gerado pelo Executivos Voice em ${moment().format("DD/MM/YYYY [às] HH:mm")} · conteúdo transcrito e analisado por IA`;
    for (let p = 1; p <= paginas; p++) {
      this.doc.setPage(p);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(150);
      this.doc.text(gerado, MARGEM, 842 - 28);
      this.doc.text(`${p} de ${paginas}`, MARGEM + LARGURA, 842 - 28, {
        align: "right",
      });
    }
  }
}

/** Markdown do resumo → linhas de documento (títulos, bullets, texto corrido). */
function renderizarMarkdown(d: Documento, markdown: string) {
  const limpar = (t: string) => t.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").trim();
  for (const bruta of markdown.split("\n")) {
    const linha = bruta.trim();
    if (!linha) continue;
    if (/^#{1,6}\s/.test(linha)) {
      d.y += 4;
      d.texto(limpar(linha.replace(/^#{1,6}\s*/, "")), { tamanho: 11, negrito: true, espacoDepois: 2 });
    } else if (/^[-*]\s/.test(linha)) {
      d.texto(`•  ${limpar(linha.replace(/^[-*]\s*/, ""))}`, { recuo: 10, espacoDepois: 1 });
    } else if (/^\d+\.\s/.test(linha)) {
      d.texto(limpar(linha), { recuo: 10, espacoDepois: 1 });
    } else {
      d.texto(limpar(linha), { espacoDepois: 3 });
    }
  }
}

function tempoFala(segundos: number): string {
  return moment.utc(Math.max(0, segundos) * 1000).format("HH:mm:ss");
}

export function gerarPdfGravacao(
  recording: RecordingDetailsProps,
  cards: CardDeNegocio[],
  opcoes: OpcoesPdf,
) {
  const d = new Documento();

  // Cabeçalho do documento
  d.texto("EXECUTIVOS VOICE · REGISTRO DE REUNIÃO", {
    tamanho: 8,
    cor: 130,
    espacoDepois: 6,
  });
  d.texto(recording.name || "Gravação sem título", {
    tamanho: 17,
    negrito: true,
    cor: 15,
    espacoDepois: 6,
  });

  if (opcoes.detalhes) {
    const meta: string[] = [
      `Data: ${moment(recording.createdAt).format("DD [de] MMMM [de] YYYY, HH:mm")}`,
      `Duração: ${recording.duration || "--"}`,
    ];
    if (recording.client) meta.push(`Contato: ${recording.client.name}`);
    if (recording.department) meta.push(`Departamento: ${recording.department.name}`);
    if (recording.speakers?.length)
      meta.push(`Participantes: ${recording.speakers.map((s) => s.name).join(", ")}`);
    d.texto(meta.join("   ·   "), { tamanho: 9, cor: 90, espacoDepois: 2 });
    if (recording.description)
      d.texto(recording.description, { tamanho: 9, cor: 90, espacoDepois: 2 });
  }

  d.doc.setDrawColor(15);
  d.doc.setLineWidth(1.4);
  d.doc.line(MARGEM, d.y, MARGEM + LARGURA, d.y);
  d.y += 14;

  if (opcoes.resumo && recording.summary) {
    d.tituloDeSecao("Resumo");
    renderizarMarkdown(d, recording.summary);
  }

  if (opcoes.acoes && cards.length > 0) {
    d.tituloDeSecao("Ações e Próximos Passos");
    for (const card of cards) {
      d.texto(card.title, { tamanho: 10.5, negrito: true, espacoDepois: 2 });
      for (const item of card.items) {
        const extras = [
          item.secondary,
          item.metadata?.map((m) => `${m.label}: ${m.value}`).join(" · "),
        ]
          .filter(Boolean)
          .join(" — ");
        d.texto(`•  ${item.primary}${extras ? ` — ${extras}` : ""}`, {
          recuo: 10,
          espacoDepois: 1,
        });
      }
      d.y += 4;
    }
  }

  if (opcoes.transcricao && recording.speeches?.length) {
    d.tituloDeSecao("Transcrição");
    const nomes = new Map(recording.speakers?.map((s) => [s.id, s.name]) ?? []);
    for (const fala of recording.speeches) {
      d.texto(
        `${nomes.get(fala.speakerId) ?? "Locutor"}   ${tempoFala(fala.startTime)}`,
        { tamanho: 9, negrito: true, espacoDepois: 0 },
      );
      d.texto(fala.transcription, { tamanho: 9.5, cor: 60, espacoDepois: 6 });
    }
  }

  d.rodapes();

  const nomeArquivo = (recording.name || "gravacao")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  d.doc.save(`${nomeArquivo || "gravacao"}.pdf`);
}
