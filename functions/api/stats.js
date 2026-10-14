/* GET /api/stats?game=mlbb&hero=Ling  ->  {ok, wins, losses, vs: [{n, wins, losses}]}  (community match results) */
import { GAMES, json, ensure, cleanName } from './_db.js';

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: 'not_configured' }, 503);
  const u = new URL(request.url);
  const game = GAMES.includes(u.searchParams.get('game')) ? u.searchParams.get('game') : null;
  const hero = cleanName(u.searchParams.get('hero'));
  if (!game || !hero) return json({ ok: false, error: 'bad_input' }, 400);
  await ensure(env.DB);
  const h = await env.DB.prepare('SELECT wins, losses FROM hero_results WHERE game = ? AND hero = ?').bind(game, hero).first();
  const vs = await env.DB.prepare('SELECT vs AS n, wins, losses FROM matchup_results WHERE game = ? AND hero = ? AND wins + losses >= 5 ORDER BY wins + losses DESC LIMIT 20').bind(game, hero).all();
  return new Response(JSON.stringify({ ok: true, wins: h ? h.wins : 0, losses: h ? h.losses : 0, vs: vs.results || [] }), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' }
  });
}
