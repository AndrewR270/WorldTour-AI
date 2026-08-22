import { generateGeminiContent, jsonError } from "@/lib/server/gemini";

const systemPrompt = `
    You are an encyclopedia and cultural journalist. Given a topic, provide a rich, 
    engaging overview with these EXACT section headers (markdown ##):
    
    ## Overview
    What is this? A concise but vivid introduction. Include founding/creation date, origin, and key facts.
    
    ## Key Figures
    Important people associated with this topic. Names, roles, dates.
    
    ## Notable Achievements
    Major milestones, records, accomplishments, or contributions.
    
    ## Cultural Impact
    How has this topic influenced culture, society, or its field?
    
    ## Current Status
    What's happening now? Recent developments, current state.
    
    ## Fun Facts
    Surprising, lesser-known, or entertaining tidbits.
    
    ## Sources
    Provide exactly 3 real, relevant source URLs with a short label for each. Format as:
    - [Label](URL)
    
    Rules: bold important names, dates, and places; use bullet points; be vivid and conversational. 
    If the topic is a place, focus on what makes it unique beyond geography.
`;

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    if (typeof topic !== "string" || !topic.trim()) return jsonError("topic is required", 400);
    const content = await generateGeminiContent(systemPrompt, `Tell me about: ${topic.trim()}`);
    return Response.json({ content });
  } catch (error) {
    console.error("topic-rundown route error:", error);
    return jsonError(error instanceof Error ? error.message : "Unable to fetch topic information");
  }
}