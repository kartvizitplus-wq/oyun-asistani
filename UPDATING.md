# Weekly update procedure

Instruction set for the automated weekly run (a human can follow it too).

## 1. Game data
Files: `data/mlbb.json`, `data/hok.json`, `data/wildrift.json`, `data/brawlstars.json`, `data/freefire.json` (each has a `notes` field describing its schema).

For every game, research the latest official patch / balance notes (official site and channels, Liquipedia, reputable esports news):
- **New heroes / brawlers / characters**: add entries with the same fields as existing ones, keep the list alphabetical. Only add what sources confirm (role, damage type, main traits).
- **Buffs / nerfs / meta**: set `tier` to `S`, `A`, `B` or `C` only when a reliable source supports it (patch direction plus win rate or reputable tier list). Use `null` when unsure. Re-check existing tiers every week.
- **Items**: if an item in `archetypes`, a hero `build` or `counters` was removed or renamed, replace it with its current equivalent. Honor of Kings archetypes currently have empty `items` and category placeholders (`#cat_...`) in `counters`; replace them with exact item names once a reliable source confirms them.
- Update `updated` (YYYY-MM-DD) and `patch` where the file has it.
- Turkish item names for MLBB live in `data/mlbb-items-tr.json`.

## 2. Patch news (SEO content)
For each game that had a patch since the last article, add one file `data/news/YYYY-MM-DD-<game>-patch-<version>.json` with the same structure as the existing article:
- `slug`, `date`, `game` (mlbb, hok, wildrift, freefire, brawlstars), `sources` (names of sources used)
- `title`, `summary` and `body` in all five languages: tr, en, id, es, pt
- `body` blocks: `{"h": "heading"}`, `{"p": "paragraph"}`, `{"ul": ["item", ...]}`
- Write everything in our own words. Never copy sentences from sources; no quotes longer than a few words. Summarize: who was buffed, who was nerfed, reworks, item/map changes, and a short "our take" section that links the change to picks and builds. Do not invent numbers or changes.

## 3. Publish
Run `node build.js` (must finish without errors), commit with a message such as `Weekly update YYYY-MM-DD: <games and patches>`, and push to `main`. Cloudflare Pages redeploys automatically. Never commit `dist/`.
