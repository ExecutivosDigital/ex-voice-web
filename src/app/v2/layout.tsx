import type { ReactNode } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--v2-font",
  weight: ["300", "400", "500", "600", "700"],
});

export default function V2Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${poppins.variable} min-h-screen bg-neutral-50`}
      style={{ fontFamily: "var(--v2-font)" }}
    >
      {children}
    </div>
  );
}
