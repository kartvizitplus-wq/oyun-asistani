/* Red Scarf: a stealth game in a dark, ever-changing labyrinth.
   The ninja never fights face to face: get close to a guard without being seen and a takedown plays out
   (eight weapons, eight different finishes). Guards see further and wider every level. Traps everywhere.
   Get caught or killed once and the labyrinth starts again from level 1. */
(function () {
  const root = document.getElementById('rs');
  if (!root) return;
  const T = JSON.parse(root.dataset.t);
  const stage = root.querySelector('.rs-stage'), cv = stage.querySelector('canvas'), ctx = cv.getContext('2d');
  const ov = stage.querySelector('.rs-ov'), pad = stage.querySelector('.rs-pad');
  const store = {
    get(k, d) { try { const v = localStorage.getItem('rs-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('rs-' + k, JSON.stringify(v)); } catch (e) {} }
  };
  const TS = 64, TAU = Math.PI * 2;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v, rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
  const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
  const NINJA = { skin: '#e8c4a0', hair: 'ninja', hairCol: '#0b0b10', shirt: '#101016', vest: '#1a1a22', pants: '#0b0b10', boots: '#050507', scarf: '#d4142e', accent: '#d4142e' };
  const TRAPS_BY_LEVEL = ['spikes', 'plate', 'pendulum', 'fire', 'saw', 'collapse', 'wire', 'gas'];

  let level = 1, map, MW, MH, seen, guards, traps, lanterns, fx, darts, me, exit, state = 'menu', time = 0, seq = null, kills = 0, hasKey = false, msg = null, deathCause = '', cam = { x: 0, y: 0, s: 1, z: 1 }, cw = 0, ch = 0, runKills = 0;
  let G = {};   // per-level guard stats

  /* ---------- labyrinth ---------- */
  const wall = (tx, ty) => tx < 0 || ty < 0 || tx >= MW || ty >= MH || map[ty * MW + tx] === 1;
  const wallAt = (x, y) => wall(Math.floor(x / TS), Math.floor(y / TS));
  const center = (tx, ty) => ({ x: tx * TS + TS / 2, y: ty * TS + TS / 2 });
  function build(lv) {
    const C = Math.min(7 + lv * 1.5, 24) | 0;
    MW = MH = C * 2 + 1;
    map = new Uint8Array(MW * MH).fill(1);
    const vis = new Uint8Array(C * C), stack = [[0, 0]]; vis[0] = 1; map[1 * MW + 1] = 0;
    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => { const nx = cx + dx, ny = cy + dy; return nx >= 0 && ny >= 0 && nx < C && ny < C && !vis[ny * C + nx]; });
      if (!nb.length) { stack.pop(); continue; }
      const [dx, dy] = pick(nb), nx = cx + dx, ny = cy + dy;
      vis[ny * C + nx] = 1; map[(cy * 2 + 1 + dy) * MW + cx * 2 + 1 + dx] = 0; map[(ny * 2 + 1) * MW + nx * 2 + 1] = 0;
      stack.push([nx, ny]);
    }
    /* loops: knock out some walls so there is more than one way around a guard */
    for (let i = 0; i < C * C * .12; i++) {
      const tx = 1 + Math.floor(Math.random() * (MW - 2)), ty = 1 + Math.floor(Math.random() * (MH - 2));
      if (map[ty * MW + tx] !== 1) continue;
      if ((!wall(tx - 1, ty) && !wall(tx + 1, ty) && wall(tx, ty - 1) && wall(tx, ty + 1)) || (!wall(tx, ty - 1) && !wall(tx, ty + 1) && wall(tx - 1, ty) && wall(tx + 1, ty))) map[ty * MW + tx] = 0;
    }
    /* a few courtyards */
    for (let i = 0; i < 1 + lv / 3; i++) { const rx = 1 + 2 * Math.floor(Math.random() * (C - 2)), ry = 1 + 2 * Math.floor(Math.random() * (C - 2)); for (let y = ry; y < ry + 3; y++) for (let x = rx; x < rx + 3; x++) map[y * MW + x] = 0; }
    seen = new Uint8Array(MW * MH);
    /* distances from the start */
    const dist = new Int32Array(MW * MH).fill(-1), q = [MW + 1]; dist[MW + 1] = 0;
    for (let h = 0; h < q.length; h++) { const i = q[h], x = i % MW, y = (i / MW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const j = (y + dy) * MW + x + dx; if (!wall(x + dx, y + dy) && dist[j] < 0) { dist[j] = dist[i] + 1; q.push(j); } } }
    let far = MW + 1; for (const i of q) if (dist[i] > dist[far]) far = i;
    exit = { tx: far % MW, ty: (far / MW) | 0 };
    const floors = q.filter(i => i !== far);
    const corridor = i => { const x = i % MW, y = (i / MW) | 0; const h = !wall(x - 1, y) && !wall(x + 1, y) && wall(x, y - 1) && wall(x, y + 1), v = !wall(x, y - 1) && !wall(x, y + 1) && wall(x - 1, y) && wall(x + 1, y); return h ? 'h' : v ? 'v' : null; };
    /* traps */
    traps = [];
    const kinds = TRAPS_BY_LEVEL.slice(0, Math.min(8, lv + 1));
    const nT = Math.min(5 + lv * 3, 46), used = new Set();
    for (const i of floors.slice().sort(() => Math.random() - .5)) {
      if (traps.length >= nT) break;
      const ax = corridor(i); if (!ax || dist[i] < 4) continue;
      const x = i % MW, y = (i / MW) | 0;
      if ([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => used.has((y + dy) * MW + x + dx))) continue;
      used.add(i);
      traps.push({ type: pick(kinds), tx: x, ty: y, ax, ph: rnd(0, 10), t: 0, armed: true });
    }
    /* lanterns light the corners where guards stand */
    lanterns = floors.filter(i => !corridor(i) && Math.random() < .12).map(i => ({ ...center(i % MW, (i / MW) | 0), f: rnd(0, 6) }));
    /* guards */
    G = { cone: Math.min(.5 + lv * .07, 1.05), range: Math.min(150 + lv * 20, 380), detect: Math.max(.22, .85 - lv * .06), speed: 70 + Math.min(lv, 10) * 4 };
    guards = [];
    const spots = floors.filter(i => dist[i] > 7 && !used.has(i)).sort(() => Math.random() - .5);
    const nG = Math.min(2 + lv, 16);
    for (let k = 0; k < nG && k < spots.length; k++) {
      const p = center(spots[k] % MW, (spots[k] / MW) | 0);
      guards.push({ x: p.x, y: p.y, ang: rnd(0, TAU), det: 0, path: [], wait: rnd(0, 2), look: 0, captain: k === 0, alive: true, dying: null, sus: null, walk: 0,
        look2: { skin: pick(['#f1c9a0', '#d9a477', '#b07a50']), hair: k === 0 ? 'kabuto' : 'straw', hairCol: k === 0 ? '#7a1020' : '#c9a25e', shirt: k === 0 ? '#6a1f2a' : '#4a5a6a', vest: k === 0 ? '#3a0f16' : '#2a3240', pants: '#22262e', weapon: 'spear', wcol: '#cfd6e2', angry: true } });
    }
    me = { ...center(1, 1), ang: 0, walk: 0, dashT: 0, dashCd: 0, run: false, alive: true, weapon: 'katana', gas: 0, noise: 0 };
    fx = []; darts = []; hasKey = false; kills = 0; time = 0; seq = null;
    cam.x = me.x; cam.y = me.y;
  }

  /* ---------- sight ---------- */
  function los(x1, y1, x2, y2) {
    const d = Math.hypot(x2 - x1, y2 - y1), n = Math.ceil(d / 10);
    for (let i = 1; i < n; i++) if (wallAt(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n)) return false;
    return true;
  }
  function inCone(g, x, y) {
    const d = Math.hypot(x - g.x, y - g.y);
    if (d > G.range || d < 1) return d < 30;
    return Math.abs(angDiff(g.ang, Math.atan2(y - g.y, x - g.x))) < G.cone && los(g.x, g.y, x, y);
  }
  const VIEW = 340;
  function viewPoly() {
    const pts = [], N = 200;
    for (let i = 0; i < N; i++) {
      const a = i / N * TAU, dx = Math.cos(a), dy = Math.sin(a); let r = 0;
      while (r < VIEW) { r += 4; const x = me.x + dx * r, y = me.y + dy * r; if (wallAt(x, y)) { const tx = Math.floor(x / TS), ty = Math.floor(y / TS); if (!seen[ty * MW + tx]) seen[ty * MW + tx] = 1; r += 14; break; } const k = Math.floor(y / TS) * MW + Math.floor(x / TS); seen[k] = 1; }
      pts.push(me.x + dx * Math.min(r, VIEW), me.y + dy * Math.min(r, VIEW));
    }
    return pts;
  }

  /* ---------- guards ---------- */
  function bfs(fx_, fy_, tx_, ty_) {
    const s = fy_ * MW + fx_, t = ty_ * MW + tx_, prev = new Int32Array(MW * MH).fill(-1), q = [s]; prev[s] = s;
    const trapTile = new Set(traps.map(tr => tr.ty * MW + tr.tx));
    for (let h = 0; h < q.length && prev[t] < 0; h++) { const i = q[h], x = i % MW, y = (i / MW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const j = (y + dy) * MW + x + dx; if (!wall(x + dx, y + dy) && prev[j] < 0 && (!trapTile.has(j) || j === t)) { prev[j] = i; q.push(j); } } }
    if (prev[t] < 0) return [];
    const path = []; for (let i = t; i !== s; i = prev[i]) path.push(center(i % MW, (i / MW) | 0)); return path.reverse();
  }
  function patrolTarget(g) {
    const gx = Math.floor(g.x / TS), gy = Math.floor(g.y / TS);
    for (let k = 0; k < 20; k++) { const tx = clamp(gx + Math.floor(rnd(-7, 8)), 1, MW - 2), ty = clamp(gy + Math.floor(rnd(-7, 8)), 1, MH - 2); if (!wall(tx, ty)) { const p = bfs(gx, gy, tx, ty); if (p.length > 1) return p; } }
    return [];
  }
  function guardUpdate(g, dt) {
    if (!g.alive || g.dying) return;
    /* noticing the ninja */
    if (me.alive && state === 'play') {
      const seenNow = inCone(g, me.x, me.y) && !me.hidden;
      const d = Math.hypot(me.x - g.x, me.y - g.y);
      if (seenNow) { g.det += dt / G.detect * (1 + (1 - d / G.range)); g.sus = { x: me.x, y: me.y, t: 3 }; g.path = []; }
      else g.det = Math.max(0, g.det - dt * .45);
      if (g.det >= 1) { caught(g); return; }
      if (me.noise > 0 && d < me.noise && !g.sus) { g.sus = { x: me.x, y: me.y, t: 3 }; g.path = []; addFx({ type: 'q', g, t: 1 }); }
      /* fallen comrades raise the alarm */
      for (const o of guards) if (!o.alive && !o.seenBy && Math.hypot(o.x - g.x, o.y - g.y) < G.range && Math.abs(angDiff(g.ang, Math.atan2(o.y - g.y, o.x - g.x))) < G.cone && los(g.x, g.y, o.x, o.y)) { o.seenBy = true; g.sus = { x: o.x, y: o.y, t: 4 }; g.path = []; addFx({ type: 'q', g, t: 1.2 }); }
    }
    const speed = g.sus ? G.speed * 1.5 : G.speed;
    if (g.sus) {
      if (!g.path.length) { g.path = bfs(Math.floor(g.x / TS), Math.floor(g.y / TS), Math.floor(g.sus.x / TS), Math.floor(g.sus.y / TS)); if (!g.path.length) g.path = [{ x: g.sus.x, y: g.sus.y }]; }
    }
    if (g.path.length) {
      const p = g.path[0], dx = p.x - g.x, dy = p.y - g.y, d = Math.hypot(dx, dy);
      if (d < 4) { g.path.shift(); if (!g.path.length) g.wait = g.sus ? 2.5 : rnd(1, 2.6); }
      else { g.x += dx / d * Math.min(d, speed * dt); g.y += dy / d * Math.min(d, speed * dt); g.ang += angDiff(g.ang, Math.atan2(dy, dx)) * Math.min(1, dt * 6); g.walk += speed * dt * .09; }
    } else {
      g.wait -= dt; g.look += dt;
      g.ang += Math.sin(g.look * 1.3) * dt * 1.1;
      if (g.wait <= 0) { if (g.sus) { g.sus.t -= 2.5; g.sus = null; } g.path = patrolTarget(g); g.wait = 1; }
    }
  }

  /* ---------- takedowns ---------- */
  const MOVES = { behind: ['tanto', 'garrote', 'kunai'], side: ['katana', 'tessen', 'smoke'], front: ['shuriken', 'kusarigama', 'katana'] };
  const WEAPON_OF = { katana: 'katana', tanto: 'daggers', garrote: null, kunai: 'daggers', tessen: 'sword', smoke: null, shuriken: null, kusarigama: 'katana' };
  function tryTakedown() {
    for (const g of guards) {
      if (!g.alive || g.dying) continue;
      const d = Math.hypot(me.x - g.x, me.y - g.y);
      if (d > 46) continue;
      if (inCone(g, me.x, me.y) && g.det > .55) continue;
      const rel = Math.abs(angDiff(g.ang, Math.atan2(me.y - g.y, me.x - g.x)));
      const kind = rel > 2.2 ? 'behind' : rel > 1 ? 'side' : 'front';
      const move = pick(MOVES[kind]);
      g.dying = { type: move, t: 0, fromX: me.x, fromY: me.y, ang: Math.atan2(g.y - me.y, g.x - me.x) };
      me.weapon = WEAPON_OF[move];
      me.ang = Math.atan2(g.y - me.y, g.x - me.x);
      seq = { g, t: 0, dur: 1.05, move, sx: me.x, sy: me.y };
      kills++; runKills++;
      return;
    }
  }
  function endTakedown() {
    const g = seq.g; g.alive = false; g.dying.t = 1;
    me.weapon = 'katana';
    if (g.captain) { hasKey = true; say(T.gotKey, 2.4); }
    seq = null;
  }

  /* ---------- traps ---------- */
  function trapState(tr) {
    const t = time + tr.ph;
    switch (tr.type) {
      case 'spikes': { const c = t % 2.6; return { on: c < 1, warn: c > 2.25 }; }
      case 'fire': { const c = t % 3.2; return { on: c > .15 && c < 1.3, warn: c < .15 || c > 2.9 }; }
      case 'gas': { const c = t % 5; return { on: c < 2.2, warn: c > 4.4 }; }
      default: return {};
    }
  }
  const tileOf = (x, y) => ({ tx: Math.floor(x / TS), ty: Math.floor(y / TS) });
  function trapUpdate(dt) {
    const { tx, ty } = tileOf(me.x, me.y);
    const leap = me.dashT > 0;
    for (const tr of traps) {
      const here = tr.tx === tx && tr.ty === ty, c = center(tr.tx, tr.ty);
      const along = tr.ax === 'h' ? me.x - c.x : me.y - c.y, across = tr.ax === 'h' ? me.y - c.y : me.x - c.x;
      const st = trapState(tr);
      switch (tr.type) {
        case 'spikes': if (here && st.on && !leap) die('spikes'); break;
        case 'fire': if (here && st.on) die('fire'); break;
        case 'gas': if (st.on && Math.hypot(me.x - c.x, me.y - c.y) < TS * .9) { me.gas += dt; if (me.gas > .9) die('gas'); } break;
        case 'plate':
          if (here && !leap && tr.armed && Math.abs(along) < 18) { tr.armed = false; tr.fire = .35; }
          if (tr.fire != null) { tr.fire -= dt; if (tr.fire <= 0) { tr.fire = null; darts.push({ tr, t: .3 }); if (here && Math.abs(along) < 20) die('darts'); setTimeout(() => { tr.armed = true; }, 1500); } }
          break;
        case 'pendulum': { const sw = Math.sin(time * 2.4 + tr.ph); tr.sw = sw; if (here && Math.abs(along) < 14 && Math.abs(across - sw * TS * .42) < 16) die('pendulum'); break; }
        case 'saw': { const p = Math.sin(time * 1.7 + tr.ph) * TS * .38; tr.p = p; const sx = tr.ax === 'h' ? c.x : c.x + p, sy = tr.ax === 'h' ? c.y + p : c.y; tr.sx = sx; tr.sy = sy; if (Math.hypot(me.x - sx, me.y - sy) < 24) die('saw'); break; }
        case 'collapse':
          if (here && !leap && tr.armed && tr.crack == null) tr.crack = .55;
          if (tr.crack != null) { tr.crack -= dt; if (tr.crack <= 0) { tr.crack = null; tr.pit = 4; tr.armed = false; } }
          if (tr.pit != null) { if (here && !leap) die('pit'); tr.pit -= dt; if (tr.pit <= 0) { tr.pit = null; tr.armed = true; } }
          break;
        case 'wire':
          if (here && !leap && tr.armed && Math.abs(along) < 10) { tr.armed = false; addFx({ type: 'bell', x: c.x, y: c.y, t: 1.4 }); say(T.alarm, 1.8); for (const g of guards) if (g.alive && !g.dying && Math.hypot(g.x - c.x, g.y - c.y) < 750) { g.sus = { x: c.x, y: c.y, t: 4 }; g.path = []; addFx({ type: 'q', g, t: 1 }); } }
          break;
      }
    }
    if (!traps.some(tr => tr.type === 'gas' && trapState(tr).on && Math.hypot(me.x - center(tr.tx, tr.ty).x, me.y - center(tr.tx, tr.ty).y) < TS * .9)) me.gas = Math.max(0, me.gas - dt);
    for (let i = darts.length - 1; i >= 0; i--) if ((darts[i].t -= dt) <= 0) darts.splice(i, 1);
  }

  /* ---------- death and progress ---------- */
  function caught(g) {
    if (!me.alive) return;
    g.ang = Math.atan2(me.y - g.y, me.x - g.x);
    addFx({ type: 'spear', g, t: .5 });
    die('caught');
  }
  function die(cause) {
    if (!me.alive) return;
    me.alive = false; me.deadT = 0; deathCause = cause;
    state = 'dead';
    const best = store.get('best', 1);
    setTimeout(() => {
      ov.innerHTML = `<h3>${T.dead}</h3><p>${T.causes[cause]}</p><p>${T.reached.replace('{n}', level).replace('{k}', runKills)}<br><small>${T.best.replace('{n}', best)}</small></p><p class="rs-reset">${T.reset}</p><button type="button" class="btn" data-k="start">${T.again}</button>`;
      ov.hidden = false;
    }, 1300);
  }
  function win() {
    state = 'clear';
    const best = Math.max(store.get('best', 1), level + 1); store.set('best', best);
    ov.innerHTML = `<h3>${T.clear.replace('{n}', level)}</h3><p>${T.clearText.replace('{k}', kills).replace('{t}', Math.round(time))}</p><p><small>${T.nextInfo.replace('{n}', level + 1)}</small></p><button type="button" class="btn" data-k="next">${T.next}</button>`;
    ov.hidden = false;
  }
  function begin(lv) {
    level = lv; build(lv); state = 'play'; ov.hidden = true; pad.hidden = !touch;
    say(T.levelStart.replace('{n}', lv), 2.4);
    if (lv === 1) runKills = 0;
  }
  const say = (text, t) => { msg = { text, t }; };
  const addFx = o => fx.push(o);

  /* ---------- input ---------- */
  const keys = {};
  let touch = false, stick = null;
  addEventListener('keydown', e => {
    if (state !== 'play') return;
    const k = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', ' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
    keys[k] = true;
    if (k === ' ') dash();
  });
  addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  const local = e => { const b = cv.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top, w: b.width }; };
  cv.addEventListener('pointerdown', e => {
    if (state !== 'play' || e.pointerType === 'mouse') return;
    e.preventDefault(); if (!touch) { touch = true; pad.hidden = false; }
    const p = local(e);
    if (!stick && p.x < p.w * .6) { cv.setPointerCapture(e.pointerId); stick = { id: e.pointerId, ox: p.x, oy: p.y, x: p.x, y: p.y }; }
  });
  cv.addEventListener('pointermove', e => { if (stick && stick.id === e.pointerId) { const p = local(e); stick.x = p.x; stick.y = p.y; } });
  const up = e => { if (stick && stick.id === e.pointerId) stick = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('contextmenu', e => e.preventDefault());
  pad.addEventListener('pointerdown', e => { const b = e.target.closest('button'); if (!b) return; e.preventDefault(); if (b.dataset.k === 'dash') dash(); });
  stage.addEventListener('click', e => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    const k = b.dataset.k;
    if (k === 'start') { begin(1); fullscreenOnPhone(); }
    else if (k === 'next') begin(level + 1);
    else if (k === 'full') { try { if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen().catch(() => {}); } catch (x) {} }
  });
  function fullscreenOnPhone() {
    try {
      if (matchMedia('(pointer:coarse)').matches && !document.fullscreenElement && stage.requestFullscreen) stage.requestFullscreen().then(() => { try { screen.orientation.lock('landscape').catch(() => {}); } catch (x) {} }).catch(() => stage.scrollIntoView({ block: 'center' }));
      else stage.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } catch (x) {}
  }
  function dash() {
    if (!me.alive || me.dashCd > 0 || seq) return;
    me.dashCd = 2.4; me.dashT = .2;
    addFx({ type: 'dash', x: me.x, y: me.y, t: .35, a: me.ang });
  }

  /* ---------- update ---------- */
  function moveMe(dx, dy) {
    const r = 13;
    const tryX = me.x + dx; if (!wallAt(tryX + Math.sign(dx) * r, me.y - r * .7) && !wallAt(tryX + Math.sign(dx) * r, me.y + r * .7)) me.x = tryX;
    const tryY = me.y + dy; if (!wallAt(me.x - r * .7, tryY + Math.sign(dy) * r) && !wallAt(me.x + r * .7, tryY + Math.sign(dy) * r)) me.y = tryY;
  }
  function update(dtReal) {
    const slow = seq ? .12 : 1, dt = dtReal * slow;
    if (state === 'play' || state === 'dead') time += dt;
    if (seq) {
      seq.t += dtReal;
      const k = Math.min(1, seq.t / seq.dur), g = seq.g;
      g.dying.t = k;
      const tx = g.x - Math.cos(g.dying.ang) * 30, ty = g.y - Math.sin(g.dying.ang) * 30;
      const reach = seq.move === 'shuriken' || seq.move === 'kusarigama' ? .15 : .6;
      me.x = seq.sx + (tx - seq.sx) * Math.min(1, k / .35) * reach; me.y = seq.sy + (ty - seq.sy) * Math.min(1, k / .35) * reach;
      if (seq.move === 'kunai') me.jump = Math.sin(Math.min(1, k / .45) * Math.PI) * 40;
      if (k >= 1) { me.jump = 0; endTakedown(); }
    }
    if (state === 'play' && me.alive && !seq) {
      let mx = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0), my = (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
      let run = !!keys.shift;
      if (stick) { const dx = stick.x - stick.ox, dy = stick.y - stick.oy, d = Math.hypot(dx, dy); if (d > 6) { mx = dx / Math.max(d, 60); my = dy / Math.max(d, 60); run = d > 52; } }
      const ml = Math.hypot(mx, my);
      me.run = run && ml > .1;
      if (ml > .1) {
        if (ml > 1) { mx /= ml; my /= ml; }
        const sp = me.dashT > 0 ? 620 : run ? 205 : 118;
        moveMe(mx * sp * dt, my * sp * dt); me.ang = Math.atan2(my, mx); me.walk += sp * dt * .1;
      } else if (me.dashT > 0) moveMe(Math.cos(me.ang) * 620 * dt, Math.sin(me.ang) * 620 * dt);
      me.noise = me.run ? 230 : 0;
      me.dashT = Math.max(0, me.dashT - dt); me.dashCd = Math.max(0, me.dashCd - dt);
      tryTakedown();
      trapUpdate(dt);
      const { tx, ty } = tileOf(me.x, me.y);
      if (tx === exit.tx && ty === exit.ty) { if (hasKey) win(); else if (!msg) say(T.locked, 1.6); }
    } else if (state === 'play' && seq) trapUpdate(0);
    for (const g of guards) guardUpdate(g, dt);
    if (!me.alive) me.deadT += dtReal;
    for (let i = fx.length - 1; i >= 0; i--) if ((fx[i].t -= dtReal) <= 0) fx.splice(i, 1);
    if (msg && (msg.t -= dtReal) <= 0) msg = null;
  }

  /* ---------- drawing ---------- */
  function resize() {
    const dpr = Math.min(2, devicePixelRatio || 1), r = stage.getBoundingClientRect();
    cw = r.width; ch = r.height; cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cam.s = clamp(Math.sqrt(cw * ch) / 620, .65, 1.4);
  }
  const C = window.Chibi;
  function drawFloor(x0, y0, x1, y1) {
    const tx0 = Math.max(0, Math.floor(x0 / TS)), ty0 = Math.max(0, Math.floor(y0 / TS)), tx1 = Math.min(MW - 1, Math.ceil(x1 / TS)), ty1 = Math.min(MH - 1, Math.ceil(y1 / TS));
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      if (wall(tx, ty)) continue;
      const x = tx * TS, y = ty * TS, n = (tx * 7 + ty * 13) % 5;
      ctx.fillStyle = n === 0 ? '#1d1d27' : '#191921'; ctx.fillRect(x, y, TS, TS);
      ctx.strokeStyle = 'rgba(255,255,255,.035)'; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, TS / 2, TS / 2); ctx.strokeRect(x + TS / 2 + .5, y + TS / 2 + .5, TS / 2 - 1, TS / 2 - 1);
      if (n === 3) { ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.moveTo(x + 10, y + 40); ctx.lineTo(x + 24, y + 30); ctx.lineTo(x + 30, y + 44); ctx.stroke(); }
    }
    /* exit gate */
    const e = center(exit.tx, exit.ty);
    if (e.x > x0 - TS && e.x < x1 + TS && e.y > y0 - TS && e.y < y1 + TS) {
      ctx.save(); ctx.translate(e.x, e.y);
      ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 70); g.addColorStop(0, hasKey ? 'rgba(255,60,80,.5)' : 'rgba(120,120,160,.25)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(-70, -70, 140, 140); ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#9a1020'; ctx.fillRect(-24, -30, 6, 46); ctx.fillRect(18, -30, 6, 46); ctx.fillRect(-30, -34, 60, 6); ctx.fillRect(-26, -24, 52, 4);
      ctx.fillStyle = hasKey ? '#ffd23d' : '#555'; ctx.font = '700 18px system-ui'; ctx.textAlign = 'center'; ctx.fillText(hasKey ? '⛩' : '🔒', 0, 8);
      ctx.restore();
    }
  }
  function drawTrap(tr) {
    const c = center(tr.tx, tr.ty), st = trapState(tr), h = tr.ax === 'h';
    ctx.save(); ctx.translate(c.x, c.y);
    switch (tr.type) {
      case 'spikes':
        ctx.fillStyle = '#0c0c10'; ctx.fillRect(-26, -26, 52, 52);
        for (let i = 0; i < 9; i++) { const x = -18 + (i % 3) * 18, y = -18 + Math.floor(i / 3) * 18; if (st.on) { ctx.fillStyle = '#b8c0cc'; ctx.beginPath(); ctx.moveTo(x - 5, y + 5); ctx.lineTo(x, y - 9); ctx.lineTo(x + 5, y + 5); ctx.fill(); ctx.fillStyle = '#7a1020'; ctx.fillRect(x - 1, y - 9, 2, 3); } else { ctx.fillStyle = st.warn ? '#c0182e' : '#2a2a32'; ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); } }
        break;
      case 'plate':
        ctx.fillStyle = tr.armed ? '#24242c' : '#3a1418'; ctx.fillRect(-14, -14, 28, 28); ctx.strokeStyle = '#3a3a46'; ctx.strokeRect(-14, -14, 28, 28);
        ctx.fillStyle = '#3a3a46'; if (h) { ctx.fillRect(-3, -32, 6, 6); ctx.fillRect(-3, 26, 6, 6); } else { ctx.fillRect(-32, -3, 6, 6); ctx.fillRect(26, -3, 6, 6); }
        break;
      case 'pendulum': {
        const sw = tr.sw || 0, off = sw * TS * .42;
        ctx.strokeStyle = '#3a3a46'; ctx.lineWidth = 2; ctx.beginPath(); if (h) { ctx.moveTo(0, -40); ctx.lineTo(0, off); } else { ctx.moveTo(-40, 0); ctx.lineTo(off, 0); } ctx.stroke();
        ctx.save(); ctx.translate(h ? 0 : off, h ? off : 0); ctx.rotate(h ? 0 : Math.PI / 2);
        ctx.fillStyle = '#c9d2de'; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.quadraticCurveTo(0, 14, 26, 0); ctx.lineTo(0, -4); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#7a1020'; ctx.lineWidth = 2; ctx.stroke();
        ctx.restore();
        break; }
      case 'fire': {
        const nz = h ? [0, -30] : [-30, 0];
        ctx.fillStyle = '#2a2a32'; ctx.fillRect(nz[0] - 6, nz[1] - 6, 12, 12);
        if (st.on || st.warn) {
          ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < 9; i++) { const k = i / 9, x = h ? Math.sin(time * 30 + i) * 6 : -30 + k * 62, y = h ? -30 + k * 62 : Math.sin(time * 30 + i) * 6; ctx.fillStyle = st.on ? `rgba(255,${120 + i * 12},40,.55)` : 'rgba(255,120,40,.12)'; ctx.beginPath(); ctx.arc(x, y, (st.on ? 14 : 6) - k * 4, 0, TAU); ctx.fill(); }
          ctx.globalCompositeOperation = 'source-over';
        }
        break; }
      case 'saw': {
        ctx.strokeStyle = '#2a2a32'; ctx.lineWidth = 5; ctx.beginPath(); if (h) { ctx.moveTo(0, -28); ctx.lineTo(0, 28); } else { ctx.moveTo(-28, 0); ctx.lineTo(28, 0); } ctx.stroke();
        ctx.translate(h ? 0 : (tr.p || 0), h ? (tr.p || 0) : 0); ctx.rotate(time * 14);
        ctx.fillStyle = '#b8c0cc'; ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = i % 2 ? 13 : 19; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.fillStyle = '#7a1020'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill();
        break; }
      case 'collapse':
        if (tr.pit != null) { ctx.fillStyle = '#000'; ctx.fillRect(-30, -30, 60, 60); ctx.strokeStyle = '#2a0a0e'; ctx.strokeRect(-30, -30, 60, 60); }
        else { ctx.strokeStyle = tr.crack != null ? '#c0182e' : 'rgba(0,0,0,.6)'; ctx.lineWidth = tr.crack != null ? 2.5 : 1.5; ctx.beginPath(); ctx.moveTo(-22, -10); ctx.lineTo(-4, -2); ctx.lineTo(4, 14); ctx.moveTo(-4, -2); ctx.lineTo(18, -16); ctx.moveTo(4, 14); ctx.lineTo(22, 20); ctx.stroke(); }
        break;
      case 'wire':
        if (tr.armed) { ctx.strokeStyle = 'rgba(200,200,220,.45)'; ctx.lineWidth = 1; ctx.beginPath(); if (h) { ctx.moveTo(0, -32); ctx.lineTo(0, 32); } else { ctx.moveTo(-32, 0); ctx.lineTo(32, 0); } ctx.stroke(); ctx.fillStyle = '#a08a3a'; ctx.beginPath(); ctx.arc(h ? 0 : -30, h ? -30 : 0, 4, 0, TAU); ctx.fill(); }
        break;
      case 'gas':
        ctx.fillStyle = '#20241c'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill(); ctx.strokeStyle = '#3a4a2a'; for (let i = -6; i <= 6; i += 4) { ctx.beginPath(); ctx.moveTo(i, -7); ctx.lineTo(i, 7); ctx.stroke(); }
        if (st.on || st.warn) { for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + time * .7, r = (st.on ? 34 : 14) + Math.sin(time * 3 + i) * 6; ctx.fillStyle = st.on ? 'rgba(120,200,60,.22)' : 'rgba(120,200,60,.08)'; ctx.beginPath(); ctx.arc(Math.cos(a) * r * .5, Math.sin(a) * r * .5, r * .6, 0, TAU); ctx.fill(); } }
        break;
    }
    ctx.restore();
  }
  function drawWalls(ty, x0, x1) {
    if (ty < 0 || ty >= MH) return;
    const tx0 = Math.max(0, Math.floor(x0 / TS)), tx1 = Math.min(MW - 1, Math.ceil(x1 / TS)), H = 22;
    for (let tx = tx0; tx <= tx1; tx++) {
      if (!wall(tx, ty)) continue;
      const x = tx * TS, y = ty * TS;
      if (!wall(tx, ty + 1)) { ctx.fillStyle = '#23232e'; ctx.fillRect(x, y + TS - H, TS, H); ctx.fillStyle = 'rgba(255,255,255,.04)'; for (let k = 0; k < 3; k++) ctx.fillRect(x + 4 + k * 21, y + TS - H + 6, 16, 3); }
      ctx.fillStyle = '#34343f'; ctx.fillRect(x, y - H, TS, TS);
      ctx.fillStyle = 'rgba(160,170,220,.1)'; ctx.fillRect(x, y - H, TS, 3); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(x + TS - 3, y - H, 3, TS);
    }
  }
  function drawGuard(g) {
    const L = Object.assign({}, g.look2, { s: 1.02, aim: g.ang, walk: g.walk, moving: !!g.path.length, t: time });
    const d = g.dying;
    if (!d) { C.draw(ctx, g.x, g.y + 4, Object.assign(L, { glow: g.captain ? '#ffd23d' : null })); return; }
    const k = d.t, ink = (r, a) => { ctx.fillStyle = `rgba(150,10,28,${a})`; ctx.beginPath(); ctx.ellipse(g.x, g.y + 14, r, r * .45, 0, 0, TAU); ctx.fill(); };
    const lying = (rot, alpha, dy) => { ctx.save(); ctx.globalAlpha = alpha; ctx.translate(g.x, g.y + 14 + (dy || 0)); ctx.rotate(rot); C.draw(ctx, 0, -10, Object.assign(L, { moving: false })); ctx.restore(); ctx.globalAlpha = 1; };
    switch (d.type) {
      case 'katana': {
        if (k > .25) ink(26 * Math.min(1, (k - .25) * 2), .8);
        const sep = Math.max(0, k - .3) * 30, rot = Math.max(0, k - .3) * .9;
        for (const half of [0, 1]) {
          ctx.save(); ctx.beginPath(); if (half) { ctx.moveTo(g.x - 60, g.y - 70); ctx.lineTo(g.x + 60, g.y - 70); ctx.lineTo(g.x + 60, g.y - 30); ctx.lineTo(g.x - 60, g.y - 6); } else { ctx.moveTo(g.x - 60, g.y - 6); ctx.lineTo(g.x + 60, g.y - 30); ctx.lineTo(g.x + 60, g.y + 40); ctx.lineTo(g.x - 60, g.y + 40); } ctx.closePath(); ctx.clip();
          ctx.translate(g.x + (half ? sep : -sep * .3), g.y + (half ? -sep * .4 + sep * sep * .03 : 0)); ctx.rotate(half ? rot : -rot * .2);
          C.draw(ctx, 0, 4, Object.assign(L, { moving: false, hit: k < .3 ? .4 : 0 })); ctx.restore();
        }
        if (k > .2 && k < .55) { ctx.strokeStyle = `rgba(255,40,60,${1 - (k - .2) * 2.8})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(g.x - 50, g.y); ctx.lineTo(g.x + 50, g.y - 34); ctx.stroke(); }
        break; }
      case 'tanto': case 'garrote': {
        const lift = d.type === 'garrote' ? Math.sin(Math.min(1, k / .6) * Math.PI) * 22 : 0;
        if (k < .55) { C.draw(ctx, g.x, g.y + 4 - lift, Object.assign(L, { moving: false, hit: d.type === 'tanto' && k > .25 ? .5 : 0 })); if (d.type === 'garrote') { ctx.strokeStyle = 'rgba(220,220,230,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(me.x, me.y - 30); ctx.lineTo(g.x, g.y - 22 - lift); ctx.stroke(); } }
        else { ink(22, .75); lying(Math.min(1, (k - .55) * 3) * 1.57 * (d.type === 'tanto' ? 1 : -1), 1); }
        break; }
      case 'shuriken': {
        for (let i = 0; i < 3; i++) { const s = clamp((k - i * .1) / .25, 0, 1); if (s <= 0 || s >= 1) continue; const x = d.fromX + (g.x - d.fromX) * s, y = d.fromY - 26 + (g.y - 26 - d.fromY + 26) * s; ctx.save(); ctx.translate(x, y); ctx.rotate(time * 40); ctx.fillStyle = '#cfd6e2'; ctx.beginPath(); for (let j = 0; j < 8; j++) { const a = j / 8 * TAU, r = j % 2 ? 3 : 9; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.fill(); ctx.restore(); }
        const push = Math.min(3, Math.floor(k / .12)) * 6;
        if (k < .6) C.draw(ctx, g.x + Math.cos(d.ang) * push, g.y + 4 + Math.sin(d.ang) * push, Object.assign(L, { moving: false, hit: k > .25 ? .4 : 0 }));
        else { ink(20, .7); lying(-1.57 * Math.min(1, (k - .6) * 3), 1); }
        break; }
      case 'kusarigama': {
        const pull = clamp((k - .35) / .4, 0, 1), gx = g.x - Math.cos(d.ang) * pull * 26, gy = g.y - Math.sin(d.ang) * pull * 26;
        ctx.strokeStyle = '#8a8f9a'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(me.x, me.y - 20); ctx.lineTo(gx, gy - 18); ctx.stroke(); ctx.setLineDash([]);
        if (k > .3) { ctx.strokeStyle = '#8a8f9a'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(gx, gy - 14 + i * 6, 15, 5, 0, 0, TAU); ctx.stroke(); } }
        if (k < .75) C.draw(ctx, gx, gy + 4, Object.assign(L, { moving: false, hit: k > .7 ? .5 : 0 }));
        else { ink(20, .75); ctx.save(); ctx.translate(gx - g.x, gy - g.y); lying(1.57, 1); ctx.restore(); }
        break; }
      case 'smoke': {
        const a = clamp(1 - (k - .3) / .4, 0, 1);
        if (a > 0) { ctx.globalAlpha = a; C.draw(ctx, g.x, g.y + 4, Object.assign(L, { moving: false })); ctx.globalAlpha = 1; }
        for (let i = 0; i < 10; i++) { const r = 10 + k * 46 + (i % 3) * 6, an = i / 10 * TAU + k * 2; ctx.fillStyle = `rgba(180,180,195,${.55 * (1 - k)})`; ctx.beginPath(); ctx.arc(g.x + Math.cos(an) * r * .6, g.y - 20 + Math.sin(an) * r * .4, 14 + k * 10, 0, TAU); ctx.fill(); }
        if (k > .6) { ctx.fillStyle = '#c9a25e'; ctx.save(); ctx.translate(g.x + 10, g.y + 10); ctx.rotate(k * 4); ctx.beginPath(); ctx.ellipse(0, 0, 18, 6, 0, 0, TAU); ctx.fill(); ctx.restore(); }
        break; }
      case 'tessen': {
        if (k < .7) { ctx.save(); ctx.translate(g.x, g.y + 14); ctx.rotate(k * 22); ctx.scale(1 - k * .5, 1 - k * .5); C.draw(ctx, 0, -10, Object.assign(L, { moving: false, hit: .3 })); ctx.restore(); ctx.strokeStyle = `rgba(212,20,46,${1 - k})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(g.x, g.y - 14, 30 + k * 20, k * 20, k * 20 + 2.4); ctx.stroke(); }
        else { ink(18, .7); lying(2.4, 1); }
        break; }
      case 'kunai': {
        const land = k > .45;
        if (!land) C.draw(ctx, g.x, g.y + 4, Object.assign(L, { moving: false }));
        else { ink(30 * Math.min(1, (k - .45) * 3), .8); ctx.save(); ctx.translate(g.x, g.y + 16); ctx.scale(1 + (k - .45), .35); C.draw(ctx, 0, -10, Object.assign(L, { moving: false, hit: .3 })); ctx.restore(); if (k < .7) { ctx.strokeStyle = `rgba(255,255,255,${(.7 - k) * 3})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(g.x, g.y + 14, 40 * (k - .2), 14 * (k - .2), 0, 0, TAU); ctx.stroke(); } }
        break; }
    }
  }
  function drawCone(g) {
    if (!g.alive || g.dying) return;
    const N = 26, pts = [];
    for (let i = 0; i <= N; i++) { const a = g.ang - G.cone + i / N * G.cone * 2; let r = 0; while (r < G.range) { r += 8; if (wallAt(g.x + Math.cos(a) * r, g.y + Math.sin(a) * r)) break; } pts.push([g.x + Math.cos(a) * r, g.y + Math.sin(a) * r]); }
    const grad = ctx.createRadialGradient(g.x, g.y, 10, g.x, g.y, G.range);
    const hot = g.det > .05 || g.sus;
    grad.addColorStop(0, hot ? 'rgba(255,40,60,.38)' : 'rgba(255,200,120,.22)'); grad.addColorStop(1, hot ? 'rgba(255,40,60,.02)' : 'rgba(255,200,120,.02)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(g.x, g.y); for (const [x, y] of pts) ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = hot ? 'rgba(255,60,80,.6)' : 'rgba(255,200,120,.25)'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  function draw() {
    ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, cw, ch);
    if (!map) return;
    const zt = seq ? 1.45 : 1; cam.z += (zt - cam.z) * .12;
    const tx = seq ? (me.x + seq.g.x) / 2 : me.x, ty = seq ? (me.y + seq.g.y) / 2 - 20 : me.y;
    cam.x += (tx - cam.x) * .14; cam.y += (ty - cam.y) * .14;
    const s = cam.s * cam.z;
    ctx.save(); ctx.translate(cw / 2, ch / 2); ctx.scale(s, s); ctx.translate(-cam.x, -cam.y);
    const x0 = cam.x - cw / 2 / s, y0 = cam.y - ch / 2 / s, x1 = cam.x + cw / 2 / s, y1 = cam.y + ch / 2 / s;
    drawFloor(x0, y0, x1, y1);
    const poly = me.alive || state === 'dead' ? viewPoly() : null;
    const visible = (x, y) => Math.hypot(x - me.x, y - me.y) < VIEW && los(me.x, me.y, x, y);
    for (const tr of traps) { const c = center(tr.tx, tr.ty); if (c.x > x0 - TS && c.x < x1 + TS && c.y > y0 - TS && c.y < y1 + TS && Math.hypot(c.x - me.x, c.y - me.y) < VIEW + 20) drawTrap(tr); }
    for (const d of darts) { const c = center(d.tr.tx, d.tr.ty), h = d.tr.ax === 'h', k = 1 - d.t / .3; ctx.strokeStyle = '#cfd6e2'; ctx.lineWidth = 2; for (let i = -1; i <= 1; i++) { ctx.beginPath(); if (h) { ctx.moveTo(c.x + i * 8, c.y - 32 + k * 64); ctx.lineTo(c.x + i * 8, c.y - 22 + k * 64); } else { ctx.moveTo(c.x - 32 + k * 64, c.y + i * 8); ctx.lineTo(c.x - 22 + k * 64, c.y + i * 8); } ctx.stroke(); } }
    /* lantern light pools */
    ctx.globalCompositeOperation = 'lighter';
    for (const l of lanterns) { if (l.x < x0 - 200 || l.x > x1 + 200 || l.y < y0 - 200 || l.y > y1 + 200) continue; const f = .85 + Math.sin(time * 6 + l.f) * .08; const g = ctx.createRadialGradient(l.x, l.y, 4, l.x, l.y, 130); g.addColorStop(0, `rgba(255,150,60,${.22 * f})`); g.addColorStop(1, 'rgba(255,150,60,0)'); ctx.fillStyle = g; ctx.fillRect(l.x - 130, l.y - 130, 260, 260); }
    ctx.globalCompositeOperation = 'source-over';
    for (const g of guards) if (visible(g.x, g.y)) drawCone(g);
    /* depth-sorted walls and figures */
    const figs = [];
    for (const g of guards) if (visible(g.x, g.y) || (!g.alive && seen[Math.floor(g.y / TS) * MW + Math.floor(g.x / TS)])) figs.push({ y: g.y, f: () => drawGuard(g) });
    if (me.alive || state === 'dead') figs.push({ y: me.y + .1, f: drawMe });
    for (const l of lanterns) if (l.x > x0 - 40 && l.x < x1 + 40 && l.y > y0 - 40 && l.y < y1 + 40) figs.push({ y: l.y - 20, f: () => { ctx.fillStyle = '#2a2a32'; ctx.fillRect(l.x - 7, l.y - 26, 14, 30); ctx.fillStyle = `rgba(255,170,80,${.8 + Math.sin(time * 6 + l.f) * .1})`; ctx.fillRect(l.x - 5, l.y - 22, 10, 9); ctx.fillStyle = '#2a2a32'; ctx.fillRect(l.x - 11, l.y - 30, 22, 5); } });
    figs.sort((a, b) => a.y - b.y);
    const ty0 = Math.max(0, Math.floor(y0 / TS) - 1), ty1 = Math.min(MH - 1, Math.ceil(y1 / TS) + 1);
    let fi = 0;
    for (let ty = ty0; ty <= ty1; ty++) {
      while (fi < figs.length && figs[fi].y < ty * TS + TS * .2) figs[fi++].f();
      drawWalls(ty, x0, x1);
    }
    while (fi < figs.length) figs[fi++].f();
    for (const f of fx) {
      if (f.type === 'q' && f.g.alive && visible(f.g.x, f.g.y)) { ctx.fillStyle = '#ffd23d'; ctx.font = '800 22px "Chakra Petch",system-ui'; ctx.textAlign = 'center'; ctx.fillText('?', f.g.x, f.g.y - 62); }
      else if (f.type === 'bell') { ctx.strokeStyle = `rgba(255,210,60,${f.t / 1.4})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 30 + (1.4 - f.t) * 160, 0, TAU); ctx.stroke(); }
      else if (f.type === 'dash') { ctx.strokeStyle = `rgba(212,20,46,${f.t * 2})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(f.x, f.y - 10); ctx.lineTo(f.x + Math.cos(f.a) * 120, f.y - 10 + Math.sin(f.a) * 120); ctx.stroke(); }
      else if (f.type === 'spear') { ctx.strokeStyle = '#cfd6e2'; ctx.lineWidth = 3; const k = 1 - f.t / .5; ctx.beginPath(); ctx.moveTo(f.g.x, f.g.y - 18); ctx.lineTo(f.g.x + (me.x - f.g.x) * k, f.g.y - 18 + (me.y - f.g.y) * k); ctx.stroke(); }
    }
    for (const g of guards) if (g.alive && !g.dying && g.det > .02 && visible(g.x, g.y)) { ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(g.x - 16, g.y - 70, 32, 6); ctx.fillStyle = g.det > .6 ? '#ff2d48' : '#ffd23d'; ctx.fillRect(g.x - 16, g.y - 70, 32 * Math.min(1, g.det), 6); ctx.font = '800 18px "Chakra Petch",system-ui'; ctx.textAlign = 'center'; ctx.fillText('!', g.x, g.y - 76); }
    /* darkness: only what the ninja can see is lit */
    if (poly) {
      ctx.beginPath(); ctx.rect(x0 - 50, y0 - 50, x1 - x0 + 100, y1 - y0 + 100); ctx.moveTo(poly[0], poly[1]); for (let i = 2; i < poly.length; i += 2) ctx.lineTo(poly[i], poly[i + 1]); ctx.closePath();
      ctx.fillStyle = 'rgba(2,2,6,.8)'; ctx.fill('evenodd');
      const g = ctx.createRadialGradient(me.x, me.y, VIEW * .45, me.x, me.y, VIEW); g.addColorStop(0, 'rgba(2,2,6,0)'); g.addColorStop(1, 'rgba(2,2,6,.75)'); ctx.fillStyle = g; ctx.fillRect(me.x - VIEW, me.y - VIEW, VIEW * 2, VIEW * 2);
      /* moonlight */
      ctx.fillStyle = 'rgba(60,80,160,.07)'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
    ctx.restore();
    if (seq) {
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, cw, 46); ctx.fillRect(0, ch - 46, cw, 46);
      const k = seq.t / seq.dur; ctx.save(); ctx.translate(cw / 2, ch * .2); ctx.rotate(-.05);
      ctx.fillStyle = `rgba(212,20,46,${Math.min(1, k * 4) * .9})`; ctx.fillRect(-150 * Math.min(1, k * 3), -22, 300 * Math.min(1, k * 3), 44);
      ctx.fillStyle = '#fff'; ctx.font = '800 26px "Chakra Petch",system-ui'; ctx.textAlign = 'center'; ctx.fillText(T.moves[seq.move], 0, 9); ctx.restore();
    }
    hud();
  }
  function drawMe() {
    if (!me.alive && me.deadT > 0) {
      ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(150,10,28,.8)'; ctx.beginPath(); ctx.ellipse(me.x, me.y + 14, 24, 10, 0, 0, TAU); ctx.fill();
      ctx.translate(me.x, me.y + 14); ctx.rotate(Math.min(1, me.deadT * 3) * 1.57); C.draw(ctx, 0, -10, Object.assign({}, NINJA, { s: 1.02, aim: me.ang, t: time, hit: .4 })); ctx.restore(); return;
    }
    const jump = me.jump || 0;
    if (jump) { ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(me.x, me.y + 18, 16, 6, 0, 0, TAU); ctx.fill(); }
    if (me.dashT > 0) { ctx.globalAlpha = .35; C.draw(ctx, me.x - Math.cos(me.ang) * 30, me.y + 4 - Math.sin(me.ang) * 30, Object.assign({}, NINJA, { s: 1.02, aim: me.ang, t: time })); ctx.globalAlpha = 1; }
    C.draw(ctx, me.x, me.y + 4 - jump, Object.assign({}, NINJA, { s: 1.02, aim: me.ang, walk: me.walk, moving: true, weapon: me.weapon, wcol: '#d4142e', t: time, glow: 'rgba(212,20,46,.55)' }));
    if (me.run) { ctx.strokeStyle = 'rgba(255,210,60,.25)'; ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.arc(me.x, me.y, me.noise, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
  }
  function hud() {
    ctx.textAlign = 'left'; ctx.font = '700 15px "Chakra Petch",system-ui';
    const pill = (x, y, t, col) => { const w = ctx.measureText(t).width + 18; ctx.fillStyle = 'rgba(10,6,10,.8)'; ctx.fillRect(x, y, w, 26); ctx.fillStyle = col || '#e9edf5'; ctx.fillText(t, x + 9, y + 18); return w; };
    let x = 10; x += pill(x, 10, `${T.level} ${level}`, '#ff4d63') + 6; x += pill(x, 10, `✕ ${kills}`) + 6; pill(x, 10, hasKey ? `🗝 ${T.key}` : `🗝 —`, hasKey ? '#ffd23d' : '#777');
    /* explored-area map */
    const S = Math.min(130, cw * .22, ch * .3), mx = cw - S - 10, my = 10, k = S / (MW * TS);
    ctx.fillStyle = 'rgba(10,6,10,.85)'; ctx.fillRect(mx, my, S, S);
    for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) { if (!seen[ty * MW + tx]) continue; ctx.fillStyle = wall(tx, ty) ? '#3a3a46' : '#15151c'; ctx.fillRect(mx + tx * TS * k, my + ty * TS * k, TS * k + .5, TS * k + .5); }
    if (seen[exit.ty * MW + exit.tx]) { ctx.fillStyle = '#ff2d48'; ctx.fillRect(mx + exit.tx * TS * k - 1, my + exit.ty * TS * k - 1, TS * k + 2, TS * k + 2); }
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(mx + me.x * k, my + me.y * k, 2.5, 0, TAU); ctx.fill();
    ctx.font = '600 11px "IBM Plex Sans",system-ui'; ctx.fillStyle = '#9a9aaa'; ctx.textAlign = 'right'; ctx.fillText(`${T.best.replace('{n}', store.get('best', 1))}`, cw - 10, my + S + 14);
    /* stealth state and dash */
    ctx.textAlign = 'center'; ctx.font = '700 13px "Chakra Petch",system-ui';
    const by = ch - 24;
    ctx.fillStyle = 'rgba(10,6,10,.8)'; ctx.fillRect(cw / 2 - 110, by - 18, 220, 28);
    ctx.fillStyle = me.run ? '#ffd23d' : '#8fd0ff'; ctx.fillText(me.run ? T.running : T.sneaking, cw / 2 - 50, by);
    ctx.fillStyle = me.dashCd > 0 ? '#666' : '#ff4d63'; ctx.fillText(`${T.dash} ${me.dashCd > 0 ? Math.ceil(me.dashCd) + 's' : (touch ? '✓' : '␣')}`, cw / 2 + 52, by);
    if (me.gas > 0) { ctx.fillStyle = `rgba(120,200,60,${me.gas * .4})`; ctx.fillRect(0, 0, cw, ch); }
    if (msg) { ctx.font = '800 22px "Chakra Petch",system-ui'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.strokeText(msg.text, cw / 2, ch * .32); ctx.fillStyle = '#fff'; ctx.fillText(msg.text, cw / 2, ch * .32); }
    if (!touch && state === 'play') { ctx.font = '600 11px "IBM Plex Sans",system-ui'; ctx.fillStyle = '#77778a'; ctx.textAlign = 'left'; ctx.fillText(T.keys, 10, ch - 10); }
    if (stick) { ctx.beginPath(); ctx.arc(stick.ox, stick.oy, 60, 0, TAU); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke(); ctx.beginPath(); ctx.arc(stick.ox, stick.oy, 52, 0, TAU); ctx.strokeStyle = 'rgba(255,210,60,.2)'; ctx.stroke(); let dx = stick.x - stick.ox, dy = stick.y - stick.oy; const d = Math.hypot(dx, dy); if (d > 60) { dx *= 60 / d; dy *= 60 / d; } ctx.beginPath(); ctx.arc(stick.ox + dx, stick.oy + dy, 22, 0, TAU); ctx.fillStyle = d > 52 ? 'rgba(255,210,60,.45)' : 'rgba(255,255,255,.3)'; ctx.fill(); }
  }

  /* ---------- loop ---------- */
  let last = 0;
  function frame(t) {
    const dt = Math.min(.05, (t - last) / 1000 || 0); last = t;
    if (state === 'play' || state === 'dead') update(dt);
    draw();
    requestAnimationFrame(frame);
  }
  addEventListener('resize', resize);
  document.addEventListener('fullscreenchange', () => setTimeout(resize, 50));
  resize();
  build(1);
  ov.innerHTML = `<h3>${T.name}</h3><p class="rs-story">${T.story}</p><p><small>${T.best.replace('{n}', store.get('best', 1))}</small></p><button type="button" class="btn" data-k="start">${T.play}</button>`;
  requestAnimationFrame(frame);
  window.__rs = { get state() { return state; }, get me() { return me; }, get guards() { return guards; }, get traps() { return traps; }, get exit() { return exit; }, begin, step: update, get level() { return level; }, setKey: v => { hasKey = v; } };
})();
