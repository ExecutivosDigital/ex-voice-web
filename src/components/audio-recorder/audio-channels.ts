/**
 * Contrato de canais do áudio gravado.
 *
 * ⚠ ISTO É UM CONTRATO ENTRE REPOS. Quem precisa concordar:
 *   - ex-voice-web        (aqui — grava)
 *   - voice-extension     (grava; tem cópia deste arquivo)
 *   - voice-ai-transcription/production/src/  (lê e transcreve cada canal)
 *
 * Se um lado inverter, NADA quebra visivelmente: a transcrição sai inteira,
 * só com os locutores trocados. É o pior tipo de bug — silencioso e plausível.
 * Por isso o valor está nomeado e centralizado em vez de espalhado como 0 e 1.
 *
 * Por que 2 canais: o microfone É o usuário local; o áudio da aba/tela É todo
 * mundo menos ele. Essa é a única informação de locutor que chega perfeita na
 * origem — antes de 16/07 a gente somava os dois num mono e mandava o motor
 * redescobrir por acústica (e ele não conseguia: reportava ZERO sobreposição
 * em 28.9s de fala cruzada real).
 */
export const AUDIO_CHANNEL = {
  /** Canal 0 / esquerdo — microfone: o usuário que está gravando. */
  LOCAL: 0,
  /** Canal 1 / direito — áudio da aba ou da tela: todos os outros participantes. */
  REMOTE: 1,
} as const;

/** Quantidade de canais do áudio gravado. */
export const AUDIO_CHANNEL_COUNT = 2;
