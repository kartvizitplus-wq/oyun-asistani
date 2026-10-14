/* Recommendation engine shared by the browser tools and the static page generator. */
(function (root) {
  const TIER = { S: 1.2, A: 0.6, B: 0, C: -0.6 };
  const clamp = v => Math.max(0, Math.min(10, v));

  /* ---------- Mobile Legends ---------- */
  function mlStats(data, names) {
    const c = { n: 0, P: 0, M: 0, h: 0, c: 0, b: 0, d: 0, tank: 0, mm: 0, sq: 0, ass: 0 };
    const H = mlIndex(data);
    names.forEach(n => {
      const h = H[n]; if (!h) return;
      c.n++; c[h.d]++;
      for (const k of h.t) c[k]++;
      if (h.r === 'tank') c.tank++;
      if (h.r === 'marksman') c.mm++;
      if (h.r === 'assassin') c.ass++;
      if (h.r === 'mage' || h.r === 'marksman' || h.r === 'support') c.sq++;
    });
    return c;
  }
  function mlIndex(data) {
    if (!data._idx) data._idx = Object.fromEntries(data.heroes.map(h => [h.n, h]));
    return data._idx;
  }
  const ROLES = ['tank', 'fighter', 'assassin', 'mage', 'marksman', 'support'];
  /* Team composition analysis: damage split, role coverage and warnings. */
  function mlTeam(data, names) {
    const H = mlIndex(data), c = mlStats(data, names), roles = {};
    ROLES.forEach(r => roles[r] = 0);
    names.forEach(n => { const h = H[n]; if (h) roles[h.r]++; });
    const w = [];
    if (c.n >= 2) {
      if (!roles.tank) w.push('wa_noTank');
      if (!c.M) w.push('wa_noMagic');
      if (!c.P) w.push('wa_noPhys');
      if (!c.c) w.push('wa_noCC');
      if (c.sq >= 4) w.push('wa_squishy');
      if (c.n >= 4 && !roles.marksman && !roles.mage) w.push('wa_noCarry');
      if (!w.length) w.push('wa_ok');
    }
    return { n: c.n, P: c.P, M: c.M, cc: c.c, heal: c.h, roles, warn: w };
  }
  function mlScore(data, enemy, pool, allies) {
    const c = mlStats(data, enemy);
    allies = allies || [];
    const a = mlTeam(data, allies), ac = mlStats(data, allies);
    const list = data.heroes.filter(h => !enemy.includes(h.n) && !allies.includes(h.n) && (!pool || !pool.length || pool.includes(h.n)));
    return list.map(h => {
      let s = 5; const why = [];
      const add = (cond, v, key) => { if (!cond || !v) return; s += v * 0.55; if (Math.abs(v) >= 0.9) why.push(key); };
      const has = k => h.s.includes(k);
      add(has('antidash'), 1.5 * c.d, 'w_dash');
      add(has('antitank'), 1.3 * c.tank, 'w_tank');
      add(has('antisquishy'), 0.9 * c.sq, 'w_squishy');
      add(has('antiheal'), 1.5 * c.h, 'w_heal');
      add(has('antiburst'), 0.8 * c.b, 'w_burst');
      add(has('antimm'), 1.3 * c.mm, 'w_mm');
      add(has('anticc'), 0.9 * c.c, 'w_cc');
      add(h.r === 'mage' || h.r === 'marksman', -0.6 * c.ass, 'w_weak');
      if (allies.length >= 2) {
        add(!a.roles.tank && h.r === 'tank', 2.4, 'w_needTank');
        add(!ac.M && h.d === 'M', 1.7, 'w_needMagic');
        add(!ac.P && h.d === 'P', 1.7, 'w_needPhys');
        add(!ac.c && h.t.includes('c'), 1.2, 'w_needCC');
        add(allies.length >= 3 && !a.roles.marksman && h.r === 'marksman', 1.5, 'w_needMM');
        add(a.roles[h.r] >= 2, -2, 'w_dupRole');
      }
      if (h.tier && TIER[h.tier]) { s += TIER[h.tier]; if (TIER[h.tier] > 0) why.push('w_tier'); }
      return { n: h.n, r: h.r, s: clamp(s), why };
    }).sort((a, b) => b.s - a.s || a.n.localeCompare(b.n));
  }
  function mlBuild(data, heroName, enemy) {
    const h = mlIndex(data)[heroName];
    const a = data.archetypes[h.b];
    const base = h.build || a.items;
    const c = mlStats(data, enemy);
    const front = a.group === 'front', T = a.type, g = front ? 'front' : 'back';
    const C = data.counters || {};
    const pick = key => { const m = C[key] || {}; return m[g + T] || m[g] || m[T] || m.any || null; };
    const adds = [];
    const want = (item, p, reason) => { if (item) adds.push({ item, p, reason }); };
    if (c.h) want(pick('antiheal'), c.h * 2 + 1, 'r_antiheal');
    if (c.M >= 2) want(pick('magic'), c.M * 1.5, 'r_magic');
    if (c.M >= 4) want(pick('magicHeavy'), c.M, 'r_magic');
    if (c.mm >= 2) want(pick('basic'), c.mm * 1.5, 'r_basic');
    if (c.P >= 4) want(pick('phys'), c.P, 'r_phys');
    if (c.tank >= 2 && T !== 'T') want(pick('pen'), c.tank * 1.5, T === 'M' ? 'r_mpen' : 'r_pen');
    if (c.b >= 3) want(pick('burst'), c.b * 1.5, 'r_burst');
    const ccBoots = C.ccBoots;
    let spell = h.spell || a.spell;
    if (c.c >= 3 && !front && C.purify) spell = C.purify;
    let emblem = h.emblem || a.emblem || null;
    if (emblem && data.emblemCounters && T === 'M' && !front && c.tank >= 2 && data.emblemCounters.tankyMage)
      emblem = Object.assign({}, emblem, { core: data.emblemCounters.tankyMage, coreAdapt: true });
    if (!base.length) {
      // No fixed build for this game yet: return only the counter items for this enemy team.
      const list = [];
      if ((c.M >= 3 || c.c >= 3) && ccBoots) list.push({ item: ccBoots, adapt: true, reason: c.M >= 3 ? 'r_magic' : 'r_cc', slot: 'boots' });
      adds.sort((x, y) => y.p - x.p).forEach(x => { if (!list.some(l => l.item === x.item)) list.push({ item: x.item, adapt: true, reason: x.reason }); });
      return { items: list, spell, emblem, partial: true };
    }
    let boots = base[0], bootsAdapt = false;
    if ((c.M >= 3 || c.c >= 3) && ccBoots && boots !== ccBoots) { boots = ccBoots; bootsAdapt = true; }
    const core = [boots, base[1], base[2]];
    const pool = [...adds.sort((x, y) => y.p - x.p).map(x => ({ item: x.item, adapt: true, reason: x.reason })),
      ...base.slice(3).map(i => ({ item: i, adapt: false }))];
    const flex = [];
    for (const x of pool) {
      if (flex.length >= 3) break;
      if (core.includes(x.item) || flex.some(f => f.item === x.item)) continue;
      flex.push(x);
    }
    return {
      items: [{ item: boots, adapt: bootsAdapt, reason: bootsAdapt ? (c.M >= 3 ? 'r_magic' : 'r_cc') : null, slot: 'boots' },
        { item: core[1], adapt: false, slot: 'core' }, { item: core[2], adapt: false, slot: 'core' }, ...flex],
      spell, emblem
    };
  }
  function mlTips(data, enemy) {
    const c = mlStats(data, enemy), t = [];
    if (c.c >= 3) t.push('tip_cc');
    if (c.h) t.push('tip_heal');
    if (c.b >= 3) t.push('tip_burst');
    if (c.d >= 3) t.push('tip_dash');
    if (c.tank >= 2) t.push('tip_tank');
    if (!t.length) t.push('tip_neutral');
    return t;
  }
  /* Items that answer a single hero (used on hero pages). */
  function mlCounterItems(data, name) {
    const h = mlIndex(data)[name], out = [], C = data.counters || {};
    const all = key => Object.values(C[key] || {}).filter(Boolean).map(i => [i, key]);
    const R = { antiheal: 'r_antiheal', magic: 'r_magic', basic: 'r_basic', phys: 'r_phys', pen: 'r_pen', burst: 'r_burst' };
    if (h.t.includes('h')) out.push(...all('antiheal'));
    if (h.d === 'M') out.push(...all('magic'));
    if (h.r === 'marksman' && h.d === 'P') out.push(...all('basic'));
    if (h.d === 'P' && h.r !== 'marksman') out.push(...all('phys'));
    if (h.r === 'tank') out.push(...all('pen'));
    if (h.t.includes('b')) out.push(...all('burst'));
    const res = out.map(([i, k]) => [i, k === 'pen' && /Void|Glaive|mpen/.test(i) ? 'r_mpen' : R[k]]);
    if (h.t.includes('c') && C.ccBoots) res.push([C.ccBoots, 'r_cc']);
    const seen = new Set();
    return res.filter(([i]) => !seen.has(i) && seen.add(i)).slice(0, 6);
  }
  function mlStrongAgainst(data, name) {
    const h = mlIndex(data)[name];
    const test = {
      antidash: y => y.t.includes('d'), antitank: y => y.r === 'tank', antisquishy: y => y.r === 'mage' || y.r === 'marksman',
      antiheal: y => y.t.includes('h'), antiburst: y => y.t.includes('b'), antimm: y => y.r === 'marksman', anticc: y => y.t.includes('c')
    };
    return h.s.filter(k => test[k]);
  }

  /* Does hero x counter hero y (by x's strengths vs y's role/traits)? */
  const STRONG = {
    antidash: y => y.t.includes('d'), antitank: y => y.r === 'tank', antisquishy: y => y.r === 'mage' || y.r === 'marksman',
    antiheal: y => y.t.includes('h'), antiburst: y => y.t.includes('b'), antimm: y => y.r === 'marksman', anticc: y => y.t.includes('c')
  };
  function mlCounters(data, x, y) {
    const H = mlIndex(data), a = H[x], b = H[y];
    return !!(a && b && a.s.some(k => STRONG[k] && STRONG[k](b)));
  }
  /* Ban suggestions: strong in the meta, or counters the heroes the user plays / their team. */
  function mlBans(data, mine, taken) {
    const TB = { S: 3, A: 2, B: 0.5, C: 0 };
    return data.heroes.filter(h => !taken.includes(h.n) && !mine.includes(h.n)).map(h => {
      const hits = mine.filter(m => mlCounters(data, h.n, m));
      const s = (TB[h.tier] || 0) + hits.length * 1.4 + h.s.length * 0.15;
      return { n: h.n, r: h.r, s, hits: hits.slice(0, 3), meta: h.tier === 'S' || h.tier === 'A' };
    }).filter(x => x.s > 0.5).sort((a, b) => b.s - a.s || a.n.localeCompare(b.n)).slice(0, 3);
  }
  /* Bot pick for draft practice: best answer to the opponent while keeping its own team balanced. */
  function mlBotPick(data, opp, own, taken, rnd) {
    const list = mlScore(data, opp, null, own).filter(x => !taken.includes(x.n));
    const top = list.slice(0, 2);
    return top[Math.floor((rnd == null ? Math.random() : rnd) * top.length)] || list[0];
  }
  /* Draft rating 0-100 for a team: how well its heroes answer the enemy, plus composition balance. */
  function mlDraftRating(data, team, enemy) {
    if (!team.length) return 0;
    let sum = 0;
    team.forEach((n, i) => {
      const others = team.filter((_, j) => j !== i);
      const r = mlScore(data, enemy, [n], others)[0];
      sum += r ? r.s : 5;
    });
    const tm = mlTeam(data, team);
    const bad = tm.warn.filter(w => w !== 'wa_ok').length;
    return Math.max(0, Math.min(100, Math.round((sum / team.length) * 10 - bad * 6)));
  }

  /* ---------- Brawl Stars ---------- */
  const BS_MATCH = {
    tank: { assassin: 2, damage: 1, support: 0.5, marksman: -1, controller: -1 },
    assassin: { marksman: 2, artillery: 2.5, support: 1.5, controller: 0.5, tank: -1.5 },
    marksman: { controller: 1.5, artillery: 1.5, support: 1, tank: 1, assassin: -1.5 },
    artillery: { damage: 1, tank: 0.5, support: 1, assassin: -1.5 },
    controller: { tank: 2, assassin: 1.5, damage: 0.5, marksman: -1 },
    support: { damage: 0.5, tank: 0.5, assassin: -0.5 },
    damage: { tank: 1.5, assassin: 1, support: 0.5, artillery: -0.5 }
  };
  const BS_MODES = {
    gem: { controller: 1.5, damage: 1, support: 1, marksman: 0.5, tank: 0.5 },
    ball: { tank: 1.5, assassin: 1, damage: 1, controller: 0.5 },
    heist: { damage: 1.5, assassin: 1, artillery: 0.5, marksman: 0.5 },
    bounty: { marksman: 1.5, artillery: 1, controller: 0.5 },
    knockout: { marksman: 1.5, artillery: 1, controller: 1 },
    hotzone: { controller: 1.5, tank: 1, artillery: 1, support: 0.5 },
    showdown: { tank: 1, assassin: 1, damage: 1, controller: 0.5 }
  };
  function bsIndex(data) {
    if (!data._idx) data._idx = Object.fromEntries(data.brawlers.map(b => [b.n, b]));
    return data._idx;
  }
  function bsScore(data, enemy, mode, pool) {
    const B = bsIndex(data);
    const ec = {}; enemy.forEach(n => { const b = B[n]; if (b) ec[b.c] = (ec[b.c] || 0) + 1; });
    return data.brawlers.filter(b => !enemy.includes(b.n) && (!pool || !pool.length || pool.includes(b.n))).map(b => {
      let s = 5; const why = [];
      let best = null, bestV = 0;
      for (const [cls, k] of Object.entries(ec)) {
        const v = (BS_MATCH[b.c][cls] || 0) * 0.7 * k;
        s += v; if (v > bestV) { bestV = v; best = cls; }
      }
      if (best && bestV >= 0.9) why.push({ k: 'bw_counter', cls: best });
      if (b.s.includes('antitank') && ec.tank) { s += ec.tank; if (!why.some(w => w.cls === 'tank')) why.push({ k: 'bw_counter', cls: 'tank' }); }
      if (b.s.includes('antiassassin') && ec.assassin) { s += ec.assassin; if (!why.some(w => w.cls === 'assassin')) why.push({ k: 'bw_counter', cls: 'assassin' }); }
      if (mode && BS_MODES[mode]) {
        const m = BS_MODES[mode][b.c] || 0; s += m;
        if (m >= 1) why.push({ k: 'bw_mode', mode });
        if (mode === 'heist' && b.s.includes('wallbreak')) { s += 0.5; why.push({ k: 'bw_wall' }); }
      }
      if (b.tier && TIER[b.tier]) { s += TIER[b.tier]; if (TIER[b.tier] > 0) why.push({ k: 'w_tier' }); }
      return { n: b.n, c: b.c, s: clamp(5 + (s - 5) * 0.55), why };
    }).sort((a, b) => b.s - a.s || a.n.localeCompare(b.n));
  }
  function bsStrongAgainst(data, name) {
    const b = bsIndex(data)[name];
    const m = BS_MATCH[b.c];
    const set = new Set(Object.keys(m).filter(k => m[k] >= 1));
    if (b.s.includes('antitank')) set.add('tank');
    if (b.s.includes('antiassassin')) set.add('assassin');
    return [...set];
  }

  /* ---------- Free Fire ---------- */
  const FF_STYLE = {
    rush: { rush: 3, mobility: 2, heal: 1, armor: 1 },
    sniper: { sniper: 3, intel: 2, heal: 1, antirush: 1 },
    support: { support: 3, heal: 3, intel: 1 },
    balanced: { heal: 2, armor: 2, intel: 1, mobility: 1, rush: 1, sniper: 1 }
  };
  const FF_MODE = { br: { br: 1.5, intel: 0.5 }, cs: { cs: 1.5, armor: 0.5 } };
  const FF_THREAT = { gloo: { antigloo: 3 }, rush: { antirush: 3, armor: 1, heal: 0.5 }, sniper: { antisniper: 3, mobility: 1 } };
  function ffWeights(style, mode, threats) {
    const w = {};
    const add = m => { for (const k in m || {}) w[k] = (w[k] || 0) + m[k]; };
    add(FF_STYLE[style]); add(FF_MODE[mode]); (threats || []).forEach(t => add(FF_THREAT[t]));
    return w;
  }
  function ffRank(data, style, mode, threats) {
    const w = ffWeights(style, mode, threats);
    return data.characters.map(ch => {
      let s = 0; const why = [];
      ch.tags.forEach(t => { if (w[t]) { s += w[t]; why.push({ t, v: w[t] }); } });
      if (ch.tier && TIER[ch.tier]) s += TIER[ch.tier] * 2;
      why.sort((a, b) => b.v - a.v);
      return { n: ch.n, type: ch.type, s, why: why.slice(0, 2).map(x => 'f_' + x.t) };
    }).sort((a, b) => b.s - a.s || a.n.localeCompare(b.n));
  }
  function ffCombo(data, style, mode, threats, force) {
    const r = ffRank(data, style, mode, threats);
    const f = force && r.find(x => x.n === force);
    const active = f && f.type === 'a' ? f : r.find(x => x.type === 'a');
    const passives = r.filter(x => x.type === 'p' && (!f || x.n !== f.n));
    const p = f && f.type === 'p' ? [f, ...passives.slice(0, 2)] : passives.slice(0, 3);
    return { active, passives: p };
  }
  function ffBestStyle(data, name) {
    let best = null;
    for (const st of Object.keys(FF_STYLE)) for (const md of Object.keys(FF_MODE)) {
      const r = ffRank(data, st, md, []).find(x => x.n === name);
      if (!best || r.s > best.s) best = { style: st, mode: md, s: r.s };
    }
    return best;
  }

  const Engine = { ROLES, mlTeam, mlCounters, mlBans, mlBotPick, mlDraftRating, mlStats, mlScore, mlBuild, mlTips, mlCounterItems, mlStrongAgainst, bsScore, bsStrongAgainst, BS_MODES, FF_STYLE, FF_MODE, FF_THREAT, ffRank, ffCombo, ffBestStyle };
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine; else root.Engine = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
