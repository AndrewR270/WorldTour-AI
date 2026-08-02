import { Compass } from "lucide-react";

export default function HeaderLogo() {
  return (
    <div className="fixed top-4 md:top-6 left-0 z-[999] pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto ml-14 p-0 md:px-2">
        <div className="w-10 h-10 rounded bg-card/90 border-2 border-border flex items-center justify-center"
          style={{ boxShadow: "2px 2px 6px hsl(25 30% 20% / 0.15)" }}>
          <Compass className="w-5 h-5 text-primary" />
        </div>
        <div className="hidden sm:block">
          <h1 className="font-display text-xl font-bold text-foreground drop-shadow-md tracking-wide">
            WorldTour AI
          </h1>
          <p className="text-xs text-muted-foreground font-body italic drop-shadow-sm">
            The world is a book - start turning its pages!
          </p>
        </div>
      </div>
    </div>
  );
}