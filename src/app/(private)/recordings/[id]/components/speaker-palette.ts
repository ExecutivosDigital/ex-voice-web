import { RecordingSpeakerProps } from "@/@types/general-client";

export type SpeakerStyle = {
  key: string;
  label: string;
  avatar: string;
  ring: string;
  bg: string;
  text: string;
  dot: string;
};

export const SPEAKER_PALETTE: SpeakerStyle[] = [
  {
    key: "indigo",
    label: "Índigo",
    avatar: "from-indigo-500 to-indigo-700",
    ring: "ring-indigo-200",
    bg: "bg-indigo-50/70",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  {
    key: "emerald",
    label: "Esmeralda",
    avatar: "from-emerald-500 to-emerald-700",
    ring: "ring-emerald-200",
    bg: "bg-emerald-50/70",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  {
    key: "amber",
    label: "Âmbar",
    avatar: "from-amber-500 to-amber-600",
    ring: "ring-amber-200",
    bg: "bg-amber-50/70",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  {
    key: "rose",
    label: "Rosa",
    avatar: "from-rose-500 to-rose-700",
    ring: "ring-rose-200",
    bg: "bg-rose-50/70",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
  {
    key: "sky",
    label: "Azul",
    avatar: "from-sky-500 to-sky-700",
    ring: "ring-sky-200",
    bg: "bg-sky-50/70",
    text: "text-sky-700",
    dot: "bg-sky-500",
  },
  {
    key: "violet",
    label: "Violeta",
    avatar: "from-violet-500 to-violet-700",
    ring: "ring-violet-200",
    bg: "bg-violet-50/70",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  {
    key: "teal",
    label: "Verde-água",
    avatar: "from-teal-500 to-teal-700",
    ring: "ring-teal-200",
    bg: "bg-teal-50/70",
    text: "text-teal-700",
    dot: "bg-teal-500",
  },
  {
    key: "orange",
    label: "Laranja",
    avatar: "from-orange-500 to-orange-600",
    ring: "ring-orange-200",
    bg: "bg-orange-50/70",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
];

export const PROFESSIONAL_STYLE: SpeakerStyle = {
  key: "professional",
  label: "Profissional",
  avatar: "from-neutral-500 to-neutral-900",
  ring: "ring-gray-900/15",
  bg: "bg-gradient-to-r from-gray-900/5 to-gray-900/0",
  text: "text-gray-900",
  dot: "bg-gray-900",
};

export function buildSpeakerStyleMap(
  speakers: RecordingSpeakerProps[] | undefined,
): Record<string, SpeakerStyle> {
  const map: Record<string, SpeakerStyle> = {};
  if (!speakers?.length) return map;

  const nonProfessional = speakers.filter((s) => !s.isProfessional);
  speakers.forEach((s) => {
    if (s.isProfessional) {
      map[s.id] = PROFESSIONAL_STYLE;
    } else {
      const idx = nonProfessional.findIndex((n) => n.id === s.id);
      map[s.id] = SPEAKER_PALETTE[Math.max(idx, 0) % SPEAKER_PALETTE.length];
    }
  });
  return map;
}

export function getSpeakerInitial(name: string | undefined | null): string {
  if (!name) return "?";
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return trimmed.charAt(0).toUpperCase();
}
