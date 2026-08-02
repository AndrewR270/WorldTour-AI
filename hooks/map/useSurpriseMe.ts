"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { SURPRISE_LOCATIONS } from "@/lib/consts/surpriseLocations";

export default function useSurpriseMe(handleLocationClick: any) {
  const [isSurprising, setIsSurprising] = useState(false);

  const handleSurpriseMe = useCallback(async () => {
    if (isSurprising) return;

    setIsSurprising(true);
    const loc = SURPRISE_LOCATIONS[Math.floor(Math.random() * SURPRISE_LOCATIONS.length)];

    toast(`✨ Whisking you away to ${loc.name}...`);
    await handleLocationClick(loc.lat, loc.lng);

    setIsSurprising(false);
  }, [handleLocationClick, isSurprising]);

  return { isSurprising, handleSurpriseMe };
}
