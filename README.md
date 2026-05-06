# QuickCode

QuickCode draait nu richting een `Vercel + Supabase` setup in plaats van `PHP + MySQL`.

## Wat is al omgezet

- `html/index.html` laadt het leaderboard uit Supabase
- `html/login.html` gebruikt Supabase Auth
- `html/register.html` gebruikt Supabase Auth + maakt een `profiles` record aan
- `html/singleplayer.html` kan je score opslaan in Supabase
- `vercel.json` routeert nette URLs zoals `/login` en `/singleplayer`

De oude PHP-bestanden staan nog in de repo als legacy referentie, maar zijn niet geschikt voor een gewone Vercel static deploy.

## Supabase setup

### 1. Maak een Supabase-project

Maak een nieuw project aan in Supabase.

### 2. Voer de SQL uit

Open de SQL editor in Supabase en voer [supabase/schema.sql](/c:/Users/siebe/OneDrive - Thomas More/Integration Skills/Project/QuickCode/supabase/schema.sql:1) uit.

Dit maakt een `profiles` tabel met:

- `id`
- `username`
- `score`
- `created_at`

en zet Row Level Security policies klaar.

### 3. Zet e-mail login aan

Gebruik Supabase Auth met e-mail en wachtwoord.

Volgens de officiële Supabase docs werken hiervoor client-side methodes zoals:

- `signUp()`
- `signInWithPassword()`
- `getUser()`
- `signOut()`

Bronnen:

- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/reference/javascript/installing
- https://supabase.com/docs/guides/database/postgres/row-level-security

### 4. Maak je lokale configbestand

Kopieer:

- `js/supabase-config.example.js`

naar:

- `js/supabase-config.js`

en vul in:

```js
window.QUICKCODE_SUPABASE_URL = "https://your-project-id.supabase.co";
window.QUICKCODE_SUPABASE_ANON_KEY = "your-publishable-anon-key";
```

`js/supabase-config.js` staat in `.gitignore` zodat je je echte key niet per ongeluk commit. Let op: de Supabase publishable/anon key is bedoeld voor client-side gebruik; beveiliging hoort in je RLS policies te zitten.

## Vercel deploy

Volgens de officiële Vercel docs gebruik je voor databases op Vercel meestal Marketplace-integraties zoals Supabase, waarbij credentials als environment variables kunnen worden toegevoegd in framework-projecten. In deze repo gebruiken we voorlopig een eenvoudige client-side configfile voor de statische site.

Bronnen:

- https://vercel.com/docs/storage
- https://vercel.com/docs/marketplace-storage

### Deploy-stappen

1. Push deze repo naar GitHub
2. Import de repo in Vercel
3. Zorg dat `js/supabase-config.js` aanwezig is in je project vóór je deployt
4. Deploy

## Belangrijk

De huidige `multiplayer` is nog steeds geen echte online multiplayer met room sync of realtime state. De pagina simuleert nog lokaal een tweede speler. Als je dat ook via Supabase wilt oplossen, is de logische volgende stap:

- Supabase Realtime of Broadcast gebruiken
- match rooms opslaan in tabellen
- live score/status synchroniseren tussen twee spelers
