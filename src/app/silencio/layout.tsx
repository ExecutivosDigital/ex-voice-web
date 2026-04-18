import type { ReactNode } from "react";
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--silencio-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--silencio-serif",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export default function SilencioLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} ${fraunces.variable}`}>
      {children}
    </div>
  );
}
