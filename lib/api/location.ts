export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const fallback = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(2)}°${lng >= 0 ? "E" : "W"}`;

  let geoData: any = null;

  for (const zoom of [10, 8, 6, 4, 3, 1]) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=${zoom}&accept-language=en`
    );

    if (!res.ok) continue;

    const next = await res.json();
    if (!next?.error) {
      geoData = next;

      const hasName =
        next?.name ||
        next?.address?.city ||
        next?.address?.town ||
        next?.address?.village ||
        next?.address?.county ||
        next?.address?.state ||
        next?.address?.country;

      if (hasName) break;
    }
  }

  const name =
    geoData?.address?.city ||
    geoData?.address?.town ||
    geoData?.address?.village ||
    geoData?.address?.county ||
    geoData?.address?.state ||
    geoData?.address?.country ||
    geoData?.name ||
    geoData?.display_name?.split(",").slice(0, 2).join(",").trim() ||
    fallback;

  const country = geoData?.address?.country || "";
  return country && name !== country ? `${name}, ${country}` : name;
}
