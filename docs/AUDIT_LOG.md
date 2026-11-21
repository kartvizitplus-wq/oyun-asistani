# Site audit log (maintenance bot)

Technical SEO, AI visibility, usability and ad-readiness checks. Content (patch news, guides) is handled by the weekly bot (UPDATING.md).

## 2026-11-20 (owner request): games redesign, Red Scarf, new home page
**Added:** Red Scarf (ninja stealth game in a generated labyrinth, `/xx/red-scarf/`, 5 languages); shared character painter `src/chibi.js`; stories for every game (`src/stories.json`) shown on each game page; animated home-page covers (`src/home.js`).
**Changed:** Night Drop now a neon rain city with a sonar mechanic; MOBA games got three worlds (sky islands with night fog, ink-painted seasons, volcanic arena with rising lava); all characters redrawn as faced figures; new home page (featured banner + cards with live covers + teasers).
**Checked:** clean build (50 pages), no JS errors on home and game pages at 390 px and 1280 px, no horizontal scroll, Red Scarf takedowns/traps/death/level-clear tested headless.

## 2026-11-20 (owner request): PickRadar is now a games site
**Why:** owner reports search traffic had fallen to about zero and asked to turn the whole site into a browser-games site (explicit exception to the "no traffic drop" rule in POLICY.md).
**Added:** five original games in 5 languages: Night Drop (top-down battle royale vs 11 bots), Crown Clash (5v5 MOBA, 3 lanes), Jade Lanes (3v3 MOBA, 2 lanes), Duel Peak (1v1 MOBA duel), Color Gradient (puzzle). MOBA games share one engine (`src/moba.js`, set-ups in `src/moba.json`).
**Changed:** new home page (game cards), header menu = games, footer, About and Privacy texts (`src/site.json`), llms.txt, manifest.
**Removed:** hero, tier-list, draft, tool, news and guide pages are no longer built (`LEGACY = false` in build.js; data files kept). `_redirects` sends old sections with 301 to the matching game (mlbb → crown-clash, honor-of-kings → jade-lanes, wild-rift → duel-peak, free-fire → night-drop, brawl-stars/news/guide → home).
**Bots:** the weekly content/update bots must stay paused: their work (hero data, news) is no longer published.
**Checked:** clean build (45 pages), 0 broken internal links, every page loads without JS errors at 390 px and 1280 px, full bot-vs-bot matches end correctly in all games.

## 2026-11-20 (owner request, earlier)
**Added:** Color Gradient, a small hue-sorting puzzle game, as a new standalone page in 5 languages: `/en|tr|id|es|pt/color-gradient/` (own script `src/colorgame.js`, texts `src/colorgame.json`, styles inline on the page). Owner asked for it explicitly, as an exception to "no new page types".
**Not changed:** no existing page, title, menu, footer or internal link was touched; the build diff vs. before is only the 5 new pages, `assets/colorgame.js` and 5 new sitemap entries. The page is reachable via the sitemap only until the owner decides whether to link it.
**Checked:** `node build.js` (2,960 pages); headless play-test at 390 px and 1280 px: levels 1–9 solved, drag and tap-to-swap work, progress survives reload, no horizontal scroll, no JS errors, all 5 languages load.

## 2026-11-09 (maintenance bot)
**Checked:** `node build.js` (2,955 pages, OK); static audit (0 broken internal links, JSON-LD valid, canonical everywhere except 404, no undefined/NaN); live = build (robots.txt, sitemap, llms.txt, ads.txt identical); all 2,955 sitemap URLs 200 (incl. today's Brawl Stars November article); real 404; headless 360 px on EN/TR homes and 10 random hero/brawler/news pages in 4 languages: no overflow, canonical = URL, no JS errors.
**Monday Google re-read:** not done this run: WebFetch was blocked by an unanswered permission prompt for all six pages (no workaround used). POLICY.md left as reviewed on 2026-11-02; retry next Monday.
**Fixed:** nothing needed.
**AdSense readiness:** ~35%. Blockers unchanged: (1) ~2,800 template hero/brawler/character pages vs ~20 articles per language; (2) About does not name who runs the site; (3) tool pages mostly JS; (4) CMP not live.
**Proposals (owner):** name a person or business on About; decide on noindexing hero pages without a kit summary (`sd`) or sourced matchups.

## 2026-11-09 (weekly content bot)
**Changed pages with possible impressions (additive only, no title/URL/structure changes):** kit summaries (`sd`) added to Honor of Kings Chano and Dolia (from hokstats.gg). New article: Brawl Stars November 2026 update. Check these pages in Search Console around 2026-11-16.
**Not done this week (sources unreachable from the bot: mlbbhub, mlcounters, brawlify, brawltime.ninja, hokbuild, fandom, wildriftcore, seemeta):** tier list refreshes, MLBB `wr` refresh (mlcounters data of 2026-10-14 turns 30 days old on 2026-11-13; remove it next run if it cannot be refreshed), Surge `mu` re-check, hero guides (no sourced build/matchup data). No new patches for MLBB (2.2.16a), HoK (S16) or Free Fire (OB56 not yet live); Wild Rift 7.3e (Nov 4) is ARAM augments only.

## 2026-11-06 (maintenance bot)
**Checked:** `node build.js` (2,950 pages, OK); static audit (0 broken internal links, JSON-LD valid, canonical everywhere, no undefined/NaN); live = build (llms.txt, robots.txt, ads.txt, sitemap identical); all 2,950 sitemap URLs 200; real 404; headless 360 px on EN/TR homes, MLBB hub, About/Privacy/Contact and 10 random pages in 5 languages: no overflow, canonical = URL, no page JS errors (only Cloudflare beacon / Google CSP report-only console notices).
**Fixed:** nothing needed.
**AdSense readiness:** ~35%. Blockers unchanged: (1) ~2,800 template hero/brawler/character pages vs ~20 articles per language; (2) About does not name who runs the site; (3) tool pages mostly JS; (4) CMP not live.
**Proposals (owner):** name a person or business on About; decide on noindexing hero pages without a kit summary (`sd`) or sourced matchups.

## 2026-11-04 (maintenance bot)
**Checked:** `node build.js` (2,950 pages, OK); static audit (0 broken internal links, JSON-LD valid, canonical everywhere, no undefined/NaN); live = build (home, llms.txt, robots.txt, ads.txt, sitemap identical); all 2,950 sitemap URLs 200; real 404; headless 360 px on EN/TR homes, About and 8 random hero/brawler/character pages in 5 languages: no JS errors, no overflow.
**Fixed:** nothing needed.
**AdSense readiness:** ~35%. Blockers unchanged: (1) ~2,800 template hero/brawler/character pages vs ~20 articles per language; (2) About does not name who runs the site; (3) tool pages mostly JS; (4) CMP not live.
**Proposals (owner):** name a person or business on About; decide on noindexing hero pages without a kit summary (`sd`) or sourced matchups.

## 2026-11-02 (maintenance bot)
**Checked:** `node build.js` (2,950 pages, OK); static audit (0 broken internal links, JSON-LD valid, canonical on every page, no undefined/NaN); live: all 2,950 sitemap URLs return 200, today's weekly update (Wild Rift 7.3d, Shyvana) is deployed; headless 360 px run on home, MLBB hub/draft/tier list/Brody, TR home, news, About/Privacy/Contact and random tr/id/es/en hero pages: no JS errors, no horizontal overflow, real 404; ads.txt matches the pub ID in the page code. Monday re-read of the six Google pages: no rule change (POLICY.md date updated).
**Fixed:** nothing needed.
**AdSense readiness:** ~35%. Blockers unchanged: (1) ~2,800 template hero/brawler/character pages vs ~20 articles per language (rejected 25 Oct for "low value content"); (2) About does not name who runs the site; (3) tool pages mostly JS; (4) CMP not live.
**Proposals (owner decides):** name a person or business on About; Terms of use page (needs a footer link = template change, not done).

## 2026-11-02 (weekly content bot)
**Changed pages with possible impressions (additive only, no title/URL/structure changes):** kit summaries (`sd`) added to MLBB Barats, Sun, Valir, Brody, Layla, Balmond, Lunox, Arlott, Vexana, Lylia and Wild Rift Tristana, Zed, Lucian, Xayah, Yunara, Jayce, Shyvana; MLBB tiers refreshed from mlbbhub (Nov 1, 19 heroes moved); Valir build/emblem and Shyvana build/rune (AD bruiser, per 7.3d guides) set on their hero pages. Check these pages in Search Console around 2026-11-09.

## 2026-10-28
**Checked:** `node build.js` (2,935 pages, OK); static audit (0 broken internal links, JSON-LD valid, canonical everywhere except 404, no template leaks such as undefined/NaN, no future dates); live: root, EN/TR/ID homes, game hubs, tier lists (sources match About), news, About/Privacy/Contact, robots.txt, sitemap, llms.txt (= build), ads.txt (valid); 40 random sitemap URLs (200, canonical = URL, hreflang present); headless 360 px run: no JS errors, no overflow.
**Fixed:** nothing needed.
**AdSense readiness:** ~35%. Blockers unchanged: (1) ~2,800 template hero/brawler/character pages vs ~18 articles per language; (2) About does not name who runs the site; (3) tool pages mostly JS; (4) CMP not live.
**Proposals (owner decides):** there is no Terms of use page (not required by AdSense, but a common trust page; adding it needs a footer link = template change, so not done); name a person or business on About.

## 2026-10-26
**Checked:** `node build.js` (2,935 pages, OK). Monday policy re-read (see DutyLens log: spam policies 2026-08-28 add manipulating AI answers; helpful content 2026-10-05 on creator identity and AI disclosure); POLICY.md updated. Live site checked by an independent reviewer subagent (canonical, hreflang, OG, JSON-LD valid, real 404, ads.txt valid) and compared with own build audit.
**Fixed:**
- Brawl Stars counter pages recommended brawlers that the target beats (Shelly, an anti-tank brawler, got Ash/Bibi/Bolt, all tanks, while the same page said Shelly is strong against tanks). The engine now lowers picks whose class or strengths the enemy beats; pages and the live assistant no longer contradict themselves.
- Contact address was hidden by Cloudflare Email Obfuscation ("[email protected]" without JS) on Contact/About/Privacy; wrapped in `<!--email_off-->` so reviewers and crawlers see it.
- About page (5 languages) named Timesaver.gg as a tier source; the Brawl Stars tier list now uses SeeMeta. Corrected.
- Meta descriptions over ~165 characters (229 Free Fire pages at 260–276, some news) are now cut at a sentence or word boundary.
- Copy: Brawl Stars / Free Fire tier FAQ said "S-tier heroes" → brawlers / characters (5 languages, new keys in sync); MOBA "strong against squishy mages and marksmen, marksmen" duplicate removed.
**AdSense readiness:** ~35% (reviewer 20–30%). Blockers: (1) ~2,800 template hero/brawler/character pages vs 18 articles per language; same-class pages 60–80% identical (Layla/Miya, Hanzo/Saber), Brawl Stars counters are class rules + tier list; (2) About does not name who runs the site; (3) tool pages are mostly JS with little static text; (4) CMP not live.
**Open (owner):**
- Decide: noindex (and drop from the sitemap) hero/brawler/character pages without a hand-written kit summary (`sd`) or sourced matchups (`mu`) until enrichment reaches them, then reapply. The bot can do this on request.
- Add a name (person or business) to About; publish Google's EEA/UK/CH consent message in AdSense.
- Minor, for later runs: Turkish "Retri" shown for Retribution (gamer slang, reads as truncated); mixed English terms in TR/ID/PT pages.

## 2026-10-22
**Checked:** `node build.js` (2,905 pages, OK); live site now reachable: home, game hubs, hero/brawler/character pages, tools, tier lists, articles, About/Privacy, robots.txt, sitemap, llms.txt, ads.txt (valid, matches config) in several languages. Independent reviewer subagent (strict AdSense reviewer / first-time visitor / AI engine) compared with own findings.
**Fixed:**
- Privacy policy (5 languages): removed the untrue "may contain affiliate links"; added Google's partner-sites link, EEA/UK/CH consent via Google's certified message, local storage, Google Fonts and Cloudflare hosting; links are now real links.
- About page (5 languages): who runs it (one-person independent project), how the 0–10 scores are computed (matchup rules + tier bonus + MLBB public win rates), named data sources, AI-assistance disclosure, error reports.
- AI-assistance note under every article (POLICY.md §3).
- Root language-redirect page no longer loads the AdSense script (page has no content); verification meta kept.
- Template leaks: "is a assassin" → "is an assassin" (EN hero/brawler pages); Free Fire and Brawl Stars tier lists say characters/brawlers instead of heroes (title + intro, 5 languages); Brawl Stars tool says "Brawlers I play"; EN meta description lost the "(ct)" slang; "A fixed build … not added yet" reworded so it no longer reads as unfinished; llms.txt calls Free Fire characters characters.
**AdSense readiness:** ~40% (reviewer 30–35%). Blockers: (1) near-duplicate programmatic pages: Brawl Stars brawler pages share one counter block per class (Shelly / 8-Bit / Spike ~97% identical), MLBB marksmen share the same counter list, 23/52 Free Fire pages share the "Rusher" combo; (2) little editorial content (13 articles, none for Brawl Stars) vs ~2,900 URLs; (3) no CMP live yet; (4) hero-page counters can contradict the site's own guides (Brody page vs Brody guide) and ignore lanes (Wild Rift Aatrox → Janna/Morgana).
**Open (owner):**
- Decide whether to noindex (and drop from the sitemap) hero/brawler/character pages whose counter block is identical to their class, until they carry hero-specific content; the bot can do this on request.
- AdSense → Privacy & messaging → European regulations: publish Google's consent message. Cloudflare → Scrape Shield → turn off Email Address Obfuscation so the contact address is visible without JavaScript.

## 2026-10-21
**Checked:** `node build.js` (2,905 pages, OK); robots.txt (all major search and AI crawlers allowed explicitly), llms.txt (accurate), ads.txt (pub ID matches config), sitemap; static audit of every built page (titles, descriptions, canonical, H1, JSON-LD validity, image alt text, internal links: 0 broken); web search visibility.
**Live site not checked:** this run's sandbox could not reach pickradar.net (network allowlist), so the deploy was verified only via the build.
**Fixed:**
- Game tool pages (MLBB / HoK / Wild Rift) and draft pages shared identical meta descriptions across games; they now start with the game name (5 languages, no new i18n keys).
- Free Fire character descriptions (up to ~300 chars) put the skill text first, so the best combo was cut off in search results; the combo now comes first.
- Root `/` language-redirect page: proper title and canonical to `/en/`.
**Open (owner):**
- The site does not show up yet in the bot's search backend (Bing-based). Check Bing Webmaster Tools (verify, submit sitemap) and Google Search Console coverage.
- Allow pickradar.net in the Claude network settings so future audits can check the live site.

## 2026-11-20 – Palmera Heat
- Added Palmera Heat (/:lang/palmera-heat/): original top-down open-world crime game (GTA-style genre, own city/characters/story, 8 missions, police wanted system, radio). Featured on the home page. Page text names GTA only descriptively, with a non-affiliation note.

## 2026-11-20 – İstanbul Heat (3D)
- /:lang/palmera-heat/ now hosts İstanbul Heat: 3D open-world game (three.js r187 MIT, bundled as assets/three.min.js) on a stylised Istanbul map. Slug kept so the URL already sent to Search Console stays valid. src/palmera.js (2D) removed.

## 2026-11-21 – Teacher Tycoon (3D)
- Added Teacher Tycoon (/:lang/teacher-tycoon/, 5 languages): original 3D classroom game on three.js r187 (already bundled). Teach at the board, manage six students with their own behaviour, three tasks per lesson, surprise events (paper fight, pop quiz, principal visit), stars and lesson/rank progress saved in localStorage. Desktop and touch controls.
- Additive only: one new page per language, one new game card and nav link (appended at the end of the games list), sitemap entries, own OG image (static/og/teacher-tycoon.png) and card image (static/img/teacher-tycoon-card.webp). No existing titles, URLs, headings or links changed.
- Page text written for people: how to play, the six students, events, controls, tips, FAQ (FAQPage JSON-LD mirrors the visible FAQ), about. All 3D models and sounds are generated in code.

## 2026-11-21 – Teacher Tycoon LIVE mode
- Teacher Tycoon gets a LIVE mode for streamers on the same URL (`?live=1`, stream output `?live=1&clean=1`); no new pages, canonical unchanged.
- Viewers become part of the school: commenters take a seat as students, gifts make the sender teacher / vice principal / principal / inspector / Minister of Education (fictional characters, thresholds set by the streamer), top supporters become class president and vice president. Fixed, stated effect per gift; no chance-based rewards. Name and word filter, blocked-user list, duplicate-event protection.
- Data source today is a clearly labelled simulator (SIMULATION / DEMO on screen). Not connected to TikTok; official TikTok LIVE access is pending, third-party providers stay off unless the owner approves.

## 2026-11-21 – Teacher Tycoon LIVE: TikFinity source (beta)
- LIVE panel gets an opt-in data source "TikFinity · on your own computer (beta)". The page connects to the creator's own TikFinity desktop app at ws://localhost:21213 and maps chat/like/follow/gift events into the existing ingest() pipeline (dedupe, filters, rate limit unchanged).
- Nothing passes through PickRadar servers; no keys. Off by default; turned on by the creator (panel button) or `&src=tikfinity` in the OBS link. No demo/fake viewers while it is on.
- Gift streaks are applied once, at the streak's final message. Unknown events are ignored.
- Owner asked for a creator-run solution on 2026-11-21. TikFinity is third-party and unofficial; labelled beta in the UI. Official TikTok access row stays "waiting for partner access".
- Additive only: no change to page titles, URLs, links or the normal game.
