/**
 * Logos das plataformas de reunião — PONTO ÚNICO para o produto inteiro
 * (card Online da home, modal online×presencial, badges de evento).
 *
 * ⚠ São desenhos aproximados, não os assets oficiais — o Victor vai trocar
 * pelos oficiais depois (22/07). Troque AQUI e o produto inteiro atualiza.
 */

export function LogoBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
      {children}
    </span>
  );
}

export function MeetLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M15 8v8l5 3V5l-5 3z" fill="#00ac47" />
      <path d="M3 6v12h9V6H3z" fill="#fff" />
      <path d="M3 6v12h9V6H3z" fill="none" stroke="#ea4335" strokeWidth="0" />
      <path d="M12 12l3-2v4l-3-2z" fill="#ffba00" />
      <path d="M3 6h9l-2 3H3V6z" fill="#4285f4" />
      <path d="M3 18h9l-2-3H3v3z" fill="#34a853" />
    </svg>
  );
}

export function ZoomLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#2D8CFF" />
      <path d="M6 9h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6V9z" fill="white" />
      <path d="M16 11l3-2v6l-3-2v-2z" fill="white" />
    </svg>
  );
}

export function TeamsLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="2" y="5" width="14" height="14" rx="2" fill="#4b53bc" />
      <text
        x="9"
        y="16"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="white"
        fontFamily="system-ui"
      >
        T
      </text>
      <circle cx="19" cy="9" r="3.5" fill="#7b83eb" />
      <circle cx="19" cy="9" r="1.5" fill="white" />
    </svg>
  );
}
