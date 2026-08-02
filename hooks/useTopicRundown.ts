"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase.functions.invoke("topic-rundown", {
        body: { topic },
      });

      if (error) throw error;
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
