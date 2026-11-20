/* Color Gradient: a hue-sorting puzzle. Tiles form a smooth gradient between corner colours; the free tiles are
   shuffled and the player swaps them back (tap two tiles, or drag one onto another). Pinned tiles (dot) never move.
   Levels are generated from the level number, so every player gets the same puzzle for the same level. */
(function () {
  const root = document.getElementById('cg');
  if (!root) return;
  const T = JSON.parse(root.dataset.t || '{}');
  const $ = s => root.querySelector(s);
  const board = $('.cg-board'), elLevel = $('[data-v=level]'), elMoves = $('[data-v=moves]'), elBest = $('[data-v=best]'), win = $('.cg-win');

  /* Storage is only a convenience (progress and best scores); the game works without it. */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('cg-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('cg-' + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* Small seeded random generator (mulberry32) so a level always looks the same. */
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  /* OKLCH -> OKLab -> sRGB. Mixing in OKLab gives even, natural-looking steps. */
  const lab = (L, C, h) => [L, C * Math.cos(h * Math.PI / 180), C * Math.sin(h * Math.PI / 180)];
  function rgb([L, a, b]) {
    const l = (L + .3963377774 * a + .2158037573 * b) ** 3, m = (L - .1055613458 * a - .0638541728 * b) ** 3, s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
    const g = x => { x = Math.min(1, Math.max(0, x)); return Math.round(255 * (x <= .0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - .055)); };
    return `rgb(${g(4.0767416621 * l - 3.3077115913 * m + .2309699292 * s)},${g(-1.2684380046 * l + 2.6097574011 * m - .3413193965 * s)},${g(-.0041960863 * l - .7034186147 * m + 1.707614701 * s)})`;
  }
  const mix = (p, q, t) => p.map((v, i) => v + (q[i] - v) * t);

  /* Level shape: 1-3 are single "tubes", then grids grow; pins thin out as the player improves. */
  function spec(n) {
    const r = rng(n * 9973 + 17);
    let rows, cols, pins;
    if (n <= 3) { rows = 1; cols = 4 + n * 2; pins = 'ends'; }
    else if (n <= 8) { rows = 4 + (n > 6); cols = 4 + (n > 5); pins = 'border'; }
    else if (n <= 16) { rows = 4 + (n > 12); cols = 5 + (n > 10); pins = 'half'; }
    else if (n <= 30) { rows = 5 + (n > 22); cols = 6 + (n > 20); pins = 'corners+'; }
    else { rows = 6 + (n > 45); cols = 7 + (n > 40); pins = 'corners'; }
    const h0 = Math.floor(r() * 24) * 15;               // 24 base hues
    const span = Math.max(28, 95 - n * 1.6);             // colours get closer as levels go up
    const dir = r() < .5 ? 1 : -1;
    const C = [lab(.9, .09, h0), lab(.68, .16, h0 + dir * span), lab(.6, .15, h0 - dir * span * .9), lab(.38, .12, h0 + dir * span * 2)];
    return { rows, cols, pins, C, seed: n * 7919 + 3 };
  }

  function pinned(s, x, y) {
    const edgeX = x === 0 || x === s.cols - 1, edgeY = y === 0 || y === s.rows - 1, corner = edgeX && edgeY;
    if (s.rows === 1) return x === 0 || x === s.cols - 1;
    if (s.pins === 'border') return edgeX || edgeY;
    if (s.pins === 'half') return corner || ((edgeX || edgeY) && (x + y) % 2 === 0);
    if (s.pins === 'corners+') return corner || (edgeY && x === Math.floor(s.cols / 2)) || (edgeX && y === Math.floor(s.rows / 2));
    return corner;
  }

  let S, tiles, order, moves, sel, level, done, drag;

  function start(n) {
    level = n; S = spec(n); moves = 0; sel = null; done = false;
    tiles = [];
    for (let y = 0; y < S.rows; y++) for (let x = 0; x < S.cols; x++) {
      const tx = S.cols > 1 ? x / (S.cols - 1) : 0, ty = S.rows > 1 ? y / (S.rows - 1) : 0;
      const c = S.rows === 1 ? mix(S.C[0], S.C[3], tx) : mix(mix(S.C[0], S.C[1], tx), mix(S.C[2], S.C[3], tx), ty);
      tiles.push({ id: tiles.length, color: rgb(c), pin: pinned(S, x, y) });
    }
    order = tiles.map(t => t.id);
    const free = order.filter(i => !tiles[i].pin), r = rng(S.seed);
    do {
      const sh = free.slice();
      for (let i = sh.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [sh[i], sh[j]] = [sh[j], sh[i]]; }
      let k = 0; order = order.map(i => tiles[i].pin ? i : sh[k++]);
    } while (free.length > 1 && solved());
    win.hidden = true;
    render(); stats();
    store.set('level', n);
  }

  const solved = () => order.every((id, pos) => id === pos);

  function render() {
    board.style.setProperty('--cols', S.cols);
    board.classList.toggle('tube', S.rows === 1);
    board.innerHTML = order.map((id, pos) => `<button type="button" class="cg-t${tiles[id].pin ? ' pin' : ''}" data-p="${pos}" style="background:${tiles[id].color}" aria-label="${tiles[id].pin ? T.pinned : T.tile} ${pos + 1}"${tiles[id].pin ? ' disabled' : ''}></button>`).join('');
  }

  function stats() {
    const best = store.get('best', {})[level];
    elLevel.textContent = level;
    elMoves.textContent = moves;
    elBest.textContent = best == null ? '–' : best;
    $('[data-a=prev]').disabled = level <= 1;
    $('[data-a=next]').disabled = level >= store.get('max', 1);
  }

  function swap(a, b) {
    if (a === b || tiles[order[a]].pin || tiles[order[b]].pin) return;
    [order[a], order[b]] = [order[b], order[a]];
    moves++;
    const A = board.children[a], B = board.children[b];
    A.style.background = tiles[order[a]].color; B.style.background = tiles[order[b]].color;
    [A, B].forEach(el => { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); });
    stats();
    if (solved()) finish();
  }

  function finish() {
    done = true;
    const best = store.get('best', {});
    if (best[level] == null || moves < best[level]) best[level] = moves;
    store.set('best', best);
    store.set('max', Math.max(store.get('max', 1), level + 1));
    board.classList.add('won');
    setTimeout(() => board.classList.remove('won'), 900);
    win.querySelector('p').textContent = T.solvedIn.replace('{n}', moves);
    win.hidden = false;
    stats();
  }

  function pick(pos) {
    if (done) return;
    const el = board.children[pos];
    if (!el || tiles[order[pos]].pin) return;
    if (sel == null) { sel = pos; el.classList.add('sel'); return; }
    board.children[sel].classList.remove('sel');
    const a = sel; sel = null;
    if (a !== pos) swap(a, pos);
  }

  /* Tap-tap or drag-and-drop with one pointer handler (works for mouse, touch and pen). */
  const posAt = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.parentNode === board ? +el.dataset.p : null; };
  board.addEventListener('pointerdown', e => {
    const p = posAt(e.clientX, e.clientY);
    if (p == null || done || tiles[order[p]].pin) return;
    drag = { p, x: e.clientX, y: e.clientY, moved: false };
  });
  board.addEventListener('pointermove', e => {
    if (!drag) return;
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 8) drag.moved = true;
  });
  window.addEventListener('pointerup', e => {
    if (!drag) return;
    const d = drag; drag = null;
    const p = posAt(e.clientX, e.clientY);
    if (d.moved && p != null && p !== d.p) {
      if (sel != null) { board.children[sel].classList.remove('sel'); sel = null; }
      swap(d.p, p);
    } else if (!d.moved) pick(d.p);
  });
  window.addEventListener('pointercancel', () => { drag = null; });
  /* Keyboard: Enter/Space on a focused tile selects it, a second one swaps. */
  board.addEventListener('animationend', e => { if (e.animationName === 'cghint') e.target.classList.remove('hint'); });
  board.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.p != null) { e.preventDefault(); pick(+e.target.dataset.p); }
  });

  function hint() {
    if (done) return;
    const pos = order.findIndex((id, p) => id !== p);
    if (pos < 0) return;
    const from = order.indexOf(pos);   // where the right tile for this spot is now
    board.querySelectorAll('.hint').forEach(el => el.classList.remove('hint'));
    [board.children[pos], board.children[from]].forEach(el => { el.classList.remove('hint'); void el.offsetWidth; el.classList.add('hint'); });
    moves += 2; stats();
  }

  root.addEventListener('click', e => {
    const a = e.target.closest('[data-a]');
    if (!a) return;
    const act = a.dataset.a;
    if (act === 'restart') start(level);
    else if (act === 'hint') hint();
    else if (act === 'prev' && level > 1) start(level - 1);
    else if (act === 'next' || act === 'continue') start(level + 1);
  });

  start(Math.max(1, Math.min(store.get('level', 1), store.get('max', 1))));
})();
