import { Loader2, Dices, HelpCircle, Globe } from "lucide-react";

interface UtilityButtonsProps {
  mapRef: React.RefObject<any>;
  handleSurpriseMe: () => void;
  isSurprising: boolean;
  setHelpOpen: (open: boolean) => void;
}

export default function UtilityButtons({ mapRef, handleSurpriseMe, isSurprising, setHelpOpen }: UtilityButtonsProps) {  
  return (  
    <div className="fixed bottom-6 left-4 z-[999] flex flex-col gap-3 pointer-events-auto">
      <button
        onClick={() => mapRef.current?.resetView()}
        className="w-12 h-12 rounded-full bg-card/95 border-2 border-border flex items-center justify-center hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
        style={{ boxShadow: "2px 2px 8px hsl(25 30% 20% / 0.2)" }}
        title="Reset map view"
      >
        <Globe className="w-5 h-5 text-primary" />
      </button>
      <button
        onClick={handleSurpriseMe}
        disabled={isSurprising}
        className="w-12 h-12 rounded-full bg-card/95 border-2 border-border flex items-center justify-center hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
        style={{ boxShadow: "2px 2px 8px hsl(25 30% 20% / 0.2)" }}
        title="Surprise Me!"
      >
        {isSurprising ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <Dices className="w-5 h-5 text-primary" />
        )}
      </button>
      <button
        onClick={() => setHelpOpen(true)}
        className="w-12 h-12 rounded-full bg-card/95 border-2 border-border flex items-center justify-center hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
        style={{ boxShadow: "2px 2px 8px hsl(25 30% 20% / 0.2)" }}
        title="Help"
      >
        <HelpCircle className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
}