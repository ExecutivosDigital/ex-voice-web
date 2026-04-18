"use client";

import { HomeShell } from "../new-home/components/home-shell";
import { ModeCardsLogos } from "../new-home/components/mode-cards-logos";

export default function NewHomeLogos() {
  return <HomeShell ModeCardsComponent={ModeCardsLogos} label="Logos" />;
}
