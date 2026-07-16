/**
 * Conversa REAL para o preview dos layouts de transcricao.
 *
 * Gravacao de 16/07/2026 (Victor + Bruno + Madu, 99s), a primeira feita com a
 * captura em 2 canais. Foi deliberadamente carregada de fala simultanea — os
 * proprios participantes narram o teste no audio ("e um teste bem pesado").
 *
 * Numeros dela: 49.7s de sobreposicao em 99s (50% da gravacao). Antes da
 * captura em 2 canais o motor reportava ZERO sobreposicao, sempre.
 *
 * E dado real de proposito: o Joao e a Madu estao na conversa e vao ler a si
 * mesmos ao escolher o layout. Mock inventado esconderia justamente o que
 * torna o problema dificil (turnos de 20s empilhados, interjeicoes de 0.7s).
 */

export type PreviewChannel = "local" | "remote";

export interface PreviewSegment {
  speaker: string;
  channel: PreviewChannel;
  start: number;
  end: number;
  text: string;
}

/** Ordenados por inicio. Segmentos PODEM se cruzar no tempo — esse e o ponto. */
export const conversaReal: PreviewSegment[] = [
  {
    "speaker": "Victor",
    "channel": "local",
    "start": 2.62,
    "end": 28.96,
    "text": "Opa, Bruno, você tá ocupado? Tô fazendo mais uma gravação aqui pra testar essa questão de separação de áudio. E aí, né, pra gente validar que tá tudo funcionando, eu preciso que você me interrompa e que eu te interrompa e que a gente vá falando um por cima do outro. Isso, exatamente. Pra gente garantir que ele vai conseguir detectar que tem, tipo, realmente duas pessoas falando e não só, tipo,"
  },
  {
    "speaker": "Bruno",
    "channel": "remote",
    "start": 19.88,
    "end": 33.5,
    "text": "Ah, é para ficar te interrompendo aqui assim? Pode crer, pode crer. Ô Madu, desmuta aí e fala também, só pra gente testar aqui três pessoas com ânimas em tempo. Mas se"
  },
  {
    "speaker": "Victor",
    "channel": "local",
    "start": 31.52,
    "end": 32.18,
    "text": "pode ser também."
  },
  {
    "speaker": "Madu",
    "channel": "remote",
    "start": 33.56,
    "end": 35.9,
    "text": "eu falar em cima de vocês, será que vocês conseguem?"
  },
  {
    "speaker": "Victor",
    "channel": "local",
    "start": 34.68,
    "end": 35.42,
    "text": "Isso."
  },
  {
    "speaker": "Bruno",
    "channel": "remote",
    "start": 36.38,
    "end": 44.7,
    "text": "Exatamente isso aí, a gente precisa saber. É pra virar um caos mesmo assim, tá ligado? Eu tô falando ao mesmo tempo aqui. Caraca,"
  },
  {
    "speaker": "Victor",
    "channel": "local",
    "start": 37.1,
    "end": 49.82,
    "text": "Boa, ótimo. Virar ca... Isso! Mas daí, né?"
  },
  {
    "speaker": "Madu",
    "channel": "remote",
    "start": 44.76,
    "end": 47.44,
    "text": "não tem nem como isso aí funcionar, se funcionar."
  },
  {
    "speaker": "Bruno",
    "channel": "remote",
    "start": 47.9,
    "end": 60.12,
    "text": "Se funcionar vai ser incrível. Não entendi, imagina,"
  },
  {
    "speaker": "Victor",
    "channel": "local",
    "start": 53.36,
    "end": 59.72,
    "text": "Não, mas a ideia é essa, a ideia é fazer um teste aqui pra... Pra ver se... É..."
  },
  {
    "speaker": "Madu",
    "channel": "remote",
    "start": 60.32,
    "end": 69.32,
    "text": "não sei. Eu vim aqui porque eu falei, meu Deus, os meninos estão falando um em cima do outro e tá indo... Eu falei, caraca, como que eles estão se entendendo? Aí cheguei aqui..."
  },
  {
    "speaker": "Victor",
    "channel": "local",
    "start": 68.48,
    "end": 78.14,
    "text": "Não, mas é... Exatamente, esse é o ponto. Se a gente não tá, eu preciso ver o quanto que o meu teste aqui vai entender de fato, mas ou não."
  },
  {
    "speaker": "Bruno",
    "channel": "remote",
    "start": 79.14,
    "end": 99.04,
    "text": "Não, ele vai, vai. É, se ele conseguir separar, vai ser incrível. Vai ser muito louco. Fechou."
  },
  {
    "speaker": "Victor",
    "channel": "local",
    "start": 79.24,
    "end": 99.04,
    "text": "Mas beleza, é isso. É um teste bem pesado, bem complicado, né? Ia ser muito bom. Mas eu vou mandar esse aqui então pra ele. Dependendo, talvez eu volte pra fazer um teste um pouquinho mais simples. Fechou, valeu."
  }
];
