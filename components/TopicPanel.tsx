import {
  X, Loader2, BookOpen, Users, Trophy, Sparkles, Radio, Lightbulb, ChevronRight, ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, Fragment } from "react";

interface TopicPanelProps {
  isOpen: boolean;
  onClose: () => void;
  topicName: string | null;
  content: string | null;
  isLoading: boolean;
  hasLocationAbove: boolean;
  onBoldClick?: (term: string) => void;
}

const tabs = [
  { key: "overview", icon: BookOpen, label: "Overview" },
  { key: "figures", icon: Users, label: "Key Figures" },
  { key: "achievements", icon: Trophy, label: "Achievements" },
  { key: "impact", icon: Sparkles, label: "Impact" },
  { key: "status", icon: Radio, label: "Current" },
  { key: "funfacts", icon: Lightbulb, label: "Fun Facts" },
];

interface ParsedContent {
  sections: Record<string, string>;
  sources: { label: string; url: string }[];
}

function parseContent(content: string): ParsedContent {
  const sections: Record<string, string> = {};
  const sources: { label: string; url: string }[] = [];
  const sectionMap: Record<string, string> = {
    "overview": "overview",
    "key figures": "figures", "figures": "figures",
    "notable achievements": "achievements", "achievements": "achievements",
    "cultural impact": "impact", "impact": "impact",
    "current status": "status", "status": "status", "current": "status",
    "fun facts": "funfacts", "funfacts": "funfacts", "trivia": "funfacts",
    "sources": "sources",
  };

  let currentKey = "overview";
  let currentLines: string[] = [];

  for (const line of content.split("\n")) {
    const headerMatch = line.match(/^#+\s*\**\s*(.+?)\s*\**\s*$/);
    if (headerMatch) {
      if (currentLines.length) {
        if (currentKey === "sources") {
          for (const l of currentLines) {
            const linkMatch = l.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
            if (linkMatch) sources.push({ label: linkMatch[1], url: linkMatch[2] });
          }
        } else {
          sections[currentKey] = (sections[currentKey] || "") + currentLines.join("\n").trim() + "\n";
        }
      }
      const title = headerMatch[1].toLowerCase().replace(/[*#]/g, "").trim();
      currentKey =
        sectionMap[title] ||
        Object.entries(sectionMap).find(([k]) => title.includes(k))?.[1] ||
        currentKey;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  if (currentLines.length) {
    if (currentKey === "sources") {
      for (const l of currentLines) {
        const linkMatch = l.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
        if (linkMatch) sources.push({ label: linkMatch[1], url: linkMatch[2] });
      }
    } else {
      sections[currentKey] = (sections[currentKey] || "") + currentLines.join("\n").trim();
    }
  }
  return { sections, sources: sources.slice(0, 3) };
}

function RichLine({ text, onBoldClick }: { text: string; onBoldClick?: (term: string) => void }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong
            key={i}
            className={`text-foreground font-bold ${onBoldClick ? "text-primary underline decoration-primary/40 cursor-pointer hover:decoration-primary transition-colors" : ""}`}
            onClick={onBoldClick ? (e) => { e.stopPropagation(); onBoldClick(part.slice(2, -2)); } : undefined}
          >
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

function RichContent({ text, onBoldClick }: { text: string; onBoldClick?: (term: string) => void }) {
  const lines = text.split("\n").filter((l) => l.trim());
  const elements: JSX.Element[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (!bulletBuffer.length) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="space-y-1.5 my-2">
        {bulletBuffer.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/85 leading-relaxed font-reading">
            <ChevronRight className="w-3.5 h-3.5 mt-1 shrink-0 text-primary/60" />
            <span><RichLine text={b} onBoldClick={onBoldClick} /></span>
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*[-•*]\s+(.+)/);
    if (bulletMatch) {
      bulletBuffer.push(bulletMatch[1]);
    } else {
      flushBullets();
      elements.push(
        <p key={`p-${elements.length}`} className="text-sm text-foreground/85 leading-relaxed font-reading">
          <RichLine text={line} onBoldClick={onBoldClick} />
        </p>
      );
    }
  }
  flushBullets();
  return <div className="space-y-2.5">{elements}</div>;
}

function SourceLinks({ sources }: { sources: { label: string; url: string }[] }) {
  if (!sources.length) return null;
  return (
    <div className="px-5 py-3 border-t border-border shrink-0">
      <p className="text-xs text-muted-foreground font-display mb-1.5">Sources</p>
      <div className="flex flex-col gap-1">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 hover:underline transition-colors font-body truncate"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

const TopicPanel = ({
  isOpen, onClose, topicName, content, isLoading, hasLocationAbove, onBoldClick,
}: TopicPanelProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const parsed = useMemo(() => (content ? parseContent(content) : { sections: {}, sources: [] }), [content]);
  const activeContent = parsed.sections[activeTab];
  const activeTabMeta = tabs.find((t) => t.key === activeTab)!;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          className="fixed right-0 bottom-10 w-full max-w-[var(--panel-width)] bg-card journal-texture border-l-2 border-t-2 border-b-2 border-border rounded-l-xl z-[999] flex flex-col"
          style={{
            top: hasLocationAbove ? "50%" : "80px",
            boxShadow: "-4px 0 15px hsl(25 30% 20% / 0.15)",
          }}
        >
          {/* Header */}
          <div className="shrink-0 px-5 pt-4 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold text-foreground leading-tight truncate">
                    {topicName || (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Researching topic…
                      </span>
                    )}
                  </h2>
                  <span className="text-xs text-muted-foreground font-body italic">
                    Topic Overview
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded bg-card/80 border border-border text-muted-foreground hover:text-foreground hover:bg-card transition-all shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-border shrink-0">
            {tabs.map(({ key, icon: Icon, label }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-display tracking-wide whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary/60 text-secondary-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
                <p className="text-foreground font-display text-sm">Researching topic…</p>
                <p className="text-muted-foreground font-body text-xs italic">Gathering facts & stories</p>
              </div>
            ) : activeContent ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-5"
              >
                <RichContent text={activeContent} onBoldClick={onBoldClick} />
              </motion.div>
            ) : content ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground text-sm px-6">
                <activeTabMeta.icon className="w-7 h-7 text-muted-foreground/30" />
                <p className="text-center font-body italic">
                  No {activeTabMeta.label.toLowerCase()} info found for this topic.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-body italic">
                Search to learn about any topic
              </div>
            )}
          </div>

          {/* Sources */}
          {!isLoading && <SourceLinks sources={parsed.sources} />}

          {/* Footer */}
          <div className="px-5 py-2 border-t border-border shrink-0">
            <p className="text-xs text-muted-foreground font-body italic text-center">
              Powered by Gemini · Search to explore topics
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopicPanel;
