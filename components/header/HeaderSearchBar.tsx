import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface HeaderSearchBarProps {
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
  topSearchQuery: string;
  setTopSearchQuery: (query: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  exploreOpen: boolean;
  setExploreOpen: (open: boolean) => void;
  exploreRef: React.RefObject<any>;
  setLastExploreQuery: (query: string) => void;
  fetchTopicRundown: (query: string) => void;
}

export default function HeaderSearchBar({ 
  searchFocused, 
  setSearchFocused, 
  topSearchQuery, 
  setTopSearchQuery, 
  setSidebarOpen, 
  setPanelOpen, 
  exploreOpen, 
  setExploreOpen, 
  exploreRef, 
  setLastExploreQuery, 
  fetchTopicRundown }: HeaderSearchBarProps) 
{ 
  return (  
    <div className="fixed top-4 md:top-6 inset-x-0 z-[999] flex justify-center pointer-events-none px-4">
      <motion.form
        className="pointer-events-auto w-full max-w-md"
        animate={{ scale: searchFocused ? 1.03 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onSubmit={(e) => {
          e.preventDefault();
          const q = topSearchQuery.trim();
          if (!q) return;
          setSidebarOpen(false);
          setPanelOpen(false);
          if (!exploreOpen) setExploreOpen(true);
          exploreRef.current?.setQueryAndSearch(q);
          setLastExploreQuery(q);
          setTopSearchQuery("");
          fetchTopicRundown(q);
        }}
      >
        <div className="relative">
          <input
            type="text"
            value={topSearchQuery}
            onChange={(e) => setTopSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search for anything in the world - see it on the map."
            className="w-full h-10 pl-4 pr-10 rounded bg-card/90 border-2 border-border text-sm font-body text-foreground placeholder:text-muted-foreground/60 placeholder:italic focus:outline-none focus:border-primary/60 backdrop-blur-sm transition-all duration-300"
            style={{
              boxShadow: searchFocused
                ? "0 4px 20px hsl(25 55% 35% / 0.25), inset 0 1px 2px hsl(25 30% 20% / 0.08)"
                : "2px 2px 6px hsl(25 30% 20% / 0.12)",
            }}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded flex items-center justify-center text-primary hover:text-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </motion.form>
    </div>
  );
}
