/* Night Drop: a top-down battle royale in the dark. You see only what your torch lights up; walls block the light.
   1 player + 11 bots, loot on the ground, a shrinking safe zone, last one standing wins.
   Controls: WASD/arrows + mouse (click to shoot, R reload, Q/H heal, E pick up) or two touch sticks on phones. */
(function () {
  const root = document.getElementById('nd');
  if (!root) return;
  const T = JSON.parse(root.dataset.t || '{}');
  const stage = root.querySelector('.nd-stage'), cv = stage.querySelector('canvas'), ctx = cv.getContext('2d');
  const ov = stage.querySelector('.nd-ov'), btns = stage.querySelector('.nd-btns');

  const store = {
    get(k, d) { try { const v = localStorage.getItem('nd-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('nd-' + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- constants ---------- */
  const W = 2600, BOTS = 11, PR = 17;
  const CONE = 0.62, RANGE = 560, AMBIENT = 125;
  const WEAPONS = {
    pistol: { tier: 1, dmg: 18, rate: 3.2, spread: .05, speed: 1500, range: 620, mag: 12, reload: 1.1, pellets: 1, col: '#c9d1e0' },
    smg: { tier: 2, dmg: 11, rate: 10, spread: .12, speed: 1500, range: 560, mag: 30, reload: 1.6, pellets: 1, col: '#7fd6ff' },
    shotgun: { tier: 2, dmg: 10, rate: 1.1, spread: .32, speed: 1300, range: 380, mag: 5, reload: 2, pellets: 8, col: '#ffb057' },
    rifle: { tier: 3, dmg: 23, rate: 5.5, spread: .045, speed: 1800, range: 820, mag: 25, reload: 1.8, pellets: 1, col: '#9dff8a' },
    sniper: { tier: 3, dmg: 82, rate: .75, spread: .008, speed: 2600, range: 1150, mag: 5, reload: 2.4, pellets: 1, col: '#ff7ad9' }
  };
  const NAMES = ['Raven', 'Kito', 'Mira', 'Duke', 'Nova', 'Zed', 'Luna', 'Brick', 'Vex', 'Juno', 'Rook', 'Pike', 'Ash', 'Sora', 'Bolt', 'Tala', 'Ozzy', 'Fenn', 'Kaya', 'Rex'];
  const PHASES = [
    { wait: 25, shrink: 18, f: .62, dps: 2 }, { wait: 20, shrink: 16, f: .55, dps: 4 }, { wait: 18, shrink: 14, f: .5, dps: 7 },
    { wait: 15, shrink: 12, f: .45, dps: 11 }, { wait: 12, shrink: 10, f: .3, dps: 16 }, { wait: 10, shrink: 12, f: 0, dps: 25 }
  ];

  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const angDiff = (a, b) => { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; };
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  /* Liang-Barsky: where (0..1) the segment p + t*d enters rect r, or null. */
  function segRect(x, y, dx, dy, r) {
    let t0 = 0, t1 = 1;
    const p = [-dx, dx, -dy, dy], q = [x - r.x, r.x + r.w - x, y - r.y, r.y + r.h - y];
    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) { if (q[i] < 0) return null; continue; }
      const t = q[i] / p[i];
      if (p[i] < 0) { if (t > t1) return null; if (t > t0) t0 = t; } else { if (t < t0) return null; if (t < t1) t1 = t; }
    }
    return t0;
  }

  /* ---------- state ---------- */
  let rects, loot, ents, bullets, fx, noises, feed, zone, me, state = 'menu', time, msg, spectate;

  function nearRects(x, y, rad) { return rects.filter(r => x + rad > r.x && x - rad < r.x + r.w && y + rad > r.y && y - rad < r.y + r.h); }
  function blocked(x1, y1, x2, y2, list) {
    const dx = x2 - x1, dy = y2 - y1;
    for (const r of list || rects) { const t = segRect(x1, y1, dx, dy, r); if (t != null && t < 1 && t > 0) return true; }
    return false;
  }
  function freePoint(pad) {
    for (let i = 0; i < 400; i++) {
      const x = rnd(80, W - 80), y = rnd(80, W - 80);
      if (!rects.some(r => x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad)) return { x, y };
    }
    return { x: W / 2, y: W / 2 };
  }

  /* Map: buildings (walls with door gaps) and crates, generated fresh for every match. */
  function makeMap() {
    rects = [];
    const B = 40;
    rects.push({ x: -B, y: -B, w: W + 2 * B, h: B, wall: 1 }, { x: -B, y: W, w: W + 2 * B, h: B, wall: 1 }, { x: -B, y: 0, w: B, h: W, wall: 1 }, { x: W, y: 0, w: B, h: W, wall: 1 });
    const blocks = [], th = 22, door = 95;
    const free = (x, y, w, h, pad) => !blocks.some(b => x < b.x + b.w + pad && x + w + pad > b.x && y < b.y + b.h + pad && y + h + pad > b.y);
    let tries = 0;
    while (blocks.filter(b => b.house).length < 9 && tries++ < 300) {
      const w = rnd(300, 520), h = rnd(240, 400), x = rnd(120, W - w - 120), y = rnd(120, W - h - 120);
      if (!free(x, y, w, h, 130)) continue;
      blocks.push({ x, y, w, h, house: 1 });
      const doors = [0, 1, 2, 3].sort(() => Math.random() - .5).slice(0, 2 + (Math.random() < .4));
      const side = (s, x1, y1, len, horiz) => {
        if (!doors.includes(s)) { rects.push(horiz ? { x: x1, y: y1, w: len, h: th, wall: 1 } : { x: x1, y: y1, w: th, h: len, wall: 1 }); return; }
        const at = rnd(40, len - door - 40);
        if (horiz) { rects.push({ x: x1, y: y1, w: at, h: th, wall: 1 }, { x: x1 + at + door, y: y1, w: len - at - door, h: th, wall: 1 }); }
        else { rects.push({ x: x1, y: y1, w: th, h: at, wall: 1 }, { x: x1, y: y1 + at + door, w: th, h: len - at - door, wall: 1 }); }
      };
      side(0, x, y, w, true); side(1, x, y + h - th, w, true); side(2, x, y + th, h - 2 * th, false); side(3, x + w - th, y + th, h - 2 * th, false);
      if (Math.random() < .7) { const cw = rnd(40, 70); rects.push({ x: x + rnd(60, w - 60 - cw), y: y + rnd(60, h - 60 - cw), w: cw, h: cw, crate: 1 }); }
    }
    tries = 0;
    while (blocks.length < 9 + 46 && tries++ < 2000) {
      const big = Math.random() < .25, w = big ? rnd(120, 220) : rnd(50, 100), h = big ? rnd(40, 70) : w * rnd(.8, 1.2);
      const ww = Math.random() < .5 ? w : h, hh = ww === w ? h : w;
      const x = rnd(80, W - ww - 80), y = rnd(80, W - hh - 80);
      if (!free(x, y, ww, hh, 90)) continue;
      blocks.push({ x, y, w: ww, h: hh });
      rects.push({ x, y, w: ww, h: hh, crate: !big, rock: big });
    }
    loot = [];
    const houses = blocks.filter(b => b.house);
    const spot = inside => {
      if (inside && houses.length) {
        for (let i = 0; i < 30; i++) {
          const h = houses[Math.floor(Math.random() * houses.length)], p = { x: rnd(h.x + 50, h.x + h.w - 50), y: rnd(h.y + 50, h.y + h.h - 50) };
          if (!rects.some(r => p.x > r.x - 25 && p.x < r.x + r.w + 25 && p.y > r.y - 25 && p.y < r.y + r.h + 25)) return p;
        }
      }
      return freePoint(30);
    };
    const wl = ['smg', 'smg', 'shotgun', 'shotgun', 'rifle', 'rifle', 'sniper', 'pistol'];
    for (let i = 0; i < 44; i++) loot.push({ ...spot(Math.random() < .65), type: 'w', w: wl[i % wl.length] });
    for (let i = 0; i < 30; i++) loot.push({ ...spot(Math.random() < .5), type: 'med' });
    for (let i = 0; i < 20; i++) loot.push({ ...spot(Math.random() < .5), type: 'armor' });
  }

  function newEnt(name, bot) {
    const p = freePoint(40);
    return { x: p.x, y: p.y, r: PR, hp: 100, armor: 0, ang: rnd(-3, 3), w: 'pistol', mag: WEAPONS.pistol.mag, reloadT: 0, cool: 0, healCd: 0,
      meds: 0, alive: true, kills: 0, name, bot, hitT: 0,
      ai: bot ? { wp: null, tgt: null, seenT: 0, last: null, think: 0, react: rnd(.22, .5), err: rnd(.07, .17), strafe: Math.random() < .5 ? 1 : -1, stuckT: 0, px: 0, py: 0, heard: null } : null };
  }

  function start() {
    makeMap();
    ents = []; bullets = []; fx = []; noises = []; feed = []; time = 0; msg = null; spectate = null;
    me = newEnt(T.you || 'You', false);
    ents.push(me);
    const names = NAMES.slice().sort(() => Math.random() - .5);
    for (let i = 0; i < BOTS; i++) {
      const b = newEnt(names[i], true);
      for (let k = 0; k < 20 && ents.some(e => dist(e, b) < 520); k++) Object.assign(b, freePoint(40));
      ents.push(b);
    }
    zone = { x: W / 2, y: W / 2, r: W * .75, nx: W / 2, ny: W / 2, nr: W * .75 * PHASES[0].f, phase: 0, t: 0, shrinking: false, ox: W / 2, oy: W / 2, or: W * .75 };
    pickNext();
    state = 'play';
    ov.hidden = true;
    say(T.drop, 3);
  }

  function pickNext() {
    const P = PHASES[zone.phase]; if (!P) return;
    const nr = W * .75 * P.f, room = Math.max(0, zone.r - nr), a = rnd(0, 6.283), d = Math.sqrt(Math.random()) * room;
    zone.nx = clamp(zone.x + Math.cos(a) * d, nr * .3, W - nr * .3); zone.ny = clamp(zone.y + Math.sin(a) * d, nr * .3, W - nr * .3); zone.nr = nr;
  }
  function updateZone(dt) {
    const P = PHASES[zone.phase]; if (!P) return;
    zone.t += dt;
    if (!zone.shrinking && zone.t >= P.wait) { zone.shrinking = true; zone.t = 0; zone.ox = zone.x; zone.oy = zone.y; zone.or = zone.r; say(T.zoneShrink, 2.5); }
    if (zone.shrinking) {
      const k = Math.min(1, zone.t / P.shrink);
      zone.x = zone.ox + (zone.nx - zone.ox) * k; zone.y = zone.oy + (zone.ny - zone.oy) * k; zone.r = zone.or + (zone.nr - zone.or) * k;
      if (k >= 1) { zone.shrinking = false; zone.t = 0; zone.phase++; pickNext(); }
    }
  }
  const zoneDps = () => (PHASES[Math.min(zone.phase, PHASES.length - 1)] || {}).dps || 25;
  const outside = e => Math.hypot(e.x - zone.x, e.y - zone.y) > zone.r;

  function say(text, sec) { msg = { text, t: sec }; }

  /* ---------- combat ---------- */
  function fire(e) {
    const W8 = WEAPONS[e.w];
    if (e.reloadT > 0 || e.cool > 0) return;
    if (e.mag <= 0) { reload(e); return; }
    e.cool = 1 / W8.rate; e.mag--;
    for (let i = 0; i < W8.pellets; i++) {
      const a = e.ang + (Math.random() - .5) * W8.spread * 2;
      bullets.push({ x: e.x + Math.cos(e.ang) * (e.r + 4), y: e.y + Math.sin(e.ang) * (e.r + 4), vx: Math.cos(a) * W8.speed, vy: Math.sin(a) * W8.speed, left: W8.range, dmg: W8.dmg, owner: e, col: W8.col });
    }
    fx.push({ type: 'flash', x: e.x + Math.cos(e.ang) * (e.r + 10), y: e.y + Math.sin(e.ang) * (e.r + 10), t: .06, owner: e });
    noises.push({ x: e.x, y: e.y, t: .7, owner: e });
    if (e.mag <= 0) reload(e);
  }
  function reload(e) { if (e.reloadT > 0 || e.mag >= WEAPONS[e.w].mag) return; e.reloadT = WEAPONS[e.w].reload; }
  function heal(e) {
    if (e.meds <= 0 || e.hp >= 100 || e.healCd > 0) return;
    e.meds--; e.hp = Math.min(100, e.hp + 45); e.healCd = 1.2;
    fx.push({ type: 'txt', x: e.x, y: e.y - 30, t: .9, text: '+45', col: '#4fc28a' });
  }
  function damage(e, dmg, by) {
    if (!e.alive) return;
    if (e.armor > 0) { const a = Math.min(e.armor, dmg * .6); e.armor -= a; dmg -= a; }
    e.hp -= dmg; e.hitT = .25;
    if (e === me || by === me) fx.push({ type: 'txt', x: e.x + rnd(-10, 10), y: e.y - 28, t: .7, text: Math.round(dmg), col: e === me ? '#ff6b6b' : '#ffe08a' });
    if (e.bot && by && by !== e && !e.ai.tgt) { e.ai.last = { x: by.x, y: by.y }; e.ai.seenT = 2; }
    if (e.hp <= 0) kill(e, by);
  }
  function kill(e, by) {
    e.alive = false; e.hp = 0;
    if (by && by !== e) by.kills++;
    feed.unshift({ text: by && by !== e ? `${by.name} ✕ ${e.name}` : `${e.name} ✕`, t: 5, mine: e === me || by === me });
    feed.length = Math.min(feed.length, 4);
    fx.push({ type: 'boom', x: e.x, y: e.y, t: .5 });
    if (e.w !== 'pistol') loot.push({ x: e.x + rnd(-15, 15), y: e.y + rnd(-15, 15), type: 'w', w: e.w });
    if (e.meds > 0) loot.push({ x: e.x + rnd(-20, 20), y: e.y + rnd(-20, 20), type: 'med' });
    const alive = ents.filter(x => x.alive).length;
    if (e === me) end(false, alive + 1, by);
    else if (alive === 1 && me.alive) end(true, 1);
  }

  function end(won, place, by) {
    state = won ? 'won' : 'dead';
    const s = store.get('stats', { games: 0, wins: 0, best: 99, kills: 0 });
    s.games++; if (won) s.wins++; s.best = Math.min(s.best, place); s.kills = Math.max(s.kills, me.kills);
    store.set('stats', s);
    if (!won) spectate = by && by !== me ? by : null;
    setTimeout(() => showOverlay(won ? T.winTitle : T.deadTitle,
      (won ? T.winText : T.deadText).replace('{place}', place).replace('{kills}', me.kills).replace('{by}', by && by !== me ? by.name : T.zone) +
      `<br><small>${T.statsLine.replace('{games}', s.games).replace('{wins}', s.wins).replace('{best}', s.best === 99 ? '–' : '#' + s.best).replace('{kills}', s.kills)}</small>`, T.again), won ? 600 : 1400);
  }

  function showOverlay(h, p, b) {
    ov.innerHTML = `<h3>${h}</h3><p>${p}</p><button type="button" class="btn" data-k="start">${b}</button>`;
    ov.hidden = false;
  }

  /* ---------- movement & AI ---------- */
  function move(e, vx, vy, dt) {
    e.x += vx * dt; e.y += vy * dt;
    for (const r of nearRects(e.x, e.y, e.r + 2)) {
      const cx = clamp(e.x, r.x, r.x + r.w), cy = clamp(e.y, r.y, r.y + r.h), dx = e.x - cx, dy = e.y - cy, d2 = dx * dx + dy * dy;
      if (d2 >= e.r * e.r) continue;
      if (d2 > 0) { const d = Math.sqrt(d2), p = e.r - d; e.x += dx / d * p; e.y += dy / d * p; }
      else {
        const l = e.x - r.x, rr = r.x + r.w - e.x, t = e.y - r.y, b = r.y + r.h - e.y, m = Math.min(l, rr, t, b);
        if (m === l) e.x = r.x - e.r; else if (m === rr) e.x = r.x + r.w + e.r; else if (m === t) e.y = r.y - e.r; else e.y = r.y + r.h + e.r;
      }
    }
    e.x = clamp(e.x, e.r, W - e.r); e.y = clamp(e.y, e.r, W - e.r);
  }

  function sees(a, b) {
    const d = dist(a, b);
    if (d > RANGE + b.r) return false;
    const inCone = Math.abs(angDiff(a.ang, Math.atan2(b.y - a.y, b.x - a.x))) < CONE + .08;
    if (!(d < AMBIENT + b.r || inCone)) return false;
    return !blocked(a.x, a.y, b.x, b.y, nearRects((a.x + b.x) / 2, (a.y + b.y) / 2, d / 2 + 5));
  }

  function botThink(b, dt) {
    const A = b.ai, W8 = WEAPONS[b.w];
    A.think -= dt;
    if (A.think <= 0) {
      A.think = .15;
      let best = null, bd = 1e9;
      for (const o of ents) { if (o === b || !o.alive) continue; const d = dist(b, o); if (d < bd && sees(b, o)) { bd = d; best = o; } }
      if (best) { if (A.tgt !== best) A.seenT = -A.react; A.tgt = best; A.last = { x: best.x, y: best.y }; }
      else { if (A.tgt) A.seenT = 2; A.tgt = null; }
      if (!A.tgt) for (const n of noises) if (n.owner !== b && Math.hypot(n.x - b.x, n.y - b.y) < 650) { A.last = { x: n.x, y: n.y }; A.seenT = 1.6; break; }
    }
    let mx = 0, my = 0, aimAt = null;
    const goTo = (x, y) => { const d = Math.hypot(x - b.x, y - b.y) || 1; mx = (x - b.x) / d; my = (y - b.y) / d; };
    const zoneD = Math.hypot(b.x - zone.x, b.y - zone.y);
    if (A.tgt && A.tgt.alive) {
      const t = A.tgt, d = dist(b, t);
      aimAt = t;
      A.seenT += dt;
      const want = Math.min(W8.range * .65, 420);
      const px = -(t.y - b.y) / d, py = (t.x - b.x) / d;
      mx = px * A.strafe; my = py * A.strafe;
      if (d > want) { mx += (t.x - b.x) / d; my += (t.y - b.y) / d; } else if (d < want * .5) { mx -= (t.x - b.x) / d; my -= (t.y - b.y) / d; }
      if (Math.random() < dt * .6) A.strafe *= -1;
      if (b.hp < 35 && b.meds > 0 && b.healCd <= 0 && Math.random() < .5) heal(b);
    } else if (outside(b) || zoneD > zone.r * .85 || (zone.shrinking && Math.hypot(b.x - zone.nx, b.y - zone.ny) > zone.nr * .8)) {
      goTo(zone.shrinking ? zone.nx : zone.x, zone.shrinking ? zone.ny : zone.y);
    } else if (A.last && A.seenT > 0) {
      A.seenT -= dt; goTo(A.last.x, A.last.y); aimAt = A.last;
      if (Math.hypot(A.last.x - b.x, A.last.y - b.y) < 30) A.seenT = 0;
    } else {
      if (b.hp < 70 && b.meds > 0) heal(b);
      if (b.mag < WEAPONS[b.w].mag) reload(b);
      let want = null, wd = 380;
      for (const l of loot) {
        const d = Math.hypot(l.x - b.x, l.y - b.y);
        if (d > wd) continue;
        const useful = l.type === 'w' ? WEAPONS[l.w].tier > W8.tier : l.type === 'med' ? b.meds < 3 : b.armor < 60;
        if (useful) { want = l; wd = d; }
      }
      if (want) goTo(want.x, want.y);
      else {
        if (!A.wp || Math.hypot(A.wp.x - b.x, A.wp.y - b.y) < 40) {
          const a = rnd(0, 6.283), r = Math.sqrt(Math.random()) * zone.r * .8;
          A.wp = { x: clamp(zone.x + Math.cos(a) * r, 60, W - 60), y: clamp(zone.y + Math.sin(a) * r, 60, W - 60) };
        }
        goTo(A.wp.x, A.wp.y);
      }
    }
    /* stuck on a wall: try sideways, then a new waypoint */
    A.stuckT += dt;
    if (A.stuckT > .5) {
      if (Math.hypot(b.x - A.px, b.y - A.py) < 12 && (mx || my)) { A.wp = null; A.dodge = .6; A.dodgeDir = Math.random() < .5 ? 1 : -1; }
      A.stuckT = 0; A.px = b.x; A.py = b.y;
    }
    if (A.dodge > 0) { A.dodge -= dt; const ox = mx; mx = -my * A.dodgeDir + mx * .3; my = ox * A.dodgeDir + my * .3; }
    const ml = Math.hypot(mx, my);
    if (ml > 0) move(b, mx / ml * 200, my / ml * 200, dt);
    let wantAng = ml > 0 ? Math.atan2(my, mx) : b.ang;
    if (aimAt) wantAng = Math.atan2(aimAt.y - b.y, aimAt.x - b.x);
    b.ang += angDiff(b.ang, wantAng) * Math.min(1, dt * (aimAt ? 7 : 5));
    if (A.tgt && A.tgt.alive && A.seenT > 0) {
      const err = angDiff(b.ang, Math.atan2(A.tgt.y - b.y, A.tgt.x - b.x));
      if (Math.abs(err) < .18 && dist(b, A.tgt) < W8.range) { const keep = b.ang; b.ang += rnd(-A.err, A.err); fire(b); b.ang = keep; }
    }
  }

  function pickups(e) {
    for (let i = loot.length - 1; i >= 0; i--) {
      const l = loot[i];
      if (Math.hypot(l.x - e.x, l.y - e.y) > e.r + 14) continue;
      if (l.type === 'med' && e.meds < 3) { e.meds++; loot.splice(i, 1); }
      else if (l.type === 'armor' && e.armor < 100) { e.armor = Math.min(100, e.armor + 50); loot.splice(i, 1); }
      else if (l.type === 'w' && e.bot && WEAPONS[l.w].tier > WEAPONS[e.w].tier) swapWeapon(e, i);
    }
  }
  function swapWeapon(e, i) {
    const l = loot[i], old = e.w;
    e.w = l.w; e.mag = WEAPONS[l.w].mag; e.reloadT = 0;
    if (old === 'pistol') loot.splice(i, 1); else l.w = old;
  }
  const weaponUnder = e => loot.findIndex(l => l.type === 'w' && l.w !== e.w && Math.hypot(l.x - e.x, l.y - e.y) < e.r + 16);

  /* ---------- input ---------- */
  const keys = {};
  let mouse = { x: 0, y: 0, down: false, on: false }, touch = false;
  const sticks = { move: null, aim: null };
  addEventListener('keydown', e => {
    if (state !== 'play') return;
    const k = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
    keys[k] = true;
    if (k === 'r') reload(me);
    if (k === 'q' || k === 'h') heal(me);
    if (k === 'e') { const i = weaponUnder(me); if (i > -1) swapWeapon(me, i); }
  });
  addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  const local = e => { const b = cv.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top, w: b.width, h: b.height }; };
  cv.addEventListener('pointerdown', e => {
    if (state !== 'play') return;
    const p = local(e);
    if (e.pointerType === 'mouse') { mouse = { ...p, down: e.button === 0, on: true }; return; }
    e.preventDefault();
    if (!touch) { touch = true; btns.hidden = false; }
    cv.setPointerCapture(e.pointerId);
    const s = { id: e.pointerId, ox: p.x, oy: p.y, x: p.x, y: p.y };
    if (p.x < p.w / 2) { if (!sticks.move) sticks.move = s; } else if (!sticks.aim) sticks.aim = s;
  });
  cv.addEventListener('pointermove', e => {
    const p = local(e);
    if (e.pointerType === 'mouse') { mouse.x = p.x; mouse.y = p.y; mouse.on = true; return; }
    for (const k of ['move', 'aim']) if (sticks[k] && sticks[k].id === e.pointerId) { sticks[k].x = p.x; sticks[k].y = p.y; }
  });
  const up = e => {
    if (e.pointerType === 'mouse') { mouse.down = false; return; }
    for (const k of ['move', 'aim']) if (sticks[k] && sticks[k].id === e.pointerId) sticks[k] = null;
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('contextmenu', e => e.preventDefault());
  stage.addEventListener('click', e => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    const k = b.dataset.k;
    if (k === 'start') {
      start();
      const coarse = matchMedia('(pointer:coarse)').matches;
      try {
        if (coarse && !document.fullscreenElement && stage.requestFullscreen) stage.requestFullscreen().then(() => { try { screen.orientation.lock('landscape').catch(() => {}); } catch (x) {} }).catch(() => stage.scrollIntoView({ block: 'center' }));
        else stage.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } catch (x) {}
    }
    else if (k === 'reload') reload(me);
    else if (k === 'heal') heal(me);
    else if (k === 'pick') { const i = weaponUnder(me); if (i > -1) swapWeapon(me, i); }
    else if (k === 'full') {
      try { if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen().then(() => { try { screen.orientation.lock('landscape').catch(() => {}); } catch (x) {} }).catch(() => {}); } catch (x) {}
    }
  });
  const STICK = 55;
  const stickVec = s => { if (!s) return null; let dx = s.x - s.ox, dy = s.y - s.oy; const d = Math.hypot(dx, dy); if (d > STICK) { dx *= STICK / d; dy *= STICK / d; } return { x: dx / STICK, y: dy / STICK, m: Math.min(1, d / STICK) }; };

  /* ---------- update ---------- */
  let cam = { x: W / 2, y: W / 2, s: 1 }, cw = 0, ch = 0;
  function update(dt) {
    time += dt;
    updateZone(dt);
    for (const e of ents) {
      if (!e.alive) continue;
      e.cool = Math.max(0, e.cool - dt); e.healCd = Math.max(0, e.healCd - dt); e.hitT = Math.max(0, e.hitT - dt);
      if (e.reloadT > 0) { e.reloadT -= dt; if (e.reloadT <= 0) { e.reloadT = 0; e.mag = WEAPONS[e.w].mag; } }
      if (outside(e)) { e.zoneT = (e.zoneT || 0) + dt; if (e.zoneT > .5) { e.zoneT = 0; damage(e, zoneDps() * .5, null); } }
    }
    if (me.alive) {
      let mx = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0), my = (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
      const ms = stickVec(sticks.move); if (ms) { mx = ms.x; my = ms.y; }
      const ml = Math.hypot(mx, my); if (ml > 1) { mx /= ml; my /= ml; }
      if (ml > .05) move(me, mx * 235, my * 235, dt);
      const as = stickVec(sticks.aim);
      if (as && as.m > .2) { me.ang = Math.atan2(as.y, as.x); if (as.m > .55) fire(me); }
      else if (!touch && mouse.on) { me.ang = Math.atan2(mouse.y - ch / 2 + camOff().y * cam.s, mouse.x - cw / 2 + camOff().x * cam.s); if (mouse.down || keys[' ']) fire(me); }
      else if (touch && ms && ms.m > .2 && !as) me.ang = Math.atan2(ms.y, ms.x);
      pickups(me);
    }
    for (const e of ents) if (e.bot && e.alive) { botThink(e, dt); pickups(e); }
    /* bullets */
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i], dx = b.vx * dt, dy = b.vy * dt;
      let hitT = 1, hit = null;
      for (const r of nearRects(b.x + dx / 2, b.y + dy / 2, Math.hypot(dx, dy) / 2 + 2)) { const t = segRect(b.x, b.y, dx, dy, r); if (t != null && t < hitT) { hitT = t; hit = 'wall'; } }
      for (const e of ents) {
        if (!e.alive || e === b.owner) continue;
        const fx_ = e.x - b.x, fy = e.y - b.y, L2 = dx * dx + dy * dy, t = clamp((fx_ * dx + fy * dy) / L2, 0, 1);
        const cx = b.x + dx * t - e.x, cy = b.y + dy * t - e.y;
        if (cx * cx + cy * cy < e.r * e.r && t < hitT) { hitT = t; hit = e; }
      }
      b.x += dx * hitT; b.y += dy * hitT; b.left -= Math.hypot(dx, dy) * hitT;
      if (hit) { if (hit !== 'wall') damage(hit, b.dmg, b.owner); else fx.push({ type: 'spark', x: b.x, y: b.y, t: .12 }); bullets.splice(i, 1); }
      else if (b.left <= 0) bullets.splice(i, 1);
    }
    for (const list of [fx, noises, feed]) for (let i = list.length - 1; i >= 0; i--) { list[i].t -= dt; if (list[i].t <= 0) list.splice(i, 1); }
    if (msg) { msg.t -= dt; if (msg.t <= 0) msg = null; }
  }

  /* ---------- drawing ---------- */
  const camOff = () => ({ x: Math.cos(me.ang) * 70, y: Math.sin(me.ang) * 70 });
  function visPoly(e) {
    const pts = [], N = 260, near = nearRects(e.x, e.y, RANGE + 10);
    for (let i = 0; i < N; i++) {
      const a = -Math.PI + i / N * Math.PI * 2, inC = Math.abs(angDiff(e.ang, a));
      const R = inC < CONE ? RANGE : inC < CONE + .12 ? AMBIENT + (RANGE - AMBIENT) * (1 - (inC - CONE) / .12) : AMBIENT;
      const dx = Math.cos(a) * R, dy = Math.sin(a) * R;
      let t = 1;
      for (const r of near) { const h = segRect(e.x, e.y, dx, dy, r); if (h != null && h < t) t = h; }
      pts.push(e.x + dx * Math.max(t, 0) + (t < 1 ? Math.cos(a) * 4 : 0), e.y + dy * Math.max(t, 0) + (t < 1 ? Math.sin(a) * 4 : 0));
    }
    return pts;
  }
  function inPoly(pts, x, y) {
    let c = false;
    for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) {
      const xi = pts[i], yi = pts[i + 1], xj = pts[j], yj = pts[j + 1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }

  function resize() {
    const dpr = Math.min(2, devicePixelRatio || 1), r = stage.getBoundingClientRect();
    cw = r.width; ch = r.height;
    cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cam.s = clamp(Math.sqrt(cw * ch) / 760, .5, 1.25);
  }

  function drawEnt(e, self) {
    ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.ang);
    ctx.fillStyle = '#0b0f17'; ctx.fillRect(e.r - 4, -4, 20, 8);
    ctx.fillStyle = WEAPONS[e.w].col; ctx.fillRect(e.r - 2, -2.5, 16, 5);
    ctx.restore();
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.283);
    ctx.fillStyle = e.hitT > 0 ? '#fff' : self ? '#e8b44a' : '#e2595b'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = self ? '#7a5a17' : '#6d1f22'; ctx.stroke();
    if (e.armor > 0) { ctx.beginPath(); ctx.arc(e.x, e.y, e.r + 4, 0, 6.283 * e.armor / 100); ctx.strokeStyle = '#4a9bea'; ctx.lineWidth = 2.5; ctx.stroke(); }
    if (!self) {
      ctx.font = '600 12px "IBM Plex Sans",system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd9d9'; ctx.fillText(e.name, e.x, e.y - e.r - 14);
      ctx.fillStyle = '#300'; ctx.fillRect(e.x - 18, e.y - e.r - 10, 36, 4); ctx.fillStyle = '#ff6b6b'; ctx.fillRect(e.x - 18, e.y - e.r - 10, 36 * e.hp / 100, 4);
    }
  }
  const LOOT_COL = { med: '#4fc28a', armor: '#4a9bea' };
  function drawLoot(l) {
    ctx.save(); ctx.translate(l.x, l.y);
    const pulse = 1 + Math.sin(time * 4 + l.x) * .08; ctx.scale(pulse, pulse);
    if (l.type === 'w') { ctx.rotate(.4); ctx.fillStyle = '#0b0f17'; ctx.fillRect(-15, -6, 30, 12); ctx.fillStyle = WEAPONS[l.w].col; ctx.fillRect(-13, -4, 26, 8); }
    else { ctx.fillStyle = LOOT_COL[l.type]; ctx.beginPath(); ctx.arc(0, 0, 10, 0, 6.283); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '700 13px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(l.type === 'med' ? '+' : '◆', 0, 1); ctx.textBaseline = 'alphabetic'; }
    ctx.restore();
  }

  function draw() {
    ctx.fillStyle = '#04060b'; ctx.fillRect(0, 0, cw, ch);
    if (!ents) return;
    const focus = me.alive || !spectate || !spectate.alive ? me : spectate;
    const off = focus === me && me.alive ? camOff() : { x: 0, y: 0 };
    cam.x += (focus.x + off.x - cam.x) * .15; cam.y += (focus.y + off.y - cam.y) * .15;
    ctx.save();
    ctx.translate(cw / 2, ch / 2); ctx.scale(cam.s, cam.s); ctx.translate(-cam.x, -cam.y);
    const vx0 = cam.x - cw / 2 / cam.s, vy0 = cam.y - ch / 2 / cam.s, vx1 = cam.x + cw / 2 / cam.s, vy1 = cam.y + ch / 2 / cam.s;
    /* dark map: floor grid and walls are always faintly visible */
    ctx.fillStyle = '#0a0e16'; ctx.fillRect(0, 0, W, W);
    ctx.strokeStyle = 'rgba(120,140,180,.05)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = Math.max(0, Math.floor(vx0 / 100) * 100); x <= Math.min(W, vx1); x += 100) { ctx.moveTo(x, Math.max(0, vy0)); ctx.lineTo(x, Math.min(W, vy1)); }
    for (let y = Math.max(0, Math.floor(vy0 / 100) * 100); y <= Math.min(W, vy1); y += 100) { ctx.moveTo(Math.max(0, vx0), y); ctx.lineTo(Math.min(W, vx1), y); }
    ctx.stroke();
    const vis = rects.filter(r => r.x < vx1 && r.x + r.w > vx0 && r.y < vy1 && r.y + r.h > vy0);
    /* light */
    const poly = focus.alive ? visPoly(focus) : null;
    if (poly) {
      ctx.save(); ctx.beginPath(); ctx.moveTo(poly[0], poly[1]); for (let i = 2; i < poly.length; i += 2) ctx.lineTo(poly[i], poly[i + 1]); ctx.closePath(); ctx.clip();
      const g = ctx.createRadialGradient(focus.x, focus.y, 20, focus.x, focus.y, RANGE);
      g.addColorStop(0, '#3a3f4c'); g.addColorStop(.5, '#262b37'); g.addColorStop(1, '#151a25');
      ctx.fillStyle = g; ctx.fillRect(focus.x - RANGE, focus.y - RANGE, RANGE * 2, RANGE * 2);
      ctx.strokeStyle = 'rgba(200,210,230,.07)'; ctx.beginPath();
      for (let x = Math.floor((focus.x - RANGE) / 100) * 100; x <= focus.x + RANGE; x += 100) { ctx.moveTo(x, focus.y - RANGE); ctx.lineTo(x, focus.y + RANGE); }
      for (let y = Math.floor((focus.y - RANGE) / 100) * 100; y <= focus.y + RANGE; y += 100) { ctx.moveTo(focus.x - RANGE, y); ctx.lineTo(focus.x + RANGE, y); }
      ctx.stroke();
      for (const l of loot) if (Math.abs(l.x - focus.x) < RANGE && Math.abs(l.y - focus.y) < RANGE) drawLoot(l);
      for (const b of bullets) { ctx.strokeStyle = b.col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .018, b.y - b.vy * .018); ctx.stroke(); }
      for (const e of ents) if (e.alive && e !== focus && inPoly(poly, e.x, e.y)) drawEnt(e, false);
      ctx.restore();
    }
    for (const r of vis) {
      ctx.fillStyle = r.wall ? '#252e40' : r.rock ? '#2a2f3a' : '#3a2f22';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = r.wall ? '#3a4660' : r.rock ? '#3c4250' : '#5a4630'; ctx.lineWidth = 2; ctx.strokeRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
      if (r.crate) { ctx.beginPath(); ctx.moveTo(r.x + 4, r.y + 4); ctx.lineTo(r.x + r.w - 4, r.y + r.h - 4); ctx.moveTo(r.x + r.w - 4, r.y + 4); ctx.lineTo(r.x + 4, r.y + r.h - 4); ctx.stroke(); }
    }
    /* own bullets are always visible; unseen gunfire shows as a red flash (you hear it) */
    for (const b of bullets) if (b.owner === focus && !(poly && inPoly(poly, b.x, b.y))) { ctx.strokeStyle = b.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .018, b.y - b.vy * .018); ctx.stroke(); }
    for (const f of fx) {
      if (f.type === 'flash') {
        const seen = f.owner === focus || (poly && inPoly(poly, f.x, f.y));
        ctx.beginPath(); ctx.arc(f.x, f.y, seen ? 9 : 14, 0, 6.283); ctx.fillStyle = seen ? 'rgba(255,230,150,.9)' : 'rgba(255,70,70,.55)'; ctx.fill();
      } else if (f.type === 'spark') { ctx.fillStyle = 'rgba(255,220,150,.8)'; ctx.fillRect(f.x - 2, f.y - 2, 4, 4); }
      else if (f.type === 'boom') { ctx.beginPath(); ctx.arc(f.x, f.y, 40 * (1 - f.t / .5) + 10, 0, 6.283); ctx.strokeStyle = `rgba(255,120,90,${f.t * 2})`; ctx.lineWidth = 3; ctx.stroke(); }
    }
    if (focus.alive) drawEnt(focus, focus === me);
    for (const f of fx) if (f.type === 'txt') { ctx.font = '700 15px "Chakra Petch",system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = f.col; ctx.globalAlpha = Math.min(1, f.t * 2); ctx.fillText(f.text, f.x, f.y - (1 - f.t) * 25); ctx.globalAlpha = 1; }
    /* zone: tint outside, outline now and next */
    ctx.beginPath(); ctx.rect(vx0 - 10, vy0 - 10, vx1 - vx0 + 20, vy1 - vy0 + 20); ctx.moveTo(zone.x + zone.r, zone.y); ctx.arc(zone.x, zone.y, zone.r, 0, 6.283);
    ctx.fillStyle = 'rgba(160,30,60,.22)'; ctx.fill('evenodd');
    ctx.lineWidth = 4 / cam.s; ctx.strokeStyle = 'rgba(255,90,120,.8)'; ctx.beginPath(); ctx.arc(zone.x, zone.y, zone.r, 0, 6.283); ctx.stroke();
    if (PHASES[zone.phase]) { ctx.setLineDash([14, 12]); ctx.lineWidth = 2 / cam.s; ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.arc(zone.nx, zone.ny, zone.nr, 0, 6.283); ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
    /* heard shots off-screen: red marks on the screen edge */
    for (const n of noises) {
      if (n.owner === focus || !focus.alive) continue;
      const dx = n.x - focus.x, dy = n.y - focus.y, d = Math.hypot(dx, dy);
      if (d > 1300 || d < 1) continue;
      const sx = (n.x - cam.x) * cam.s + cw / 2, sy = (n.y - cam.y) * cam.s + ch / 2;
      if (sx > 10 && sx < cw - 10 && sy > 10 && sy < ch - 10) continue;
      const a = Math.atan2(dy, dx), ex = clamp(cw / 2 + Math.cos(a) * cw, 14, cw - 14), ey = clamp(ch / 2 + Math.sin(a) * ch, 14, ch - 14);
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(a); ctx.fillStyle = `rgba(255,80,80,${n.t})`; ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-6, -8); ctx.lineTo(-6, 8); ctx.fill(); ctx.restore();
    }
    hud(focus);
  }

  function hud(focus) {
    const alive = ents.filter(e => e.alive).length;
    ctx.textAlign = 'left'; ctx.font = '700 15px "Chakra Petch",system-ui';
    pill(10, 10, `👥 ${alive}`); pill(10, 42, `✕ ${me.kills}`);
    /* minimap */
    const M = Math.min(110, cw * .26), mx = cw - M - 10, my = 10, k = M / W;
    ctx.fillStyle = 'rgba(8,12,20,.8)'; ctx.fillRect(mx, my, M, M); ctx.strokeStyle = '#253048'; ctx.lineWidth = 1; ctx.strokeRect(mx, my, M, M);
    ctx.fillStyle = 'rgba(80,95,125,.6)'; for (const r of rects) if (r.wall) ctx.fillRect(mx + r.x * k, my + r.y * k, Math.max(1, r.w * k), Math.max(1, r.h * k));
    ctx.save(); ctx.beginPath(); ctx.rect(mx, my, M, M); ctx.clip(); ctx.strokeStyle = 'rgba(255,90,120,.9)'; ctx.beginPath(); ctx.arc(mx + zone.x * k, my + zone.y * k, zone.r * k, 0, 6.283); ctx.stroke();
    if (PHASES[zone.phase]) { ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(mx + zone.nx * k, my + zone.ny * k, zone.nr * k, 0, 6.283); ctx.stroke(); }
    ctx.restore(); ctx.fillStyle = '#e8b44a'; ctx.beginPath(); ctx.arc(mx + focus.x * k, my + focus.y * k, 3, 0, 6.283); ctx.fill();
    const P = PHASES[zone.phase];
    if (P) { ctx.font = '600 12px "IBM Plex Sans",system-ui'; ctx.textAlign = 'right'; ctx.fillStyle = '#ffb3c1'; ctx.fillText(zone.shrinking ? T.zoneMoving : `${T.zoneIn} ${Math.ceil(P.wait - zone.t)}s`, cw - 10, my + M + 16); }
    /* kill feed */
    ctx.textAlign = 'center'; ctx.font = '600 13px "IBM Plex Sans",system-ui';
    feed.forEach((f, i) => { ctx.fillStyle = f.mine ? `rgba(232,180,74,${Math.min(1, f.t)})` : `rgba(233,237,245,${Math.min(1, f.t) * .8})`; ctx.fillText(f.text, cw / 2, 22 + i * 18); });
    if (msg) { ctx.font = '700 20px "Chakra Petch",system-ui'; ctx.fillStyle = `rgba(255,255,255,${Math.min(1, msg.t)})`; ctx.fillText(msg.text, cw / 2, ch * .3); }
    if (!me.alive) return;
    /* bottom bar: health, armor, weapon, meds */
    const bw = Math.min(260, cw * .55), bx = cw / 2 - bw / 2, by = ch - 46;
    ctx.fillStyle = 'rgba(8,12,20,.75)'; ctx.fillRect(bx - 6, by - 26, bw + 12, 44);
    ctx.fillStyle = '#3a1416'; ctx.fillRect(bx, by, bw, 10); ctx.fillStyle = me.hp > 30 ? '#4fc28a' : '#e2595b'; ctx.fillRect(bx, by, bw * me.hp / 100, 10);
    ctx.fillStyle = '#4a9bea'; ctx.fillRect(bx, by + 11, bw * me.armor / 100, 4);
    ctx.textAlign = 'left'; ctx.font = '700 14px "Chakra Petch",system-ui'; ctx.fillStyle = WEAPONS[me.w].col;
    ctx.fillText(`${T.w[me.w]}  ${me.reloadT > 0 ? T.reloading : me.mag + '/' + WEAPONS[me.w].mag}`, bx, by - 8);
    ctx.textAlign = 'right'; ctx.fillStyle = '#4fc28a'; ctx.fillText(`+ ${me.meds}`, bx + bw, by - 8);
    const wi = weaponUnder(me);
    if (btns) btns.querySelector('[data-k=pick]').hidden = wi < 0;
    if (wi > -1) { ctx.textAlign = 'center'; ctx.font = '600 14px "IBM Plex Sans",system-ui'; ctx.fillStyle = '#fff'; ctx.fillText((touch ? '' : 'E: ') + T.pick + ' ' + T.w[loot[wi].w], cw / 2, by - 40); }
    if (outside(me)) { ctx.fillStyle = `rgba(200,30,60,${.12 + Math.sin(time * 6) * .06})`; ctx.fillRect(0, 0, cw, ch); ctx.textAlign = 'center'; ctx.font = '700 16px "Chakra Petch",system-ui'; ctx.fillStyle = '#ffb3c1'; ctx.fillText(T.outside, cw / 2, ch * .38); }
    if (me.hitT > 0) { const g = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * .3, cw / 2, ch / 2, Math.max(cw, ch) * .7); g.addColorStop(0, 'rgba(255,0,0,0)'); g.addColorStop(1, `rgba(255,0,0,${me.hitT})`); ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch); }
    /* touch sticks */
    for (const k of ['move', 'aim']) {
      const s = sticks[k]; if (!s) continue;
      ctx.beginPath(); ctx.arc(s.ox, s.oy, STICK, 0, 6.283); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke();
      const v = stickVec(s); ctx.beginPath(); ctx.arc(s.ox + v.x * STICK, s.oy + v.y * STICK, 22, 0, 6.283); ctx.fillStyle = k === 'aim' && v.m > .55 ? 'rgba(226,89,91,.6)' : 'rgba(255,255,255,.3)'; ctx.fill();
    }
  }
  function pill(x, y, text) {
    const w = ctx.measureText(text).width + 18;
    ctx.fillStyle = 'rgba(8,12,20,.75)'; ctx.fillRect(x, y, w, 26); ctx.fillStyle = '#e9edf5'; ctx.fillText(text, x + 9, y + 18);
  }

  /* ---------- loop ---------- */
  let last = 0;
  function frame(t) {
    const dt = Math.min(.05, (t - last) / 1000 || 0); last = t;
    if (state === 'play' || state === 'dead' || state === 'won') { if (state === 'play' || ents.filter(e => e.alive).length > 1) update(dt); }
    draw();
    requestAnimationFrame(frame);
  }
  addEventListener('resize', resize);
  document.addEventListener('fullscreenchange', () => setTimeout(resize, 50));
  resize();
  /* menu: a quiet preview map behind the start screen */
  makeMap(); ents = []; bullets = []; fx = []; noises = []; feed = []; time = 0;
  me = newEnt('', false); ents.push(me);
  zone = { x: W / 2, y: W / 2, r: W * .75, nx: W / 2, ny: W / 2, nr: W * .45, phase: 0, t: 0 };
  const s = store.get('stats', null);
  showOverlay(T.name, T.startText + (s ? `<br><small>${T.statsLine.replace('{games}', s.games).replace('{wins}', s.wins).replace('{best}', s.best === 99 ? '–' : '#' + s.best).replace('{kills}', s.kills)}</small>` : ''), T.play);
  requestAnimationFrame(frame);
  window.__nd = { get state() { return state; }, get me() { return me; }, get ents() { return ents; }, get zone() { return zone; }, start, step: update };
})();
