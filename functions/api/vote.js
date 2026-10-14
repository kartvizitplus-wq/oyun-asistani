/* POST /api/vote  {game, hero, enemy: [names], result: "win" | "loss"}
   Stores anonymous match results. Each visitor (hashed IP, rotated daily) can send at most 30 results per day. */
import { GAMES, json, ensure, sha, cleanName } from './_db.js';

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: 'not_configured' }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  const game = GAMES.includes(body.game) ? body.game : null;
  const hero = cleanName(body.hero);
  const win = body.result === 'win' ? 1 : body.result === 'loss' ? 0 : null;
  const enemy = Array.isArray(body.enemy) ? [...new Set(body.enemy.map(cleanName).filter(Boolean))].slice(0, 5) : [];
  if (!game || !hero || win === null) return json({ ok: false, error: 'bad_input' }, 400);

  const db = env.DB;
  await ensure(db);
  const day = new Date().toISOString().slice(0, 10);
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const key = await sha(ip + '|' + day);
  const row = await db.prepare('SELECT n FROM rate WHERE key = ?').bind(key).first();
  if (row && row.n >= 30) return json({ ok: false, error: 'limit' }, 429);

  const w = win, l = 1 - win;
  const stmts = [
    db.prepare('INSERT INTO rate (key, day, n) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET n = n + 1').bind(key, day),
    db.prepare('DELETE FROM rate WHERE day < ?').bind(day),
    db.prepare('INSERT INTO hero_results (game, hero, wins, losses) VALUES (?, ?, ?, ?) ON CONFLICT(game, hero) DO UPDATE SET wins = wins + ?, losses = losses + ?').bind(game, hero, w, l, w, l)
  ];
  for (const vs of enemy) stmts.push(db.prepare('INSERT INTO matchup_results (game, hero, vs, wins, losses) VALUES (?, ?, ?, ?, ?) ON CONFLICT(game, hero, vs) DO UPDATE SET wins = wins + ?, losses = losses + ?').bind(game, hero, vs, w, l, w, l));
  await db.batch(stmts);
  return json({ ok: true });
}
