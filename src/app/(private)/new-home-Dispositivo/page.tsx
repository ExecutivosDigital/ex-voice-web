"use client";

import { HomeShell } from "../new-home/components/home-shell";
import { ModeCardsDispositivo } from "../new-home/components/mode-cards-dispositivo";

export default function NewHomeDispositivo() {
  return (
    <HomeShell ModeCardsComponent={ModeCardsDispositivo} label="Dispositivo" />
  );
}
