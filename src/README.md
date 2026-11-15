# Bus Schedule Information System

React + TypeScript (Vite) frontend, Supabase (Postgres) as the backend/database.

## Setup
1. Create a Vite project, then replace its files with the ones here:
   ```bash
   npm create vite@latest bus-schedule-system -- --template react-ts
   cd bus-schedule-system
   npm install @supabase/supabase-js
   ```
   Copy `src/App.tsx`, `src/App.css`, `src/types.ts`, `src/lib/supabase.ts`
   into `src/`, and delete `src/index.css` (and its import in `src/main.tsx`).
2. In Supabase: SQL Editor > paste and run `schema.sql`.
3. Copy `.env.example` to `.env`, fill in the values from
   Supabase > Project Settings > API.
4. `npm run dev`
