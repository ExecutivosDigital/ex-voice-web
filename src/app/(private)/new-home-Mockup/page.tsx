"use client";

import { HomeShell } from "../new-home/components/home-shell";
import { ModeCardsMockup } from "../new-home/components/mode-cards-mockup";

export default function NewHomeMockup() {
  return <HomeShell ModeCardsComponent={ModeCardsMockup} label="Mockup" />;
}
