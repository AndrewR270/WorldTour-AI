"use client";

import { ExploreLocation } from "@/components/ExploreSidebar";

export default function useMapMarkers(exploreMarkers: ExploreLocation[]) {
  return exploreMarkers.map((loc) => ({
    lat: loc.lat,
    lng: loc.lng,
    name: loc.name,
  }));
}
