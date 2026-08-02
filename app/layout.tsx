"use client";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/system/sonner";
import { TooltipProvider } from "@/components/system/tooltip";

export const metadata = {
  title: "WorldTour AI",
  description: "Explore culture, history, and geography interactively.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider delayDuration={200}>
            <Toaster richColors closeButton />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
