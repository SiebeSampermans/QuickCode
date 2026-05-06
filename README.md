# QuickCode

QuickCode draait nu richting een `Vercel + Supabase` setup in plaats van `PHP + MySQL`.

## Wat is al omgezet

- `html/index.html` laadt het leaderboard uit Supabase
- `html/login.html` gebruikt Supabase Auth
- `html/register.html` gebruikt Supabase Auth en maakt een `profiles` record aan
- `html/singleplayer.html` kan je score opslaan in Supabase
- `vercel.json` routeert nette URLs zoals `/login` en `/singleplayer`
- `api/supabase-config.js` leest je Vercel environment variables uit

De oude PHP-bestanden staan nog in de repo als legacy referentie, maar zijn niet geschikt voor een gewone Vercel static deploy.

## Supabase setup

### 1. Maak een Supabase-project

Maak een nieuw project aan in Supabase.

### 2. Voer de SQL uit

Open de SQL editor in Supabase en voer `supabase/schema.sql` uit.

Dit maakt een `profiles` tabel met:

- `id`
- `username`
- `score`
- `created_at`

en zet Row Level Security policies klaar.

### 3. Zet e-mail login aan

Gebruik Supabase Auth met e-mail en wachtwoord.

Client-side gebruikt deze app:

- `signUp()`
- `signInWithPassword()`
- `getUser()`
- `signOut()`

Bronnen:

- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/reference/javascript/installing
- https://supabase.com/docs/guides/database/postgres/row-level-security

### 4. Zet je Vercel environment variables

Voeg in Vercel deze environment variables toe:

- `QUICKCODE_SUPABASE_URL`
- `QUICKCODE_SUPABASE_ANON_KEY`

Voorbeeld:

- `QUICKCODE_SUPABASE_URL=https://your-project-id.supabase.co`
- `QUICKCODE_SUPABASE_ANON_KEY=your-publishable-anon-key`

De site leest die waarden via `api/supabase-config.js`.

Let op:

- gebruik hier alleen je Supabase publishable/anon key
- gebruik nooit je secret key in de browser
- beveiliging hoort in je RLS policies te zitten

## Vercel deploy

Volgens de officiele Vercel docs gebruik je voor databases op Vercel meestal Marketplace-integraties zoals Supabase, waarbij credentials als environment variables kunnen worden toegevoegd. In deze repo worden die variables uitgelezen via een kleine Vercel API route.

Bronnen:

- https://vercel.com/docs/storage
- https://vercel.com/docs/marketplace-storage

### Deploy-stappen

1. Push deze repo naar GitHub
2. Import de repo in Vercel
3. Voeg in Vercel `QUICKCODE_SUPABASE_URL` en `QUICKCODE_SUPABASE_ANON_KEY` toe
4. Redeploy

## Belangrijk

De huidige `multiplayer` is nog steeds geen echte online multiplayer met room sync of realtime state. De pagina simuleert nog lokaal een tweede speler. Als je dat ook via Supabase wilt oplossen, is de logische volgende stap:

- Supabase Realtime of Broadcast gebruiken
- match rooms opslaan in tabellen
- live score/status synchroniseren tussen twee spelers
