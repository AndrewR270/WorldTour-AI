# World Tour

Explore and learn about the world through your own unique lens. Journey to anywhere on the map, or discover places associated with any topic you can dream of. The story of our world, visualized.

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
