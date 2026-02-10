import {
    Activity,
    AlertCircle,
    AlertTriangle,
    Beaker,
    Briefcase,
    CalendarClock,
    CheckCircle,
    CheckCircle2,
    ChevronRight,
    Cigarette,
    ClipboardCheck,
    Clock,
    Dna,
    Download,
    FileOutput,
    FileSignature,
    FileText,
    GitBranch,
    History,
    Info,
    LucideIcon,
    Pill,
    User,
    UserPlus,
    Users,
    Wine,
} from "lucide-react";
import { Variant } from "../types/component-types";

// Mapeamento de strings de ícones para componentes do lucide-react
export const iconMap: Record<string, LucideIcon> = {
  pill: Pill,
  "file-output": FileOutput,
  "user-plus": UserPlus,
  "file-signature": FileSignature,
  "clipboard-check": ClipboardCheck,
  "file-text": FileText,
  "calendar-clock": CalendarClock,
  clock: Clock,
  user: User,
  "alert-circle": AlertCircle,
  activity: Activity,
  stethoscope: Briefcase,
  "alert-triangle": AlertTriangle,
  beaker: Beaker,
  info: Info,
  "git-branch": GitBranch,
  "check-circle": CheckCircle,
  "check-circle2": CheckCircle2,
  download: Download,
  "chevron-right": ChevronRight,
  history: History,
  users: Users,
  dna: Dna,
  cigarette: Cigarette,
  wine: Wine,
};

// Função para obter ícone por string
export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || FileText; // Fallback para FileText se não encontrar
}

// Mapeamento de variantes para classes Tailwind
export const variantStyles: Record<
  Variant,
  {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    iconText: string;
    gradientFrom: string;
    gradientTo: string;
    shadow: string;
  }
> = {
  emerald: {
    bg: "bg-emerald-50/30",
    border: "border-emerald-100",
    text: "text-emerald-600",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-500",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600",
    shadow: "shadow-emerald-200",
  },
  blue: {
    bg: "bg-gray-50/30",
    border: "border-gray-100",
    text: "text-gray-600",
    iconBg: "bg-gray-50",
    iconText: "text-gray-500",
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-600",
    shadow: "shadow-gray-200",
  },
  violet: {
    bg: "bg-violet-50/30",
    border: "border-violet-100",
    text: "text-violet-600",
    iconBg: "bg-violet-50",
    iconText: "text-violet-500",
    gradientFrom: "from-violet-500",
    gradientTo: "to-violet-600",
    shadow: "shadow-violet-200",
  },
  amber: {
    bg: "bg-amber-50/30",
    border: "border-amber-100",
    text: "text-amber-600",
    iconBg: "bg-amber-50",
    iconText: "text-amber-500",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600",
    shadow: "shadow-amber-200",
  },
  teal: {
    bg: "bg-teal-50/30",
    border: "border-teal-100",
    text: "text-teal-600",
    iconBg: "bg-teal-50",
    iconText: "text-teal-500",
    gradientFrom: "from-teal-500",
    gradientTo: "to-teal-600",
    shadow: "shadow-teal-200",
  },
  gray: {
    bg: "bg-gray-50/30",
    border: "border-gray-100",
    text: "text-gray-600",
    iconBg: "bg-gray-50",
    iconText: "text-gray-500",
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-600",
    shadow: "shadow-gray-200",
  },
  rose: {
    bg: "bg-rose-50/30",
    border: "border-rose-100",
    text: "text-rose-600",
    iconBg: "bg-rose-50",
    iconText: "text-rose-500",
    gradientFrom: "from-rose-500",
    gradientTo: "to-rose-600",
    shadow: "shadow-rose-200",
  },
  red: {
    bg: "bg-red-50/30",
    border: "border-red-100",
    text: "text-red-600",
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    gradientFrom: "from-red-500",
    gradientTo: "to-red-600",
    shadow: "shadow-red-200",
  },
  indigo: {
    bg: "bg-gray-50/30",
    border: "border-gray-100",
    text: "text-gray-600",
    iconBg: "bg-gray-100",
    iconText: "text-gray-600",
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-600",
    shadow: "shadow-gray-200",
  },
  orange: {
    bg: "bg-orange-50/30",
    border: "border-orange-100",
    text: "text-orange-600",
    iconBg: "bg-orange-50",
    iconText: "text-orange-500",
    gradientFrom: "from-orange-500",
    gradientTo: "to-orange-600",
    shadow: "shadow-orange-200",
  },
  purple: {
    bg: "bg-purple-50/30",
    border: "border-purple-100",
    text: "text-purple-600",
    iconBg: "bg-purple-50",
    iconText: "text-purple-500",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-600",
    shadow: "shadow-purple-200",
  },
  neutral: {
    bg: "bg-gray-50/30",
    border: "border-gray-100",
    text: "text-gray-600",
    iconBg: "bg-gray-50",
    iconText: "text-gray-400",
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-600",
    shadow: "shadow-gray-200",
  },
};

// Função para obter estilos de variante
export function getVariantStyles(variant: Variant = "neutral") {
  return variantStyles[variant];
}
