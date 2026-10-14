# Weekly update procedure

Instruction set for the automated weekly run (a human can follow it too).

## 1. Game data
Files: `data/mlbb.json`, `data/hok.json`, `data/wildrift.json`, `data/brawlstars.json`, `data/freefire.json` (each has a `notes` field describing its schema).

For every game, research the latest official patch / balance notes (official site and channels, Liquipedia, reputable esports news):
- **New heroes / brawlers / characters**: add entries with the same fields as existing ones, keep the list alphabetical. Only add what sources confirm (role, damage type, main traits).
- **Buffs / nerfs / meta**: set `tier` to `S`, `A`, `B` or `C` only when a reliable source supports it (patch direction plus win rate or reputable tier list). Use `null` when unsure. Re-check existing tiers every week.
- **Items**: if an item in `archetypes`, a hero `build` or `counters` was removed or renamed, replace it with its current equivalent. Honor of Kings archetypes currently have empty `items` and category placeholders (`#cat_...`) in `counters`; replace them with exact item names once a reliable source confirms them.
- **Emblems / runes / gears**: MLBB archetypes carry `emblem` (set, t1, t2, core), Wild Rift archetypes carry `emblem.core` (keystone rune), Brawl Stars has `gears` per class. Update them when the game changes these systems. Honor of Kings Arcana is not added yet: add `emblem` entries to `data/hok.json` archetypes once a reliable source confirms current Arcana setups.
- Update `updated` (YYYY-MM-DD) and `patch` where the file has it.
- Turkish item names for MLBB live in `data/mlbb-items-tr.json`.

## 2. Articles (patch news, meta reports, hero guides)
All articles live in `data/news/` as one JSON file each, same structure as the existing article:
- `type`: `patch`, `meta` or `guide`; `slug`, `date`, `game` (mlbb, hok, wildrift, freefire, brawlstars), `sources` (names of sources used); guides also set `hero` (exact name as in the game data file, so the article links to the hero page)
- `title`, `summary` and `body` in all five languages: tr, en, id, es, pt. Each language is written naturally for its readers, not a word-for-word translation.
- `body` blocks: `{"h": "heading"}`, `{"p": "paragraph"}`, `{"ul": ["item", ...]}`

### Every week
1. **Patch news** (`type: patch`): one article per game that had a patch since its last patch article. File `YYYY-MM-DD-<game>-patch-<version>.json`. Cover buffs, nerfs, reworks, item/map changes and an "our take" section.
2. **Meta report** (`type: meta`): for up to 3 games, the ones with the most meaningful shifts this week. File `YYYY-MM-DD-<game>-meta.json`. Name the strongest picks per role with a one-sentence reason each, what rose and fell since the previous meta report (read it first), and one practical draft tip. If nothing really changed for a game since its last meta report, skip that game this week.
3. **Hero guides** (`type: guide`): 2 or 3 per week. File `YYYY-MM-DD-<game>-guide-<hero-slug>.json`. Pick heroes that are popular or just changed and that have no guide yet (check existing files). Sections: role and playstyle, recommended build and emblem/rune (consistent with the data files), skill combo or key tips, counters and who they counter (consistent with the site's engine), and what changed recently. Update the hero's data entry if research shows it is wrong.

### Quality rules (protect the site from Google's spam and low-value content policies)
- Every article must contain facts from this week's research with named sources in `sources`. No article without real information behind it.
- Write in our own words. Never copy sentences from sources; at most a few quoted words. Do not invent numbers, win rates, dates or changes.
- No filler: no generic intros, no repeated template paragraphs across articles, no keyword stuffing. Each article must give the reader something they can use in their next match.
- Do not publish two articles on the same topic. Before writing, read the titles of existing articles for that game.
- Quality over volume: if research turns up too little for an article, skip it. A week with 3 strong articles is better than 10 thin ones.
- Keep titles honest and specific (game, patch or week, hero name). No clickbait.

## 3. Publish
Run `node build.js` (must finish without errors), commit with a message such as `Weekly update YYYY-MM-DD: <games and patches>`, and push to `main`. Cloudflare Pages redeploys automatically. Never commit `dist/`.
