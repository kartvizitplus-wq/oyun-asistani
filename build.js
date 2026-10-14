#!/usr/bin/env node
/* Static site generator. Run: node build.js  ->  writes everything to dist/. No dependencies. */
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, p);
const read = p => JSON.parse(fs.readFileSync(R(p), 'utf8'));
const cfg = read('config.json'), I18N = read('src/i18n.json'), ITEMS_TR = read('data/mlbb-items-tr.json');
const Engine = require('./src/engine.js'), Icons = require('./src/icons.js');
const OUT = R('dist');

/* Games shown on the site. kind: moba (heroes + items), bs (Brawl Stars), ff (Free Fire). */
const GAMES = [
  { id: 'mlbb', slug: 'mlbb', name: 'Mobile Legends', full: 'Mobile Legends: Bang Bang', kind: 'moba', data: read('data/mlbb.json'), example: ['Ling', 'Estes', 'Tigreal', 'Pharsa', 'Claude'] },
  { id: 'hok', slug: 'honor-of-kings', name: 'Honor of Kings', full: 'Honor of Kings', kind: 'moba', data: read('data/hok.json'), example: ['Lam', 'Cai Yan', 'Lian Po', 'Kongming', 'Marco Polo'] },
  { id: 'wildrift', slug: 'wild-rift', name: 'Wild Rift', full: 'League of Legends: Wild Rift', kind: 'moba', data: read('data/wildrift.json'), example: ['Yasuo', 'Soraka', 'Malphite', 'Ahri', 'Jinx'] },
  { id: 'freefire', slug: 'free-fire', name: 'Free Fire', full: 'Free Fire', kind: 'ff', data: read('data/freefire.json') },
  { id: 'brawlstars', slug: 'brawl-stars', name: 'Brawl Stars', full: 'Brawl Stars', kind: 'bs', data: read('data/brawlstars.json'), example: ['Mortis', 'Piper', 'Bull'] }
];
const NEWS = fs.existsSync(R('data/news')) ? fs.readdirSync(R('data/news')).filter(f => f.endsWith('.json')).map(f => read('data/news/' + f)).sort((a, b) => b.date.localeCompare(a.date)) : [];

const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fill = (s, v) => { for (const k in v || {}) s = s.split('{' + k + '}').join(v[k]); return s; };
const base = (cfg.baseUrl || '').replace(/\/$/, '');
const pages = [];
const lastUpdated = [...GAMES.map(g => g.data.updated), ...NEWS.map(n => n.date)].sort().pop();

function write(rel, html) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}
const itemName = (lang, i, t) => i.startsWith('#') ? t[i.slice(1)] : ((lang === 'tr' && ITEMS_TR[i]) || i);
const itemHtml = (lang, i, t) => { const n = itemName(lang, i, t); return Icons.item(i, 28) + '<span class="iname">' + esc(n) + (n !== i && !i.startsWith('#') ? '<small class="en">' + esc(i) + '</small>' : ''); };
const scoreCls = s => s >= 7 ? 'good' : s >= 5 ? 'mid' : 'bad';

function layout({ lang, rel, title, desc, body, active, app, type, jsonld }) {
  const t = I18N[lang];
  const tail = rel.replace(/^[a-z]{2}\//, '');
  pages.push(rel);
  const alts = cfg.langs.map(l => `<link rel="alternate" hreflang="${l}" href="${base}/${l}/${tail}">`).join('') +
    `<link rel="alternate" hreflang="x-default" href="${base}/${cfg.defaultLang}/${tail}">`;
  const langOpts = cfg.langs.map(l => `<option value="${l}" data-href="/${l}/${tail}"${l === lang ? ' selected' : ''}>${esc(I18N[l].langName)}</option>`).join('');
  const ads = cfg.adsenseClient ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(cfg.adsenseClient)}" crossorigin="anonymous"></script>` : '';
  const verify = cfg.googleVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleVerification)}">` : '';
  const appJs = app ? `<script>window.APP=${JSON.stringify(app).replace(/</g, '\\u003c')}</script><script src="/assets/engine.js"></script>` : '';
  const nav = GAMES.map(g => `<a href="/${lang}/${g.slug}/"${active === g.id ? ' aria-current="page"' : ''}>${esc(g.name)}</a>`).join('') +
    `<a href="/${lang}/news/"${active === 'news' ? ' aria-current="page"' : ''}>${esc(t.news)}</a>`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${verify}${base ? `<link rel="canonical" href="${base}/${rel}">` : ''}${alts}
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="${type || 'website'}"><meta property="og:site_name" content="${esc(cfg.siteName)}">${base ? `<meta property="og:url" content="${base}/${rel}">` : ''}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : ''}
<link rel="icon" href="/assets/icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&family=IBM+Plex+Sans:wght@400;600&display=swap">
<link rel="stylesheet" href="/assets/style.css">
${ads}
</head>
<body>
<header class="top"><div class="wrap">
<a class="logo" href="/${lang}/">${esc(cfg.siteName).replace(/(Radar)$/, '<span>$1</span>')}</a>
<select class="lang" id="langSel" aria-label="${esc(t.language)}">${langOpts}</select>
<nav class="games">${nav}</nav>
</div></header>
<main class="wrap">
${body}
</main>
<footer><div class="wrap">
<span>${esc(t.disclaimer)}</span>
<span><a href="/${lang}/about/">${esc(t.about)}</a> · <a href="/${lang}/privacy/">${esc(t.privacy)}</a> · <a href="/${lang}/news/">${esc(t.news)}</a> · ${esc(t.updatedOn)}: ${esc(lastUpdated)}</span>
</div></footer>
${appJs}<script src="/assets/icons.js"></script><script src="/assets/app.js"></script>
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
    return `<div class="team"><b>${esc(g.name)}</b><div class="list-links">${list.map(h => `<a href="/${lang}/${g.slug}/${slug(h.n)}/" class="tierlink">${Icons.hero(h.n, h.r || h.c || h.type, 20)}<span>${esc(h.n)}</span><span class="tier t${h.tier}">${h.tier}</span></a>`).join('')}</div></div>`;
  }).filter(Boolean);
  if (!blocks.length) return '';
  return `<section><h2>${esc(t.topHome)}</h2><div class="card teams">${blocks.join('')}</div><p class="note" style="margin-top:6px">${esc(t.topHomeNote)}</p></section>`;
}
const newsCards = (lang, list) => list.length ? `<div class="newslist">${list.map(n => `<a class="newsitem" href="/${lang}/news/${n.slug}/"><span class="note">${esc(n.date)} · ${esc(GAMES.find(g => g.id === n.game)?.name || '')} · ${esc(I18N[lang]['type_' + (n.type || 'patch')] || '')}</span><h3>${esc(n.title[lang] || n.title.en)}</h3><span class="note">${esc(n.summary[lang] || n.summary.en)}</span></a>`).join('')}</div>` : `<p class="note">${esc(I18N[lang].noNews)}</p>`;

for (const lang of cfg.langs) {
  const t = I18N[lang];
  const tt = (k, v) => fill(t[k] || k, v);
  const tSub = Object.fromEntries(Object.keys(t).filter(k => !/^(priv|about)Body$|^homeText$/.test(k)).map(k => [k, t[k]]));

  /* Home */
  const gameDesc = g => g.kind === 'moba' ? t.mobaToolDesc : g.kind === 'bs' ? t.bsToolDesc : t.ffToolDesc;
  const gameTitle = g => g.kind === 'moba' ? tt('mobaToolTitle', { g: g.name }) : g.kind === 'bs' ? t.bsToolTitle : t.ffToolTitle;
  write(`${lang}/index.html`, layout({
    lang, rel: `${lang}/`, title: `${cfg.siteName} · ${t.tagline}`, desc: t.homeText,
    jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.siteName, url: `${base}/${lang}/`, inLanguage: lang },
    body: `<section><h1>${esc(t.homeH1)}</h1><p class="lead">${esc(t.homeText)}</p></section>
<section><h2>${esc(t.chooseGame)}</h2><div class="games-grid">
${GAMES.map(g => `<a class="game" href="/${lang}/${g.slug}/"><h3>${esc(g.full)}</h3><span class="note">${esc(gameDesc(g))}</span><span class="go">${esc(t.openTool)} →</span></a>`).join('\n')}
</div></section>
${showcase(lang)}
<section><h2>${esc(t.latestNews)}</h2>${newsCards(lang, NEWS.slice(0, 3))}</section>`
  }));

  for (const g of GAMES) {
    const D = g.data;
    const gp = `${lang}/${g.slug}`;
    const app = { lang, game: g.id, kind: g.kind, t: tSub, data: D, example: g.example || null, itemsTr: lang === 'tr' && g.id === 'mlbb' ? ITEMS_TR : null };

    if (g.kind === 'moba' || g.kind === 'bs') {
      const isMoba = g.kind === 'moba';
      const list = isMoba ? D.heroes : D.brawlers;
      const roleOf = x => isMoba ? x.r : x.c;
      const links = list.map(h => `<a href="/${gp}/${slug(h.n)}/">${esc(h.n)}</a>`).join('');
      const body = `<section><h1>${esc(gameTitle(g))}</h1><p class="lead">${esc(gameDesc(g))}</p></section>
<section><h2>${esc(t.enemyTeam)}</h2>
<div class="slots" id="slots" style="grid-template-columns:repeat(${isMoba ? 5 : 3},1fr)"></div>
${isMoba ? `<h2 style="margin-top:14px">${esc(t.myTeam)}</h2><div class="slots" id="aslots" style="grid-template-columns:repeat(4,1fr)"></div>
<div class="row seg" style="margin-top:12px"><span class="note">${esc(t.addingTo)}</span><button type="button" id="sideE">${esc(t.sideEnemy)}</button><button type="button" id="sideA">${esc(t.sideAlly)}</button></div>` : ''}
<p class="note" id="example" hidden>${esc(t.exampleNote)}</p>
<input id="q" type="search" placeholder="${esc(t.search)}" autocomplete="off" aria-label="${esc(t.search)}">
<div class="pool" id="pool"></div></section>
${isMoba ? '' : `<section><h2>${esc(t.mode)}</h2><div class="row seg" id="modes"></div></section>`}
${isMoba ? `<section><h2>${esc(t.teamAnalysis)}</h2><div class="card teams" id="team"></div></section>
<section><h2>${esc(t.bansTitle)}</h2><div class="card" id="bans"></div></section>` : ''}
<section><h2>${esc(t.bestPicks)}</h2><div class="card" id="picks"></div>
<details class="poolbox card" style="margin-top:10px"><summary>${esc(t.myPool)}<span id="poolcount"></span></summary>
<p class="note">${esc(t.poolHint)}</p><input id="pq" type="search" placeholder="${esc(t.search)}" autocomplete="off" aria-label="${esc(t.search)}"><div class="pool" id="mypool"></div></details></section>
${isMoba ? `<section id="buildsec"><h2>${esc(t.yourHero)}</h2><div class="heroline"><span id="heroIcon"></span>
<select class="lang" id="heroSel" aria-label="${esc(t.yourHero)}" style="font-size:1rem;padding:8px 10px;max-width:260px"></select></div></section>
<section><h2>${esc(t.buildTitle)}</h2><div class="card"><p class="note" id="partial" hidden>${esc(t.partialNote)}</p><ol class="build" id="build"></ol><h2 id="emblemHead" style="margin:16px 0 10px" hidden></h2><ol class="build" id="emblem" hidden></ol><ul class="tips" id="tips"></ul></div>
<p class="note" style="margin-top:8px">${esc(t.itemNote)}</p></section>
<section class="card" id="report"><h2>${esc(t.reportTitle)}</h2><p class="note" id="reportHint"></p>
<div class="bar"><button class="btn" id="winBtn" type="button">✓ ${esc(t.winBtn)}</button><button class="btn ghost" id="lossBtn" type="button">✕ ${esc(t.lossBtn)}</button></div><p class="note" id="reportMsg" aria-live="polite"></p></section>` : `<section><div class="card"><ul class="tips" id="tips" style="margin:0"></ul></div></section>`}
<div class="bar"><button class="btn" id="speak" type="button">🔊 ${esc(t.speak)}</button><button class="btn ghost" id="clear" type="button">${esc(t.clear)}</button>${isMoba ? `<a class="btn ghost" href="/${gp}/draft/">🎯 ${esc(t.draftLink)}</a>` : ''}</div>
<section><h2>${esc(isMoba ? t.allHeroes : t.allBrawlers)}</h2><div class="list-links">${links}</div></section>`;
      write(`${gp}/index.html`, layout({ lang, rel: `${gp}/`, title: `${gameTitle(g)} · ${cfg.siteName}`, desc: gameDesc(g), active: g.id, body, app }));

      if (isMoba) write(`${gp}/draft/index.html`, layout({
        lang, rel: `${gp}/draft/`, active: g.id, app: { lang, game: g.id, kind: 'draft', t: tSub, data: D },
        title: `${tt('draftTitle', { g: g.name })} · ${cfg.siteName}`, desc: t.draftDesc,
        body: `<section><h1>${esc(tt('draftTitle', { g: g.name }))}</h1><p class="lead">${esc(t.draftDesc)}</p></section>
<section><div class="teams"><div class="team"><b>${esc(t.draftYou)}</b><div class="slots" id="dme" style="grid-template-columns:repeat(5,1fr)"></div></div>
<div class="team"><b>${esc(t.draftBot)}</b><div class="slots" id="dbot" style="grid-template-columns:repeat(5,1fr)"></div></div></div>
<p class="status" id="status" aria-live="polite"></p><ul class="tips" id="dlog" style="margin:0"></ul></section>
<section id="pickbox"><h2>${esc(t.suggestForYou)}</h2><div class="pool" id="sugg" style="max-height:none"></div>
<input id="q" type="search" placeholder="${esc(t.search)}" autocomplete="off" aria-label="${esc(t.search)}"><div class="pool" id="pool"></div></section>
<section class="card" id="result" hidden></section>
<div class="bar"><button class="btn" id="again" type="button">${esc(t.draftAgain)}</button><a class="btn ghost" href="/${gp}/">${esc(gameTitle(g))}</a></div>`
      }));
      for (const h of list) {
        const x = h.n;
        let inner;
        if (isMoba) {
          const picks = Engine.mlScore(D, [x], null).slice(0, 8);
          const strong = Engine.mlStrongAgainst(D, x);
          const items = Engine.mlCounterItems(D, x);
          const own = Engine.mlBuild(D, x, []);
          const traits = [...h.t].map(k => t['tr_' + k]).filter(Boolean);
          inner = `<section><div class="heroline">${Icons.hero(x, h.r, 56)}<h1>${esc(tt('hp_h1', { x }))}</h1></div>
<p class="lead">${esc(tt('hp_about', { x, role: t['role_' + h.r].toLowerCase(), dmg: h.d === 'P' ? t.dmgP : t.dmgM }))}${traits.length ? ' ' + esc(t.hp_traits) + ': ' + esc(traits.join(', ')) + '.' : ''}</p></section>
<section><h2>${esc(tt('hp_best', { x }))}</h2><div class="card">${picks.map(p => `<div class="pick">${Icons.hero(p.n, p.r, 36)}<span class="pmain"><span><span class="score ${scoreCls(p.s)}">${p.s.toFixed(1)}</span> <b><a href="/${gp}/${slug(p.n)}/" style="color:inherit">${esc(p.n)}</a></b> <span class="role">${esc(t['role_' + p.r])}</span></span><span class="why">${esc(p.why.length ? [...new Set(p.why.map(w => t[w]))].join(' · ') : t.neutral)}</span></span><span></span></div>`).join('')}</div></section>
${items.length ? `<section><h2>${esc(tt('hp_items', { x }))}</h2><div class="card"><ol class="build">${items.map(([i, r]) => `<li class="adapt">${itemHtml(lang, i, t)}<small class="why">${esc(t[r] || '')}</small></span></li>`).join('')}</ol></div></section>` : ''}
${strong.length ? `<section><h2>${esc(tt('hp_strong', { x }))}</h2><p style="margin:0">${esc(strong.map(k => t['s_' + k]).join(', '))}</p></section>` : ''}
${own.items.length ? `<section><h2>${esc(tt('hp_build', { x }))}</h2><div class="card"><ol class="build">${own.items.map(o => `<li>${itemHtml(lang, o.item, t)}</span></li>`).join('')}</ol>
${own.emblem ? `<h2 style="margin:16px 0 10px">${esc(own.emblem.set ? t.emblemTitle : t.runeTitle)}</h2><ol class="build">${(own.emblem.set ? [['em_set', own.emblem.set], ['em_t1', own.emblem.t1], ['em_t2', own.emblem.t2], ['em_core', own.emblem.core]] : [['runeTitle', own.emblem.core]]).map(([k, v]) => `<li>${Icons.talent(v, 32)}<span class="iname">${esc(v)}<small class="why">${esc(t[k])}</small></span></li>`).join('')}</ol>` : ''}
<ul class="tips"><li>${esc(t.spell)}: ${esc(itemName(lang, own.spell, t))}</li></ul></div></section>` : ''}`;
        } else {
          const picks = Engine.bsScore(D, [x], null, null).slice(0, 8);
          const strong = Engine.bsStrongAgainst(D, x);
          const whyTxt = w => w.k === 'bw_counter' ? tt('bw_counter', { cls: t['cl_' + w.cls] }) : w.k === 'bw_mode' ? tt('bw_mode', { mode: t['m_' + w.mode] }) : t[w.k];
          inner = `<section><div class="heroline">${Icons.hero(x, h.c, 56)}<h1>${esc(tt('bp_h1', { x }))}</h1></div><p class="lead">${esc(tt('bp_about', { x, cls: t['cl_' + h.c] }))}</p></section>
<section><h2>${esc(tt('bp_best', { x }))}</h2><div class="card">${picks.map(p => `<div class="pick">${Icons.hero(p.n, p.c, 36)}<span class="pmain"><span><span class="score ${scoreCls(p.s)}">${p.s.toFixed(1)}</span> <b><a href="/${gp}/${slug(p.n)}/" style="color:inherit">${esc(p.n)}</a></b> <span class="role">${esc(t['cl_' + p.c])}</span></span><span class="why">${esc(p.why.length ? [...new Set(p.why.map(whyTxt))].join(' · ') : t.neutral)}</span></span><span></span></div>`).join('')}</div></section>
${strong.length ? `<section><h2>${esc(tt('bp_strong', { x }))}</h2><p style="margin:0">${esc(strong.map(c => t['cl_' + c]).join(', '))}</p></section>` : ''}
<section><h2>${esc(tt('bp_tip', { cls: t['cl_' + h.c] }))}</h2><p style="margin:0">${esc(t['bt_' + h.c])}</p>${D.gears && D.gears[h.c] ? `<p style="margin:8px 0 0"><b>${esc(t.gearTitle)}:</b> ${esc(D.gears[h.c].join(' + '))}</p>` : ''}</section>`;
        }
        const comm = isMoba ? `<section class="card" id="community" hidden data-game="${g.id}" data-hero="${esc(x)}" data-t="${esc(JSON.stringify({ commTitle: t.commTitle, commRate: t.commRate, commVs: t.commVs, commFew: t.commFew }))}"></section>` : '';
        const body2 = `${inner}
${comm}
<div class="bar"><a class="btn" href="/${gp}/?e=${encodeURIComponent(x)}">${esc(tt('hp_try', { x }))}</a></div>
<section><h2>${esc(isMoba ? t.allHeroes : t.allBrawlers)}</h2><div class="list-links">${links}</div></section>`;
        write(`${gp}/${slug(x)}/index.html`, layout({
          lang, rel: `${gp}/${slug(x)}/`, active: g.id, body: body2,
          title: `${isMoba ? tt('hp_title', { x }) : tt('bp_title', { x })} · ${g.name}`,
          desc: isMoba ? tt('hp_desc', { x, g: g.full }) : tt('bp_desc', { x })
        }));
      }
    }

    if (g.kind === 'ff') {
      const chars = D.characters;
      const links = chars.map(c => `<a href="/${gp}/${slug(c.n)}/">${esc(c.n)}</a>`).join('');
      const body = `<section><h1>${esc(t.ffToolTitle)}</h1><p class="lead">${esc(t.ffToolDesc)}</p></section>
<section><h2>${esc(t.playstyle)}</h2><div class="row seg" id="styles"></div></section>
<section><h2>${esc(t.ffMode)}</h2><div class="row seg" id="ffmodes"></div></section>
<section><h2>${esc(t.threats)}</h2><div class="row seg" id="threats"></div></section>
<section><h2>${esc(t.ffCombo)}</h2><div class="card" id="combo"></div></section>
<div class="bar"><button class="btn" id="speak" type="button">🔊 ${esc(t.speak)}</button></div>
<section><h2>${esc(t.allCharacters)}</h2><div class="list-links">${links}</div></section>`;
      write(`${gp}/index.html`, layout({ lang, rel: `${gp}/`, title: `${t.ffToolTitle} · ${cfg.siteName}`, desc: t.ffToolDesc, active: g.id, body, app }));
      for (const c of chars) {
        const best = Engine.ffBestStyle(D, c.n);
        const combo = Engine.ffCombo(D, best.style, best.mode, [], c.n);
        const card = (x, label) => `<div class="pick">${Icons.hero(x.n, x.type, 40)}<span class="pmain"><span><b><a href="/${gp}/${slug(x.n)}/" style="color:inherit">${esc(x.n)}</a></b> <span class="role">${esc(label)}</span></span><span class="why">${esc(x.why.map(k => t[k]).join(' · '))}</span></span><span></span></div>`;
        const tags = c.tags.map(k => t['f_' + k]).filter(Boolean);
        const body2 = `<section><div class="heroline">${Icons.hero(c.n, c.type, 56)}<h1>${esc(tt('fp_h1', { x: c.n }))}</h1></div>
<p class="lead">${esc(tt(c.type === 'a' ? 'fp_aboutA' : 'fp_aboutP', { x: c.n }))} ${esc(tags.join(', '))}.</p></section>
<section><h2>${esc(tt('fp_best', { x: c.n }))}</h2><p class="note" style="margin:0 0 8px">${esc(t.fp_style)}: ${esc(t['ps_' + best.style])} · ${esc(t['ff_' + best.mode])}</p>
<div class="card">${card(combo.active, t.activeSkill)}${combo.passives.map(p => card(p, t.passiveSkill)).join('')}</div></section>
<div class="bar"><a class="btn" href="/${gp}/?c=${encodeURIComponent(c.n)}">${esc(tt('hp_try', { x: c.n }))}</a></div>
<section><h2>${esc(t.allCharacters)}</h2><div class="list-links">${links}</div></section>`;
        write(`${gp}/${slug(c.n)}/index.html`, layout({ lang, rel: `${gp}/${slug(c.n)}/`, active: g.id, body: body2, title: `${tt('fp_title', { x: c.n })} · Free Fire`, desc: tt('fp_desc', { x: c.n }) }));
      }
    }
  }

  /* News */
  write(`${lang}/news/index.html`, layout({ lang, rel: `${lang}/news/`, active: 'news', title: `${t.news} · ${cfg.siteName}`, desc: t.newsDesc,
    body: `<section><h1>${esc(t.news)}</h1><p class="lead">${esc(t.newsDesc)}</p></section><section>${newsCards(lang, NEWS)}</section>` }));
  for (const n of NEWS) {
    const g = GAMES.find(x => x.id === n.game);
    const blocks = (n.body[lang] || n.body.en).map(b => b.h ? `<h2>${esc(b.h)}</h2>` : b.ul ? `<ul>${b.ul.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : `<p>${esc(b.p)}</p>`).join('\n');
    const title = n.title[lang] || n.title.en;
    write(`${lang}/news/${n.slug}/index.html`, layout({
      lang, rel: `${lang}/news/${n.slug}/`, active: 'news', type: 'article', title: `${title} · ${cfg.siteName}`, desc: n.summary[lang] || n.summary.en,
      jsonld: { '@context': 'https://schema.org', '@type': n.type === 'guide' ? 'Article' : 'NewsArticle', headline: title, datePublished: n.date, dateModified: n.date, inLanguage: lang, publisher: { '@type': 'Organization', name: cfg.siteName }, author: { '@type': 'Organization', name: cfg.siteName } },
      body: `<article class="prose"><p class="note">${esc(t.publishedOn)}: ${esc(n.date)}${g ? ' · ' + esc(g.full) : ''}</p><h1>${esc(title)}</h1>${blocks}
${n.sources && n.sources.length ? `<p class="note">${esc(n.sources.join(' · '))}</p>` : ''}</article>
<div class="bar">${g && n.hero ? `<a class="btn ghost" href="/${lang}/${g.slug}/${slug(n.hero)}/">${esc(tt('hp_h1', { x: n.hero }))}</a>` : ''}${g ? `<a class="btn" href="/${lang}/${g.slug}/">${esc(t.openTool)} →</a>` : ''}</div>`
    }));
  }

  /* Privacy & About */
  write(`${lang}/privacy/index.html`, layout({ lang, rel: `${lang}/privacy/`, title: `${t.privTitle} · ${cfg.siteName}`, desc: t.privBody[0],
    body: `<section class="prose"><h1>${esc(t.privTitle)}</h1>${t.privBody.map(p => `<p>${esc(p)}</p>`).join('')}</section>` }));
  write(`${lang}/about/index.html`, layout({ lang, rel: `${lang}/about/`, title: `${t.aboutTitle} · ${cfg.siteName}`, desc: t.aboutBody[0],
    body: `<section class="prose"><h1>${esc(t.aboutTitle)}</h1>${t.aboutBody.map(p => `<p>${esc(p)}</p>`).join('')}${cfg.contactEmail ? `<p>${esc(t.contact)}: <span style="user-select:all">${esc(cfg.contactEmail)}</span></p>` : ''}</section>` }));
}

/* Root, assets, SEO files */
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(cfg.siteName)}</title><meta name="description" content="${esc(I18N.en.homeText)}">
${cfg.googleVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleVerification)}">` : ''}
${cfg.langs.map(l => `<link rel="alternate" hreflang="${l}" href="${base}/${l}/">`).join('')}
<script>(function(){var L=${JSON.stringify(cfg.langs)},s=null;try{s=localStorage.getItem('lang')}catch(e){}
var n=(s||navigator.language||'en').slice(0,2).toLowerCase();location.replace('/'+(L.indexOf(n)>-1?n:'${cfg.defaultLang}')+'/');})();</script>
</head><body style="background:#0c1018;color:#e9edf5;font-family:system-ui;padding:24px">
${cfg.langs.map(l => `<a style="color:#e8b44a;margin-right:12px" href="/${l}/">${esc(I18N[l].langName)}</a>`).join('')}
</body></html>`);
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of ['style.css', 'app.js', 'engine.js', 'icons.js']) fs.copyFileSync(R('src/' + f), path.join(OUT, 'assets', f));
fs.writeFileSync(path.join(OUT, 'assets/icon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0c1018"/><circle cx="16" cy="16" r="10" fill="none" stroke="#e8b44a" stroke-width="2.5"/><circle cx="16" cy="16" r="4" fill="#e2595b"/><path d="M16 3v6M16 23v6M3 16h6M23 16h6" stroke="#e8b44a" stroke-width="2.5"/></svg>');
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}`);
if (base) fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `<url><loc>${base}/${p}</loc><lastmod>${lastUpdated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
if (cfg.adsenseClient) fs.writeFileSync(path.join(OUT, 'ads.txt'), `google.com, ${cfg.adsenseClient.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html><meta charset="utf-8"><title>404</title><body style="background:#0c1018;color:#e9edf5;font-family:system-ui;padding:24px"><p>404 · <a style="color:#e8b44a" href="/">${esc(cfg.siteName)}</a></p></body>`);
console.log(`Built ${pages.length} pages into dist/`);
