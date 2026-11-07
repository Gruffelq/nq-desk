# NQ Desk

Psych journal and morning briefing for NQ futures. A web app on GitHub Pages, installable on phone and desktop.

Everything is encrypted in the browser with a key that only the owner's password unlocks:

- the morning briefing (`data.enc.json`, written by the scheduled task with `encrypt.mjs`)
- the journal, stored as encrypted rows in Supabase (`supabase.sql`). Nothing is kept in the browser.

Files

- `index.html`: the app (lock screen, journal, news)
- `keys.json`: public key and the password-protected private key (made once with `setup.html`)
- `encrypt.mjs`: encrypts a plaintext briefing (`node encrypt.mjs data.json > data.enc.json`)
- `supabase.sql`: the database table and its access rule

Never commit a plaintext `data.json`.
