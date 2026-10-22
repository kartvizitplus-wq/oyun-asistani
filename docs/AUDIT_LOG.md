# Site audit log (maintenance bot)

Technical SEO, AI visibility, usability and ad-readiness checks. Content (patch news, guides) is handled by the weekly bot (UPDATING.md).

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
