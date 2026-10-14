/* Shared helpers for the community match-result API (Cloudflare Pages Functions + D1, binding name DB). */
export const GAMES = ['mlbb', 'hok', 'wildrift'];
export const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});
export async function ensure(db) {
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS hero_results (game TEXT, hero TEXT, wins INTEGER DEFAULT 0, losses INTEGER DEFAULT 0, PRIMARY KEY (game, hero))'),
    db.prepare('CREATE TABLE IF NOT EXISTS matchup_results (game TEXT, hero TEXT, vs TEXT, wins INTEGER DEFAULT 0, losses INTEGER DEFAULT 0, PRIMARY KEY (game, hero, vs))'),
    db.prepare('CREATE TABLE IF NOT EXISTS rate (key TEXT PRIMARY KEY, day TEXT, n INTEGER)')
  ]);
}
export async function sha(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
}
export const cleanName = s => typeof s === 'string' && /^[\p{L}\p{N} .'&-]{1,40}$/u.test(s) ? s : null;
