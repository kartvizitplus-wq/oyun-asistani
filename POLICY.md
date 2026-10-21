# Google policy checklist (read before every task)

The owner wants the site to pass Google AdSense review and stay safe in Google Search. Every bot reads this file
before doing anything and checks its own work against it before pushing. If a task would break a rule here, skip
that part and say so in the summary.

Official sources (re-read them; policies change and the publisher is responsible for keeping up):
- AdSense Program policies: https://support.google.com/adsense/answer/48182
- Google Publisher Policies: https://support.google.com/adsense/answer/10502938
- AdSense eligibility: https://support.google.com/adsense/answer/9724
- Google Search spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- EEA/UK/Swiss consent (certified CMP): https://support.google.com/adsense/answer/13554116

The maintenance bot re-reads these pages once a week (on Mondays) and updates this file when a rule changed,
noting the change and date in docs/AUDIT_LOG.md (copy any change to the DutyLens POLICY.md too).

Last reviewed against the official pages: 2026-10-21.

## 1. Content: what Google approves
- Original, accurate, useful content written for people. Every page must answer the visitor's question better than
  a generic answer would: real figures, worked examples, official sources, practical warnings.
- Accuracy: hero stats, items, patch changes and tier claims must match official patch notes or reliable data
  sources from the current patch. When unsure, leave it out. Say which patch a guide is for.
- Titles and headings describe the page honestly: no exaggeration, no clickbait, no shock value.
- No thin pages: never publish a page or post just to have more pages. Skip a post rather than publish a weak one.
- Do not change dates, or add and remove content, just to look fresh. Change the "checked" date only after a real check.

## 2. Spam policies that apply to this site
- **Scaled content abuse**: never mass-produce hero, item or tier pages. Each page must carry real, hero-specific
  information (builds, counters, patch changes, how to play) that helps a player. No pages for the sake of page count.
- **Spun or rewritten text**: never vary pages by swapping synonyms or rewording the same facts. Differences must come
  from real facts.
- **Scraping**: never copy or lightly reword other sites' text. Write in your own words, cite the official source.
- **Doorway pages**: no near-identical pages aimed at one query that only funnel visitors elsewhere.
- **Keyword stuffing**: no lists of keywords, countries or phrases repeated for search engines.
- **Hidden text / cloaking**: nothing shown to Google that people cannot see; no off-screen or same-colour text.
  Accordions and FAQ details are fine.
- **Misleading functionality**: the pick assistant and tools must work and do what the page says.
- **Game IP**: PickRadar is an unofficial fan site. Keep the "not affiliated with" notice; never imply an official
  link with Moonton, Tencent, Riot, Garena or Supercell; no ripped game assets beyond fair, small references; no
  cheats, hacks, mods, account selling or top-up schemes (Publisher Policies: dishonest behaviour).
- **Link spam**: no paid or exchanged links; any sponsored link gets rel="sponsored".

## 3. Trust signals (Who / How / Why)
- About page says who runs the site and how to contact them.
- Explain where data comes from (official patch notes, game data) and which patch it reflects.
- Disclose automation: news posts and guides are drafted with AI assistance and checked against official sources;
  keep that note on the About page and under every post. Never invent authors, credentials, reviews or quotes.
- Privacy policy explains ads, cookies and consent. Keep it accurate.

## 4. Ads (when AdSense is live)
- Never click own ads; never ask visitors to click ads or "support us"; no arrows or images pointing at ads.
- Ads must not look like content, menus, navigation or download buttons; label them "Advertisement" if labelled.
- No ads in pop-ups, floating boxes or on pages without real content (error pages, empty results, thank-you pages).
- No paid traffic, traffic exchanges or bots. No pop-ups, forced redirects or auto-downloads.
- Do not touch the publisher ID in ads.txt or the ad code unless clearly broken.
- EEA, UK and Switzerland: a Google-certified CMP (TCF) is required for personalised ads. Use Google's own
  "Privacy & messaging → European regulations" message; the owner turns it on in AdSense.

## 5. Site quality
- Easy navigation: header menu, breadcrumbs, links between related pages, working search and tools.
- No broken pages or links, no "under construction" sections, no empty pages.
- Fast and mobile-friendly: no horizontal scroll at 360 px, no heavy scripts or images.
- robots.txt allows Googlebot and AdSense's crawler (Mediapartners-Google); sitemap.xml is valid.

## 6. Before you push: self-check
1. Is every new fact backed by official patch notes or reliable current data?
2. Is the text original, in your own words, and useful to a real visitor?
3. Would the page still be worth publishing if Google did not exist?
4. No rule in sections 2 and 4 broken?
If any answer is "no", fix it or do not publish that part.
