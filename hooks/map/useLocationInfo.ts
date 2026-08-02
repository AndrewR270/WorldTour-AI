"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { reverseGeocode } from "../../lib/map/reverseGeocode";

export default function useLocationInfo(addEntry: (name: string, lat: number, lng: number) => void) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [exploreContext, setExploreContext] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const handleLocationClick = useCallback(
    async (clickLat: number, clickLng: number, searchQuery?: string) => {
      setLat(clickLat);
      setLng(clickLng);
      setPanelOpen(true);
      setIsLoading(true);
      setContent(null);
      setImageUrl(null);
      setLocationName(null);
      setExploreContext(null);

      try {
        const fullName = await reverseGeocode(clickLat, clickLng);
        setLocationName(fullName);

        addEntry(fullName, clickLat, clickLng);

        const { data, error } = await supabase.functions.invoke("location-culture", {
          body: { locationName: fullName, lat: clickLat, lng: clickLng, searchQuery },
        });

        if (error) throw error;

        setContent(data.content);
        setImageUrl(data.imageUrl || null);
        setExploreContext(data.exploreContext || null);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to fetch info about this location");
        setContent("Work in progress! Cultural information retrieval will be running again soon.");
      } finally {
        setIsLoading(false);
      }
    },
    [addEntry]
  );

  return {
    panelOpen,
    setPanelOpen,
    locationName,
    content,
    imageUrl,
    exploreContext,
    isLoading,
    lat,
    lng,
    handleLocationClick,
  };
}
