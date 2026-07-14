"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

/**
 * Aviso de gravação esquecida (trilha IA, visão 13/07):
 * 1. Lembretes em gravações longas — 1h, 1h30 e 2h ("ainda está gravando?"),
 *    com opt-out por gravação ("não avisar de novo").
 * 2. Detecção de silêncio — se não há áudio audível por ~7 minutos contínuos,
 *    avisa que a gravação continua rodando em silêncio.
 * NUNCA para a gravação sozinho (decisão da reunião: avisar, não parar).
 */

const LONG_RECORDING_MARKS_S = [3600, 5400, 7200]; // 1h, 1h30, 2h
const SILENCE_WINDOW_MS = 7 * 60 * 1000; // ~7 min sem áudio audível
const SILENCE_CHECK_INTERVAL_MS = 5000;
const SILENCE_RMS_THRESHOLD = 0.01; // abaixo disso = silêncio (0..1)

export function useRecordingWatchdog({
  isRecording,
  isPaused,
  duration,
  getStream,
}: {
  isRecording: boolean;
  isPaused: boolean;
  duration: number; // segundos
  getStream: () => MediaStream | null;
}) {
  const optedOutRef = useRef(false);
  const firedMarksRef = useRef<Set<number>>(new Set());
  const lastSoundAtRef = useRef<number>(Date.now());
  const silenceWarnedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset ao começar/terminar uma gravação
  useEffect(() => {
    if (isRecording) {
      optedOutRef.current = false;
      firedMarksRef.current = new Set();
      lastSoundAtRef.current = Date.now();
      silenceWarnedRef.current = false;
    }
  }, [isRecording]);

  // 1. Lembretes de gravação longa
  useEffect(() => {
    if (!isRecording || isPaused || optedOutRef.current) return;
    for (const mark of LONG_RECORDING_MARKS_S) {
      if (duration >= mark && !firedMarksRef.current.has(mark)) {
        firedMarksRef.current.add(mark);
        const horas = (mark / 3600).toFixed(1).replace(".0", "").replace(".", "h");
        const label = mark % 3600 === 0 ? `${mark / 3600}h` : `${horas}30`;
        toast(
          (t) => {
            return (
              <span className="text-sm">
                🎙️ Gravando há <strong>{label}</strong> — ainda está em
                reunião? A gravação continua normalmente.
                <button
                  onClick={() => {
                    optedOutRef.current = true;
                    toast.dismiss(t.id);
                  }}
                  className="ml-2 font-semibold underline"
                >
                  Não avisar de novo
                </button>
              </span>
            );
          },
          { duration: 15000, id: `long-rec-${mark}` },
        );
      }
    }
  }, [isRecording, isPaused, duration]);

  // 2. Detecção de silêncio prolongado
  useEffect(() => {
    if (!isRecording) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      return;
    }

    const stream = getStream();
    if (!stream) return;

    let analyser: AnalyserNode;
    let data: Uint8Array<ArrayBuffer>;
    try {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      data = new Uint8Array(new ArrayBuffer(analyser.fftSize));
    } catch {
      return; // sem suporte — watchdog de silêncio desativado silenciosamente
    }

    intervalRef.current = setInterval(() => {
      if (isPaused) {
        lastSoundAtRef.current = Date.now(); // pausa não conta como silêncio
        return;
      }
      analyser.getByteTimeDomainData(data);
      let sumSquares = 0;
      for (let i = 0; i < data.length; i++) {
        const normalized = (data[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / data.length);

      if (rms >= SILENCE_RMS_THRESHOLD) {
        lastSoundAtRef.current = Date.now();
        silenceWarnedRef.current = false;
        return;
      }

      const silentForMs = Date.now() - lastSoundAtRef.current;
      if (silentForMs >= SILENCE_WINDOW_MS && !silenceWarnedRef.current) {
        silenceWarnedRef.current = true;
        const minutos = Math.round(silentForMs / 60000);
        toast(
          `🔇 Não detectamos áudio há ~${minutos} minutos. A reunião acabou? A gravação continua rodando — pare quando quiser.`,
          { duration: 20000, id: "silence-warn" },
        );
        // Re-arma: se continuar em silêncio, avisa de novo daqui a outra janela
        lastSoundAtRef.current = Date.now();
      }
    }, SILENCE_CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [isRecording, isPaused, getStream]);
}
