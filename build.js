#!/usr/bin/env node
/* Static site generator. Run: node build.js  ->  writes everything to dist/. No dependencies. */
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, p);
const read = p => JSON.parse(fs.readFileSync(R(p), 'utf8'));
const cfg = read('config.json'), I18N = read('src/i18n.json'), ITEMS_TR = read('data/mlbb-items-tr.json'), GUIDE = read('src/guide.json'), CG = read('src/colorgame.json'), ND = read('src/nightdrop.json'), MB = read('src/moba.json'), SITE = read('src/site.json');
/* The old pick-assistant pages (hero, tier, draft, news, guide) are no longer built: PickRadar is a games site now. */
const LEGACY = false;
const Engine = require('./src/engine.js'), Icons = require('./src/icons.js');
const OUT = R('dist');
/* Cache-busting: asset URLs carry a hash of their content so browsers never mix old and new scripts. */
const crypto = require('crypto');
const VER = Object.fromEntries(['style.css', 'app.js', 'engine.js', 'icons.js', 'colorgame.js', 'nightdrop.js', 'moba.js'].map(f => [f, crypto.createHash('md5').update(fs.readFileSync(R('src/' + f))).digest('hex').slice(0, 8)]));
const asset = f => `/assets/${f}?v=${VER[f]}`;

/* Games shown on the site. kind: moba (heroes + items), bs (Brawl Stars), ff (Free Fire). */
const GAMES = [
  { id: 'mlbb', accent: '#a77bf3', slug: 'mlbb', name: 'Mobile Legends', full: 'Mobile Legends: Bang Bang', kind: 'moba', data: read('data/mlbb.json'), example: ['Ling', 'Estes', 'Tigreal', 'Pharsa', 'Claude'] },
  { id: 'hok', accent: '#ef5a52', slug: 'honor-of-kings', name: 'Honor of Kings', full: 'Honor of Kings', kind: 'moba', data: read('data/hok.json'), example: ['Lam', 'Cai Yan', 'Lian Po', 'Kongming', 'Marco Polo'] },
  { id: 'wildrift', accent: '#3ec3f5', slug: 'wild-rift', name: 'Wild Rift', full: 'League of Legends: Wild Rift', kind: 'moba', data: read('data/wildrift.json'), example: ['Yasuo', 'Soraka', 'Malphite', 'Ahri', 'Jinx'] },
  { id: 'freefire', accent: '#f7863a', slug: 'free-fire', name: 'Free Fire', full: 'Free Fire', kind: 'ff', data: read('data/freefire.json') },
  { id: 'brawlstars', accent: '#f5c842', slug: 'brawl-stars', name: 'Brawl Stars', full: 'Brawl Stars', kind: 'bs', data: read('data/brawlstars.json'), example: ['Mortis', 'Piper', 'Bull'] }
];
/* PickRadar's own browser games, in menu order. */
const PLAY = [
  { slug: 'night-drop', name: l => ND[l].name, desc: l => ND[l].desc, bg: '#0a0e16' },
  { slug: 'crown-clash', name: () => MB.games.crown.name, desc: l => MB.pages[l].crown.desc, bg: '#14261b' },
  { slug: 'jade-lanes', name: () => MB.games.jade.name, desc: l => MB.pages[l].jade.desc, bg: '#132a26' },
  { slug: 'duel-peak', name: () => MB.games.duel.name, desc: l => MB.pages[l].duel.desc, bg: '#1a1a2e' },
  { slug: 'color-gradient', name: l => CG[l].name, desc: l => CG[l].desc, bg: '#121825' }
];
/* Small original cover drawings for the game cards (inline SVG, no image files). */
const COVER = {
  'night-drop': '<rect width="320" height="180" fill="#05070c"/><path d="M160 110 L330 30 L330 190 Z" fill="#e8b44a" opacity=".22"/><circle cx="160" cy="110" r="46" fill="#2a2f3a"/><rect x="40" y="30" width="70" height="14" fill="#252e40"/><rect x="40" y="30" width="14" height="80" fill="#252e40"/><rect x="230" y="120" width="40" height="40" fill="#3a2f22"/><circle cx="160" cy="110" r="13" fill="#e8b44a" stroke="#7a5a17" stroke-width="3"/><circle cx="262" cy="80" r="11" fill="#e2595b" stroke="#6d1f22" stroke-width="3"/><circle cx="160" cy="90" r="140" fill="none" stroke="#ff5a78" stroke-width="3" opacity=".6"/>',
  'crown-clash': '<rect width="320" height="180" fill="#14261b"/><path d="M20 165 L20 15 L300 15 M20 165 L300 165 L300 15 M20 165 L300 15" stroke="#4a3d2a" stroke-width="22" fill="none" stroke-linejoin="round"/><path d="M-10 -10 L330 190" stroke="#14354a" stroke-width="18"/><rect x="60" y="120" width="16" height="16" fill="#4a9bea"/><rect x="244" y="44" width="16" height="16" fill="#e2595b"/><circle cx="130" cy="98" r="11" fill="#b48cff" stroke="#4a9bea" stroke-width="3"/><circle cx="178" cy="78" r="11" fill="#ffb057" stroke="#e2595b" stroke-width="3"/><polygon points="20,150 32,157 32,171 20,178 8,171 8,157" fill="#4a9bea"/><polygon points="300,2 312,9 312,23 300,30 288,23 288,9" fill="#e2595b"/>',
  'jade-lanes': '<rect width="320" height="180" fill="#132a26"/><path d="M20 165 L20 15 L300 15 M20 165 L300 165 L300 15" stroke="#5a4a33" stroke-width="24" fill="none" stroke-linejoin="round"/><path d="M-10 -10 L330 190" stroke="#123f45" stroke-width="22"/><circle cx="160" cy="90" r="14" fill="#c99a4a"/><circle cx="110" cy="65" r="9" fill="#c99a4a" opacity=".8"/><circle cx="210" cy="115" r="9" fill="#c99a4a" opacity=".8"/><circle cx="20" cy="70" r="11" fill="#6fd6b0" stroke="#4a9bea" stroke-width="3"/><circle cx="300" cy="110" r="11" fill="#e05a8a" stroke="#e2595b" stroke-width="3"/>',
  'duel-peak': '<rect width="320" height="180" fill="#1a1a2e"/><path d="M30 160 L290 20" stroke="#3d3550" stroke-width="34"/><path d="M-10 -10 L330 190" stroke="#1b2f55" stroke-width="16" opacity=".8"/><circle cx="135" cy="104" r="14" fill="#a48bff" stroke="#4a9bea" stroke-width="4"/><circle cx="185" cy="77" r="14" fill="#ff5fa2" stroke="#e2595b" stroke-width="4"/><path d="M152 95 L170 86" stroke="#fff" stroke-width="3"/><rect x="72" y="128" width="16" height="16" fill="#4a9bea"/><rect x="232" y="36" width="16" height="16" fill="#e2595b"/>',
  'color-gradient': Array.from({ length: 40 }, (_, i) => { const x = i % 8, y = Math.floor(i / 8); return `<rect x="${12 + x * 37}" y="${8 + y * 33}" width="34" height="30" rx="4" fill="hsl(${200 + x * 14 - y * 9} ${55 + y * 6}% ${72 - y * 9 - x * 2}%)"/>`; }).join('') + '<circle cx="29" cy="23" r="4" fill="#0006"/><circle cx="288" cy="155" r="4" fill="#0006"/>'
};
const cover = slug => `<svg viewBox="0 0 320 180" width="320" height="180" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${COVER[slug]}</svg>`;
const NEWS = fs.existsSync(R('data/news')) ? fs.readdirSync(R('data/news')).filter(f => f.endsWith('.json')).map(f => read('data/news/' + f)).sort((a, b) => b.date.localeCompare(a.date)) : [];

const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/* English article: "is a assassin" -> "is an assassin" */
const anA = (s, lang) => lang === 'en' ? String(s).replace(/\b(is) a ([aeiouAEIOU])/g, '$1 an $2') : s;
const fill = (s, v) => { for (const k in v || {}) s = s.split('{' + k + '}').join(v[k]); return s; };
const base = (cfg.baseUrl || '').replace(/\/$/, '');
const pages = [];
const lastUpdated = '2026-11-20';

function write(rel, html) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}
const itemName = (lang, i, t) => i.startsWith('#') ? t[i.slice(1)] : ((lang === 'tr' && ITEMS_TR[i]) || i);
const itemHtml = (lang, i, t) => { const n = itemName(lang, i, t); return Icons.item(i, 28) + '<span class="iname">' + esc(n) + (n !== i && !i.startsWith('#') ? '<small class="en">' + esc(i) + '</small>' : ''); };
const scoreCls = s => s >= 7 ? 'good' : s >= 5 ? 'mid' : 'bad';
/* Light hero cards: role color + role art come from one generated stylesheet, initials are text. */
const ROLE_KEYS = ['tank', 'fighter', 'assassin', 'mage', 'marksman', 'support', 'artillery', 'controller', 'damage', 'a', 'p'];
const ROLE_CSS = ROLE_KEYS.map(r => `.r-${r}{--rc:${Icons.roleColor(r)}}.r-${r} .av{background-image:url("data:image/svg+xml,${encodeURIComponent(Icons.roleArt(r)).replace(/'/g, '%27')}")}`).join('\n') + '\n';
VER['roles.css'] = crypto.createHash('md5').update(ROLE_CSS).digest('hex').slice(0, 8);
const roleKey = h => h.r || h.c || h.type || '';
const roleLabel = (g, h, t) => g.kind === 'moba' ? t['role_' + h.r] : g.kind === 'bs' ? t['cl_' + h.c] : (h.type === 'a' ? t.activeSkill : t.passiveSkill);
const heroCard = (g, h, t, href, mini) => `<a class="hcard r-${roleKey(h)}${mini ? ' mini' : ''}" href="${href}" data-r="${roleKey(h)}"><span class="av" aria-hidden="true">${esc(Icons.initials(h.n))}</span><span class="hn">${esc(h.n)}</span>${mini ? '' : `<span class="rb">${esc(roleLabel(g, h, t) || '')}</span>`}${h.tier ? `<span class="tier t${h.tier}">${h.tier}</span>` : ''}</a>`;
/* Grid of hero cards; full grids get role filter buttons (shown only when JavaScript runs). */
const heroGrid = (g, list, t, gp, mini) => {
  const roles = [...new Set(list.map(roleKey))].filter(Boolean);
  const filt = !mini && roles.length > 1 ? `<div class="row seg rolefilter" hidden><button type="button" data-rf="" aria-pressed="true">${esc(t.rfAll)} <small>${list.length}</small></button>${roles.map(r => { const h0 = list.find(h => roleKey(h) === r); return `<button type="button" data-rf="${r}" aria-pressed="false" class="r-${r}"><span class="dot"></span>${esc(roleLabel(g, h0, t) || r)} <small>${list.filter(h => roleKey(h) === r).length}</small></button>`; }).join('')}</div>` : '';
  return `${filt}<div class="hgrid${mini ? ' mini' : ''}">${list.map(h => heroCard(g, h, t, `/${gp}/${slug(h.n)}/`, mini)).join('')}</div>`;
};

/* Radar mark used in the header logo (original drawing). */
const LOGO = '<svg class="mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke="#f5a524" stroke-width="3"/><circle cx="16" cy="16" r="8.5" fill="none" stroke="#f5a524" stroke-width="1.5" opacity=".55"/><path d="M16 16L16 2A14 14 0 0 1 29.3 11.7Z" fill="#f5a524" opacity=".35"/><circle cx="16" cy="16" r="4.2" fill="#e2595b"/></svg>';
const OG_LOCALE = { en: 'en_US', tr: 'tr_TR', id: 'id_ID', es: 'es_ES', pt: 'pt_BR' };
/* Breadcrumb trail as schema.org BreadcrumbList: crumbs = [[name, rel], ...]. */
const crumbLd = crumbs => crumbs && crumbs.length > 1 ? { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, r], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${base}/${r}` })) } : null;
/* Search snippets are cut at about 160 characters: end long descriptions at a sentence (or word) boundary. */
function clipDesc(s, n = 165) {
  if (!s || s.length <= n) return s;
  const cut = s.slice(0, n), dot = cut.lastIndexOf('. ');
  if (dot >= 100) return cut.slice(0, dot + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:–-]+$/, '') + '…';
}
function layout({ lang, rel, title, desc, body, active, app, type, jsonld, img, crumbs, lastmod }) {
  desc = clipDesc(desc);
  const t = I18N[lang];
  const gm = GAMES.find(g => g.id === active);
  const tail = rel.replace(/^[a-z]{2}\//, '');
  pages.push({ rel, lastmod: lastmod || lastUpdated });
  const ogImg = `${base}/og/${img || 'default'}.png`;
  const lds = [].concat(jsonld || [], crumbLd(crumbs) || []).filter(Boolean);
  const crumbNav = crumbs && crumbs.length > 1 ? `<nav class="crumbs note" aria-label="breadcrumb">${crumbs.map(([name, r], i) => i < crumbs.length - 1 ? `<a href="/${r}">${esc(name)}</a>` : `<span aria-current="page">${esc(name)}</span>`).join(' › ')}</nav>` : '';
  const alts = cfg.langs.map(l => `<link rel="alternate" hreflang="${l}" href="${base}/${l}/${tail}">`).join('') +
    `<link rel="alternate" hreflang="x-default" href="${base}/${cfg.defaultLang}/${tail}">`;
  const langOpts = cfg.langs.map(l => `<option value="${l}" data-href="/${l}/${tail}"${l === lang ? ' selected' : ''}>${esc(I18N[l].langName)}</option>`).join('');
  const ads = cfg.adsenseClient ? `<meta name="google-adsense-account" content="${esc(cfg.adsenseClient)}"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(cfg.adsenseClient)}" crossorigin="anonymous"></script>` : '';
  const verify = cfg.googleVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleVerification)}">` : '';
  const appJs = app ? `<script>window.APP=${JSON.stringify(app).replace(/</g, '\\u003c')}</script><script src="${asset('engine.js')}"></script>` : '';
  const nav = PLAY.map(g => `<a href="/${lang}/${g.slug}/"${active === g.slug ? ' aria-current="page"' : ''}>${esc(g.name(lang))}</a>`).join('');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${verify}${base ? `<link rel="canonical" href="${base}/${rel}">` : ''}${alts}
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="${type || 'website'}"><meta property="og:site_name" content="${esc(cfg.siteName)}">${base ? `<meta property="og:url" content="${base}/${rel}">` : ''}<meta property="og:locale" content="${OG_LOCALE[lang] || 'en_US'}"><meta property="og:image" content="${ogImg}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(cfg.siteName)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${ogImg}">
${lds.map(j => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('')}
<link rel="icon" href="/assets/icon.svg" type="image/svg+xml"><link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#0a0e16"><link rel="apple-touch-icon" href="/icons/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&family=IBM+Plex+Sans:wght@400;600&display=swap">
<link rel="stylesheet" href="${asset('style.css')}"><link rel="stylesheet" href="${asset('roles.css')}">
${ads}
</head>
<body${gm ? ` class="g-${gm.id}" style="--accent:${gm.accent}"` : ''}>
<header class="top"><div class="wrap">
<a class="logo" href="/${lang}/">${LOGO}<span class="name">${esc(cfg.siteName).replace(/(Radar)$/, '<span>$1</span>')}</span></a>
<select class="lang" id="langSel" aria-label="${esc(t.language)}">${langOpts}</select>
<nav class="games">${nav}</nav>
</div></header>
${gm ? `<div class="gbanner" aria-hidden="true" style="background-image:url(/img/${gm.id}-1200.webp)"></div>` : ''}
<main class="wrap">
${crumbNav}${body}
</main>
<footer><div class="wrap">
<span>${esc(SITE[lang].disclaimer)}</span>
<span><a href="/${lang}/about/">${esc(t.about)}</a> · <a href="/${lang}/privacy/">${esc(t.privacy)}</a> · <a href="/${lang}/contact/">${esc(t.contact)}</a></span>
</div></footer>
${appJs}<script src="${asset('icons.js')}"></script><script src="${asset('app.js')}"></script>
</body>
</html>`;
}

/* Home showcase: heroes the weekly updater marked S or A tier, per game. Hidden until there is enough data. */
function showcase(lang) {
  const t = I18N[lang], order = { S: 0, A: 1 };
  const blocks = GAMES.map(g => {
    const list = (g.data.heroes || g.data.brawlers || g.data.characters || []).filter(h => h.tier === 'S' || h.tier === 'A')
      .sort((a, b) => order[a.tier] - order[b.tier] || a.n.localeCompare(b.n)).slice(0, 10);
    if (!list.length) return '';
    return `<div class="team"><b><a href="/${lang}/${g.slug}/${g.data.tierList ? 'tier-list/' : ''}" style="color:inherit">${esc(g.name)} →</a></b><div class="hgrid mini">${list.map(h => heroCard(g, h, t, `/${lang}/${g.slug}/${slug(h.n)}/`, true)).join('')}</div></div>`;
  }).filter(Boolean);
  if (!blocks.length) return '';
  return `<section><h2>${esc(t.topHome)}</h2><div class="card teams">${blocks.join('')}</div><p class="note" style="margin-top:6px">${esc(t.topHomeNote)}</p></section>`;
}
const newsCards = (lang, list) => list.length ? `<div class="newslist">${list.map(n => `<a class="newsitem" href="/${lang}/news/${n.slug}/"><span class="note">${esc(n.date)} · ${esc(GAMES.find(g => g.id === n.game)?.name || '')} · ${esc(I18N[lang]['type_' + (n.type || 'patch')] || '')}</span><h3>${esc(n.title[lang] || n.title.en)}</h3><span class="note">${esc(n.summary[lang] || n.summary.en)}</span></a>`).join('')}</div>` : `<p class="note">${esc(I18N[lang].noNews)}</p>`;

/* Articles that mention a hero (guide for it, or its name in the English body), newest first. */
const reEsc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const newsAbout = (gid, x) => NEWS.filter(n => n.game === gid && (n.hero === x || new RegExp(`(^|[^A-Za-z])${reEsc(x)}([^A-Za-z]|$)`).test(JSON.stringify(n.body.en) + ' ' + n.title.en)))
  .sort((a, b) => (b.hero === x) - (a.hero === x) || b.date.localeCompare(a.date)).slice(0, 4);
const newsSection = (lang, h, list) => list.length ? `<section><h2>${esc(h)}</h2>${newsCards(lang, list)}</section>` : '';
for (const lang of cfg.langs) {
  const t = I18N[lang];
  const tt = (k, v) => fill(t[k] || k, v);
  const tSub = Object.fromEntries(Object.keys(t).filter(k => !/^(priv|about|contact)Body$|^homeText$/.test(k)).map(k => [k, t[k]]));

  /* Home */
  const gameDesc = g => g.kind === 'moba' ? t.mobaToolDesc : g.kind === 'bs' ? t.bsToolDesc : t.ffToolDesc;
  const gameTitle = g => g.kind === 'moba' ? tt('mobaToolTitle', { g: g.name }) : g.kind === 'bs' ? t.bsToolTitle : t.ffToolTitle;
  const S = SITE[lang];
  write(`${lang}/index.html`, layout({
    lang, rel: `${lang}/`, title: `${cfg.siteName} · ${S.tagline}`, desc: S.homeText,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.siteName, url: `${base}/${lang}/`, inLanguage: lang },
      { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: PLAY.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: `${base}/${lang}/${g.slug}/`, name: g.name(lang) })) }],
    body: `<section class="playhero"><span class="kicker">${esc(S.tagline)}</span><h1>${esc(S.homeH1)}</h1><p class="lead">${esc(S.homeText)}</p></section>
<section id="games"><h2>${esc(S.gamesH)}</h2><div class="playgrid">
${PLAY.map((g, i) => `<a class="playcard" href="/${lang}/${g.slug}/">${cover(g.slug)}<span class="pbody"><span class="note">${esc(S.genre[g.slug])}</span><h3>${esc(g.name(lang))}</h3><span class="note">${esc(g.desc(lang))}</span><span class="go">▶ ${esc(S.play)}</span></span></a>`).join('\n')}
</div></section>
<section class="prose"><h2>${esc(S.whyH)}</h2><ul>${S.why.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
<style>
.playhero{gap:6px}
.playgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
.playcard{display:flex;flex-direction:column;text-decoration:none;color:var(--fg);background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden;transition:transform .15s ease,border-color .15s ease}
.playcard:hover{border-color:var(--gold);transform:translateY(-2px)}
.playcard svg{display:block;width:100%;height:auto;aspect-ratio:16/9}
.playcard .pbody{display:flex;flex-direction:column;gap:6px;padding:14px}
.playcard .go{font-family:var(--display);font-weight:700;color:var(--gold);margin-top:4px}
</style>`
  }));

  if (LEGACY) {
  for (const g of GAMES) {
    const D = g.data;
    const gp = `${lang}/${g.slug}`;
    /* SEO helpers: patch or year label, readable update date, natural-language lists, FAQ block. */
    const period = D.patch ? fill(t.patchLbl, { v: D.patch }) : String(D.updated || '').slice(0, 4);
    const dateTxt = (() => { try { return new Date(D.updated).toLocaleDateString(lang, { month: 'long', year: 'numeric' }); } catch (e) { return D.updated; } })();
    const gshort = { mlbb: 'MLBB', hok: 'HoK', wildrift: 'Wild Rift', brawlstars: 'Brawl Stars', freefire: 'Free Fire' }[g.id] || g.name;
    const listOf = arr => { try { return new Intl.ListFormat(lang, { type: 'conjunction' }).format(arr); } catch (e) { return arr.join(', '); } };
    const faqBlock = qa => qa.length ? `<section class="faq"><h2>${esc(t.faqTitle)}</h2>${qa.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>` : '';
    const faqLd = qa => qa.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) } : null;
    /* Tier list page (sourced, refreshed weekly by the updater). */
    const writeTier = (list, rOf) => {
        const byName = Object.fromEntries(list.map(h => [h.n.toLowerCase(), h]));
        const chipFor = n => { const h = byName[n.toLowerCase()]; return h ? `<a href="/${gp}/${slug(h.n)}/" class="tierlink">${Icons.hero(h.n, rOf(h), 22)}<span>${esc(h.n)}</span></a>` : `<span class="tierlink nolink" title="${esc(t.tl_new)}">${Icons.hero(n, '', 22)}<span>${esc(n)}</span></span>`; };
        const rows = tl => ['S', 'A', 'B', 'C', 'D'].filter(k => tl[k] && tl[k].length).map(k => `<div class="tierrow"><span class="tierbadge t${k}">${k}</span><div class="list-links">${tl[k].map(chipFor).join('')}</div></div>`).join('');
        const lanes = D.tierListByLane ? Object.entries(D.tierList) : null;
        const sTop = lanes ? [...new Set(lanes.flatMap(([, tl]) => tl.S || []))] : (D.tierList.S || []);
        const src = D.tierSource || {};
        const tlPeriod = D.patch ? period : src.patch ? fill(t.patchLbl, { v: src.patch }) : period;
        const tqa = [[tt(g.kind === 'bs' ? 'tl_q_bs' : g.kind === 'ff' ? 'tl_q_ff' : 'tl_q', { g: g.name }), tt(g.kind === 'bs' ? 'tl_a_bs' : g.kind === 'ff' ? 'tl_a_ff' : 'tl_a', { list: listOf(sTop.slice(0, 10)) })]];
        const tbody = `<section><h1>${esc(tt('tl_h1', { g: g.name }))} <span class="tlper">${esc(tlPeriod)}</span></h1><p class="lead">${esc(tt(g.kind === 'bs' ? 'tl_intro_bs' : g.kind === 'ff' ? 'tl_intro_ff' : 'tl_intro', { src: src.name || '' }))}</p>
<p class="note">${esc(t.tl_src)}: ${src.url ? `<a href="${esc(src.url)}" rel="nofollow noopener" target="_blank">${esc(src.name)}</a>` : esc(src.name || '')} · ${esc(src.date || D.updated)}</p></section>
${lanes ? lanes.map(([lane, tl]) => `<section><h2>${esc(t['tl_lane_' + lane] || lane)}</h2><div class="card tiers">${rows(tl)}</div></section>`).join('') : `<section><div class="card tiers">${rows(D.tierList)}</div></section>`}
<div class="bar"><a class="btn" href="/${gp}/">${esc(gameTitle(g))} →</a></div>
${faqBlock(tqa)}`;
        write(`${gp}/tier-list/index.html`, layout({ lang, rel: `${gp}/tier-list/`, active: g.id, body: tbody, jsonld: faqLd(tqa), img: g.id, lastmod: D.updated,
          crumbs: [[t.home, `${lang}/`], [g.name, `${gp}/`], [tt('tl_h1', { g: g.name }), `${gp}/tier-list/`]],
          title: tt(g.kind === 'bs' ? 'tl_title_bs' : g.kind === 'ff' ? 'tl_title_ff' : 'tl_title', { g: g.name, p: tlPeriod }), desc: tt('tl_desc', { g: g.name, top: listOf(sTop.slice(0, 4)), d: dateTxt }) }));
      };
    const app = { lang, game: g.id, kind: g.kind, t: tSub, data: D, example: g.example || null, itemsTr: lang === 'tr' && g.id === 'mlbb' ? ITEMS_TR : null };

    if (g.kind === 'moba' || g.kind === 'bs') {
      const isMoba = g.kind === 'moba';
      const list = isMoba ? D.heroes : D.brawlers;
      const roleOf = x => isMoba ? x.r : x.c;
      /* Sourced matchups (field mu) for popular heroes: names from a public stats source, explanations in our own words. */
      const byName = Object.fromEntries(list.map(z => [z.n, z]));
      const roleLbl = z => isMoba ? t['role_' + z.r] : t['cl_' + z.c];
      const muSrc = m => m.src.map(s => `<a href="${esc(s.url)}" rel="nofollow noopener" target="_blank">${esc(s.name)}</a> (${s.patch ? esc(fill(t.patchLbl, { v: s.patch })) + ', ' : ''}${esc(s.date)})`).join(', ');
      const muSec = h => !h.mu ? '' : `<section><h2>${esc(tt('mu_h', { x: h.n }))}</h2><div class="card">${h.mu.c.map(c => { const z = byName[c.n]; return `<div class="pick">${Icons.hero(c.n, z ? roleOf(z) : '', 36)}<span class="pmain"><span><b><a href="/${gp}/${slug(c.n)}/" style="color:inherit">${esc(c.n)}</a></b> <span class="role">${z ? esc(roleLbl(z)) : ''}</span></span><span class="why">${esc(c.w[lang] || c.w.en)}</span></span></div>`; }).join('')}${h.mu.tip ? `<p style="margin:12px 0 0"><b>${esc(t.mu_tip)}:</b> ${esc(h.mu.tip[lang] || h.mu.tip.en)}</p>` : ''}<p class="note" style="margin-top:10px">${fill(esc(t.mu_note), { src: muSrc(h.mu) })}</p></div></section>`;
      const body = `<section><h1>${esc(gameTitle(g))}</h1><p class="lead">${esc(gameDesc(g))} <a href="/${lang}/guide/">${esc(GUIDE[lang].nav)} →</a>${D.tierList ? ` · <a href="/${gp}/tier-list/">${esc(tt('tl_h1', { g: g.name }))} →</a>` : ''}</p></section>
<section><h2>${esc(t.enemyTeam)}</h2>
<div class="slots" id="slots" style="grid-template-columns:repeat(${isMoba ? 5 : 3},1fr)"></div>
${isMoba ? `<h2 style="margin-top:14px">${esc(t.myTeam)}</h2><div class="slots" id="aslots" style="grid-template-columns:repeat(4,1fr)"></div>
<div class="row seg" style="margin-top:12px"><span class="note">${esc(t.addingTo)}</span><button type="button" id="sideE">${esc(t.sideEnemy)}</button><button type="button" id="sideA">${esc(t.sideAlly)}</button></div>` : ''}
<p class="note" id="example" hidden>${esc(t.exampleNote)}</p>
<div class="searchrow"><input id="q" type="search" placeholder="${esc(t.search)}" autocomplete="off" aria-label="${esc(t.search)}"><button class="btn ghost micbtn" id="micBtn" type="button" hidden aria-label="${esc(t.voiceBtn)}">🎤 <span>${esc(t.voiceBtn)}</span></button></div>
<p class="note" id="voiceMsg" aria-live="polite"></p>
<div class="row seg rf" id="rf"></div>
<div class="pool" id="pool"></div></section>
${isMoba ? '' : `<section><h2>${esc(t.mode)}</h2><div class="row seg" id="modes"></div></section>`}
${isMoba ? `<section><h2>${esc(t.teamAnalysis)}</h2><div class="card teams" id="team"></div></section>
<section><h2>${esc(t.bansTitle)}</h2><div class="card" id="bans"></div></section>` : ''}
<section class="card poolcard" id="poolcard"><div class="poolhead"><h2 style="margin:0">⭐ ${esc(isMoba ? t.myPool : t.myPoolBs)}</h2><button class="btn ghost" id="poolEdit" type="button">${esc(t.poolEdit)}</button></div>
<p class="note" id="poolHint"></p><div class="list-links" id="poolSel"></div><div class="row seg" id="poolMode"></div>
<div id="poolPicker" hidden><input id="pq" type="search" placeholder="${esc(t.search)}" autocomplete="off" aria-label="${esc(t.search)}"><div class="pool" id="mypool"></div></div></section>
<section><h2>${esc(t.bestPicks)}</h2>${D.lanes ? `<div class="row seg" style="margin-bottom:10px"><span class="note">${esc(t.myLane)}:</span><span class="row seg" id="laneSeg"></span></div>` : ''}<div class="card" id="picks"></div>
</section>
${isMoba ? `<section id="buildsec"><h2>${esc(t.yourHero)}</h2><div class="heroline"><span id="heroIcon"></span>
<select class="lang" id="heroSel" aria-label="${esc(t.yourHero)}" style="font-size:1rem;padding:8px 10px;max-width:260px"></select></div>
<div class="card" id="myMatch" style="margin-top:10px"></div></section>
<section><h2>${esc(t.buildTitle)}</h2><div class="card"><p class="note" id="partial" hidden>${esc(t.partialNote)}</p><ol class="build" id="build"></ol><h2 id="emblemHead" style="margin:16px 0 10px" hidden></h2><ol class="build" id="emblem" hidden></ol><ul class="tips" id="tips"></ul></div>
<p class="note" style="margin-top:8px">${esc(t.itemNote)}</p></section>
<section class="card" id="report"><h2>${esc(t.reportTitle)}</h2><p class="note" id="reportHint"></p>
<div class="bar"><button class="btn" id="winBtn" type="button">✓ ${esc(t.winBtn)}</button><button class="btn ghost" id="lossBtn" type="button">✕ ${esc(t.lossBtn)}</button></div><p class="note" id="reportMsg" aria-live="polite"></p><p class="badge" id="badge"></p></section>` : `<section><div class="card"><ul class="tips" id="tips" style="margin:0"></ul></div></section>`}
<div class="bar"><button class="btn" id="speak" type="button">🔊 ${esc(t.speak)}</button><button class="btn ghost" id="clear" type="button">${esc(t.clear)}</button>${isMoba ? `<a class="btn ghost" href="/${gp}/draft/">🎯 ${esc(t.draftLink)}</a>` : ''}</div>
<section><h2>${esc(isMoba ? t.allHeroes : t.allBrawlers)}</h2>${heroGrid(g, list, t, gp, false)}</section>`;
      write(`${gp}/index.html`, layout({ lang, rel: `${gp}/`, title: `${gameTitle(g)} · ${cfg.siteName}`, desc: `${g.full} – ${gameDesc(g)}`, active: g.id, body, app, img: g.id, lastmod: D.updated }));

      if (D.tierList) writeTier(list, h => isMoba ? h.r : h.c);
      if (isMoba) write(`${gp}/draft/index.html`, layout({
        lang, rel: `${gp}/draft/`, active: g.id, img: g.id, lastmod: D.updated, app: { lang, game: g.id, kind: 'draft', t: tSub, data: D, itemsTr: lang === 'tr' && g.id === 'mlbb' ? ITEMS_TR : null },
        title: `${tt('draftTitle', { g: g.name })} · ${cfg.siteName}`, desc: `${g.full} – ${t.draftDesc}`,
        body: `<section><h1>${esc(tt('draftTitle', { g: g.name }))}</h1><p class="lead">${esc(t.draftDesc)}</p></section>
<section><div class="row seg"><span class="note">${esc(t.dMode)}:</span><span class="row seg" id="dmodeSeg"></span></div>
<div class="row seg" id="banRow" style="margin-top:8px"><span class="note">${esc(t.banCount)}:</span><span class="row seg" id="banSeg"></span></div>
<p class="note" id="classicNote" hidden>${esc(t.classicNote)}</p></section>
<section id="banBox"><div class="teams"><div class="team"><b>${esc(t.yourBans)}</b><div class="slots bans" id="dmeBan"></div></div>
<div class="team"><b>${esc(t.botBans)}</b><div class="slots bans" id="dbotBan"></div></div></div></section>
<section><div class="teams"><div class="team"><b>${esc(t.draftYou)}</b><div class="slots" id="dme" style="grid-template-columns:repeat(5,1fr)"></div></div>
<div class="team"><b>${esc(t.draftBot)}</b><div class="slots" id="dbot" style="grid-template-columns:repeat(5,1fr)"></div></div></div>
<p class="status" id="status" aria-live="polite"></p><ul class="tips" id="dlog" style="margin:0"></ul></section>
<section id="pickbox"><h2 id="suggHead"></h2><div class="pool" id="sugg" style="max-height:none"></div>
<input id="q" type="search" placeholder="${esc(t.search)}" autocomplete="off" aria-label="${esc(t.search)}"><div class="pool" id="pool"></div></section>
<section class="card" id="prep" hidden></section>
<section class="card" id="botBuilds" hidden></section>
<section class="card" id="result" hidden></section>
<div class="bar"><button class="btn" id="again" type="button">${esc(t.draftAgain)}</button><a class="btn ghost" href="/${gp}/">${esc(gameTitle(g))}</a></div>`
      }));
      for (const h of list) {
        const x = h.n;
        let inner, qa = [], topNames = [];
        if (isMoba) {
          const picks = Engine.mlScore(D, [x], null).slice(0, 8);
          const strong = Engine.mlStrongAgainst(D, x);
          const items = Engine.mlCounterItems(D, x);
          const own = Engine.mlBuild(D, x, []);
          const traits = [...h.t].map(k => t['tr_' + k]).filter(Boolean);
          inner = `<section><div class="heroline">${Icons.hero(x, h.r, 56)}<h1>${esc(tt('hp_h1g', { x, g: g.name }))}</h1></div>
<p class="lead">${esc(anA(tt('hp_about', { x, role: t['role_' + h.r].toLowerCase(), dmg: h.d === 'P' ? t.dmgP : t.dmgM }), lang))}${traits.length ? ' ' + esc(t.hp_traits) + ': ' + esc(traits.join(', ')) + '.' : ''}</p></section>
${h.sd ? `<section><h2>${esc(tt('bp_kitH', { x }))}</h2><p style="margin:0">${esc(h.sd[lang] || h.sd.en)}</p></section>` : ''}
${muSec(h)}
<section><h2>${esc(tt(h.mu ? 'mu_more' : 'hp_best', { x }))}</h2><div class="card">${picks.map(p => `<div class="pick">${Icons.hero(p.n, p.r, 36)}<span class="pmain"><span><span class="score ${scoreCls(p.s)}">${p.s.toFixed(1)}</span> <b><a href="/${gp}/${slug(p.n)}/" style="color:inherit">${esc(p.n)}</a></b> <span class="role">${esc(t['role_' + p.r])}</span></span><span class="why">${esc(p.why.length ? [...new Set(p.why.map(w => typeof w === 'string' ? t[w] : fill(t[w.k] || '', { x: w.x })))].join(' · ') : t.neutral)}</span></span><span></span></div>`).join('')}</div></section>
${items.length ? `<section><h2>${esc(tt('hp_items', { x }))}</h2><div class="card"><ol class="build">${items.map(([i, r]) => `<li class="adapt">${itemHtml(lang, i, t)}<small class="why">${esc(t[r] || '')}</small></span></li>`).join('')}</ol></div></section>` : ''}
${strong.length ? `<section><h2>${esc(tt('hp_strong', { x }))}</h2><p style="margin:0">${esc(strong.map(k => t['s_' + k]).join(', '))}</p></section>` : ''}
${own.items.length ? `<section><h2>${esc(tt('hp_build', { x }))}</h2><div class="card"><ol class="build">${own.items.map(o => `<li>${itemHtml(lang, o.item, t)}</span></li>`).join('')}</ol>
${own.emblem ? `<h2 style="margin:16px 0 10px">${esc(own.emblem.arcana ? t.arcanaTitle : own.emblem.set ? t.emblemTitle : t.runeTitle)}</h2><ol class="build">${(own.emblem.arcana ? own.emblem.arcana.map(a => ['arcanaSlot', a]) : own.emblem.set ? [['em_set', own.emblem.set], ['em_t1', own.emblem.t1], ['em_t2', own.emblem.t2], ['em_core', own.emblem.core]] : [['runeTitle', own.emblem.core]]).map(([k, v]) => `<li>${Icons.talent(v, 32)}<span class="iname">${esc(v)}<small class="why">${esc(t[k])}</small></span></li>`).join('')}</ol>` : ''}
<ul class="tips"><li>${esc(t.spell)}: ${esc(itemName(lang, own.spell, t))}</li></ul></div></section>` : ''}`;
          /* How to play against this hero, derived from its traits and data. */
          const ah = Engine.mlCounterItems(D, x).find(([, r]) => r === 'r_antiheal');
          const vs = [];
          if (h.t.includes('h')) vs.push(tt('vt_h', { x, i: ah ? itemName(lang, ah[0], t) : t.cat_antiheal }));
          if (h.t.includes('c')) vs.push(tt('vt_c', { x }));
          if (h.t.includes('b')) vs.push(tt('vt_b', { x }));
          if (h.t.includes('d')) vs.push(tt('vt_d', { x }));
          if (h.r === 'tank') vs.push(tt('vt_tank', { x }));
          if ((h.r === 'mage' || h.r === 'marksman') && !h.t.includes('d')) vs.push(tt('vt_squishy', { x }));
          vs.push(tt(h.d === 'M' ? 'vt_M' : 'vt_P', { x }));
          if (h.wr) vs.push(tt('vt_wr', { x, p: h.wr.toFixed(1) }));
          inner += `<section><h2>${esc(tt('playVs', { x }))}</h2><ul class="tips" style="margin:0">${vs.map(v => `<li>${esc(v)}</li>`).join('')}</ul></section>`;
          const top3 = picks.slice(0, 3), w0 = top3[0] && top3[0].why.find(w => typeof w === 'string');
          qa = [[tt('q_best', { x }), tt('a_best', { x, list: listOf(top3.map(p => p.n)), first: top3[0].n, why: w0 ? t[w0] : t.neutral })]];
          if (items.length) qa.push([tt('q_items', { x }), tt('a_items', { x, list: listOf(items.map(([i]) => itemName(lang, i, t))) })]);
          if (strong.length) qa.push([tt('q_strong', { x }), tt('a_strong', { x, list: listOf(strong.map(k => t['s_' + k])) })]);
          if (own.items.length) qa.push([tt('q_build', { x }), tt('a_build', { x, list: listOf(own.items.map(o => itemName(lang, o.item, t))) }) +
            (own.emblem ? (own.emblem.arcana ? tt('a_emblem', { e: own.emblem.arcana.join(', ') }).replace(/Emblem|Amblem|Emblema/, 'Arcana') : own.emblem.set ? tt('a_emblem', { e: [own.emblem.set, own.emblem.t1, own.emblem.t2, own.emblem.core].join(', ') }) : tt('a_rune', { e: own.emblem.core })) : '')]);
          topNames = top3.map(p => p.n);
        } else {
          const picks = Engine.bsScore(D, [x], null, null).slice(0, 8);
          const strong = Engine.bsStrongAgainst(D, x);
          const whyTxt = w => w.k === 'bw_counter' ? tt('bw_counter', { cls: t['cl_' + w.cls] }) : w.k === 'bw_mode' ? tt('bw_mode', { mode: t['m_' + w.mode] }) : t[w.k];
          inner = `<section><div class="heroline">${Icons.hero(x, h.c, 56)}<h1>${esc(tt('hp_h1g', { x, g: g.name }))}</h1></div><p class="lead">${esc(anA(tt('bp_about', { x, cls: t['cl_' + h.c] }), lang))}</p></section>
${h.sd ? `<section><h2>${esc(tt('bp_kitH', { x }))}</h2><p style="margin:0">${esc(h.sd[lang] || h.sd.en)}</p></section>` : ''}
${muSec(h)}
<section><h2>${esc(tt(h.mu ? 'mu_more' : 'bp_best', { x }))}</h2><div class="card">${picks.map(p => `<div class="pick">${Icons.hero(p.n, p.c, 36)}<span class="pmain"><span><span class="score ${scoreCls(p.s)}">${p.s.toFixed(1)}</span> <b><a href="/${gp}/${slug(p.n)}/" style="color:inherit">${esc(p.n)}</a></b> <span class="role">${esc(t['cl_' + p.c])}</span></span><span class="why">${esc(p.why.length ? [...new Set(p.why.map(whyTxt))].join(' · ') : t.neutral)}</span></span><span></span></div>`).join('')}</div></section>
${strong.length ? `<section><h2>${esc(tt('bp_strong', { x }))}</h2><p style="margin:0">${esc(strong.map(c => t['cl_' + c]).join(', '))}</p></section>` : ''}
<section><h2>${esc(tt('bp_tip', { cls: t['cl_' + h.c] }))}</h2><p style="margin:0">${esc(t['bt_' + h.c])}</p>${D.gears && D.gears[h.c] ? `<p style="margin:8px 0 0"><b>${esc(t.gearTitle)}:</b> ${esc(D.gears[h.c].join(' + '))}</p>` : ''}</section>`;
          const top3 = picks.slice(0, 3), w0 = top3[0] && top3[0].why[0];
          qa = [[tt('q_bsbest', { x }), tt('a_best', { x, list: listOf(top3.map(p => p.n)), first: top3[0].n, why: w0 ? whyTxt(w0) : t.neutral })]];
          if (strong.length) qa.push([tt('q_strong', { x }), tt('a_strong', { x, list: listOf(strong.map(c => t['cl_' + c])) })]);
          topNames = top3.map(p => p.n);
        }
        if (h.mu) {
          const mn = h.mu.c.map(c => c.n), w0 = (h.mu.c[0].w[lang] || h.mu.c[0].w.en);
          qa[0] = [qa[0][0], tt('a_mu', { x, src: listOf(h.mu.src.map(z => z.name)), list: listOf(mn.slice(0, 4)), first: mn[0], why: w0 })];
          topNames = mn.slice(0, 3);
        }
        const src = isMoba && h.wr && D.wrSource ? `<section class="card"><h2>${esc(t.srcTitle)}</h2><p style="margin:0">${esc(tt('srcRate', { p: h.wr.toFixed(1), src: D.wrSource.name, d: D.wrSource.date }))}</p><p class="note" style="margin-top:6px"><a href="${esc(D.wrSource.url)}" rel="nofollow noopener" target="_blank">${esc(D.wrSource.name)}</a></p></section>` : '';
        const comm = isMoba ? `<section class="card" id="community" hidden data-game="${g.id}" data-hero="${esc(x)}" data-t="${esc(JSON.stringify({ commTitle: t.commTitle, commRate: t.commRate, commVs: t.commVs, commFew: t.commFew }))}"></section>` : '';
        const body2 = `${inner}
${src}${comm}
<div class="bar"><a class="btn" href="/${gp}/?e=${encodeURIComponent(x).replace(/'/g, '%27')}">${esc(tt('hp_try', { x }))}</a>${D.tierList ? `<a class="btn ghost" href="/${gp}/tier-list/">${esc(tt('tl_h1', { g: g.name }))}</a>` : ''}</div>
${newsSection(lang, tt('hp_news', { x }), newsAbout(g.id, x))}
${faqBlock(qa)}
<section><h2>${esc(t.simHeroes)}</h2>${heroGrid(g, list.filter(z => z !== h && roleKey(z) === roleKey(h)).slice(0, 12), t, gp, true)}<p class="note" style="margin-top:10px"><a href="/${gp}/">${esc(isMoba ? t.allHeroes : t.allBrawlers)} →</a></p></section>`;
        write(`${gp}/${slug(x)}/index.html`, layout({
          lang, rel: `${gp}/${slug(x)}/`, active: g.id, body: body2, jsonld: faqLd(qa), img: g.id, lastmod: D.updated,
          crumbs: [[t.home, `${lang}/`], [g.name, `${gp}/`], [x, `${gp}/${slug(x)}/`]],
          title: tt(isMoba ? 'hp_title2' : 'bp_title2', { x, p: period, g: gshort, top: listOf(topNames) }),
          desc: tt(isMoba ? 'hp_desc2' : 'bp_desc2', { x, g: g.full, top: listOf(topNames), d: dateTxt })
        }));
      }
    }

    if (g.kind === 'ff') {
      const chars = D.characters;
      const body = `<section><h1>${esc(t.ffToolTitle)}</h1><p class="lead">${esc(t.ffToolDesc)} <a href="/${lang}/guide/">${esc(GUIDE[lang].nav)} →</a>${D.tierList ? ` · <a href="/${gp}/tier-list/">${esc(tt('tl_h1', { g: g.name }))} →</a>` : ''}</p></section>
<section><h2>${esc(t.playstyle)}</h2><div class="row seg" id="styles"></div></section>
<section><h2>${esc(t.ffMode)}</h2><div class="row seg" id="ffmodes"></div></section>
<section><h2>${esc(t.threats)}</h2><div class="row seg" id="threats"></div></section>
<section><h2>${esc(t.ffCombo)}</h2><div class="card" id="combo"></div></section>
<div class="bar"><button class="btn" id="speak" type="button">🔊 ${esc(t.speak)}</button></div>
<section><h2>${esc(t.allCharacters)}</h2>${heroGrid(g, chars, t, gp, false)}</section>`;
      write(`${gp}/index.html`, layout({ lang, rel: `${gp}/`, title: `${t.ffToolTitle} · ${cfg.siteName}`, desc: t.ffToolDesc, active: g.id, body, app, img: g.id, lastmod: D.updated }));
      if (D.tierList) writeTier(chars, c => c.type);
      for (const c of chars) {
        const best = Engine.ffBestStyle(D, c.n);
        const combo = Engine.ffCombo(D, best.style, best.mode, [], c.n);
        const card = (x, label) => `<div class="pick">${Icons.hero(x.n, x.type, 40)}<span class="pmain"><span><b><a href="/${gp}/${slug(x.n)}/" style="color:inherit">${esc(x.n)}</a></b> <span class="role">${esc(label)}</span></span><span class="why">${esc(x.why.map(k => t[k]).join(' · '))}</span></span><span></span></div>`;
        const tags = c.tags.map(k => t['f_' + k]).filter(Boolean);
        const comboTxt = `${combo.active.n} + ${listOf(combo.passives.map(p => p.n))}`;
        const sd = c.sd ? (c.sd[lang] || c.sd.en) : '';
        const fqa = c.skill && sd ? [[tt('q_ffskill', { x: c.n }), `${c.skill}. ${sd}`]] : [];
        fqa.push([tt('q_ffbest', { x: c.n }), tt('a_ffbest', { x: c.n, a: combo.active.n, p: listOf(combo.passives.map(p => p.n)), s: `${t['ps_' + best.style]} · ${t['ff_' + best.mode]}` })]);
        const body2 = `<section><div class="heroline">${Icons.hero(c.n, c.type, 56)}<h1>${esc(tt('fp_h1', { x: c.n }))}</h1></div>
<p class="lead">${esc(tt(c.type === 'a' ? 'fp_aboutA' : 'fp_aboutP', { x: c.n }))} ${esc(tags.join(', '))}.</p></section>
${c.skill && sd ? `<section><h2>${esc(tt('fp_skillH', { x: c.n, s: c.skill }))}</h2><p style="margin:0">${esc(sd)}</p></section>` : ''}
<section><h2>${esc(tt('fp_best', { x: c.n }))}</h2><p class="note" style="margin:0 0 8px">${esc(t.fp_style)}: ${esc(t['ps_' + best.style])} · ${esc(t['ff_' + best.mode])}</p>
<div class="card">${card(combo.active, t.activeSkill)}${combo.passives.map(p => card(p, t.passiveSkill)).join('')}</div></section>
<div class="bar"><a class="btn" href="/${gp}/?c=${encodeURIComponent(c.n)}">${esc(tt('hp_try', { x: c.n }))}</a>${D.tierList ? `<a class="btn ghost" href="/${gp}/tier-list/">${esc(tt('tl_h1', { g: g.name }))}</a>` : ''}</div>
${newsSection(lang, tt('hp_news', { x: c.n }), newsAbout(g.id, c.n))}
${faqBlock(fqa)}
<section><h2>${esc(t.simChars)}</h2>${heroGrid(g, chars.filter(z => z !== c && z.type === c.type).slice(0, 12), t, gp, true)}<p class="note" style="margin-top:10px"><a href="/${gp}/">${esc(t.allCharacters)} →</a></p></section>`;
        write(`${gp}/${slug(c.n)}/index.html`, layout({ lang, rel: `${gp}/${slug(c.n)}/`, active: g.id, body: body2, jsonld: faqLd(fqa), img: g.id, lastmod: D.updated,
          crumbs: [[t.home, `${lang}/`], [g.name, `${gp}/`], [c.n, `${gp}/${slug(c.n)}/`]],
          title: c.skill ? `${tt('fp_title2', { x: c.n, s: c.skill, p: period })} · Free Fire` : `${tt('fp_h1', { x: c.n })} ${period} · Free Fire`,
          desc: tt('fp_desc2', { x: c.n, top: comboTxt, d: dateTxt }) + (sd ? ` ${c.skill}: ${sd}` : '') }));
      }
    }
  }

  /* News */
  write(`${lang}/news/index.html`, layout({ lang, rel: `${lang}/news/`, active: 'news', lastmod: NEWS.length ? NEWS[0].date : lastUpdated, title: `${t.news} · ${cfg.siteName}`, desc: t.newsDesc,
    body: `<section><h1>${esc(t.news)}</h1><p class="lead">${esc(t.newsDesc)}</p></section><section>${newsCards(lang, NEWS)}</section>` }));
  for (const n of NEWS) {
    const g = GAMES.find(x => x.id === n.game);
    const blocks = (n.body[lang] || n.body.en).map(b => b.h ? `<h2>${esc(b.h)}</h2>` : b.ul ? `<ul>${b.ul.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : `<p>${esc(b.p)}</p>`).join('\n');
    const title = n.title[lang] || n.title.en;
    write(`${lang}/news/${n.slug}/index.html`, layout({
      lang, rel: `${lang}/news/${n.slug}/`, active: 'news', type: 'article', title: `${title} · ${cfg.siteName}`, desc: n.summary[lang] || n.summary.en,
      img: n.game, lastmod: n.date, crumbs: [[t.home, `${lang}/`], [t.news, `${lang}/news/`], [title, `${lang}/news/${n.slug}/`]],
      jsonld: { '@context': 'https://schema.org', '@type': n.type === 'guide' ? 'Article' : 'NewsArticle', headline: title, description: n.summary[lang] || n.summary.en,
        image: [`${base}/og/${n.game}.png`], url: `${base}/${lang}/news/${n.slug}/`, mainEntityOfPage: `${base}/${lang}/news/${n.slug}/`,
        datePublished: n.date, dateModified: n.date, inLanguage: lang, articleSection: I18N[lang]['type_' + (n.type || 'patch')] || undefined,
        about: g ? { '@type': 'VideoGame', name: g.full } : undefined,
        publisher: { '@type': 'Organization', name: cfg.siteName, url: `${base}/`, logo: { '@type': 'ImageObject', url: `${base}/icons/icon-512.png` } }, author: { '@type': 'Organization', name: cfg.siteName, url: `${base}/${lang}/about/` } },
      body: `<article class="prose"><p class="note">${esc(t.publishedOn)}: ${esc(n.date)}${g ? ' · ' + esc(g.full) : ''}</p><h1>${esc(title)}</h1>${blocks}
${n.sources && n.sources.length ? `<p class="note">${esc(n.sources.join(' · '))}</p>` : ''}<p class="note">${esc(t.aiNote)}</p></article>
<div class="bar">${g && n.hero ? `<a class="btn ghost" href="/${lang}/${g.slug}/${slug(n.hero)}/">${esc(tt('hp_h1', { x: n.hero }))}</a>` : ''}${g && g.data.tierList ? `<a class="btn ghost" href="/${lang}/${g.slug}/tier-list/">${esc(tt('tl_h1', { g: g.name }))}</a>` : ''}${g ? `<a class="btn" href="/${lang}/${g.slug}/">${esc(t.openTool)} →</a>` : ''}</div>
${newsSection(lang, t.relatedNews, NEWS.filter(m => m !== n && m.game === n.game).slice(0, 4))}`
    }));
  }

  /* How-to guide */
  const G = GUIDE[lang];
  write(`${lang}/guide/index.html`, layout({
    lang, rel: `${lang}/guide/`, active: 'guide', type: 'article', title: `${G.title} · ${cfg.siteName}`, desc: G.desc,
    jsonld: { '@context': 'https://schema.org', '@type': 'HowTo', name: G.title, description: G.desc, inLanguage: lang,
      step: G.sections.map(sec => ({ '@type': 'HowToSection', name: sec.h, itemListElement: sec.steps.map(st => ({ '@type': 'HowToStep', text: st })) })) },
    body: `<article class="prose guide"><h1>${esc(G.title)}</h1><p class="lead">${esc(G.intro)}</p>
${fs.existsSync(R(`static/video/pickradar-${lang}.mp4`)) ? `<video class="guidevid" controls playsinline preload="none" poster="/video/pickradar-${lang}.jpg" src="/video/pickradar-${lang}.mp4"></video>` : ''}
<nav class="toc card">${G.sections.map((sec, i) => `<a href="#s${i + 1}">${esc(sec.h)}</a>`).join('')}</nav>
${G.sections.map((sec, i) => `<h2 id="s${i + 1}">${esc(sec.h)}</h2><ol>${sec.steps.map(st => `<li>${esc(st)}</li>`).join('')}</ol>`).join('\n')}
</article>
<div class="bar">${GAMES.map(gm => `<a class="btn ghost" href="/${lang}/${gm.slug}/">${esc(gm.name)}</a>`).join('')}</div>`
  }));
  } /* end LEGACY */

  /* Color Gradient: a small hue-sorting puzzle (standalone page, own script). */
  {
    const C = CG[lang] || CG.en, rel = `${lang}/color-gradient/`;
    const ui = { tile: C.tile, pinned: C.pinned, solvedIn: C.solvedIn };
    write(`${rel}index.html`, layout({
      lang, rel, active: 'color-gradient', title: `${C.title} · ${cfg.siteName}`, desc: C.desc, lastmod: '2026-11-20',
      crumbs: [[t.home, `${lang}/`], [C.name, rel]],
      jsonld: { '@context': 'https://schema.org', '@type': 'VideoGame', name: C.name, description: C.desc, url: `${base}/${rel}`, inLanguage: lang,
        genre: 'Puzzle', gamePlatform: 'Web browser', applicationCategory: 'Game', operatingSystem: 'Any', isAccessibleForFree: true,
        publisher: { '@type': 'Organization', name: cfg.siteName, url: `${base}/` } },
      body: `<section><h1>${esc(C.h1)}</h1><p class="lead">${esc(C.intro)}</p></section>
<section id="cg" class="cg card" data-t="${esc(JSON.stringify(ui))}">
<div class="cg-bar"><span>${esc(C.level)} <b data-v="level">1</b></span><span>${esc(C.moves)} <b data-v="moves">0</b></span><span>${esc(C.best)} <b data-v="best">–</b></span></div>
<div class="cg-wrap"><div class="cg-board" role="grid" aria-label="${esc(C.name)}"></div>
<div class="cg-win" hidden><h3>${esc(C.solved)}</h3><p></p><button type="button" class="btn" data-a="continue">${esc(C.continue)}</button></div></div>
<div class="cg-ctl"><button type="button" class="btn ghost" data-a="prev" aria-label="${esc(C.prev)}">←</button><button type="button" class="btn ghost" data-a="hint">${esc(C.hint)}</button><button type="button" class="btn ghost" data-a="restart">${esc(C.restart)}</button><button type="button" class="btn ghost" data-a="next" aria-label="${esc(C.next)}">→</button></div>
<noscript><p class="note">JavaScript is required to play.</p></noscript>
</section>
<article class="prose"><h2>${esc(C.howH)}</h2><ol>${C.how.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
<h2>${esc(C.tipsH)}</h2><ul>${C.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
<h2>${esc(C.aboutH)}</h2><p>${esc(C.about)}</p></article>
<style>
.cg{gap:14px;align-items:center}
.cg-bar{display:flex;gap:18px;justify-content:center;font-family:var(--display);color:var(--muted);flex-wrap:wrap}
.cg-bar b{color:var(--fg);font-size:1.15rem;margin-left:4px}
.cg-wrap{position:relative;width:100%;max-width:520px}
.cg-board{display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:3px;touch-action:none;user-select:none;-webkit-user-select:none}
.cg-t{aspect-ratio:1;border:0;border-radius:6px;padding:0;cursor:grab;position:relative;transition:transform .12s ease,box-shadow .12s ease}
.cg-board.tube .cg-t{aspect-ratio:.42;border-radius:10px}
.cg-t.pin{cursor:default}
.cg-t.pin::after{content:"";position:absolute;left:50%;top:50%;width:7px;height:7px;margin:-3.5px;border-radius:50%;background:rgba(0,0,0,.45);box-shadow:0 0 0 2px rgba(255,255,255,.5)}
.cg-t.sel{transform:scale(.86);box-shadow:0 0 0 3px var(--fg)}
.cg-t:focus-visible{outline:3px solid var(--gold);outline-offset:1px}
.cg-t.pop{animation:cgpop .22s ease}
.cg-t.hint{animation:cghint 1.2s ease 2}
.cg-board.won .cg-t{animation:cgwin .7s ease}
@keyframes cgpop{50%{transform:scale(1.1)}}
@keyframes cghint{50%{box-shadow:0 0 0 4px var(--gold);transform:scale(.9)}}
@keyframes cgwin{40%{transform:scale(.92)}}
.cg-win{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;background:rgba(10,14,22,.78);border-radius:10px;padding:16px}
.cg-win[hidden]{display:none}
.cg-win p{margin:0;color:var(--muted)}
.cg-ctl{display:flex;gap:6px;justify-content:center}
.cg-ctl .btn{padding:10px 12px;font-size:.88rem;white-space:nowrap}
.cg-ctl .btn:disabled{opacity:.4;cursor:default}
@media (prefers-reduced-motion:reduce){.cg-t,.cg-t.pop,.cg-t.hint,.cg-board.won .cg-t{animation:none;transition:none}}
</style>
<script src="${asset('colorgame.js')}" defer></script>`
    }));
  }

  /* Night Drop: top-down battle royale against bots (standalone page, own script). */
  {
    const N = ND[lang] || ND.en, rel = `${lang}/night-drop/`;
    const ui = Object.fromEntries(['name', 'you', 'play', 'again', 'startText', 'drop', 'zoneShrink', 'zoneMoving', 'zoneIn', 'zone', 'outside', 'reloading', 'pick', 'winTitle', 'winText', 'deadTitle', 'deadText', 'statsLine', 'w'].map(k => [k, N[k]]));
    const li = a => a.map(x => `<li>${esc(x)}</li>`).join('');
    write(`${rel}index.html`, layout({
      lang, rel, active: 'night-drop', title: `${N.title} · ${cfg.siteName}`, desc: N.desc, lastmod: '2026-11-20',
      crumbs: [[t.home, `${lang}/`], [N.name, rel]],
      jsonld: { '@context': 'https://schema.org', '@type': 'VideoGame', name: N.name, description: N.desc, url: `${base}/${rel}`, inLanguage: lang,
        genre: ['Battle royale', 'Shooter'], gamePlatform: 'Web browser', applicationCategory: 'Game', operatingSystem: 'Any', isAccessibleForFree: true, playMode: 'SinglePlayer',
        publisher: { '@type': 'Organization', name: cfg.siteName, url: `${base}/` } },
      body: `<section><h1>${esc(N.h1)}</h1><p class="lead">${esc(N.intro)}</p></section>
<section id="nd" class="nd" data-t="${esc(JSON.stringify(ui))}">
<div class="nd-stage"><canvas aria-label="${esc(N.name)}"></canvas>
<div class="nd-btns" hidden><button type="button" data-k="pick" hidden>↑</button><button type="button" data-k="sonar" aria-label="${esc(N.sonar)}">◎</button><button type="button" data-k="heal" aria-label="${esc(N.heal)}">+</button><button type="button" data-k="reload" aria-label="${esc(N.reload)}">⟳</button></div>
<button type="button" class="nd-full" data-k="full" aria-label="${esc(N.fullscreen)}">⛶</button>
<div class="nd-ov"></div></div>
<noscript><p class="note">JavaScript is required to play.</p></noscript>
</section>
<article class="prose"><h2>${esc(N.ctrlH)}</h2><ul>${li(N.ctrl)}</ul>
<h2>${esc(N.howH)}</h2><ol>${li(N.how)}</ol>
<h2>${esc(N.weaponsH)}</h2><ul>${li(N.weapons)}</ul>
<h2>${esc(N.tipsH)}</h2><ul>${li(N.tips)}</ul>
<h2>${esc(N.aboutH)}</h2><p>${esc(N.about)}</p></article>
<style>
.nd-stage{position:relative;width:100%;height:min(76vh,620px);min-height:380px;border:1px solid #2ef2ff55;border-radius:10px;overflow:hidden;background:#05070f;box-shadow:0 0 40px -12px #ff3df2aa;touch-action:none;user-select:none;-webkit-user-select:none}
.nd-stage:fullscreen{height:100%;border:0;border-radius:0}
.nd-stage canvas{display:block;width:100%;height:100%;touch-action:none}
.nd-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;background:rgba(4,6,11,.72);padding:20px}
.nd-ov[hidden]{display:none}
.nd-ov h3{font-size:1.8rem}
.nd-ov p{margin:0;color:var(--muted);max-width:44ch}
.nd-ov small{display:block;margin-top:8px;font-size:.82rem}
.nd-btns{position:absolute;right:14px;bottom:14px;display:flex;flex-direction:column;gap:10px}
.nd-btns[hidden],.nd-btns [hidden]{display:none}
.nd-btns button,.nd-full{width:52px;height:52px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(10,14,22,.6);color:#fff;font:700 1.3rem var(--display);cursor:pointer}
.nd-btns button[data-k=pick]{background:rgba(232,180,74,.85);color:#1a1405}
.nd-btns button[data-k=sonar]{border-color:#2ef2ff;color:#2ef2ff}
.nd-btns button.cd{opacity:.4}
.nd-full{position:absolute;left:10px;bottom:10px;width:40px;height:40px;font-size:1.1rem;border-radius:8px}
</style>
<script src="${asset('nightdrop.js')}" defer></script>`
    }));
  }

  /* MOBA games: one engine (src/moba.js), three set-ups from src/moba.json. */
  for (const [gid, G] of Object.entries(MB.games)) {
    const P = MB.pages[lang] || MB.pages.en, U = MB.ui[lang] || MB.ui.en, C = P[gid], rel = `${lang}/${G.slug}/`;
    const ui = { ...U, name: G.name };
    const li = a => a.map(x => `<li>${esc(x)}</li>`).join('');
    const sk = U.roles;
    write(`${rel}index.html`, layout({
      lang, rel, active: G.slug, title: `${C.title} · ${cfg.siteName}`, desc: C.desc, lastmod: '2026-11-20',
      crumbs: [[t.home, `${lang}/`], [G.name, rel]],
      jsonld: { '@context': 'https://schema.org', '@type': 'VideoGame', name: G.name, description: C.desc, url: `${base}/${rel}`, inLanguage: lang,
        genre: ['MOBA', 'Strategy'], gamePlatform: 'Web browser', applicationCategory: 'Game', operatingSystem: 'Any', isAccessibleForFree: true, playMode: 'SinglePlayer',
        publisher: { '@type': 'Organization', name: cfg.siteName, url: `${base}/` } },
      body: `<section><h1>${esc(C.h1)}</h1><p class="lead">${esc(C.intro)}</p></section>
<section id="mb" class="mb" data-cfg="${esc(JSON.stringify({ id: gid, ...G.cfg }))}" data-t="${esc(JSON.stringify(ui))}">
<div class="mb-stage"><canvas aria-label="${esc(G.name)}"></canvas>
<div class="mb-pad" hidden><button type="button" data-s="recall" class="sm" aria-label="${esc(U.recall)}">⌂</button><button type="button" data-s="0"><i></i></button><button type="button" data-s="1"><i></i></button><button type="button" data-s="2" class="ult"><i></i></button><button type="button" data-s="atk" class="atk" aria-label="${esc(U.attack)}">⚔</button></div>
<button type="button" class="mb-full" data-k="full" aria-label="${esc(U.fullscreen)}">⛶</button>
<div class="mb-ov"></div></div>
<noscript><p class="note">JavaScript is required to play.</p></noscript>
</section>
<article class="prose"><h2>${esc(P.ctrlH)}</h2><ul>${li(P.ctrl)}</ul>
<h2>${esc(G.style)}</h2><ol>${li(C.how)}</ol>
<h2>${esc(P.heroesH)}</h2><ul>${G.cfg.roster.map(r => `<li><b>${esc(r.name)}</b> – ${esc(sk[r.arch].name)}: ${esc(sk[r.arch].d)} <span class="note">(${sk[r.arch].s.map(esc).join(' · ')})</span></li>`).join('')}</ul>
<h2>${esc(P.tipsH)}</h2><ul>${li(P.tips)}</ul>
<h2>${esc(P.aboutH)}</h2><p>${esc(P.about.replace('{name}', G.name))}</p></article>
<style>
.mb-stage{position:relative;width:100%;height:min(76vh,620px);min-height:380px;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#05080c;touch-action:none;user-select:none;-webkit-user-select:none}
.mb-stage:fullscreen{height:100%;border:0;border-radius:0}
.mb-stage canvas{display:block;width:100%;height:100%;touch-action:none}
.mb-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;background:rgba(5,8,12,.78);padding:16px;overflow:auto}
.mb-ov[hidden]{display:none}
.mb-ov h3{font-size:1.8rem}
.mb-ov p{margin:0;color:var(--muted)}
.mb-roster{display:grid;grid-template-columns:repeat(3,minmax(0,140px));gap:8px}
.mb-roster button{display:flex;flex-direction:column;gap:2px;align-items:center;padding:10px 6px;border-radius:10px;border:2px solid var(--line);background:var(--panel);color:var(--fg);cursor:pointer;font:inherit}
.mb-roster button b{font-family:var(--display);color:var(--hc)}
.mb-roster button small{color:var(--muted)}
.mb-roster button[aria-pressed=true]{border-color:var(--hc);box-shadow:0 0 0 2px var(--hc) inset}
.mb-pad{position:absolute;right:12px;bottom:12px;width:230px;height:200px}
.mb-pad[hidden]{display:none}
.mb-pad button{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.3);background:rgba(10,14,22,.6);color:#fff;font:700 1rem var(--display);touch-action:none;width:58px;height:58px}
.mb-pad button i{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:1rem}
.mb-pad button.cd{opacity:.55}
.mb-pad .atk{right:0;bottom:0;width:86px;height:86px;font-size:1.8rem;background:rgba(226,89,91,.55)}
.mb-pad [data-s="0"]{right:96px;bottom:2px;background:rgba(74,155,234,.5)}
.mb-pad [data-s="1"]{right:84px;bottom:72px;background:rgba(74,155,234,.5)}
.mb-pad [data-s="2"]{right:18px;bottom:100px;background:rgba(167,123,243,.6)}
.mb-pad .sm{right:170px;bottom:0;width:44px;height:44px;font-size:1.1rem}
.mb-full{position:absolute;left:10px;bottom:10px;width:40px;height:40px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:rgba(10,14,22,.6);color:#fff;cursor:pointer}
</style>
<script src="${asset('moba.js')}" defer></script>`
    }));
  }

  /* Privacy, About & Contact */
  const PRIVACY_DATE = '2026-11-20';
  // email_off: Cloudflare Email Obfuscation must not hide the address from visitors without JS, reviewers and crawlers
  const mail = `<!--email_off--><a href="mailto:${esc(cfg.contactEmail)}">${esc(cfg.contactEmail)}</a><!--/email_off-->`;
  write(`${lang}/privacy/index.html`, layout({ lang, rel: `${lang}/privacy/`, title: `${t.privTitle} · ${cfg.siteName}`, desc: t.privBody[0],
    body: `<section class="prose"><h1>${esc(t.privTitle)}</h1><p class="muted">${esc(t.privDate)}: ${PRIVACY_DATE}</p>${[SITE[lang].privStore, ...t.privBody.slice(1)].map(p => `<p>${p}</p>`).join('')}<p>${esc(t.privP5)} ${mail}</p></section>` }));
  write(`${lang}/about/index.html`, layout({ lang, rel: `${lang}/about/`, title: `${t.aboutTitle} · ${cfg.siteName}`, desc: SITE[lang].about[0],
    body: `<section class="prose"><h1>${esc(t.aboutTitle)}</h1>${SITE[lang].about.map(p => `<p>${esc(p)}</p>`).join('')}${cfg.contactEmail ? `<p>${esc(t.contact)}: ${mail}</p>` : ''}</section>` }));
  write(`${lang}/contact/index.html`, layout({ lang, rel: `${lang}/contact/`, title: `${t.contactTitle} · ${cfg.siteName}`, desc: t.contactBody[0],
    body: `<section class="prose"><h1>${esc(t.contactTitle)}</h1>${t.contactBody.map(p => `<p>${esc(p)}</p>`).join('')}<p><b>E-mail:</b> ${mail}</p><p><!--email_off--><a class="btn" href="mailto:${esc(cfg.contactEmail)}?subject=PickRadar">${esc(t.emailUs)}</a><!--/email_off--></p><p><a href="/${lang}/about/">${esc(t.about)}</a> · <a href="/${lang}/privacy/">${esc(t.privacy)}</a></p></section>` }));
}

/* Root, assets, SEO files */
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(cfg.siteName)} · ${esc(SITE.en.tagline)}</title><meta name="description" content="${esc(SITE.en.homeText)}">${base ? `<link rel="canonical" href="${base}/${cfg.defaultLang}/">` : ''}
${cfg.googleVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleVerification)}">` : ''}
${cfg.adsenseClient ? `<meta name="google-adsense-account" content="${esc(cfg.adsenseClient)}">` : ''}
${cfg.langs.map(l => `<link rel="alternate" hreflang="${l}" href="${base}/${l}/">`).join('')}
<script>(function(){var L=${JSON.stringify(cfg.langs)},s=null;try{s=localStorage.getItem('lang')}catch(e){}
var n=(s||navigator.language||'en').slice(0,2).toLowerCase();location.replace('/'+(L.indexOf(n)>-1?n:'${cfg.defaultLang}')+'/');})();</script>
</head><body style="background:#0c1018;color:#e9edf5;font-family:system-ui;padding:24px">
${cfg.langs.map(l => `<a style="color:#e8b44a;margin-right:12px" href="/${l}/">${esc(I18N[l].langName)}</a>`).join('')}
</body></html>`);
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of ['style.css', 'app.js', 'engine.js', 'icons.js', 'colorgame.js', 'nightdrop.js', 'moba.js']) fs.copyFileSync(R('src/' + f), path.join(OUT, 'assets', f));
if (fs.existsSync(R('static'))) fs.cpSync(R('static'), OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
  name: cfg.siteName + ' – ' + SITE.en.tagline, short_name: cfg.siteName, start_url: '/', scope: '/', display: 'standalone',
  background_color: '#0c1018', theme_color: '#0c1018', description: SITE.en.homeText,
  icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }],
  shortcuts: PLAY.slice(0, 4).map(g => ({ name: g.name('en'), url: `/${cfg.defaultLang}/${g.slug}/` }))
}, null, 1));
fs.writeFileSync(path.join(OUT, 'assets/roles.css'), ROLE_CSS);
fs.writeFileSync(path.join(OUT, 'assets/icon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0c1018"/><circle cx="16" cy="16" r="10" fill="none" stroke="#e8b44a" stroke-width="2.5"/><circle cx="16" cy="16" r="4" fill="#e2595b"/><path d="M16 3v6M16 23v6M3 16h6M23 16h6" stroke="#e8b44a" stroke-width="2.5"/></svg>');
/* Search engines and AI assistants (search and answer bots) are explicitly welcome. */
const AI_BOTS = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'DuckAssistBot', 'meta-externalagent'];
fs.writeFileSync(path.join(OUT, 'robots.txt'), AI_BOTS.map(b => `User-agent: ${b}\nAllow: /\n`).join('\n') + `\nUser-agent: *\nAllow: /\n${base ? `\nSitemap: ${base}/sitemap.xml\n` : ''}`);
/* llms.txt: a plain summary that AI assistants can read to understand and cite the site. */
{
  const B = base || '', E = SITE.en;
  fs.writeFileSync(path.join(OUT, 'llms.txt'), `# ${cfg.siteName}\n\n> ${E.homeText} All games are original and made by PickRadar. Available in English, Turkish, Indonesian, Spanish and Portuguese (replace /en/ with /tr/, /id/, /es/ or /pt/).\n\n## Games\n${PLAY.map(g => `- [${g.name('en')}](${B}/en/${g.slug}/): ${E.genre[g.slug]}. ${g.desc('en')}`).join('\n')}\n\n## More\n- [About](${B}/en/about/) · Contact: ${cfg.contactEmail || ''}\n`);
}
/* The old pick-assistant sections moved: send visitors and search engines to the matching new game (permanent). */
fs.writeFileSync(path.join(OUT, '_redirects'), [
  ['mlbb', 'crown-clash/'], ['honor-of-kings', 'jade-lanes/'], ['wild-rift', 'duel-peak/'], ['free-fire', 'night-drop/'],
  ['brawl-stars', ''], ['news', ''], ['guide', '']
].map(([from, to]) => `/:lang/${from}/* /:lang/${to} 301\n/:lang/${from} /:lang/${to} 301`).join('\n') + '\n');
if (base) fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `<url><loc>${base}/${p.rel}</loc><lastmod>${p.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`);
if (cfg.adsenseClient) fs.writeFileSync(path.join(OUT, 'ads.txt'), `google.com, ${cfg.adsenseClient.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html><meta charset="utf-8"><title>404</title><body style="background:#0c1018;color:#e9edf5;font-family:system-ui;padding:24px"><p>404 · <a style="color:#e8b44a" href="/">${esc(cfg.siteName)}</a></p></body>`);
console.log(`Built ${pages.length} pages into dist/`);
