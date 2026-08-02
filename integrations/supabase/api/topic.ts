import { supabase } from "@/integrations/supabase/client";

export async function fetchTopic(topic: string) {
  return supabase.functions.invoke("topic-rundown", {
    body: { topic },
  });
}
