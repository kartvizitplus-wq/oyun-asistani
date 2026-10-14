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
  function mlScore(data, enemy, pool) {
    const c = mlStats(data, enemy);
    const list = data.heroes.filter(h => !enemy.includes(h.n) && (!pool || !pool.length || pool.includes(h.n)));
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
      if (h.tier && TIER[h.tier]) { s += TIER[h.tier]; if (TIER[h.tier] > 0) why.push('w_tier'); }
      return { n: h.n, r: h.r, s: clamp(s), why };
    }).sort((a, b) => b.s - a.s || a.n.localeCompare(b.n));
  }
  function mlBuild(data, heroName, enemy) {
    const h = mlIndex(data)[heroName];
    const a = data.archetypes[h.b];
    const base = h.build || a.items;
    const c = mlStats(data, enemy);
    const front = a.group === 'front', T = a.type;
    const adds = [];
    const want = (item, p, reason) => adds.push({ item, p, reason });
    if (c.h) want(T === 'T' ? 'Dominance Ice' : T === 'M' ? 'Necklace of Durance' : 'Sea Halberd', c.h * 2 + 1, 'r_antiheal');
    if (c.M >= 2) want("Athena's Shield", c.M * 1.5, 'r_magic');
    if (c.M >= 4 && front) want('Radiant Armor', c.M, 'r_magic');
    if (c.mm >= 2) want(front ? (T === 'T' ? 'Blade Armor' : 'Dominance Ice') : (T === 'M' ? 'Winter Crown' : 'Wind of Nature'), c.mm * 1.5, 'r_basic');
    if (c.P >= 4) want(front ? 'Antique Cuirass' : (T === 'M' ? 'Winter Crown' : 'Wind of Nature'), c.P, 'r_phys');
    if (c.tank >= 2 && T !== 'T') want(T === 'M' ? 'Divine Glaive' : 'Malefic Roar', c.tank * 1.5, T === 'M' ? 'r_mpen' : 'r_pen');
    if (c.b >= 3) want(T === 'M' && !front ? 'Winter Crown' : 'Immortality', c.b * 1.5, 'r_burst');
    let boots = base[0], bootsAdapt = false;
    if (c.M >= 3 || c.c >= 3) { if (boots !== 'Tough Boots') { boots = 'Tough Boots'; bootsAdapt = true; } }
    const core = [boots, base[1], base[2]];
    const pool = [...adds.sort((x, y) => y.p - x.p).map(x => ({ item: x.item, adapt: true, reason: x.reason })),
      ...base.slice(3).map(i => ({ item: i, adapt: false }))];
    const flex = [];
    for (const x of pool) {
      if (flex.length >= 3) break;
      if (core.includes(x.item) || flex.some(f => f.item === x.item)) continue;
      flex.push(x);
    }
    const spell = (c.c >= 3 && !front) ? 'Purify' : (h.spell || a.spell);
    return {
      items: [{ item: boots, adapt: bootsAdapt, reason: bootsAdapt ? (c.M >= 3 ? 'r_magic' : 'r_cc') : null, slot: 'boots' },
        { item: core[1], adapt: false, slot: 'core' }, { item: core[2], adapt: false, slot: 'core' }, ...flex],
      spell
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
    const h = mlIndex(data)[name], out = [];
    if (h.t.includes('h')) out.push(['Sea Halberd', 'r_antiheal'], ['Necklace of Durance', 'r_antiheal'], ['Dominance Ice', 'r_antiheal']);
    if (h.d === 'M') out.push(["Athena's Shield", 'r_magic']);
    if (h.r === 'marksman' && h.d === 'P') out.push(['Blade Armor', 'r_basic'], ['Wind of Nature', 'r_basic']);
    if (h.d === 'P' && h.r !== 'marksman') out.push(['Antique Cuirass', 'r_phys']);
    if (h.r === 'tank') out.push(['Malefic Roar', 'r_pen'], ['Divine Glaive', 'r_mpen']);
    if (h.t.includes('b')) out.push(['Immortality', 'r_burst'], ['Winter Crown', 'r_burst']);
    if (h.t.includes('c')) out.push(['Tough Boots', 'r_cc']);
    const seen = new Set();
    return out.filter(([i]) => !seen.has(i) && seen.add(i)).slice(0, 6);
  }
  function mlStrongAgainst(data, name) {
    const h = mlIndex(data)[name];
    const test = {
      antidash: y => y.t.includes('d'), antitank: y => y.r === 'tank', antisquishy: y => y.r === 'mage' || y.r === 'marksman',
      antiheal: y => y.t.includes('h'), antiburst: y => y.t.includes('b'), antimm: y => y.r === 'marksman', anticc: y => y.t.includes('c')
    };
    return h.s.filter(k => test[k]);
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

  const Engine = { mlStats, mlScore, mlBuild, mlTips, mlCounterItems, mlStrongAgainst, bsScore, bsStrongAgainst, BS_MODES };
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine; else root.Engine = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
