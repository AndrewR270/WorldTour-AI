import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface HelpModalProps {
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
}

export default function HelpModal({ helpOpen, setHelpOpen }: HelpModalProps) {
  return (
    <AnimatePresence>
      {helpOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
          onClick={() => setHelpOpen(false)}
        >
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-card journal-texture border-2 border-border rounded-lg max-w-md w-full p-6"
            style={{ boxShadow: "4px 4px 20px hsl(25 30% 20% / 0.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setHelpOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              What Is WorldTour?
            </h2>
            <p>
              <strong className="text-primary">📖 Our Mission:</strong> Explore and learn about the world through your own unique lens. Journey to anywhere on the map, or discover places associated with any topic you can dream of. This is the story of our world, visualized.
            </p>
            <p>
              <strong className="text-primary">🗺 Tap the map:</strong> Click anywhere on the map. Discover History, Food, Culture, Stories, News, and Issues associated with this place on earth. Perfect for studying specific locations and learning local lore.
            </p>
            <p>
              <strong className="text-primary">🔍 Search:</strong> Enter any (yes any) topic. See stories come alive through geography as WorldTour finds locations associated with your query.
            </p>
            <p>
              <strong className="text-primary">🔗 Clickable keywords:</strong> Bolded words in descriptions are clickable! Click any highlighted term to instantly search and explore it further.
            </p>
            <p>
              <strong className="text-primary">📑 Explore tab:</strong> Browse through a list of locations relevant to your query. Click any destination to fly there and see how it connects to your search!
            </p>
            <p>
              <strong className="text-primary">📗 History tab:</strong> Your personal journey log. Revisit any place you've explored before.
            </p>
            <p>
              <strong className="text-primary">🎲 Surprise Me:</strong> Roll the dice! Get whisked away to a random, fascinating destination.
            </p>
            <p>
              <strong className="text-primary">🌍 Reset view:</strong> Zoom out to see the full world map again.
            </p>
            <p>
              <strong className="text-primary">📚 Sources:</strong> Each description includes linked sources at the bottom for further reading.
            </p>
            <p className="mt-4 text-xs font-body italic text-muted-foreground text-center">
              Created by Andrew Rafal and Archith Erigineni.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}