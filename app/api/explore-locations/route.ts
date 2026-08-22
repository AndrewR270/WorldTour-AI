import { generateGeminiContent, jsonError } from "@/lib/server/gemini";

export async function POST(request: Request) {
  try {
    const { query, exclude } = await request.json();
    if (typeof query !== "string" || !query.trim()) return jsonError("query is required", 400);

    const excluded = Array.isArray(exclude) && exclude.length ? `
        Do NOT include these locations: ${exclude.join(", ")}.` : "";
    
    const prompt = `
        Given the query "${query.trim()}", 
        return a JSON array of up to 10 real-world locations most relevant to it. ${excluded} 
        Each object must have "name" (location with country), "lat" (latitude number), "lng" (longitude number),
        and "description" (one short sentence). Return ONLY valid JSON array.
    `;

    const raw = await generateGeminiContent("Return precise, valid JSON only.", prompt);
    const match = raw.match(/\[[\s\S]*\]/);
    const locations = match ? JSON.parse(match[0]) : [];

    return Response.json({ locations: Array.isArray(locations) ? locations.slice(0, 10) : [] });

  } catch (error) {
    console.error("explore-locations route error:", error);
    return jsonError(error instanceof Error ? error.message : "Unable to explore locations");
  }
}