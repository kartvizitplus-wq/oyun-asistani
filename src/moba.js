/* PickRadar MOBA engine: one top-down arena engine, three games (5v5 three lanes, 3v3 two lanes, 1v1 duel).
   Heroes, towers, minion waves, levels, gold with auto-bought items, three skills per hero and bots on both teams.
   The page passes the game set-up in data-cfg and the texts in data-t. Everything runs in the browser. */
(function () {
  const root = document.getElementById('mb');
  if (!root) return;
  const CFG = JSON.parse(root.dataset.cfg), T = JSON.parse(root.dataset.t);
  const stage = root.querySelector('.mb-stage'), cv = stage.querySelector('canvas'), ctx = cv.getContext('2d');
  const ov = stage.querySelector('.mb-ov'), pad = stage.querySelector('.mb-pad');
  const store = {
    get(k, d) { try { const v = localStorage.getItem('mb-' + CFG.id + '-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mb-' + CFG.id + '-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v, rnd = (a, b) => a + Math.random() * (b - a);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const TEAM_COL = ['#4a9bea', '#e2595b'], TEAM_DARK = ['#173a5e', '#5e1b1d'];

  /* ---------- hero archetypes ---------- */
  const ARCH = {
    tank: { hp: 2700, dmg: 68, range: 75, as: .85, spd: 235, ranged: false, grow: { hp: 230, dmg: 5 },
      sk: [{ t: 'dash', d: 320, dmg: 110, r: 95, stun: .8, cd: 7 }, { t: 'nova', r: 210, dmg: 95, slow: 2, cd: 8 }, { t: 'nova', r: 270, dmg: 190, stun: 1.5, cd: 32 }],
      build: ['boots', 'plate', 'aegis', 'heart', 'plate', 'aegis'] },
    fighter: { hp: 2250, dmg: 92, range: 80, as: .95, spd: 240, ranged: false, grow: { hp: 190, dmg: 7 },
      sk: [{ t: 'dash', d: 290, dmg: 150, r: 85, cd: 6 }, { t: 'buff', dur: 4, atk: .45, ls: .25, cd: 10 }, { t: 'leap', range: 400, r: 150, dmg: 360, cd: 28 }],
      build: ['boots', 'fang', 'blade', 'plate', 'aegis', 'crit'] },
    assassin: { hp: 1750, dmg: 104, range: 75, as: 1.05, spd: 265, ranged: false, grow: { hp: 150, dmg: 9 },
      sk: [{ t: 'dash', d: 340, dmg: 160, r: 75, cd: 6 }, { t: 'shot', range: 620, dmg: 190, w: 30, speed: 1300, cd: 7 }, { t: 'execute', range: 500, dmg: 300, miss: .3, cd: 26 }],
      build: ['boots', 'blade', 'fang', 'crit', 'blade', 'aegis'] },
    mage: { hp: 1550, dmg: 72, range: 460, as: .8, spd: 235, ranged: true, grow: { hp: 140, dmg: 6 },
      sk: [{ t: 'shot', range: 720, dmg: 230, w: 34, speed: 1050, cd: 5 }, { t: 'blast', range: 620, r: 125, dmg: 170, stun: 1, delay: .5, cd: 9 }, { t: 'blast', range: 720, r: 225, dmg: 440, delay: .7, cd: 30 }],
      build: ['boots', 'wand', 'staff', 'wand', 'staff', 'heart'] },
    marksman: { hp: 1650, dmg: 94, range: 520, as: 1.1, spd: 240, ranged: true, grow: { hp: 145, dmg: 8 },
      sk: [{ t: 'shot', range: 820, dmg: 190, w: 28, speed: 1500, pierce: true, cd: 6 }, { t: 'buff', dur: 4, as: .7, spd: 60, cd: 11 }, { t: 'shot', range: 1700, dmg: 480, w: 42, speed: 1900, pierce: true, cd: 30 }],
      build: ['boots', 'bow', 'crit', 'fang', 'bow', 'crit'] },
    support: { hp: 1950, dmg: 60, range: 430, as: .8, spd: 240, ranged: true, grow: { hp: 170, dmg: 4 },
      sk: [{ t: 'heal', r: 330, heal: 200, cd: 8 }, { t: 'shot', range: 660, dmg: 110, w: 38, speed: 1100, stun: 1.2, cd: 9 }, { t: 'heal', r: 540, heal: 380, shield: 300, cd: 34 }],
      build: ['boots', 'wand', 'plate', 'aegis', 'staff', 'heart'] }
  };
  const ITEMS = {
    boots: { cost: 450, spd: 40, c: '#c9a46a' }, blade: { cost: 900, dmg: 35, c: '#e2595b' }, plate: { cost: 850, hp: 520, c: '#8e9ab0' },
    wand: { cost: 950, dmg: 42, cdr: .1, c: '#a77bf3' }, bow: { cost: 1000, as: .25, c: '#4fc28a' }, fang: { cost: 1100, dmg: 28, ls: .12, c: '#ff7ad9' },
    aegis: { cost: 1300, hp: 720, c: '#4a9bea' }, staff: { cost: 1500, dmg: 70, cdr: .1, c: '#7f6bff' }, crit: { cost: 1600, dmg: 58, as: .15, c: '#f5a524' },
    heart: { cost: 1500, hp: 950, c: '#e8b44a' }
  };

  /* ---------- map ---------- */
  const M = CFG.size, BASE = 260;
  const homes = [{ x: BASE, y: M - BASE }, { x: M - BASE, y: BASE }];
  /* fountain (spawn, heal, defence) sits in the corner behind the core, so the core can be attacked */
  const spawns = [{ x: 115, y: M - 115 }, { x: M - 115, y: 115 }], FOUNT = 175;
  const LANES = {
    mid: [homes[0], homes[1]],
    top: [homes[0], { x: BASE, y: BASE }, homes[1]],
    bot: [homes[0], { x: M - BASE, y: M - BASE }, homes[1]]
  };
  function laneLen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += dist(p[i - 1], p[i]); return L; }
  function laneAt(p, t) {
    let want = laneLen(p) * clamp(t, 0, 1);
    for (let i = 1; i < p.length; i++) { const d = dist(p[i - 1], p[i]); if (want <= d) { const k = want / d; return { x: p[i - 1].x + (p[i].x - p[i - 1].x) * k, y: p[i - 1].y + (p[i].y - p[i - 1].y) * k }; } want -= d; }
    return { ...p[p.length - 1] };
  }
  /* trees: decoration only, seeded so the map looks the same every match */
  const trees = [];
  { let s = M; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const nearLane = (x, y) => CFG.lanes.some(l => { const p = LANES[l]; for (let t = 0; t <= 1; t += .02) { const q = laneAt(p, t); if (Math.hypot(q.x - x, q.y - y) < 150) return true; } return false; });
    for (let i = 0; i < M * M / 26000; i++) { const x = r() * M, y = r() * M; if (!nearLane(x, y) && homes.every(h => Math.hypot(h.x - x, h.y - y) > 420)) trees.push({ x, y, r: 26 + r() * 30 }); } }


  /* ---------- worlds: each game has its own look and one rule of its own ---------- */
  const WORLD = CFG.world || 'sky';
  const seeded = (seed => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; })(M + 7);
  const islands = [], clouds = [], cracks = [], peaks = [];
  if (WORLD === 'sky') {
    const add = (x, y, r) => islands.push({ x, y, r, wob: Array.from({ length: 14 }, () => .82 + seeded() * .3) });
    for (const l of CFG.lanes) { const L = laneLen(LANES[l]); for (let d = 0; d <= L; d += 240) { const p = laneAt(LANES[l], d / L); add(p.x + (seeded() - .5) * 40, p.y + (seeded() - .5) * 40, 150 + seeded() * 60); } }
    for (const h of [...homes, ...spawns]) add(h.x, h.y, 330);
    for (const c of CFG.camps || []) add(c[0] * M, c[1] * M, 170);
    for (let i = 0; i < 26; i++) clouds.push({ x: seeded() * M, y: seeded() * M, r: 80 + seeded() * 160, v: 8 + seeded() * 14 });
  } else if (WORLD === 'lava') {
    for (let i = 0; i < 70; i++) { let x = seeded() * M, y = seeded() * M; const pts = [[x, y]]; for (let k = 0; k < 5; k++) { x += (seeded() - .5) * 160; y += (seeded() - .5) * 160; pts.push([x, y]); } cracks.push(pts); }
  } else {
    for (const t of trees) if (seeded() < .35) peaks.push({ x: t.x, y: t.y, h: 60 + seeded() * 90, w: 70 + seeded() * 80 });
  }
  const motes = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), v: .2 + Math.random() * .8, s: Math.random() }));
  const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
  const season = () => SEASONS[Math.floor(time / 70) % 4];
  const isNight = () => WORLD === 'sky' && time % 100 > 62;
  /* duel arena: after 2:30 lava creeps in from the sides of the lane */
  const lavaHalf = () => WORLD !== 'lava' || time < 150 ? Infinity : Math.max(300, M * .75 - (time - 150) * 4.5);
  const laneDist = (x, y) => { const a = homes[0], b = homes[1], dx = b.x - a.x, dy = b.y - a.y; return Math.abs((x - a.x) * dy - (y - a.y) * dx) / Math.hypot(dx, dy); };
  const inRiver = (x, y) => Math.abs(x - y) < 80;

  /* ---------- state ---------- */
  let units, shots, fx, heroes, me, state = 'menu', time, waveT, kills, feed, choice = 0, lastT = 0;

  function mkUnit(o) { return Object.assign({ hp: o.maxHp, atkCd: 0, stunT: 0, slowT: 0, shield: 0, alive: true, r: 16, as: 1, spd: 0, range: 60, dmg: 0, hitBy: {} }, o); }

  function stats(h) {
    const A = ARCH[h.arch], L = h.lvl - 1;
    let hp = A.hp + A.grow.hp * L, dmg = A.dmg + A.grow.dmg * L, as = A.as, spd = A.spd, cdr = 0, ls = 0;
    for (const id of h.items) { const I = ITEMS[id]; hp += I.hp || 0; dmg += I.dmg || 0; as += I.as || 0; spd += I.spd || 0; cdr += I.cdr || 0; ls += I.ls || 0; }
    const ratio = h.hp / (h.maxHp || hp);
    h.maxHp = hp; if (h.alive) h.hp = Math.max(1, Math.round(hp * ratio)); h.baseDmg = dmg; h.bonusDmg = dmg - A.dmg - A.grow.dmg * L;
    h.as0 = as; h.spd0 = spd; h.cdr = Math.min(.35, cdr); h.ls = ls; h.range = A.range;
  }

  function newGame(pick) {
    units = []; shots = []; fx = []; feed = []; time = 0; waveT = 4; kills = [0, 0];
    /* towers and cores */
    for (const team of [0, 1]) {
      const core = mkUnit({ kind: 'core', team, x: homes[team].x, y: homes[team].y, r: 62, maxHp: CFG.coreHp, inv: true });
      units.push(core);
      const inner = [];
      for (const l of CFG.lanes) {
        let prev = null;
        CFG.towers.forEach((tpos, i) => {
          const p = laneAt(LANES[l], team === 0 ? tpos : 1 - tpos);
          const tw = mkUnit({ kind: 'tower', team, x: p.x, y: p.y, r: 40, maxHp: CFG.towerHp, dmg: CFG.towerDmg, range: 430, as: 1, req: null, lane: l, idx: i });
          units.push(tw); if (i === 0) inner.push(tw); else tw.req = prev;
          prev = tw;
        });
        /* inner tower (index 0) needs the outer ones gone first */
        const list = units.filter(u => u.kind === 'tower' && u.team === team && u.lane === l).sort((a, b) => b.idx - a.idx);
        for (let i = 1; i < list.length; i++) list[i].req = list[i - 1];
        list[0].req = null;
      }
      core.inner = inner;
    }
    /* heroes */
    heroes = [];
    const roster = CFG.roster, n = CFG.teamSize;
    const mine = roster[pick];
    const others = roster.filter((_, i) => i !== pick).sort(() => Math.random() - .5);
    const blue = [mine, ...others.slice(0, n - 1)];
    const red = roster.slice().sort(() => Math.random() - .5).slice(0, n);
    const lanesFor = k => CFG.lanePlan.slice(0, k);
    [blue, red].forEach((list, team) => {
      const plan = lanesFor(list.length).slice().sort(() => Math.random() - .5);
      list.forEach((r, i) => {
        const h = mkUnit({ kind: 'hero', team, arch: r.arch, name: r.name, col: r.col, x: spawns[team].x + rnd(-40, 40), y: spawns[team].y + rnd(-40, 40), r: 24,
          lvl: 1, xp: 0, gold: 300, items: [], cds: [0, 0, 0], buffs: [], k: 0, d: 0, a: 0, bot: !(team === 0 && i === 0), dead: false, respawnT: 0, ang: team === 0 ? -.78 : 2.36,
          ai: { lane: plan[i % plan.length], think: 0, recall: 0 } });
        h.maxHp = 0; stats(h); h.hp = h.maxHp;
        units.push(h); heroes.push(h);
      });
    });
    me = heroes[0];
    me.ai.lane = null;
    /* jungle camps */
    for (const c of CFG.camps || []) units.push(mkUnit({ kind: 'monster', team: 2, x: c[0] * M, y: c[1] * M, hx: c[0] * M, hy: c[1] * M, r: 34, maxHp: 1600, dmg: 45, range: 90, as: .8, spd: 170, gold: 140, xp: 90 }));
    state = 'play'; ov.hidden = true; pad.hidden = !touch;
    say(T.welcome, 3);
  }

  /* ---------- helpers ---------- */
  let msg = null;
  const say = (text, t) => { msg = { text, t }; };
  const enemyOf = (a, b) => b.alive && a.team !== b.team && (b.team !== 2 || a.kind === 'hero');
  const targetable = u => u.alive && !(u.kind === 'tower' && u.req && u.req.alive) && !(u.kind === 'core' && u.inner.every(t => t.alive));
  function nearest(from, range, filter) {
    let best = null, bd = range;
    for (const u of units) { if (!filter(u)) continue; const d = dist(from, u) - u.r; if (d < bd) { bd = d; best = u; } }
    return best;
  }
  function addFx(o) { fx.push(o); }

  function damage(u, amt, by) {
    if (!u.alive || amt <= 0) return;
    if (!targetable(u)) return;
    if (u.kind === 'tower' && by && by.kind === 'hero' && !units.some(m => m.kind === 'minion' && m.alive && m.team === by.team && dist(m, u) < u.range)) amt *= .5; // backdoor protection
    if (u.shield > 0) { const s = Math.min(u.shield, amt); u.shield -= s; amt -= s; }
    u.hp -= amt;
    if (by && by.kind === 'hero') { u.hitBy[heroes.indexOf(by)] = time; if (by.ls > 0) by.hp = Math.min(by.maxHp, by.hp + amt * by.ls); }
    if (by && u.kind === 'hero' && by.kind === 'hero') u.lastHeroHit = time;
    if (by && by.kind === 'hero' && u.kind === 'hero') by.aggroT = time;
    if (u.kind === 'monster' && by) u.angry = by;
    if (u === me || by === me) addFx({ type: 'txt', x: u.x + rnd(-10, 10), y: u.y - u.r - 10, t: .7, text: Math.round(amt), col: u === me ? '#ff6b6b' : '#ffe08a' });
    if (u.hp <= 0) die(u, by);
  }

  function giveXp(h, xp) {
    if (!h.alive) return;
    h.xp += xp;
    while (h.lvl < 15 && h.xp >= h.lvl * 110) { h.xp -= h.lvl * 110; h.lvl++; stats(h); h.hp = Math.min(h.maxHp, h.hp + h.maxHp * .15); if (h === me) { say(T.levelUp.replace('{n}', h.lvl), 1.6); } }
  }
  function giveGold(h, g) { h.gold += g; }

  function die(u, by) {
    u.alive = false; u.hp = 0;
    addFx({ type: 'boom', x: u.x, y: u.y, t: .5, r: u.r });
    const killer = by && by.kind === 'hero' ? by : null;
    if (u.kind === 'minion' || u.kind === 'monster') {
      const near = heroes.filter(h => h.alive && h.team !== u.team && dist(h, u) < 750);
      for (const h of near) giveXp(h, u.xp / Math.max(1, near.length) * (near.length > 1 ? 1.3 : 1));
      if (killer) giveGold(killer, u.gold * (WORLD === 'ink' && season() === 'autumn' ? 1.5 : 1)); else if (near.length) near.forEach(h => giveGold(h, u.gold * .3));
      if (u.kind === 'monster') { u.respawnT = 60; }
    } else if (u.kind === 'hero') {
      u.dead = true; u.d++; u.respawnT = 4 + u.lvl * 1.6; u.buffs = [];
      kills[1 - u.team]++;
      const assists = heroes.filter((h, i) => h !== killer && h.team !== u.team && u.hitBy[i] && time - u.hitBy[i] < 10);
      if (killer) { killer.k++; giveGold(killer, 280 + u.lvl * 15); giveXp(killer, 120 + u.lvl * 25); }
      assists.forEach(h => { h.a++; giveGold(h, 110); giveXp(h, 60 + u.lvl * 10); });
      u.hitBy = {};
      feed.unshift({ text: `${killer ? killer.name : T.tower} ✕ ${u.name}`, t: 5, team: 1 - u.team }); feed.length = Math.min(4, feed.length);
      if (u === me) say(T.youDied, 2.5);
      if (CFG.winKills && kills[1 - u.team] >= CFG.winKills) end(1 - u.team === 0);
    } else if (u.kind === 'tower') {
      heroes.filter(h => h.team !== u.team).forEach(h => { giveGold(h, 220); giveXp(h, 80); });
      feed.unshift({ text: T.towerDown.replace('{team}', u.team === 0 ? T.blue : T.red), t: 5, team: 1 - u.team }); feed.length = Math.min(4, feed.length);
    } else if (u.kind === 'core') end(u.team === 1);
  }

  function end(won) {
    if (state !== 'play') return;
    state = 'over';
    const s = store.get('stats', { games: 0, wins: 0 }); s.games++; if (won) s.wins++; store.set('stats', s);
    setTimeout(() => {
      ov.innerHTML = `<h3>${won ? T.victory : T.defeat}</h3><p>${T.kda}: ${me.k} / ${me.d} / ${me.a} · ${T.time}: ${fmt(time)}<br><small>${T.record.replace('{w}', s.wins).replace('{g}', s.games)}</small></p><button type="button" class="btn" data-k="menu">${T.again}</button>`;
      ov.hidden = false; pad.hidden = true;
    }, 1500);
  }
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  /* ---------- attacks & skills ---------- */
  function attack(a, t) {
    if (a.atkCd > 0 || a.stunT > 0) return false;
    if (dist(a, t) > a.range + t.r + a.r) return false;
    const as = (a.as0 || a.as) * (1 + buffSum(a, 'as'));
    a.atkCd = 1 / as;
    let dmg = (a.baseDmg || a.dmg) * (1 + buffSum(a, 'atk'));
    /* waves should be able to take towers: towers hit minions softer, minions hit buildings harder */
    if (a.kind === 'tower' && t.kind === 'minion') dmg *= .55;
    if (a.kind === 'minion' && (t.kind === 'tower' || t.kind === 'core')) dmg *= 1.7;
    a.ang = Math.atan2(t.y - a.y, t.x - a.x);
    if (a.kind === 'tower' || (a.kind === 'hero' && ARCH[a.arch].ranged) || a.ranged) shots.push({ x: a.x, y: a.y, tgt: t, speed: a.kind === 'tower' ? 900 : 1100, dmg, src: a, col: a.kind === 'tower' ? '#ffe08a' : TEAM_COL[a.team] || '#ccc', homing: true });
    else { damage(t, dmg, a); addFx({ type: 'slash', x: t.x, y: t.y, t: .15, ang: a.ang }); }
    return true;
  }
  const buffSum = (u, k) => (u.buffs || []).reduce((s, b) => s + (b[k] || 0), 0);
  const skillDmg = (h, base) => (base * (1 + .07 * (h.lvl - 1)) + h.bonusDmg * .7) * (h.reso || 1);
  const unlocked = (h, i) => h.lvl >= [1, 2, 4][i];

  /* Cast skill i toward world point (ax, ay). Returns true when cast. */
  function cast(h, i, ax, ay) {
    if (!h.alive || h.stunT > 0 || h.cds[i] > 0 || !unlocked(h, i)) return false;
    const S = ARCH[h.arch].sk[i];
    let dx = ax - h.x, dy = ay - h.y, d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    h.ang = Math.atan2(dy, dx);
    h.cds[i] = S.cd * (1 - h.cdr);
    /* Duel Peak: two different skills within 2.5 s resonate (+35% damage) */
    h.reso = WORLD === 'lava' && h.lastCast && h.lastCast.i !== i && time - h.lastCast.t < 2.5 ? 1.35 : 1;
    if (h.reso > 1) addFx({ type: 'txt', x: h.x, y: h.y - 50, t: 1, text: T.reso || 'RESONANCE', col: '#ffb057' });
    h.lastCast = { i, t: time };
    const foes = () => units.filter(u => enemyOf(h, u) && targetable(u) && u.kind !== 'core');
    const hitCircle = (x, y, r, dmg, eff) => { for (const u of foes()) if (Math.hypot(u.x - x, u.y - y) < r + u.r) { damage(u, dmg, h); if (eff.stun) u.stunT = Math.max(u.stunT, eff.stun * (u.kind === 'tower' ? 0 : 1)); if (eff.slow) u.slowT = Math.max(u.slowT, eff.slow); } };
    if (S.t === 'dash') {
      const len = Math.min(S.d, d + 20), sx = h.x, sy = h.y;
      h.x = clamp(h.x + dx * len, 30, M - 30); h.y = clamp(h.y + dy * len, 30, M - 30);
      for (const u of foes()) { const t = clamp(((u.x - sx) * dx + (u.y - sy) * dy) / len, 0, 1), cx = sx + dx * len * t, cy = sy + dy * len * t; if (Math.hypot(u.x - cx, u.y - cy) < S.r * .6 + u.r) { damage(u, skillDmg(h, S.dmg), h); if (S.stun) u.stunT = Math.max(u.stunT, S.stun); } }
      addFx({ type: 'trail', x: sx, y: sy, x2: h.x, y2: h.y, t: .3, col: h.col });
    } else if (S.t === 'nova') {
      hitCircle(h.x, h.y, S.r, skillDmg(h, S.dmg), S);
      addFx({ type: 'ring', x: h.x, y: h.y, r: S.r, t: .4, col: h.col });
    } else if (S.t === 'leap') {
      const len = Math.min(S.range, d);
      h.x = clamp(h.x + dx * len, 30, M - 30); h.y = clamp(h.y + dy * len, 30, M - 30);
      hitCircle(h.x, h.y, S.r, skillDmg(h, S.dmg), S);
      addFx({ type: 'ring', x: h.x, y: h.y, r: S.r, t: .5, col: '#ffb057' });
    } else if (S.t === 'shot') {
      shots.push({ x: h.x, y: h.y, vx: dx * S.speed, vy: dy * S.speed, left: S.range, w: S.w, dmg: skillDmg(h, S.dmg), src: h, col: h.col, skill: S, hit: new Set(), pierce: S.pierce });
    } else if (S.t === 'blast') {
      const len = Math.min(S.range, d), x = h.x + dx * len, y = h.y + dy * len;
      addFx({ type: 'warn', x, y, r: S.r, t: S.delay, col: h.col, then: () => { hitCircle(x, y, S.r, skillDmg(h, S.dmg), S); addFx({ type: 'ring', x, y, r: S.r, t: .4, col: h.col }); } });
    } else if (S.t === 'buff') {
      h.buffs.push({ t: S.dur, atk: S.atk || 0, as: S.as || 0, spd: S.spd || 0, ls: S.ls || 0 });
      addFx({ type: 'ring', x: h.x, y: h.y, r: 50, t: .4, col: '#ffe08a', follow: h });
    } else if (S.t === 'heal') {
      for (const a of heroes) if (a.alive && a.team === h.team && dist(a, h) < S.r) { a.hp = Math.min(a.maxHp, a.hp + S.heal * (1 + .06 * (h.lvl - 1))); if (S.shield) a.shield = S.shield; addFx({ type: 'txt', x: a.x, y: a.y - 34, t: .8, text: '+', col: '#4fc28a' }); }
      addFx({ type: 'ring', x: h.x, y: h.y, r: S.r, t: .5, col: '#4fc28a' });
    } else if (S.t === 'execute') {
      const tgt = heroes.filter(e => e.alive && e.team !== h.team && dist(e, h) < S.range).sort((a, b) => Math.hypot(a.x - ax, a.y - ay) - Math.hypot(b.x - ax, b.y - ay))[0];
      if (!tgt) { h.cds[i] = 0; return false; }
      const sx = h.x, sy = h.y, a = Math.atan2(h.y - tgt.y, h.x - tgt.x);
      h.x = tgt.x + Math.cos(a) * (tgt.r + h.r); h.y = tgt.y + Math.sin(a) * (tgt.r + h.r);
      damage(tgt, skillDmg(h, S.dmg) + (tgt.maxHp - tgt.hp) * S.miss, h);
      addFx({ type: 'trail', x: sx, y: sy, x2: h.x, y2: h.y, t: .35, col: '#ff4d6d' });
    }
    return true;
  }

  /* ---------- minions ---------- */
  function spawnWave() {
    const wave = Math.floor(time / CFG.waveEvery);
    for (const team of [0, 1]) for (const l of CFG.lanes) {
      const path = team === 0 ? LANES[l] : LANES[l].slice().reverse();
      CFG.wave.forEach((ranged, i) => {
        const p = laneAt(path, .02);
        units.push(mkUnit({ kind: 'minion', team, ranged: !!ranged, x: p.x - i * 18, y: p.y + i * 18, r: ranged ? 14 : 16, path, prog: .02,
          maxHp: (ranged ? 320 : 460) * (1 + wave * .05), dmg: (ranged ? 30 : 22) * (1 + wave * .04), range: ranged ? 330 : 55, as: ranged ? .8 : 1, spd: 130,
          gold: ranged ? 45 : 36, xp: ranged ? 40 : 34, delay: i * .5 }));
      });
    }
  }

  /* ---------- movement ---------- */
  function moveTo(u, x, y, dt, stopAt) {
    if (u.stunT > 0) return;
    const dx = x - u.x, dy = y - u.y, d = Math.hypot(dx, dy);
    if (d <= (stopAt || 2)) return;
    let sp = (u.spd0 || u.spd) * (u.slowT > 0 ? .6 : 1) + buffSum(u, 'spd');
    if (WORLD === 'ink') { const se = season(); if (se === 'summer') sp *= 1.15; else if (se === 'winter' && inRiver(u.x, u.y)) sp *= .65; }
    u.walk = (u.walk || 0) + sp * dt * .06;
    const step = Math.min(d - (stopAt || 0), sp * dt);
    u.x = clamp(u.x + dx / d * step, 20, M - 20); u.y = clamp(u.y + dy / d * step, 20, M - 20);
    if (u.kind === 'hero' && u !== me) u.ang = Math.atan2(dy, dx);
  }
  function separate() {
    const mov = units.filter(u => u.alive && (u.kind === 'minion' || u.kind === 'hero' || u.kind === 'monster'));
    for (let i = 0; i < mov.length; i++) for (let j = i + 1; j < mov.length; j++) {
      const a = mov[i], b = mov[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), m = (a.r + b.r) * .8;
      if (d > 0 && d < m) { const p = (m - d) / 2 / d; a.x -= dx * p; a.y -= dy * p; b.x += dx * p; b.y += dy * p; }
    }
  }

  /* ---------- AI ---------- */
  function minionAI(u, dt) {
    if (u.delay > 0) { u.delay -= dt; return; }
    if (!u.tgt || !u.tgt.alive || !targetable(u.tgt) || dist(u, u.tgt) > 520) u.tgt = nearest(u, 420, o => enemyOf(u, o) && targetable(o) && o.kind !== 'monster');
    if (u.tgt) { if (!attack(u, u.tgt) && dist(u, u.tgt) > u.range + u.tgt.r + u.r) moveTo(u, u.tgt.x, u.tgt.y, dt, u.range + u.tgt.r + u.r - 5); return; }
    const next = laneAt(u.path, u.prog + .03);
    moveTo(u, next.x, next.y, dt);
    const here = laneAt(u.path, u.prog);
    if (Math.hypot(here.x - u.x, here.y - u.y) < 60) u.prog = Math.min(1, u.prog + (u.spd * dt) / laneLen(u.path));
  }
  function towerAI(u) {
    if (u.kind !== 'tower') return;
    let t = u.tgt;
    if (!t || !t.alive || dist(u, t) > u.range + t.r) t = null;
    /* heroes who hit an allied hero under the tower get targeted first */
    const diver = heroes.find(h => h.alive && h.team !== u.team && dist(h, u) < u.range + h.r && h.aggroT && time - h.aggroT < 2 && heroes.some(a => a.team === u.team && a.alive && dist(a, u) < u.range + 200 && a.lastHeroHit && time - a.lastHeroHit < 2));
    if (diver) t = diver;
    if (!t) t = nearest(u, u.range, o => o.kind === 'minion' && enemyOf(u, o)) || nearest(u, u.range, o => o.kind === 'hero' && enemyOf(u, o));
    u.tgt = t;
    if (t) attack(u, t);
  }
  function monsterAI(u, dt) {
    if (!u.alive) { u.respawnT -= dt; if (u.respawnT <= 0) { Object.assign(u, { alive: true, hp: u.maxHp, x: u.hx, y: u.hy, angry: null, hitBy: {} }); } return; }
    const a = u.angry;
    if (a && a.alive && Math.hypot(u.x - u.hx, u.y - u.hy) < 520) { if (!attack(u, a)) moveTo(u, a.x, a.y, dt, u.range + a.r); }
    else { u.angry = null; moveTo(u, u.hx, u.hy, dt); u.hp = Math.min(u.maxHp, u.hp + u.maxHp * .1 * dt); }
  }

  function heroBot(h, dt) {
    const A = h.ai, arch = ARCH[h.arch];
    A.think -= dt;
    const hpPct = h.hp / h.maxHp, home = spawns[h.team];
    const atHome = Math.hypot(h.x - home.x, h.y - home.y) < FOUNT + 50;
    if (h.recallT > 0) return;
    if (hpPct < .28 && !atHome) A.retreat = true;
    if (atHome && hpPct > .95) A.retreat = false;
    if (A.retreat) {
      const danger = units.some(u => u.alive && enemyOf(h, u) && (u.kind === 'hero' || u.kind === 'tower') && dist(u, h) < 650);
      if (!danger && !atHome) { h.recallT = 3; h.lastHit = h.hp; addFx({ type: 'recall', x: h.x, y: h.y, t: 3, u: h }); return; }
      moveTo(h, home.x, home.y, dt); return;
    }
    /* pick a target */
    if (A.think <= 0) {
      A.think = .2;
      const foesH = heroes.filter(e => e.alive && e.team !== h.team && dist(e, h) < 650);
      const weak = foesH.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      const brave = hpPct > .45 || (weak && weak.hp / weak.maxHp < .3);
      const tower = (x, y) => units.find(t => t.kind === 'tower' && t.alive && t.team !== h.team && Math.hypot(t.x - x, t.y - y) < t.range + 40);
      const safe = (x, y) => { const tw = tower(x, y); return !tw || units.some(m => m.kind === 'minion' && m.alive && m.team === h.team && dist(m, tw) < tw.range - 40) || tw.hp < tw.maxHp * .15; };
      A.tgt = null;
      const building = nearest(h, 600, o => (o.kind === 'tower' || o.kind === 'core') && enemyOf(h, o) && targetable(o) && safe(o.x, o.y));
      if (weak && brave && safe(weak.x, weak.y) && (!building || dist(weak, h) < 380)) A.tgt = weak;
      else if (building) A.tgt = building;
      else {
        const m = nearest(h, 520, o => enemyOf(h, o) && targetable(o) && o.kind !== 'monster' && o.kind !== 'hero' && safe(o.x, o.y));
        if (m) A.tgt = m;
      }
      /* lane front: the most advanced allied minion, else our outermost tower */
      const lane = A.lane || CFG.lanes[0];
      const path = h.team === 0 ? LANES[lane] : LANES[lane].slice().reverse();
      const mins = units.filter(u => u.kind === 'minion' && u.alive && u.team === h.team && u.path[1] === path[1] && u.path.length === path.length);
      let front = mins.sort((a, b) => b.prog - a.prog)[0];
      if (front && safe(front.x, front.y)) A.front = { x: front.x, y: front.y };
      else {
        const my = units.filter(t => t.kind === 'tower' && t.alive && t.team === h.team && t.lane === lane).sort((a, b) => b.idx - a.idx)[0];
        const p = my || home; const toward = laneAt(path, .5);
        const d = Math.hypot(toward.x - p.x, toward.y - p.y) || 1;
        A.front = { x: p.x + (toward.x - p.x) / d * 120, y: p.y + (toward.y - p.y) / d * 120 };
      }
      A.safeFn = safe;
    }
    const t = A.tgt;
    if (t && t.alive && targetable(t)) {
      if (t.kind === 'hero') {
        const d = dist(h, t);
        arch.sk.forEach((S, i) => {
          if (h.cds[i] > 0 || !unlocked(h, i)) return;
          const reach = S.d || S.range || S.r || 0;
          if (S.t === 'heal') { if (heroes.some(a => a.alive && a.team === h.team && dist(a, h) < S.r && a.hp / a.maxHp < .6)) cast(h, i, h.x, h.y); return; }
          if (S.t === 'buff') { if (d < h.range + 120) cast(h, i, t.x, t.y); return; }
          if (i === 2 && t.hp / t.maxHp > .75 && heroes.filter(e => e.alive && e.team !== h.team && dist(e, t) < 300).length < 2) return;
          if (d < reach + t.r) cast(h, i, t.x + rnd(-20, 20), t.y + rnd(-20, 20));
        });
      } else if (t.kind === 'minion' && h.cds[0] <= 0 && ARCH[h.arch].sk[0].t === 'shot' && Math.random() < .02) cast(h, 0, t.x, t.y);
      if (!attack(h, t) && dist(h, t) > h.range + t.r + h.r) moveTo(h, t.x, t.y, dt, h.range + t.r + h.r - 8);
      else if (arch.ranged && t.kind === 'hero' && dist(h, t) < h.range * .6) { const a = Math.atan2(h.y - t.y, h.x - t.x); moveTo(h, h.x + Math.cos(a) * 60, h.y + Math.sin(a) * 60, dt * .6); }
    } else if (A.front) {
      const back = arch.ranged ? 160 : 60;
      const path = h.team === 0 ? homes[0] : homes[1];
      const d = Math.hypot(A.front.x - path.x, A.front.y - path.y) || 1;
      moveTo(h, A.front.x - (A.front.x - path.x) / d * back, A.front.y - (A.front.y - path.y) / d * back, dt, 20);
    }
  }

  /* ---------- player input ---------- */
  const keys = {};
  let mouse = { x: 0, y: 0, on: false, down: false }, touch = false, stick = null, aimSkill = null, atkHeld = false;
  addEventListener('keydown', e => {
    if (state !== 'play') return;
    const k = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
    keys[k] = true;
    const sk = { q: 0, '1': 0, e: 1, '2': 1, r: 2, '3': 2 }[k];
    if (sk != null) { const w = mouseWorld(); playerCast(sk, w.x, w.y, !mouse.on); }
    if (k === 'b') recall();
  });
  addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  const local = e => { const b = cv.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top, w: b.width, h: b.height }; };
  cv.addEventListener('pointerdown', e => {
    if (state !== 'play') return;
    const p = local(e);
    if (e.pointerType === 'mouse') { mouse = { ...p, on: true, down: e.button === 0 }; return; }
    e.preventDefault();
    if (!touch) { touch = true; pad.hidden = false; }
    if (!stick && p.x < p.w * .5) { cv.setPointerCapture(e.pointerId); stick = { id: e.pointerId, ox: p.x, oy: p.y, x: p.x, y: p.y }; }
  });
  cv.addEventListener('pointermove', e => {
    const p = local(e);
    if (e.pointerType === 'mouse') { mouse.x = p.x; mouse.y = p.y; mouse.on = true; return; }
    if (stick && stick.id === e.pointerId) { stick.x = p.x; stick.y = p.y; }
  });
  const upH = e => { if (e.pointerType === 'mouse') mouse.down = false; if (stick && stick.id === e.pointerId) stick = null; };
  cv.addEventListener('pointerup', upH); cv.addEventListener('pointercancel', upH);
  cv.addEventListener('contextmenu', e => e.preventDefault());
  /* touch pad: attack (hold), skills (tap = auto aim, drag = aim), recall */
  pad.addEventListener('pointerdown', e => {
    const b = e.target.closest('button'); if (!b || state !== 'play') return;
    e.preventDefault(); b.setPointerCapture(e.pointerId);
    if (b.dataset.s === 'atk') { atkHeld = true; return; }
    if (b.dataset.s === 'recall') { recall(); return; }
    const r = b.getBoundingClientRect();
    aimSkill = { i: +b.dataset.s, id: e.pointerId, cx: r.left + r.width / 2, cy: r.top + r.height / 2, dx: 0, dy: 0 };
  });
  pad.addEventListener('pointermove', e => { if (aimSkill && aimSkill.id === e.pointerId) { aimSkill.dx = e.clientX - aimSkill.cx; aimSkill.dy = e.clientY - aimSkill.cy; } });
  const padUp = e => {
    const b = e.target.closest('button');
    if (b && b.dataset.s === 'atk') atkHeld = false;
    if (aimSkill && aimSkill.id === e.pointerId) {
      const a = aimSkill; aimSkill = null;
      if (e.type === 'pointercancel') return;
      const m = Math.hypot(a.dx, a.dy);
      if (m > 25) { const S = ARCH[me.arch].sk[a.i], reach = S.d || S.range || 300; playerCast(a.i, me.x + a.dx / m * reach, me.y + a.dy / m * reach, false); }
      else playerCast(a.i, me.x + Math.cos(me.ang) * 300, me.y + Math.sin(me.ang) * 300, true);
    }
  };
  pad.addEventListener('pointerup', padUp); pad.addEventListener('pointercancel', padUp);
  pad.addEventListener('contextmenu', e => e.preventDefault());

  function playerCast(i, x, y, auto) {
    if (!me.alive) return;
    if (auto) {
      const S = ARCH[me.arch].sk[i], reach = (S.d || S.range || S.r || 300) + 60;
      const t = S.t === 'heal' || S.t === 'nova' || S.t === 'buff' ? null : nearest(me, reach, o => o.kind === 'hero' && enemyOf(me, o)) || nearest(me, reach, o => enemyOf(me, o) && targetable(o) && o.kind !== 'core');
      if (t) { x = t.x; y = t.y; }
    }
    me.recallT = 0;
    if (!cast(me, i, x, y) && me.cds[i] <= 0 && !unlocked(me, i)) say(T.locked.replace('{n}', [1, 2, 4][i]), 1.2);
  }
  function recall() { if (!me.alive || me.recallT > 0) return; me.recallT = 3; me.lastHit = me.hp; addFx({ type: 'recall', x: me.x, y: me.y, t: 3, u: me }); }
  stage.addEventListener('click', e => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    const k = b.dataset.k;
    if (k === 'pick') { choice = +b.dataset.i; ov.querySelectorAll('[data-k=pick]').forEach(x => x.setAttribute('aria-pressed', x === b)); }
    else if (k === 'start') {
      newGame(choice);
      try {
        if (matchMedia('(pointer:coarse)').matches && !document.fullscreenElement && stage.requestFullscreen) stage.requestFullscreen().then(() => { try { screen.orientation.lock('landscape').catch(() => {}); } catch (x) {} }).catch(() => stage.scrollIntoView({ block: 'center' }));
        else stage.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } catch (x) {}
    }
    else if (k === 'menu') menu();
    else if (k === 'full') { try { if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen().catch(() => {}); } catch (x) {} }
  });

  /* ---------- update ---------- */
  let cam = { x: homes[0].x, y: homes[0].y, s: 1 }, cw = 0, ch = 0;
  const mouseWorld = () => ({ x: cam.x + (mouse.x - cw / 2) / cam.s, y: cam.y + (mouse.y - ch / 2) / cam.s });
  function update(dt) {
    const se0 = WORLD === 'ink' ? season() : null, n0 = isNight();
    time += dt;
    if (WORLD === 'ink' && season() !== se0) say(T.seasons ? T.seasons[season()] : season(), 2.5);
    if (isNight() !== n0) say(isNight() ? T.night : T.day, 2.2);
    if (WORLD === 'lava' && time >= 150 && time - dt < 150) say(T.lava, 2.8);
    waveT -= dt;
    if (waveT <= 0) { spawnWave(); waveT = CFG.waveEvery; }
    for (const u of units) {
      if (u.kind === 'hero' && u.dead) { u.respawnT -= dt; if (u.respawnT <= 0) { u.dead = false; u.alive = true; u.hp = u.maxHp; u.x = spawns[u.team].x + rnd(-40, 40); u.y = spawns[u.team].y + rnd(-40, 40); u.stunT = 0; u.slowT = 0; u.shield = 0; if (u.ai) u.ai.retreat = false; } continue; }
      if (!u.alive) continue;
      u.atkCd = Math.max(0, u.atkCd - dt); u.stunT = Math.max(0, u.stunT - dt); u.slowT = Math.max(0, u.slowT - dt);
      if (u.kind === 'hero') {
        u.cds = u.cds.map(c => Math.max(0, c - dt));
        u.buffs = u.buffs.filter(b => (b.t -= dt) > 0);
        u.lsBuff = buffSum(u, 'ls');
        giveGold(u, 2.2 * dt);
        if (WORLD === 'ink' && season() === 'spring') u.hp = Math.min(u.maxHp, u.hp + u.maxHp * .012 * dt);
        if (Math.hypot(u.x - spawns[u.team].x, u.y - spawns[u.team].y) < FOUNT + 60) { u.hp = Math.min(u.maxHp, u.hp + u.maxHp * .18 * dt); }
        /* auto-buy the next item of the hero's build when there is gold for it */
        const next = ARCH[u.arch].build[u.items.length];
        if (next && u.gold >= ITEMS[next].cost) { u.gold -= ITEMS[next].cost; u.items.push(next); stats(u); if (u === me) say(T.bought, 1.2); }
      }
      if ((u.kind === 'hero' || u.kind === 'minion') && laneDist(u.x, u.y) > lavaHalf()) { u.hp -= u.maxHp * .05 * dt; if (u.hp <= 0) die(u, null); }
      /* base fountain hurts enemy heroes */
      if (u.kind === 'hero') { const eh = spawns[1 - u.team]; if (Math.hypot(u.x - eh.x, u.y - eh.y) < FOUNT) { u.hp -= 700 * dt; if (u.hp <= 0) die(u, null); } }
    }
    for (const u of units) {
      if (!u.alive) { if (u.kind === 'monster') monsterAI(u, dt); continue; }
      if (u.kind === 'minion') minionAI(u, dt);
      else if (u.kind === 'tower') towerAI(u);
      else if (u.kind === 'monster') monsterAI(u, dt);
      else if (u.kind === 'hero' && u.bot) heroBot(u, dt);
    }
    if (me.alive) playerUpdate(dt);
    separate();
    /* projectiles */
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      if (s.homing) {
        if (!s.tgt.alive) { shots.splice(i, 1); continue; }
        const dx = s.tgt.x - s.x, dy = s.tgt.y - s.y, d = Math.hypot(dx, dy);
        if (d < s.speed * dt + s.tgt.r) { damage(s.tgt, s.dmg, s.src); shots.splice(i, 1); continue; }
        s.x += dx / d * s.speed * dt; s.y += dy / d * s.speed * dt; continue;
      }
      const step = Math.hypot(s.vx, s.vy) * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; s.left -= step;
      let done = s.left <= 0;
      for (const u of units) {
        if (done) break;
        if (!enemyOf(s.src, u) || !targetable(u) || u.kind === 'core' || s.hit.has(u)) continue;
        if (Math.hypot(u.x - s.x, u.y - s.y) < u.r + s.w / 2) {
          s.hit.add(u); damage(u, s.dmg, s.src);
          if (s.skill.stun && u.kind !== 'tower') u.stunT = Math.max(u.stunT, s.skill.stun);
          if (!s.pierce) done = true;
        }
      }
      if (done) shots.splice(i, 1);
    }
    units = units.filter(u => u.alive || u.kind === 'hero' || u.kind === 'monster' || (u.kind !== 'minion'));
    for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t -= dt; if (f.t <= 0) { fx.splice(i, 1); if (f.then) f.then(); } }
    for (let i = feed.length - 1; i >= 0; i--) if ((feed[i].t -= dt) <= 0) feed.splice(i, 1);
    if (msg && (msg.t -= dt) <= 0) msg = null;
    /* recall channel */
    for (const h of heroes) if (h.recallT > 0) {
      if (h.lastHit === h.hp) { h.recallT -= dt; if (h.recallT <= 0) { h.x = spawns[h.team].x; h.y = spawns[h.team].y; } }
      else h.recallT = 0;
    }
    for (const h of heroes) h.lastHit = h.hp;
  }

  function playerUpdate(dt) {
    let mx = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0), my = (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
    if (stick) { let dx = stick.x - stick.ox, dy = stick.y - stick.oy; const d = Math.hypot(dx, dy); if (d > 6) { mx = dx / Math.max(d, 55); my = dy / Math.max(d, 55); } }
    const ml = Math.hypot(mx, my);
    if (ml > .1) {
      if (ml > 1) { mx /= ml; my /= ml; }
      me.recallT = 0;
      moveTo(me, me.x + mx * 100, me.y + my * 100, dt * Math.min(1, ml));
      me.ang = Math.atan2(my, mx);
    }
    if (!touch && mouse.on) { const w = mouseWorld(); if (ml <= .1) me.ang = Math.atan2(w.y - me.y, w.x - me.x); }
    const wantAtk = atkHeld || keys[' '] || keys.j || (mouse.down && !touch);
    if (wantAtk) {
      me.recallT = 0;
      let t = null;
      if (mouse.down && !touch) { const w = mouseWorld(); t = nearest({ x: w.x, y: w.y }, 140, o => enemyOf(me, o) && targetable(o)); }
      t = t || nearest(me, me.range + 160, o => o.kind === 'hero' && enemyOf(me, o)) || nearest(me, me.range + 260, o => enemyOf(me, o) && targetable(o));
      if (t) { if (!attack(me, t) && ml <= .1 && dist(me, t) > me.range + t.r + me.r) moveTo(me, t.x, t.y, dt, me.range + t.r + me.r - 8); }
      me.atkTgt = t;
    } else me.atkTgt = null;
  }

  /* ---------- drawing ---------- */
  function resize() {
    const dpr = Math.min(2, devicePixelRatio || 1), r = stage.getBoundingClientRect();
    cw = r.width; ch = r.height; cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cam.s = clamp(Math.sqrt(cw * ch) / 900, .45, 1.15);
  }
  function lanePath(l) { const p = LANES[l]; ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y); for (const q of p.slice(1)) ctx.lineTo(q.x, q.y); }
  function drawMap(x0, y0, x1, y1) {
    const inView = (x, y, r) => x + r > x0 && x - r < x1 && y + r > y0 && y - r < y1;
    if (WORLD === 'sky') {
      const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#5aa7ff'); g.addColorStop(1, '#bfe3ff');
      ctx.fillStyle = g; ctx.fillRect(x0 - 50, y0 - 50, x1 - x0 + 100, y1 - y0 + 100);
      for (const c of clouds) { const cx = (c.x + time * c.v) % (M + 400) - 200; if (!inView(cx, c.y, c.r)) continue; ctx.fillStyle = 'rgba(255,255,255,.55)'; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(cx + k * c.r * .5, c.y + (k % 2) * c.r * .15, c.r * (.6 + k * .1), 0, 6.283); ctx.fill(); } }
      const blob = (is, dy, r0) => { ctx.beginPath(); is.wob.forEach((w, i) => { const a = i / is.wob.length * 6.283, r = is.r * w + r0; ctx.lineTo(is.x + Math.cos(a) * r, is.y + dy + Math.sin(a) * r); }); ctx.closePath(); };
      for (const is of islands) if (inView(is.x, is.y, is.r + 80)) { blob(is, 46, -8); ctx.fillStyle = '#6b4a2e'; ctx.fill(); blob(is, 24, -2); ctx.fillStyle = '#8a6440'; ctx.fill(); }
      for (const is of islands) if (inView(is.x, is.y, is.r + 80)) { blob(is, 0, 0); ctx.fillStyle = '#5fbf5a'; ctx.fill(); blob(is, -6, -18); ctx.fillStyle = '#74d36a'; ctx.fill(); }
      /* rope bridges */
      for (const l of CFG.lanes) { lanePath(l); ctx.strokeStyle = '#5a3a1e'; ctx.lineWidth = 120; ctx.lineJoin = 'round'; ctx.stroke(); lanePath(l); ctx.strokeStyle = '#c99a5e'; ctx.lineWidth = 100; ctx.setLineDash([16, 6]); ctx.stroke(); ctx.setLineDash([]); }
    } else if (WORLD === 'ink') {
      const se = season(), tint = { spring: '#f3e9d6', summer: '#f2e6c4', autumn: '#efdcc2', winter: '#eef1f4' }[se];
      ctx.fillStyle = tint; ctx.fillRect(x0 - 50, y0 - 50, x1 - x0 + 100, y1 - y0 + 100);
      ctx.strokeStyle = se === 'winter' ? 'rgba(170,210,240,.9)' : 'rgba(120,170,200,.45)'; ctx.lineWidth = 150; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(M + 50, M + 50); ctx.stroke();
      for (const pk of peaks) if (inView(pk.x, pk.y, pk.w)) { ctx.fillStyle = 'rgba(40,40,45,.16)'; ctx.beginPath(); ctx.moveTo(pk.x - pk.w, pk.y + 20); ctx.quadraticCurveTo(pk.x - pk.w * .3, pk.y - pk.h, pk.x, pk.y - pk.h); ctx.quadraticCurveTo(pk.x + pk.w * .4, pk.y - pk.h * .6, pk.x + pk.w, pk.y + 20); ctx.fill(); ctx.strokeStyle = 'rgba(30,30,35,.5)'; ctx.lineWidth = 3; ctx.stroke(); }
      for (const t of trees) { if (!inView(t.x, t.y, t.r)) continue; ctx.fillStyle = { spring: 'rgba(232,140,170,.55)', summer: 'rgba(70,120,70,.5)', autumn: 'rgba(210,110,40,.55)', winter: 'rgba(255,255,255,.8)' }[se]; ctx.beginPath(); ctx.arc(t.x, t.y, t.r * .7, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(30,30,35,.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(t.x, t.y + t.r); ctx.lineTo(t.x + 4, t.y - t.r * .2); ctx.stroke(); }
      for (const l of CFG.lanes) for (let k = 0; k < 3; k++) { lanePath(l); ctx.strokeStyle = `rgba(35,35,40,${.12 + k * .05})`; ctx.lineWidth = 170 - k * 40; ctx.lineJoin = 'round'; ctx.stroke(); }
    } else {
      ctx.fillStyle = '#1b1416'; ctx.fillRect(x0 - 50, y0 - 50, x1 - x0 + 100, y1 - y0 + 100);
      ctx.globalCompositeOperation = 'lighter';
      for (const c of cracks) { if (!inView(c[0][0], c[0][1], 400)) continue; ctx.beginPath(); c.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.strokeStyle = `rgba(255,110,30,${.25 + Math.sin(time * 2 + c[0][0]) * .1})`; ctx.lineWidth = 9; ctx.stroke(); ctx.strokeStyle = 'rgba(255,200,90,.5)'; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.globalCompositeOperation = 'source-over';
      for (const t of trees) { if (!inView(t.x, t.y, t.r)) continue; ctx.fillStyle = '#2b2226'; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + t.r; ctx.lineTo(t.x + Math.cos(a) * t.r * (i % 2 ? .7 : 1), t.y + Math.sin(a) * t.r * (i % 2 ? .7 : 1)); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#3d3036'; ctx.lineWidth = 3; ctx.stroke(); }
      for (const l of CFG.lanes) { lanePath(l); ctx.strokeStyle = '#3a2c30'; ctx.lineWidth = 180; ctx.lineJoin = 'round'; ctx.stroke(); lanePath(l); ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 150; ctx.setLineDash([60, 40]); ctx.stroke(); ctx.setLineDash([]); }
      /* rising lava */
      const lh = lavaHalf();
      if (lh < M) {
        const a = homes[0], b = homes[1], ang = Math.atan2(b.y - a.y, b.x - a.x), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
        const g = ctx.createLinearGradient(0, lh, 0, lh + 120); g.addColorStop(0, 'rgba(255,140,40,.95)'); g.addColorStop(1, 'rgba(200,40,10,.95)');
        ctx.fillStyle = g; ctx.fillRect(-M * 2, lh, M * 4, M * 2);
        const g2 = ctx.createLinearGradient(0, -lh, 0, -lh - 120); g2.addColorStop(0, 'rgba(255,140,40,.95)'); g2.addColorStop(1, 'rgba(200,40,10,.95)');
        ctx.fillStyle = g2; ctx.fillRect(-M * 2, -lh - M * 2, M * 4, M * 2);
        ctx.strokeStyle = '#ffe08a'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = -M * 2; x < M * 2; x += 40) ctx.lineTo(x, lh + Math.sin(x * .05 + time * 3) * 8); ctx.stroke();
        ctx.beginPath(); for (let x = -M * 2; x < M * 2; x += 40) ctx.lineTo(x, -lh - Math.sin(x * .05 + time * 3) * 8); ctx.stroke();
        ctx.restore();
      }
    }
    /* fountains */
    [0, 1].forEach(team => { const h = spawns[team]; ctx.beginPath(); ctx.arc(h.x, h.y, FOUNT, 0, 6.283); ctx.fillStyle = TEAM_COL[team] + '33'; ctx.fill(); ctx.strokeStyle = TEAM_COL[team]; ctx.lineWidth = 5; ctx.setLineDash([18, 10]); ctx.stroke(); ctx.setLineDash([]); });
  }
  const textCol = () => WORLD === 'ink' ? '#1e1e24' : '#f4f6fb';
  /* heroes are drawn as small figures seen from above, each class with its own weapon */
  function drawHero(u) {
    const col = TEAM_COL[u.team], sw = Math.sin(u.walk || 0) * 6;
    ctx.save(); ctx.translate(u.x, u.y);
    ctx.fillStyle = col + '44'; ctx.beginPath(); ctx.ellipse(0, 10, 30, 15, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = u === me ? '#ffd23d' : col; ctx.lineWidth = 3; ctx.stroke();
    ctx.rotate(u.ang || 0);
    const dark = '#1c1c26';
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-3 + sw, -9, 7, 5, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(-3 - sw, 9, 7, 5, 0, 0, 6.283); ctx.fill();
    /* cape */
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-4, -15); ctx.quadraticCurveTo(-26 - Math.abs(sw), 0, -4, 15); ctx.closePath(); ctx.fill();
    /* weapon */
    ctx.lineCap = 'round';
    const A = u.arch;
    if (A === 'tank') { ctx.fillStyle = '#c9d2e3'; ctx.fillRect(12, -18, 9, 36); ctx.fillStyle = col; ctx.fillRect(14, -12, 5, 24); }
    else if (A === 'fighter') { ctx.strokeStyle = '#dfe6f2'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(44, 10); ctx.stroke(); ctx.strokeStyle = '#8a6a2a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(8, 4); ctx.lineTo(8, 16); ctx.stroke(); }
    else if (A === 'assassin') { ctx.strokeStyle = '#e8e8f0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(12, -10); ctx.lineTo(28, -14); ctx.moveTo(12, 10); ctx.lineTo(28, 14); ctx.stroke(); }
    else if (A === 'mage') { ctx.strokeStyle = '#6b4a2e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(6, 12); ctx.lineTo(38, 12); ctx.stroke(); ctx.fillStyle = u.col; ctx.beginPath(); ctx.arc(40, 12, 7 + Math.sin(time * 5) * 1.5, 0, 6.283); ctx.fill(); ctx.globalAlpha = .3; ctx.beginPath(); ctx.arc(40, 12, 14, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
    else if (A === 'marksman') { ctx.strokeStyle = '#8a5a2a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(10, 0, 20, -1.1, 1.1); ctx.stroke(); ctx.strokeStyle = '#eee'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(10 + Math.cos(-1.1) * 20, Math.sin(-1.1) * 20); ctx.lineTo(10 + Math.cos(1.1) * 20, Math.sin(1.1) * 20); ctx.stroke(); }
    else { ctx.strokeStyle = '#e8d8a8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(6, 12); ctx.lineTo(34, 12); ctx.stroke(); ctx.strokeStyle = '#ffd23d'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(38, 12, 7, 0, 6.283); ctx.stroke(); }
    /* body, arms, head */
    ctx.fillStyle = u.col; ctx.beginPath(); ctx.ellipse(0, 0, 11, 17, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = u.col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(2, -13); ctx.lineTo(12, -8); ctx.moveTo(2, 13); ctx.lineTo(12, 10); ctx.stroke();
    ctx.fillStyle = '#f1c9a0'; ctx.beginPath(); ctx.arc(2, 0, 8.5, 0, 6.283); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(0, 0, 8.5, 1.9, 4.4); ctx.fill();
    if (A === 'tank' || A === 'fighter') { ctx.fillStyle = '#9aa6bb'; ctx.beginPath(); ctx.arc(1, 0, 8.5, 1.2, 5.1); ctx.fill(); }
    ctx.restore();
    if (u.shield > 0) { ctx.beginPath(); ctx.arc(u.x, u.y, 32, 0, 6.283); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.stroke(); }
    if (u.stunT > 0) { ctx.fillStyle = '#ffd23d'; ctx.font = '700 14px system-ui'; ctx.textAlign = 'center'; ctx.fillText('✦ ✦', u.x, u.y - 52); }
    bar(u.x, u.y - 40, 56, u.hp / u.maxHp, u.team === 0 ? (u === me ? '#4fc28a' : '#4a9bea') : '#e2595b', 6);
    ctx.fillStyle = textCol(); ctx.font = '600 11px "IBM Plex Sans",system-ui'; ctx.textAlign = 'center'; ctx.fillText(`${u.lvl} · ${u.name}`, u.x, u.y - 45);
  }
  function drawMinion(u, col) {
    ctx.save(); ctx.translate(u.x, u.y);
    if (WORLD === 'sky') {
      const f = Math.sin(time * 14 + u.x) * .5;
      ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.ellipse(-12, -6 - f * 4, 10, 5, -.6, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(12, -6 - f * 4, 10, 5, .6, 0, 6.283); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, u.r * .8, 0, 6.283); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(3, -2, 3, 0, 6.283); ctx.fill();
    } else if (WORLD === 'ink') {
      ctx.fillStyle = '#f7efe0'; ctx.fillRect(-9, -10, 18, 20); ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 2; ctx.strokeRect(-9, -10, 18, 20);
      ctx.fillStyle = col; ctx.fillRect(-9, -2, 18, 5);
      ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.moveTo(-13, -10); ctx.lineTo(0, -20); ctx.lineTo(13, -10); ctx.fill();
      if (u.ranged) { ctx.strokeStyle = '#2a2a30'; ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(20, -8); ctx.stroke(); }
    } else {
      ctx.fillStyle = '#3a3036'; ctx.beginPath(); for (let i = 0; i < 7; i++) { const a = i / 7 * 6.283; ctx.lineTo(Math.cos(a) * u.r * (i % 2 ? .8 : 1.1), Math.sin(a) * u.r * (i % 2 ? .8 : 1.1)); } ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, u.r * .45, 0, 6.283); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
  }
  function drawTower(u, col) {
    ctx.save(); ctx.translate(u.x, u.y);
    if (WORLD === 'sky') {
      const bob = Math.sin(time * 2 + u.x) * 5;
      ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(0, 26, 30, 10, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -60 + bob); ctx.lineTo(22, -14 + bob); ctx.lineTo(0, 16 + bob); ctx.lineTo(-22, -14 + bob); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.moveTo(0, -60 + bob); ctx.lineTo(8, -14 + bob); ctx.lineTo(0, 16 + bob); ctx.closePath(); ctx.fill();
    } else if (WORLD === 'ink') {
      for (let k = 0; k < 3; k++) { const w = 46 - k * 10, y = -k * 20; ctx.fillStyle = '#f1e6d2'; ctx.fillRect(-w / 2 + 6, y - 14, w - 12, 16); ctx.fillStyle = '#26262c'; ctx.beginPath(); ctx.moveTo(-w / 2 - 6, y - 12); ctx.quadraticCurveTo(0, y - 24, w / 2 + 6, y - 12); ctx.lineTo(w / 2 - 4, y - 8); ctx.lineTo(-w / 2 + 4, y - 8); ctx.closePath(); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(-4, y - 10, 8, 8); }
    } else {
      ctx.fillStyle = '#141014'; ctx.beginPath(); ctx.moveTo(-20, 22); ctx.lineTo(-12, -46); ctx.lineTo(0, -60); ctx.lineTo(12, -46); ctx.lineTo(20, 22); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(0, -30); ctx.lineTo(6, 6); ctx.stroke();
      ctx.fillStyle = `rgba(255,150,50,${.6 + Math.sin(time * 9) * .2})`; ctx.beginPath(); ctx.arc(0, -62, 9 + Math.sin(time * 11) * 2, 0, 6.283); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
  }
  function drawUnit(u) {
    if (!u.alive) return;
    const col = u.team === 2 ? '#c99a4a' : TEAM_COL[u.team];
    if (u.kind === 'tower') {
      if (me && me.alive && dist(me, u) < u.range + 220 && u.team !== me.team) { ctx.beginPath(); ctx.arc(u.x, u.y, u.range, 0, 6.283); ctx.strokeStyle = u.tgt === me ? 'rgba(255,60,60,.8)' : 'rgba(255,255,255,.3)'; ctx.lineWidth = 3; ctx.stroke(); }
      drawTower(u, col);
      if (!targetable(u)) { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(u.x, u.y - 10, 48, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); }
      bar(u.x, u.y - 78, 70, u.hp / u.maxHp, col, 6);
    } else if (u.kind === 'core') {
      ctx.save(); ctx.translate(u.x, u.y); ctx.rotate(time * .3);
      ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; ctx.lineTo(Math.cos(a) * 58, Math.sin(a) * 58); } ctx.closePath();
      ctx.fillStyle = WORLD === 'ink' ? '#f1e6d2' : TEAM_DARK[u.team]; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.stroke();
      ctx.rotate(-time * .9); ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + .5; ctx.lineTo(Math.cos(a) * 28, Math.sin(a) * 28); } ctx.closePath(); ctx.fillStyle = col; ctx.fill();
      ctx.restore();
      bar(u.x, u.y - 80, 110, u.hp / u.maxHp, col, 7);
    } else if (u.kind === 'minion') {
      drawMinion(u, col);
      if (u.hp < u.maxHp) bar(u.x, u.y - u.r - 10, 30, u.hp / u.maxHp, col, 4);
    } else if (u.kind === 'monster') {
      ctx.save(); ctx.translate(u.x, u.y); ctx.rotate(Math.sin(time * 2) * .1);
      ctx.fillStyle = WORLD === 'ink' ? '#3a3a40' : WORLD === 'lava' ? '#5a2a1a' : '#e8d070';
      ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; ctx.lineTo(Math.cos(a) * u.r * (i % 2 ? .8 : 1.15), Math.sin(a) * u.r * (i % 2 ? .8 : 1.15)); } ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ff5050'; ctx.beginPath(); ctx.arc(-8, -6, 4, 0, 6.283); ctx.arc(8, -6, 4, 0, 6.283); ctx.fill();
      ctx.restore();
      if (u.hp < u.maxHp) bar(u.x, u.y - u.r - 12, 56, u.hp / u.maxHp, '#f5c842', 4);
    } else if (u.kind === 'hero') drawHero(u);
  }
  /* night fog in the sky world: only what your team sees is shown */
  const fogCv = document.createElement('canvas'), fctx = fogCv.getContext('2d');
  const allySees = u => u.team === 0 || !isNight() || units.some(a => a.alive && a.team === 0 && a.kind !== 'core' && Math.hypot(a.x - u.x, a.y - u.y) < (a.kind === 'hero' ? 520 : 380));
  function drawNight() {
    if (!isNight()) return;
    const dpr = cv.width / cw;
    if (fogCv.width !== cv.width || fogCv.height !== cv.height) { fogCv.width = cv.width; fogCv.height = cv.height; }
    fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.globalCompositeOperation = 'source-over';
    const k = Math.min(1, (time % 100 - 62) / 4, (100 - time % 100) / 4);
    fctx.clearRect(0, 0, fogCv.width, fogCv.height); fctx.fillStyle = `rgba(8,12,40,${.72 * k})`; fctx.fillRect(0, 0, fogCv.width, fogCv.height);
    fctx.globalCompositeOperation = 'destination-out';
    for (const a of units) {
      if (!a.alive || a.team !== 0 || a.kind === 'core') continue;
      const sx = ((a.x - cam.x) * cam.s + cw / 2) * dpr, sy = ((a.y - cam.y) * cam.s + ch / 2) * dpr, r = (a.kind === 'hero' ? 520 : 380) * cam.s * dpr;
      if (sx < -r || sy < -r || sx > fogCv.width + r || sy > fogCv.height + r) continue;
      const g = fctx.createRadialGradient(sx, sy, r * .5, sx, sy, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      fctx.fillStyle = g; fctx.beginPath(); fctx.arc(sx, sy, r, 0, 6.283); fctx.fill();
    }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(fogCv, 0, 0); ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < 40; i++) { const x = (i * 97.3) % cw, y = (i * 53.7) % (ch * .5); ctx.fillRect(x, y, 1.5, 1.5); }
  }
  function drawMotes() {
    const se = season();
    for (const m of motes) {
      m.y += m.v * .0016 * (WORLD === 'lava' ? -1 : 1); m.x += Math.sin(time + m.s * 9) * .0007;
      if (m.y > 1) m.y = 0; if (m.y < 0) m.y = 1; if (m.x > 1) m.x = 0; if (m.x < 0) m.x = 1;
      const x = m.x * cw, y = m.y * ch;
      if (WORLD === 'lava') { ctx.fillStyle = `rgba(255,${120 + m.s * 100},40,${.5 + m.s * .4})`; ctx.fillRect(x, y, 2 + m.s * 2, 2 + m.s * 2); }
      else if (WORLD === 'ink') { ctx.fillStyle = { spring: 'rgba(240,150,180,.8)', summer: 'rgba(255,240,150,.35)', autumn: 'rgba(210,110,40,.8)', winter: 'rgba(255,255,255,.95)' }[se]; ctx.beginPath(); ctx.ellipse(x, y, 4, 2.5, m.s * 6 + time, 0, 6.283); ctx.fill(); }
      else if (m.s < .3) { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(x, y, 1.5, 0, 6.283); ctx.fill(); }
    }
  }
  function bar(x, y, w, pct, col, h) { ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(x - w / 2 - 1, y - 1, w + 2, (h || 5) + 2); ctx.fillStyle = col; ctx.fillRect(x - w / 2, y, w * clamp(pct, 0, 1), h || 5); }
  function draw() {
    ctx.fillStyle = WORLD === 'ink' ? '#efe6d2' : WORLD === 'lava' ? '#120c0e' : '#5aa7ff'; ctx.fillRect(0, 0, cw, ch);
    if (!units) return;
    const f = me.alive ? me : homes[0];
    cam.x += (f.x - cam.x) * .18; cam.y += (f.y - cam.y) * .18;
    ctx.save(); ctx.translate(cw / 2, ch / 2); ctx.scale(cam.s, cam.s); ctx.translate(-cam.x, -cam.y);
    const x0 = cam.x - cw / 2 / cam.s, y0 = cam.y - ch / 2 / cam.s, x1 = cam.x + cw / 2 / cam.s, y1 = cam.y + ch / 2 / cam.s;
    drawMap(x0, y0, x1, y1);
    for (const ff of fx) if (ff.type === 'warn') { ctx.beginPath(); ctx.arc(ff.x, ff.y, ff.r, 0, 6.283); ctx.fillStyle = 'rgba(255,90,90,.18)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,120,120,.7)'; ctx.lineWidth = 2; ctx.stroke(); }
    for (const ff of fx) if (ff.type === 'recall' && ff.u.recallT > 0) { ctx.beginPath(); ctx.arc(ff.u.x, ff.u.y, 40, -1.57, -1.57 + 6.283 * (1 - ff.u.recallT / 3)); ctx.strokeStyle = '#7fd6ff'; ctx.lineWidth = 4; ctx.stroke(); }
    const vis = u => u.x > x0 - 100 && u.x < x1 + 100 && u.y > y0 - 100 && u.y < y1 + 100;
    for (const u of units) if (u.kind !== 'hero' && vis(u) && (u.kind === 'tower' || u.kind === 'core' || allySees(u))) drawUnit(u);
    for (const u of heroes) if (u.alive && vis(u) && allySees(u)) drawUnit(u);
    if (me.atkTgt && me.atkTgt.alive) { ctx.beginPath(); ctx.arc(me.atkTgt.x, me.atkTgt.y, me.atkTgt.r + 6, 0, 6.283); ctx.strokeStyle = '#ff4d4d'; ctx.lineWidth = 2; ctx.stroke(); }
    for (const s of shots) { ctx.beginPath(); ctx.arc(s.x, s.y, s.w ? s.w / 2 : 5, 0, 6.283); ctx.fillStyle = s.col; ctx.fill(); if (s.w) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); } }
    for (const ff of fx) {
      if (ff.type === 'ring') { const k = 1 - ff.t / .5; ctx.beginPath(); ctx.arc(ff.follow ? ff.follow.x : ff.x, ff.follow ? ff.follow.y : ff.y, ff.r * (.6 + k * .4), 0, 6.283); ctx.strokeStyle = ff.col; ctx.globalAlpha = clamp(ff.t * 2.5, 0, 1); ctx.lineWidth = 6; ctx.stroke(); ctx.globalAlpha = 1; }
      else if (ff.type === 'trail') { ctx.strokeStyle = ff.col; ctx.globalAlpha = clamp(ff.t * 3, 0, 1); ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(ff.x, ff.y); ctx.lineTo(ff.x2, ff.y2); ctx.stroke(); ctx.globalAlpha = 1; }
      else if (ff.type === 'slash') { ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ff.x, ff.y, 22, ff.ang - 1, ff.ang + 1); ctx.stroke(); }
      else if (ff.type === 'boom') { ctx.beginPath(); ctx.arc(ff.x, ff.y, ff.r + 30 * (1 - ff.t / .5), 0, 6.283); ctx.strokeStyle = `rgba(255,200,120,${ff.t * 2})`; ctx.lineWidth = 3; ctx.stroke(); }
      else if (ff.type === 'txt') { ctx.font = '700 15px "Chakra Petch",system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = ff.col; ctx.globalAlpha = clamp(ff.t * 2, 0, 1); ctx.fillText(ff.text, ff.x, ff.y - (1 - ff.t) * 24); ctx.globalAlpha = 1; }
    }
    /* aim preview while dragging a skill on touch, or hovering keys on desktop */
    if (aimSkill && me.alive) {
      const S = ARCH[me.arch].sk[aimSkill.i], reach = S.d || S.range || S.r || 300, m = Math.hypot(aimSkill.dx, aimSkill.dy);
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3;
      if (m > 25) { ctx.beginPath(); ctx.moveTo(me.x, me.y); ctx.lineTo(me.x + aimSkill.dx / m * reach, me.y + aimSkill.dy / m * reach); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(me.x, me.y, reach, 0, 6.283); ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.stroke();
    }
    ctx.restore();
    drawNight();
    drawMotes();
    hud();
  }

  function hud() {
    /* score and time */
    ctx.textAlign = 'center'; ctx.font = '700 18px "Chakra Petch",system-ui';
    ctx.fillStyle = 'rgba(8,12,20,.8)'; ctx.fillRect(cw / 2 - 80, 6, 160, 30);
    ctx.fillStyle = TEAM_COL[0]; ctx.fillText(kills[0], cw / 2 - 50, 27); ctx.fillStyle = TEAM_COL[1]; ctx.fillText(kills[1], cw / 2 + 50, 27);
    ctx.fillStyle = '#e9edf5'; ctx.font = '600 13px "IBM Plex Sans",system-ui'; ctx.fillText(fmt(time), cw / 2, 26);
    const tag = WORLD === 'ink' ? (T.seasons ? T.seasons[season()] : '') : WORLD === 'sky' ? (isNight() ? '☾ ' + T.night : '☀ ' + T.day) : (time >= 150 ? '🔥 ' + T.lava : '');
    if (tag) { ctx.font = '600 12px "IBM Plex Sans",system-ui'; const w = ctx.measureText(tag).width + 16; ctx.fillStyle = 'rgba(8,12,20,.8)'; ctx.fillRect(cw / 2 - w / 2, 38, w, 20); ctx.fillStyle = '#ffd23d'; ctx.fillText(tag, cw / 2, 52); }
    feed.forEach((f, i) => { ctx.fillStyle = f.team === 0 ? `rgba(40,110,220,${Math.min(1, f.t)})` : `rgba(220,60,60,${Math.min(1, f.t)})`; ctx.font = '700 13px "IBM Plex Sans",system-ui'; ctx.fillText(f.text, cw / 2, 76 + i * 17); });
    if (msg) { ctx.font = '700 22px "Chakra Petch",system-ui'; ctx.lineWidth = 4; ctx.strokeStyle = `rgba(0,0,0,${Math.min(1, msg.t) * .6})`; ctx.strokeText(msg.text, cw / 2, ch * .26); ctx.fillStyle = `rgba(255,255,255,${Math.min(1, msg.t)})`; ctx.fillText(msg.text, cw / 2, ch * .26); }
    /* minimap */
    const S = Math.min(130, cw * .2, ch * .3), mx = 8, my = 8, k = S / M;
    ctx.fillStyle = 'rgba(8,12,20,.85)'; ctx.fillRect(mx, my, S, S);
    ctx.strokeStyle = 'rgba(160,130,90,.6)'; ctx.lineWidth = 3;
    for (const l of CFG.lanes) { const p = LANES[l]; ctx.beginPath(); ctx.moveTo(mx + p[0].x * k, my + p[0].y * k); for (const q of p.slice(1)) ctx.lineTo(mx + q.x * k, my + q.y * k); ctx.stroke(); }
    for (const u of units) {
      if (!u.alive) continue;
      const c = u.team === 2 ? '#c99a4a' : TEAM_COL[u.team];
      if (u.kind === 'tower' || u.kind === 'core') { ctx.fillStyle = c; ctx.fillRect(mx + u.x * k - 3, my + u.y * k - 3, 6, 6); }
      else if (u.kind === 'minion') { ctx.fillStyle = c; ctx.fillRect(mx + u.x * k - 1, my + u.y * k - 1, 2, 2); }
      else if (u.kind === 'hero') { ctx.beginPath(); ctx.arc(mx + u.x * k, my + u.y * k, u === me ? 5 : 3.5, 0, 6.283); ctx.fillStyle = u === me ? '#e8b44a' : c; ctx.fill(); }
    }
    ctx.strokeStyle = '#fff6'; ctx.lineWidth = 1; ctx.strokeRect(mx + (cam.x - cw / 2 / cam.s) * k, my + (cam.y - ch / 2 / cam.s) * k, cw / cam.s * k, ch / cam.s * k);
    /* own stats */
    ctx.fillStyle = 'rgba(8,12,20,.78)'; ctx.fillRect(mx, my + S + 4, Math.max(130, S), 86);
    ctx.textAlign = 'left'; ctx.font = '600 13px "IBM Plex Sans",system-ui'; ctx.fillStyle = '#e9edf5';
    ctx.fillText(`${T.kda} ${me.k}/${me.d}/${me.a}`, mx + 6, my + S + 20);
    ctx.fillStyle = '#e8b44a'; ctx.fillText(`● ${Math.floor(me.gold)}`, mx + 6, my + S + 38);
    me.items.forEach((id, i) => { ctx.fillStyle = ITEMS[id].c; ctx.fillRect(mx + 6 + i * 16, my + S + 46, 13, 13); });
    const lvlW = 120; bar(mx + lvlW / 2, my + S + 64, lvlW, me.lvl >= 15 ? 1 : me.xp / (me.lvl * 110), '#a77bf3', 4);
    ctx.fillStyle = '#c9b8ff'; ctx.fillText(`${T.level} ${me.lvl}`, mx + 6, my + S + 84);
    if (!me.alive) { ctx.textAlign = 'center'; ctx.font = '700 22px "Chakra Petch",system-ui'; ctx.fillStyle = '#ff9a9a'; ctx.fillText(`${T.respawn} ${Math.ceil(me.respawnT)}`, cw / 2, ch / 2); }
    /* skill cooldowns: on desktop draw them; on touch update the buttons */
    if (touch) {
      pad.querySelectorAll('[data-s]').forEach(b => {
        const i = +b.dataset.s; if (isNaN(i)) return;
        const cd = me.cds[i], lock = !unlocked(me, i);
        b.classList.toggle('cd', cd > 0 || lock); b.querySelector('i').textContent = lock ? '🔒' : cd > 0 ? Math.ceil(cd) : ['1', '2', '★'][i];
      });
    } else {
      const bx = cw / 2 - 120, by = ch - 64;
      ['Q', 'E', 'R'].forEach((key, i) => {
        const x = bx + i * 84, cd = me.cds[i], lock = !unlocked(me, i), Sk = ARCH[me.arch].sk[i];
        ctx.fillStyle = 'rgba(8,12,20,.85)'; ctx.fillRect(x, by, 76, 52);
        ctx.fillStyle = lock ? '#333a' : me.col + (cd > 0 ? '44' : 'cc'); ctx.fillRect(x + 3, by + 3, 70, 46);
        if (cd > 0) { ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(x + 3, by + 3, 70, 46 * cd / (Sk.cd * (1 - me.cdr))); }
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '700 15px "Chakra Petch",system-ui';
        ctx.fillText(lock ? '🔒' : cd > 0 ? Math.ceil(cd) : key, x + 38, by + 24);
        ctx.font = '600 10px "IBM Plex Sans",system-ui'; ctx.fillText(T.roles[me.arch].s[i], x + 38, by + 42);
      });
      ctx.textAlign = 'left'; ctx.fillStyle = '#8e9ab0'; ctx.font = '600 11px "IBM Plex Sans",system-ui'; ctx.fillText(T.keysHint, bx + 260, by + 30);
    }
    /* touch stick */
    if (stick) {
      ctx.beginPath(); ctx.arc(stick.ox, stick.oy, 55, 0, 6.283); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke();
      let dx = stick.x - stick.ox, dy = stick.y - stick.oy; const d = Math.hypot(dx, dy); if (d > 55) { dx *= 55 / d; dy *= 55 / d; }
      ctx.beginPath(); ctx.arc(stick.ox + dx, stick.oy + dy, 22, 0, 6.283); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fill();
    }
  }

  /* ---------- menu ---------- */
  function menu() {
    state = 'menu'; pad.hidden = true;
    const s = store.get('stats', null);
    ov.innerHTML = `<h3>${T.name}</h3><p>${T.pickHero}</p><div class="mb-roster">${CFG.roster.map((r, i) => `<button type="button" data-k="pick" data-i="${i}" aria-pressed="${i === choice}" style="--hc:${r.col}"><b>${r.name}</b><small>${T.roles[r.arch].name}</small></button>`).join('')}</div><button type="button" class="btn" data-k="start">${T.play}</button>${s ? `<small>${T.record.replace('{w}', s.wins).replace('{g}', s.games)}</small>` : ''}`;
    ov.hidden = false;
  }

  function frame(t) {
    const dt = Math.min(.05, (t - lastT) / 1000 || 0); lastT = t;
    if (state === 'play' || state === 'over') update(dt);
    draw();
    requestAnimationFrame(frame);
  }
  addEventListener('resize', resize);
  document.addEventListener('fullscreenchange', () => setTimeout(resize, 50));
  resize();
  newGame(0); state = 'menu'; menu();
  requestAnimationFrame(frame);
  window.__mb = { get state() { return state; }, get me() { return me; }, get units() { return units; }, get heroes() { return heroes; }, get kills() { return kills; }, step: update, newGame, cast };
})();
