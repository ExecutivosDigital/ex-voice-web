"use client";

import { HomeShell } from "../new-home/components/home-shell";
import { ModeCardsCor } from "../new-home/components/mode-cards-cor";

export default function NewHomeCor() {
  return <HomeShell ModeCardsComponent={ModeCardsCor} label="Cor" />;
}
