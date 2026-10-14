#!/usr/bin/env node
/* Static site generator. Run: node build.js  ->  writes everything to dist/. No dependencies. */
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, p);
const read = p => JSON.parse(fs.readFileSync(R(p), 'utf8'));
const cfg = read('config.json'), I18N = read('src/i18n.json');
const ML = read('data/mlbb.json'), BS = read('data/brawlstars.json'), ITEMS_TR = read('data/mlbb-items-tr.json');
const Engine = require('./src/engine.js');
const OUT = R('dist');

const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fill = (s, v) => { for (const k in v || {}) s = s.split('{' + k + '}').join(v[k]); return s; };
const base = (cfg.baseUrl || '').replace(/\/$/, '');
const pages = [];

function write(rel, html) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}
function itemName(lang, i) { return (lang === 'tr' && ITEMS_TR[i]) || i; }
function itemHtml(lang, i) { const n = itemName(lang, i); return esc(n) + (n !== i ? ' <small class="note">(' + esc(i) + ')</small>' : ''); }
const scoreCls = s => s >= 7 ? 'good' : s >= 5 ? 'mid' : 'bad';

function layout({ lang, rel, title, desc, body, active, app }) {
  const t = I18N[lang];
  const tail = rel.replace(/^[a-z]{2}\//, '');
  pages.push(rel);
  const alts = cfg.langs.map(l => `<link rel="alternate" hreflang="${l}" href="${base}/${l}/${tail}">`).join('') +
    `<link rel="alternate" hreflang="x-default" href="${base}/${cfg.defaultLang}/${tail}">`;
  const langOpts = cfg.langs.map(l => `<option value="${l}" data-href="/${l}/${tail}"${l === lang ? ' selected' : ''}>${esc(I18N[l].langName)}</option>`).join('');
  const ads = cfg.adsenseClient ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(cfg.adsenseClient)}" crossorigin="anonymous"></script>` : '';
  const appJs = app ? `<script>window.APP=${JSON.stringify(app).replace(/</g, '\\u003c')}</script><script src="/assets/engine.js"></script>` : '';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${base ? `<link rel="canonical" href="${base}/${rel}">` : ''}${alts}
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website">
<link rel="icon" href="/assets/icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&family=IBM+Plex+Sans:wght@400;600&display=swap">
<link rel="stylesheet" href="/assets/style.css">
${ads}
</head>
<body>
<header class="top"><div class="wrap">
<a class="logo" href="/${lang}/">${esc(cfg.siteName).replace(/(Radar)$/, '<span>$1</span>')}</a>
<nav class="games"><a href="/${lang}/mlbb/"${active === 'mlbb' ? ' aria-current="page"' : ''}>Mobile Legends</a><a href="/${lang}/brawl-stars/"${active === 'bs' ? ' aria-current="page"' : ''}>Brawl Stars</a></nav>
<label><span class="note" hidden>${esc(t.language)}</span><select class="lang" id="langSel" aria-label="${esc(t.language)}">${langOpts}</select></label>
</div></header>
<main class="wrap">
${body}
</main>
<footer><div class="wrap">
<span>${esc(t.disclaimer)}</span>
<span><a href="/${lang}/about/">${esc(t.about)}</a> · <a href="/${lang}/privacy/">${esc(t.privacy)}</a> · ${esc(t.updatedOn)}: ${esc([ML.updated, BS.updated].sort().pop())}</span>
</div></footer>
${appJs}<script src="/assets/app.js"></script>
</body>
</html>`;
}

/* ---------- pages ---------- */
for (const lang of cfg.langs) {
  const t = I18N[lang];
  const tt = (k, v) => fill(t[k] || k, v);

  // Home
  write(`${lang}/index.html`, layout({
    lang, rel: `${lang}/`, title: `${cfg.siteName} · ${t.tagline}`, desc: t.homeText,
    body: `<section><h1>${esc(t.homeH1)}</h1><p class="lead">${esc(t.homeText)}</p></section>
<section><h2>${esc(t.chooseGame)}</h2><div class="games-grid">
<a class="game" href="/${lang}/mlbb/"><h3>${esc(t.mlbbName)}</h3><span class="note">${esc(t.mlbbToolDesc)}</span><span class="go">${esc(t.openTool)} →</span></a>
<a class="game" href="/${lang}/brawl-stars/"><h3>${esc(t.bsName)}</h3><span class="note">${esc(t.bsToolDesc)}</span><span class="go">${esc(t.openTool)} →</span></a>
</div></section>`
  }));

  // MLBB tool
  const mlLinks = ML.heroes.map(h => `<a href="/${lang}/mlbb/${slug(h.n)}/">${esc(h.n)}</a>`).join('');
  const toolBody = (isML) => `<section><h1>${esc(isML ? t.mlbbToolTitle : t.bsToolTitle)}</h1><p class="lead">${esc(isML ? t.mlbbToolDesc : t.bsToolDesc)}</p></section>
<section><h2>${esc(t.enemyTeam)}</h2>
<div class="slots" id="slots"></div>
<p class="note" id="example" hidden>${esc(t.exampleNote)}</p>
<input id="q" type="search" placeholder="${esc(t.search)}" autocomplete="off">
<div class="pool" id="pool"></div></section>
${isML ? '' : `<section><h2>${esc(t.mode)}</h2><div class="row seg" id="modes"></div></section>`}
<section><h2>${esc(t.bestPicks)}</h2><div class="card" id="picks"></div>
<details class="poolbox card" style="margin-top:10px"><summary>${esc(t.myPool)}<span id="poolcount"></span></summary>
<p class="note">${esc(t.poolHint)}</p><input id="pq" type="search" placeholder="${esc(t.search)}" autocomplete="off"><div class="pool" id="mypool"></div></details></section>
${isML ? `<section id="buildsec"><h2>${esc(t.yourHero)}</h2>
<select class="lang" id="heroSel" aria-label="${esc(t.yourHero)}" style="font-size:1rem;padding:8px 10px;max-width:280px"></select></section>
<section><h2>${esc(t.buildTitle)}</h2><div class="card"><ol class="build" id="build"></ol><ul class="tips" id="tips"></ul></div>
<p class="note" style="margin-top:8px">${esc(t.itemNote)}</p></section>` : `<section><div class="card"><ul class="tips" id="tips" style="margin:0"></ul></div></section>`}
<div class="bar"><button class="btn" id="speak" type="button">🔊 ${esc(t.speak)}</button><button class="btn ghost" id="clear" type="button">${esc(t.clear)}</button></div>
<section><h2>${esc(isML ? t.allHeroes : t.allBrawlers)}</h2><div class="list-links">${isML ? mlLinks : BS.brawlers.map(b => `<a href="/${lang}/brawl-stars/${slug(b.n)}/">${esc(b.n)}</a>`).join('')}</div></section>`;
  const tKeys = Object.keys(t).filter(k => !/^(priv|about)Body$|^homeText$/.test(k));
  const tSub = Object.fromEntries(tKeys.map(k => [k, t[k]]));
  write(`${lang}/mlbb/index.html`, layout({
    lang, rel: `${lang}/mlbb/`, title: `${t.mlbbToolTitle} · ${cfg.siteName}`, desc: t.mlbbToolDesc, active: 'mlbb',
    body: toolBody(true), app: { lang, game: 'mlbb', t: tSub, data: ML, itemsTr: lang === 'tr' ? ITEMS_TR : null }
  }));
  write(`${lang}/brawl-stars/index.html`, layout({
    lang, rel: `${lang}/brawl-stars/`, title: `${t.bsToolTitle} · ${cfg.siteName}`, desc: t.bsToolDesc, active: 'bs',
    body: toolBody(false), app: { lang, game: 'brawlstars', t: tSub, data: BS }
  }));

  // MLBB hero pages
  for (const h of ML.heroes) {
    const x = h.n;
    const picks = Engine.mlScore(ML, [x], null).slice(0, 8);
    const strong = Engine.mlStrongAgainst(ML, x);
    const items = Engine.mlCounterItems(ML, x);
    const own = Engine.mlBuild(ML, x, []);
    const traits = [...h.t].map(k => t['tr_' + k]).filter(Boolean);
    const body = `<section><h1>${esc(tt('hp_h1', { x }))}</h1>
<p class="lead">${esc(tt('hp_about', { x, role: t['role_' + h.r].toLowerCase(), dmg: h.d === 'P' ? t.dmgP : t.dmgM }))}${traits.length ? ' ' + esc(t.hp_traits) + ': ' + esc(traits.join(', ')) + '.' : ''}</p></section>
<section><h2>${esc(tt('hp_best', { x }))}</h2><div class="card">${picks.map(p => `<div class="pick"><span class="score ${scoreCls(p.s)}">${p.s.toFixed(1)}</span><span><b><a href="/${lang}/mlbb/${slug(p.n)}/" style="color:inherit">${esc(p.n)}</a></b> <span class="role">${esc(t['role_' + p.r])}</span></span><span></span><span class="why">${esc(p.why.length ? [...new Set(p.why.map(w => t[w]))].join(' · ') : t.neutral)}</span></div>`).join('')}</div></section>
<section><h2>${esc(tt('hp_items', { x }))}</h2><div class="card"><ol class="build">${items.map(([i, r]) => `<li class="adapt">${itemHtml(lang, i)}<small class="why">${esc(t[r] || '')}</small></li>`).join('')}</ol></div></section>
${strong.length ? `<section><h2>${esc(tt('hp_strong', { x }))}</h2><p style="margin:0">${esc(strong.map(k => t['s_' + k]).join(', '))}</p></section>` : ''}
<section><h2>${esc(tt('hp_build', { x }))}</h2><div class="card"><ol class="build">${own.items.map(o => `<li>${itemHtml(lang, o.item)}</li>`).join('')}</ol>
<ul class="tips"><li>${esc(t.spell)}: ${itemHtml(lang, own.spell)}</li></ul></div></section>
<div class="bar"><a class="btn" href="/${lang}/mlbb/?e=${encodeURIComponent(x)}">${esc(tt('hp_try', { x }))}</a></div>
<section><h2>${esc(t.allHeroes)}</h2><div class="list-links">${mlLinks}</div></section>`;
    write(`${lang}/mlbb/${slug(x)}/index.html`, layout({ lang, rel: `${lang}/mlbb/${slug(x)}/`, title: tt('hp_title', { x }), desc: tt('hp_desc', { x }), active: 'mlbb', body }));
  }

  // Brawl Stars pages
  const bsLinks = BS.brawlers.map(b => `<a href="/${lang}/brawl-stars/${slug(b.n)}/">${esc(b.n)}</a>`).join('');
  for (const b of BS.brawlers) {
    const x = b.n;
    const picks = Engine.bsScore(BS, [x], null, null).slice(0, 8);
    const strong = Engine.bsStrongAgainst(BS, x);
    const whyTxt = w => w.k === 'bw_counter' ? tt('bw_counter', { cls: t['cl_' + w.cls] }) : w.k === 'bw_mode' ? tt('bw_mode', { mode: t['m_' + w.mode] }) : t[w.k];
    const body = `<section><h1>${esc(tt('bp_h1', { x }))}</h1><p class="lead">${esc(tt('bp_about', { x, cls: t['cl_' + b.c] }))}</p></section>
<section><h2>${esc(tt('bp_best', { x }))}</h2><div class="card">${picks.map(p => `<div class="pick"><span class="score ${scoreCls(p.s)}">${p.s.toFixed(1)}</span><span><b><a href="/${lang}/brawl-stars/${slug(p.n)}/" style="color:inherit">${esc(p.n)}</a></b> <span class="role">${esc(t['cl_' + p.c])}</span></span><span></span><span class="why">${esc(p.why.length ? [...new Set(p.why.map(whyTxt))].join(' · ') : t.neutral)}</span></div>`).join('')}</div></section>
${strong.length ? `<section><h2>${esc(tt('bp_strong', { x }))}</h2><p style="margin:0">${esc(strong.map(c => t['cl_' + c]).join(', '))}</p></section>` : ''}
<section><h2>${esc(tt('bp_tip', { cls: t['cl_' + b.c] }))}</h2><p style="margin:0">${esc(t['bt_' + b.c])}</p></section>
<div class="bar"><a class="btn" href="/${lang}/brawl-stars/?e=${encodeURIComponent(x)}">${esc(tt('hp_try', { x }))}</a></div>
<section><h2>${esc(t.allBrawlers)}</h2><div class="list-links">${bsLinks}</div></section>`;
    write(`${lang}/brawl-stars/${slug(x)}/index.html`, layout({ lang, rel: `${lang}/brawl-stars/${slug(x)}/`, title: tt('bp_title', { x }), desc: tt('bp_desc', { x }), active: 'bs', body }));
  }

  // Privacy & About
  write(`${lang}/privacy/index.html`, layout({ lang, rel: `${lang}/privacy/`, title: `${t.privTitle} · ${cfg.siteName}`, desc: t.privBody[0],
    body: `<section class="prose"><h1>${esc(t.privTitle)}</h1>${t.privBody.map(p => `<p>${esc(p)}</p>`).join('')}</section>` }));
  write(`${lang}/about/index.html`, layout({ lang, rel: `${lang}/about/`, title: `${t.aboutTitle} · ${cfg.siteName}`, desc: t.aboutBody[0],
    body: `<section class="prose"><h1>${esc(t.aboutTitle)}</h1>${t.aboutBody.map(p => `<p>${esc(p)}</p>`).join('')}${cfg.contactEmail ? `<p>${esc(t.contact)}: <span style="user-select:all">${esc(cfg.contactEmail)}</span></p>` : ''}</section>` }));
}

/* ---------- root, assets, SEO files ---------- */
const langMap = JSON.stringify(cfg.langs);
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(cfg.siteName)}</title><meta name="description" content="${esc(I18N.en.homeText)}">
${cfg.langs.map(l => `<link rel="alternate" hreflang="${l}" href="${base}/${l}/">`).join('')}
<script>(function(){var L=${langMap},s=null;try{s=localStorage.getItem('lang')}catch(e){}
var n=(s||navigator.language||'en').slice(0,2).toLowerCase();location.replace('/'+(L.indexOf(n)>-1?n:'${cfg.defaultLang}')+'/');})();</script>
</head><body style="background:#0c1018;color:#e9edf5;font-family:system-ui;padding:24px">
${cfg.langs.map(l => `<a style="color:#e8b44a;margin-right:12px" href="/${l}/">${esc(I18N[l].langName)}</a>`).join('')}
</body></html>`);
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of ['style.css', 'app.js', 'engine.js']) fs.copyFileSync(R('src/' + f), path.join(OUT, 'assets', f));
fs.writeFileSync(path.join(OUT, 'assets/icon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0c1018"/><circle cx="16" cy="16" r="10" fill="none" stroke="#e8b44a" stroke-width="2.5"/><circle cx="16" cy="16" r="4" fill="#e2595b"/><path d="M16 3v6M16 23v6M3 16h6M23 16h6" stroke="#e8b44a" stroke-width="2.5"/></svg>');
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}`);
if (base) fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `<url><loc>${base}/${p}</loc></url>`).join('\n')}\n</urlset>\n`);
if (cfg.adsenseClient) fs.writeFileSync(path.join(OUT, 'ads.txt'), `google.com, ${cfg.adsenseClient.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html><meta charset="utf-8"><title>404</title><body style="background:#0c1018;color:#e9edf5;font-family:system-ui;padding:24px"><p>404 · <a style="color:#e8b44a" href="/">${esc(cfg.siteName)}</a></p></body>`);
console.log(`Built ${pages.length} pages into dist/`);
