import { generateGeminiContent, jsonError } from "@/lib/server/gemini";
import { fetchWikipediaImage } from "@/lib/wikipedia";

const systemPrompt = `
    Rules:
    You are a focused, to-the-point cultural historian describing a location.
    Keep responses short and informational.
    If your provided location is remote, identify the nearest notable town or city 
    and start with: "Nearest town: [Town Name, Country]".
    Within the response, encapsulate any important keywords, but not years, in double asterisks (**term**).

    Provide a concise summary for each of these headers. (markdown ##):

    ## Historical Significance
    Write a paragraph describing this location in history. 
    List no more than 5 bullet points of notable years and corresponding events. 

    ## Food & Cuisine
    No more than 4 traditional dishes.
    
    ## Culture & Arts
    3 specific examples from any of: music, art, festivals, cultural practices.
    
    ## Hidden Stories
    Folklore and legends from this area.
    
    ## Current News
    Recent notable events or developments.
    
    ## Issues & Challenges
    Provide a neutral, academic overview of existing environmental, political, or humanitarian challenges.
    
    ## Sources
    Provide exactly 3 real, relevant source URLs with a short label for each. Format as:
    - [Label](URL)
`;

// Use the shared Wikipedia helper to fetch thumbnails for responses.

export async function POST(request: Request) {
  try {
    const { locationName, lat, lng, searchQuery } = await request.json();

    if (typeof locationName !== "string" || typeof lat !== "number" || typeof lng !== "number") {
      return jsonError("locationName, lat, and lng are required", 400);
    }

    // 1. Kick off main content generation and image fetch simultaneously
    const contentPromise = generateGeminiContent(
      systemPrompt, 
      `Tell me about: ${locationName} (${lat}, ${lng})`
    );
    
    const imagePromise = fetchWikipediaImage(locationName).catch(() => null);

    // 2. Kick off search context in parallel if searchQuery exists
    const explorePromise = (typeof searchQuery === "string" && searchQuery.trim())
      ? generateGeminiContent(
          `Write one concise paragraph (2-3 sentences, max 50 words) explaining how a location relates to a search topic. No headers or bullets.`,
          `How does "${locationName}" relate to "${searchQuery.trim()}"?`
        ).catch(() => null)
      : Promise.resolve(null);

    // 3. Wait for all promises to settle together
    const [content, imageUrl, exploreContext] = await Promise.all([
      contentPromise,
      imagePromise,
      explorePromise
    ]);

    return Response.json({ content, imageUrl, exploreContext });
  } catch (error) {
    console.error("location-culture route error:", error);
    return jsonError(error instanceof Error ? error.message : "Unable to fetch location information");
  }
}