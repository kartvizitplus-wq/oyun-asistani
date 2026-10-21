# Site audit log (maintenance bot)

Technical SEO, AI visibility, usability and ad-readiness checks. Content (patch news, guides) is handled by the weekly bot (UPDATING.md).

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
