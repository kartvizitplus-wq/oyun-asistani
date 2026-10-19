#!/usr/bin/env node
/* Tells Bing, Yandex and other IndexNow engines which pages changed, so they crawl them right away.
   Run after the deploy is live: node tools/indexnow.js            -> URLs of pages changed in the last commit
                                  node tools/indexnow.js --all      -> every URL in dist/sitemap.xml (run node build.js first) */
const fs = require('fs'), path = require('path'), https = require('https'), { execSync } = require('child_process');
const KEY = '4d05c15d8c2b41aa9fe8f52866baa88a', HOST = 'pickradar.net', BASE = 'https://' + HOST;
let urls;
if (process.argv.includes('--all')) {
  urls = [...fs.readFileSync(path.join(__dirname, '../dist/sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
} else {
  const changed = execSync('git diff --name-only HEAD~1 HEAD', { cwd: path.join(__dirname, '..') }).toString().split('\n');
  const langs = ['en', 'tr', 'id', 'es', 'pt'], set = new Set();
  const games = { 'data/mlbb.json': 'mlbb', 'data/hok.json': 'honor-of-kings', 'data/wildrift.json': 'wild-rift', 'data/freefire.json': 'free-fire', 'data/brawlstars.json': 'brawl-stars' };
  for (const f of changed) {
    const m = f.match(/^data\/news\/\d{4}-\d{2}-\d{2}-(.+)\.json$/);
    if (m && fs.existsSync(path.join(__dirname, '..', f))) { const s = JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).slug; langs.forEach(l => set.add(`${BASE}/${l}/news/${s}/`)); }
    if (games[f]) langs.forEach(l => { set.add(`${BASE}/${l}/${games[f]}/`); set.add(`${BASE}/${l}/${games[f]}/tier-list/`); });
  }
  if (set.size) langs.forEach(l => { set.add(`${BASE}/${l}/`); set.add(`${BASE}/${l}/news/`); });
  urls = [...set];
}
if (!urls.length) { console.log('IndexNow: nothing to submit'); process.exit(0); }
const send = list => new Promise(res => {
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList: list });
  const req = https.request('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) } },
    r => { console.log(`IndexNow: ${list.length} URLs -> HTTP ${r.statusCode}`); r.resume(); r.on('end', res); });
  req.on('error', e => { console.log('IndexNow error: ' + e.message); res(); }); req.end(body);
});
(async () => { for (let i = 0; i < urls.length; i += 10000) await send(urls.slice(i, i + 10000)); })();
