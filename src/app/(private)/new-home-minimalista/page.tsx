"use client";

import { HomeShell } from "../new-home/components/home-shell";
import { ModeCardsMinimalista } from "../new-home/components/mode-cards-minimalista";

export default function NewHomeMinimalista() {
  return (
    <HomeShell ModeCardsComponent={ModeCardsMinimalista} label="Minimalista" />
  );
}
