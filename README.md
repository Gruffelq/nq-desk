# NQ Desk

Private morning briefing for NQ futures, published with GitHub Pages.

The briefing is stored encrypted in `data.enc.json`. It can only be opened with the owner's password, entered on the page itself. The password never leaves the browser.

- `index.html`: the site
- `setup.html`: one-time page to create the password keys (`keys.json`)
- `encrypt.mjs`: encrypts a plaintext briefing with the public key (`node encrypt.mjs data.json > data.enc.json`)

Never commit a plaintext `data.json`.
