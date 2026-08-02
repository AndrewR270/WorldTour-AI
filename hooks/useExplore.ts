"use client";

import { useState, useCallback } from "react";
import { ExploreLocation } from "@/components/ExploreSidebar";

export default function useExplore(handleLocationClick: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [exploreMarkers, setExploreMarkers] = useState<ExploreLocation[]>([]);

  const handleExploreSelect = useCallback(
    (location: ExploreLocation, searchQuery: string, mapRef: any) => {
      mapRef.current?.flyTo(location.lat, location.lng);
      handleLocationClick(location.lat, location.lng, searchQuery);
    },
    [handleLocationClick]
  );

  const handleExploreResults = useCallback((locations: ExploreLocation[]) => {
    setExploreMarkers(locations);
  }, []);

  const handleHistorySelect = useCallback(
    (entry: { locationName: string; lat: number; lng: number }) => {
      handleLocationClick(entry.lat, entry.lng);
      setSidebarOpen(false);
    },
    [handleLocationClick]
  );

  return {
    sidebarOpen,
    setSidebarOpen,
    exploreOpen,
    setExploreOpen,
    exploreMarkers,
    handleExploreSelect,
    handleExploreResults,
    handleHistorySelect,
  };
}
