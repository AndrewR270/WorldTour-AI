"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import InfoPanel from "@/components/InfoPanel";
import TopicPanel from "@/components/TopicPanel";
import SearchHistorySidebar from "@/components/SearchHistorySidebar";
import ExploreSidebar, { ExploreSidebarHandle } from "@/components/ExploreSidebar";
import HeaderLogo from "@/components/header/HeaderLogo";
import HeaderSearchBar from "@/components/header/HeaderSearchBar";
import UtilityButtons from "@/components/UtilityButtons";
import HelpModal from "@/components/HelpModal";

import { useSearchHistory } from "@/hooks/use-search-history";
import useLocationInfo from "@/hooks/useLocationInfo";
import useTopicRundown from "@/hooks/useTopicRundown";
import useExplore from "@/hooks/useExplore";
import useSurpriseMe from "@/hooks/useSurpriseMe";
import useMapMarkers from "@/hooks/useMapMarkers";

// Leaflet must be dynamically imported (SSR disabled)
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });
import type { MapViewHandle } from "@/components/MapView";

export default function Page() {
  // Refs
  const exploreRef = useRef<ExploreSidebarHandle>(null);
  const mapRef = useRef<MapViewHandle>(null);

  // Search history
  const { history, addEntry, clearHistory, removeEntry } = useSearchHistory();

  // Location info hook
  const {
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
  } = useLocationInfo(addEntry);

  // Topic rundown hook
  const {
    topicPanelOpen,
    setTopicPanelOpen,
    topicName,
    topicContent,
    topicLoading,
    fetchTopicRundown,
    handleBoldClick,
  } = useTopicRundown();

  // Explore hook
  const {
    sidebarOpen,
    setSidebarOpen,
    exploreOpen,
    setExploreOpen,
    exploreMarkers,
    handleExploreSelect,
    handleExploreResults,
    handleHistorySelect,
  } = useExplore(handleLocationClick);

  // Surprise me hook
  const { isSurprising, handleSurpriseMe } = useSurpriseMe(handleLocationClick);

  // Map markers derived from explore results
  const mapMarkers = useMapMarkers(exploreMarkers);

  // UI state
  const [topSearchQuery, setTopSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [lastExploreQuery, setLastExploreQuery] = useState("");

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Map */}
      <MapView
        ref={mapRef}
        onLocationClick={handleLocationClick}
        markers={mapMarkers}
        onMarkerClick={(m) => handleLocationClick(m.lat, m.lng)}
      />

      {/* Search history sidebar */}
      <SearchHistorySidebar
        isOpen={sidebarOpen}
        hidden={exploreOpen}
        onToggle={() => {
          setSidebarOpen((o) => !o);
          setExploreOpen(false);
        }}
        history={history}
        onSelect={handleHistorySelect}
        onRemove={removeEntry}
        onClear={clearHistory}
      />

      {/* Explore sidebar */}
      <ExploreSidebar
        ref={exploreRef}
        isOpen={exploreOpen}
        hidden={sidebarOpen}
        onToggle={() => {
          setExploreOpen((o) => !o);
          setSidebarOpen(false);
        }}
        onSelect={(loc, q) => {
          setPanelOpen(false);
          setTopicPanelOpen(false);
          handleExploreSelect(loc, q, mapRef);
        }}
        onResults={handleExploreResults}
        onSearch={(q) => {
          setPanelOpen(false);
          setTopicPanelOpen(false);
          setLastExploreQuery(q);
          fetchTopicRundown(q);
        }}
      />

      {/* Logo */}
      <HeaderLogo />

      {/* Search bar */}
      <HeaderSearchBar
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        topSearchQuery={topSearchQuery}
        setTopSearchQuery={setTopSearchQuery}
        setSidebarOpen={setSidebarOpen}
        setPanelOpen={setPanelOpen}
        exploreOpen={exploreOpen}
        setExploreOpen={setExploreOpen}
        exploreRef={exploreRef}
        setLastExploreQuery={setLastExploreQuery}
        fetchTopicRundown={fetchTopicRundown}
      />

      {/* Floating buttons */}
      <UtilityButtons
        mapRef={mapRef}
        handleSurpriseMe={handleSurpriseMe}
        isSurprising={isSurprising}
        setHelpOpen={setHelpOpen}
      />

      {/* Help modal */}
      <HelpModal helpOpen={helpOpen} setHelpOpen={setHelpOpen} />

      {/* Topic panel */}
      <TopicPanel
        isOpen={topicPanelOpen}
        onClose={() => setTopicPanelOpen(false)}
        topicName={topicName}
        content={topicContent}
        isLoading={topicLoading}
        hasLocationAbove={panelOpen}
        onBoldClick={(term) => handleBoldClick(term, exploreOpen, setExploreOpen, exploreRef, setLastExploreQuery)}
      />

      {/* Location info panel */}
      <InfoPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        locationName={locationName}
        content={content}
        isLoading={isLoading}
        lat={lat}
        lng={lng}
        exploreContext={exploreContext}
        hasTopicBelow={topicPanelOpen}
        onBoldClick={(term) => handleBoldClick(term, exploreOpen, setExploreOpen, exploreRef, setLastExploreQuery)}
      />
    </div>
  );
}