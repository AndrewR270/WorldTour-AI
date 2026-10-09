# World Tour

Explore and learn about the world through your own unique lens. Journey to anywhere on the map, or discover places associated with any topic you can dream of. The story of our world, visualized.

Visit and explore here!
https://world-tour-ai.vercel.app/

Watch a demo here!
https://youtu.be/kPvVLIWDY0g?si=xuYSdmt54gWGng9j

## Specs

- Framework: React + Next.js
- LLM Model: Gemini 3.5 Flash Lite
- Hosting: Vercel
- Map Integration: OpenStreetMaps & Leaflet.js
- Data Storage: localStorage (WIP)

## How it Works

### Architecture

Our page is stored in app/
AI endpoints are stored in app/api.
UI is stored in components/.
Helper functions for APIs are stored in lib/.

### Click and Find

1. Clicking on the map sends coordinates to a reverseGeocode function.
2. OpenStreetMaps finds a location for those coordinates.
3. The location-culture endpoint is called.
4. Gemini is queried for anthropological information through a lib function.
5. Information is returned on the location or its nearest relevant neighbor.

### Topics

1. Clicking on a hyperlinked topic enters that topic into the searchbar.
2. The topic-rundown endpoint is called.
3. Information is returned on the topic including an overview.

### Searching

1. Entering a term into a searchbar calls the explore-locations endpoint.
2. 10 relevant locations are returned.

## Dev Details

### Map tiles

The map uses the standard OpenStreetMap tile service and does not require an API
key. Keep the visible attribution on the map and follow the
[OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/);
the public tile service is best-effort and intended for moderate, interactive
use, not bulk downloads or prefetching.

### Install dependencies

```bash
npm install @supabase/supabase-js @tanstack/react-query leaflet react-leaflet lucide-react framer-motion zod clsx tailwind-merge tailwindcss-animate sonner date-fns next-themes @radix-ui/react-tooltip

npm install --save-dev @types/leaflet
```

### Architecture Overview

app/              ← frontend UI

backend/          ← AI logic
  functions/      ← AI endpoints (LLM orchestration, domain logic)

components/       ← UI building blocks

hooks/            ← UI + state logic

integrations/     ← external services
  supabase/       ← database client + types

lib/              ← internal utilities + domain helpers
