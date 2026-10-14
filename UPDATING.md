# Weekly data update procedure

This file is the instruction set for the automated weekly update run. A human can follow it too.

## Goal
Keep `data/mlbb.json` and `data/brawlstars.json` in line with the latest game patches, then rebuild and push.

## Steps
1. Research the most recent official patch / balance notes:
   - Mobile Legends: Bang Bang: official patch notes (Moonton site, official social channels, reputable esports news). Note the patch number.
   - Brawl Stars: latest balance changes and new brawlers (Supercell blog / official channels).
2. For each game update the data file:
   - **New heroes / brawlers**: add an entry with the same fields as existing ones (see each file's `notes`). Keep the list alphabetical.
   - **Buffs / nerfs and meta**: set `tier` to `S`, `A`, `B` or `C` only where at least one reliable source supports it (patch notes, tier lists from reputable sites, pro pick rates). Leave `null` when unsure. Re-check existing tiers each week; reset a tier to `null` when it is no longer supported.
   - **Item changes (MLBB)**: if an item in `archetypes` or a hero `build` was removed or renamed, replace it with its current equivalent. If a Turkish name is known, update `data/mlbb-items-tr.json`.
   - Update `updated` to today's date (YYYY-MM-DD) and `patch` (MLBB) to the patch number.
3. Do not invent data. Only change what sources confirm.
4. Run `node build.js` and make sure it finishes without errors.
5. Commit with a message like `Data update YYYY-MM-DD: MLBB patch X, Brawl Stars changes` listing the main changes, then push to `main`. Cloudflare Pages redeploys automatically.
6. Never commit the `dist/` folder.
