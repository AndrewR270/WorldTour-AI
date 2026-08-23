export async function fetchWikipediaImage(title: string) {
  if (!title) return null;
  try {
    const encoded = encodeURIComponent(title.replace(/\s+/g, "_"));
    const resp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`);
    if (!resp.ok) return null;
    const data = await resp.json();
    // Prefer a larger thumbnail if available, fallback to originalimage
    const thumb = data?.thumbnail?.source;
    const original = data?.originalimage?.source;

    // If we have a thumbnail URL, try a list of safe sizes and return the first that responds 200.
    if (thumb) {
      const sizes = [640, 512, 400, 320, 200];
      for (const s of sizes) {
        try {
          const candidate = thumb.replace(/\/\d+px-/, `/${s}px-`);
          const head = await fetch(candidate, { method: "HEAD" });
          if (head.ok) return candidate;
        } catch (e) {
          // ignore and try next size
        }
      }
      // If none of the candidates worked, fall back to the provided thumbnail URL
      return thumb;
    }
    return original || null;
  } catch (err) {
    return null;
  }
}
