export async function generateGeminiContent(systemInstruction: string, prompt: string) {
  // Fallback to gemini-3.6-flash if process.env.GEMINI_API_URL is missing
  const rawApiUrl = process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";
  const apiUrl = rawApiUrl.replace(/[;/"\s]+$/, ""); 
  const apiKey = process.env.GEMINI_KEY;

  // In development, allow a safe fallback so the app can be tested without
  // an actual Gemini API key. In production, require the key.
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      return `Dev fallback: no GEMINI_KEY provided. Prompt received:\n${prompt}`;
    }
    throw new Error("GEMINI_KEY is not configured");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        temperature: 0.1, // Low conversationality to speed up processing
        maxOutputTokens: 800, // Caps response length to prevent runaway generation
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${details}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "No information available.";
}

export function jsonError(message: string, status = 500) {
  return Response.json({ error: message }, { status });
}