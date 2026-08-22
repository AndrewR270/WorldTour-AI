"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export default function useTopicRundown() {
  const [topicPanelOpen, setTopicPanelOpen] = useState(false);
  const [topicName, setTopicName] = useState<string | null>(null);
  const [topicContent, setTopicContent] = useState<string | null>(null);
  const [topicLoading, setTopicLoading] = useState(false);

  const fetchTopicRundown = useCallback(async (topic: string) => {
    setTopicPanelOpen(true);
    setTopicLoading(true);
    setTopicName(topic);
    setTopicContent(null);

    try {
      const response = await fetch("/api/topic-rundown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Topic request failed");
      setTopicContent(data.content);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch topic info.");
      setTopicContent("Work in progress! Topic information retrieval will be running again soon.");
    } finally {
      setTopicLoading(false);
    }
  }, []);

  const handleBoldClick = useCallback(
    (term: string, exploreOpen: boolean, setExploreOpen: (v: boolean) => void, exploreRef: any, setLastExploreQuery: any) => {
      if (!exploreOpen) setExploreOpen(true);
      exploreRef.current?.setQueryAndSearch(term);
      setLastExploreQuery(term);
      fetchTopicRundown(term);
    },
    [fetchTopicRundown]
  );

  return {
    topicPanelOpen,
    setTopicPanelOpen,
    topicName,
    topicContent,
    topicLoading,
    fetchTopicRundown,
    handleBoldClick,
  };
}
