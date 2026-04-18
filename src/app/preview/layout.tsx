import type { ReactNode } from "react";
import {
  Geist,
  Inter,
  Instrument_Serif,
  Fraunces,
} from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--preview-font-geist",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--preview-font-inter",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--preview-font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--preview-font-fraunces",
  weight: ["300", "400", "500", "600"],
});

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${geist.variable} ${inter.variable} ${instrumentSerif.variable} ${fraunces.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
