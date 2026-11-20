/* PickRadar home page: small animated covers for every game, drawn with the same characters as the games.
   Each <canvas data-scene="..."> only animates while it is on screen. */
(function () {
  const C = window.Chibi, TAU = Math.PI * 2;
  if (!C) return;
  const NINJA = { skin: '#e8c4a0', hair: 'ninja', hairCol: '#0b0b10', shirt: '#101016', vest: '#1a1a22', pants: '#0b0b10', boots: '#050507', scarf: '#d4142e', accent: '#d4142e' };
  const GUARD = { skin: '#d9a477', hair: 'straw', hairCol: '#c9a25e', shirt: '#4a5a6a', vest: '#2a3240', pants: '#22262e', weapon: 'spear', wcol: '#cfd6e2', angry: true };
  const R = (s => () => { s = (s * 16807) % 2147483647; return s / 2147483647; });

  const scenes = {
    'palmera-heat'(c, w, h, t) {
      const hz = h * .64, g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#1a0b3b'); g.addColorStop(.5, '#7a1f6a'); g.addColorStop(.64, '#ff6a4d'); g.addColorStop(.645, '#24092f'); g.addColorStop(1, '#090616');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      const sr = Math.min(w, h) * .26, sx = w * .62;
      c.save(); c.beginPath(); c.rect(0, 0, w, hz); c.clip();
      const sg = c.createLinearGradient(0, hz - sr, 0, hz); sg.addColorStop(0, '#ffe36b'); sg.addColorStop(1, '#ff3f8e'); c.fillStyle = sg; c.beginPath(); c.arc(sx, hz, sr, 0, TAU); c.fill();
      c.fillStyle = '#7a1f6a'; for (let i = 0; i < 6; i++) c.fillRect(sx - sr, hz - sr * .5 + i * sr * .1 + i * i * 1.2, sr * 2, 2 + i);
      c.restore();
      const rnd = R(11); c.fillStyle = '#12061f'; let x = 0; while (x < w) { const bw = 16 + rnd() * 40, bh = 20 + rnd() * h * .25; c.fillRect(x, hz - bh, bw, bh); x += bw + 2; }
      const r2 = R(5); c.fillStyle = 'rgba(255,210,140,.6)'; for (let i = 0; i < 70; i++) c.fillRect(r2() * w, hz - r2() * h * .22, 2, 2);
      c.strokeStyle = 'rgba(255,79,160,.5)'; c.lineWidth = 1.2;
      for (let i = 0; i < 12; i++) { const k = ((i + (t * .6) % 1) / 12), yy = hz + Math.pow(k, 2) * (h - hz); c.beginPath(); c.moveTo(0, yy); c.lineTo(w, yy); c.stroke(); }
      for (let i = -10; i <= 10; i++) { c.beginPath(); c.moveTo(sx + i * 16, hz); c.lineTo(sx + i * 120, h); c.stroke(); }
      // car on the grid road
      const cx = sx - 40 + Math.sin(t * .8) * 30, cy = h * .86, cw = Math.min(150, w * .2), ch = cw * .32;
      c.fillStyle = '#0b0614'; c.beginPath(); c.moveTo(cx - cw / 2, cy); c.lineTo(cx - cw * .38, cy - ch * .55); c.lineTo(cx - cw * .2, cy - ch); c.lineTo(cx + cw * .22, cy - ch); c.lineTo(cx + cw * .4, cy - ch * .55); c.lineTo(cx + cw / 2, cy); c.closePath(); c.fill();
      c.fillStyle = '#ff2a3a'; c.fillRect(cx - cw * .46, cy - ch * .45, cw * .16, 4); c.fillRect(cx + cw * .3, cy - ch * .45, cw * .16, 4);
      c.fillStyle = 'rgba(255,42,58,.25)'; c.fillRect(cx - cw * .5, cy - ch * .52, cw, 12);
      const palm = (px, s, flip) => { c.save(); c.translate(px, h); c.scale(flip ? -s : s, s); c.fillStyle = '#09040f'; c.beginPath(); c.moveTo(-5, 0); c.quadraticCurveTo(8, -120, 34, -240); c.lineTo(40, -238); c.quadraticCurveTo(16, -120, 7, 0); c.fill(); for (let i = 0; i < 7; i++) { c.save(); c.translate(37, -240); c.rotate(-2.6 + i * .75 + Math.sin(t + i) * .04); c.beginPath(); c.ellipse(50, 0, 54, 8, .25, 0, TAU); c.fill(); c.restore(); } c.restore(); };
      palm(w * .05, h / 330, false); palm(w * .97, h / 400, true);
    },
    'red-scarf'(c, w, h, t) {
      c.fillStyle = '#07070b'; c.fillRect(0, 0, w, h);
      const T = 64;
      for (let y = 0; y < h; y += T) for (let x = 0; x < w; x += T) { c.fillStyle = (x / T + y / T) % 2 ? '#15151c' : '#121218'; c.fillRect(x, y, T, T); }
      const block = (x, y, bw, bh) => { c.fillStyle = '#20202a'; c.fillRect(x, y + bh - 18, bw, 18); c.fillStyle = '#30303c'; c.fillRect(x, y - 18, bw, bh); c.fillStyle = 'rgba(170,180,230,.1)'; c.fillRect(x, y - 18, bw, 3); };
      block(0, 40, w * .32, 70); block(w * .62, 0, 90, h * .55); block(w * .62, h * .55 - 18, w * .38, 60); block(0, h * .78, w * .45, 80);
      c.globalCompositeOperation = 'lighter';
      const lg = c.createRadialGradient(w * .55, h * .3, 4, w * .55, h * .3, 150); lg.addColorStop(0, 'rgba(255,150,60,.35)'); lg.addColorStop(1, 'rgba(255,150,60,0)'); c.fillStyle = lg; c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = 'source-over';
      const off = w > 700 ? w * .36 : 0;
      const gx = w * .6 + off * .62, gy = h * .62, ga = Math.PI + Math.sin(t * .6) * .5;
      c.fillStyle = 'rgba(255,200,120,.16)'; c.beginPath(); c.moveTo(gx, gy); c.arc(gx, gy, 210, ga - .55, ga + .55); c.closePath(); c.fill();
      C.draw(c, gx, gy, Object.assign({}, GUARD, { s: w > 700 ? 2 : 1.5, aim: ga, t }));
      const nx = w * .3 + off + Math.sin(t * .8) * 10, ny = h * .45;
      C.draw(c, nx, ny, Object.assign({}, NINJA, { s: w > 700 ? 2.2 : 1.6, aim: .25, walk: t * 6, moving: true, weapon: 'katana', wcol: '#d4142e', t, glow: 'rgba(212,20,46,.5)' }));
      c.fillStyle = 'rgba(220,225,240,.85)'; c.beginPath(); c.arc(w * .9, h * .14, 18, 0, TAU); c.fill(); c.fillStyle = '#07070b'; c.beginPath(); c.arc(w * .9 - 7, h * .14 - 4, 16, 0, TAU); c.fill();
      const v = c.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, w * .7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.75)'); c.fillStyle = v; c.fillRect(0, 0, w, h);
    },
    'night-drop'(c, w, h, t) {
      c.fillStyle = '#0b1020'; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(110,140,255,.07)'; c.lineWidth = 2; for (let x = 0; x < w; x += 70) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y < h; y += 70) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
      c.globalCompositeOperation = 'lighter';
      for (const [x, y, col] of [[w * .2, h * .75, '#ff3df2'], [w * .75, h * .3, '#2ef2ff'], [w * .55, h * .85, '#ffd23d']]) { const g = c.createRadialGradient(x, y, 2, x, y, 90); g.addColorStop(0, col + '40'); g.addColorStop(1, col + '00'); c.fillStyle = g; c.fillRect(x - 90, y - 90, 180, 180); }
      const neon = (x, y, bw, bh, col) => { c.fillStyle = '#1f2848'; c.fillRect(x, y, bw, bh); c.strokeStyle = col; c.globalAlpha = .25; c.lineWidth = 10; c.strokeRect(x + 4, y + 4, bw - 8, bh - 8); c.globalAlpha = .9 - (Math.random() < .02 ? .5 : 0); c.lineWidth = 2; c.strokeRect(x + 4, y + 4, bw - 8, bh - 8); c.globalAlpha = 1; };
      c.globalCompositeOperation = 'source-over';
      neon(-10, -10, w * .3, 70, '#ff3df2'); neon(w * .78, h * .5, w * .3, 26, '#2ef2ff'); neon(w * .45, -10, 26, h * .35, '#7dff6b');
      c.globalCompositeOperation = 'lighter';
      const sr = (t * 180) % 320; c.strokeStyle = `rgba(46,242,255,${1 - sr / 320})`; c.lineWidth = 3; c.beginPath(); c.arc(w * .32, h * .6, sr, 0, TAU); c.stroke();
      const tk = (t * 2.5) % 1; c.strokeStyle = '#9dff8a'; c.lineWidth = 3; c.beginPath(); c.moveTo(w * .36 + tk * w * .3, h * .55 - tk * h * .12); c.lineTo(w * .36 + tk * w * .3 + 30, h * .55 - tk * h * .12 - 6); c.stroke();
      c.globalCompositeOperation = 'source-over';
      C.draw(c, w * .32, h * .62, { skin: '#f1c9a0', hair: 'cap', hairCol: '#1f1f2a', shirt: '#e8b44a', vest: '#7a5a17', pants: '#2a3048', accent: '#2ef2ff', s: 1.6, aim: -.2, weapon: 'rifle', wcol: '#9dff8a', glow: '#7dff6b', t });
      C.draw(c, w * .72, h * .5, { skin: '#b07a50', hair: 'mohawk', hairCol: '#ff5fa2', shirt: '#6a2a8a', vest: '#2a1040', pants: '#222', accent: '#ff3df2', s: 1.45, aim: Math.PI + .25, weapon: 'smg', wcol: '#7fd6ff', glow: '#ff3d5a', angry: true, t });
      c.strokeStyle = 'rgba(170,200,255,.3)'; c.lineWidth = 1; c.beginPath(); const r = R(7);
      for (let i = 0; i < 70; i++) { const x = (r() * w + t * 60) % w, y = (r() * h + t * 400 * (.6 + r() * .4)) % h; c.moveTo(x, y); c.lineTo(x + 3, y - 14); } c.stroke();
    },
    'crown-clash'(c, w, h, t) {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#4b9bff'); g.addColorStop(1, '#c4e6ff'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 4; i++) { const x = ((i * 190 + t * 14) % (w + 200)) - 100, y = 30 + i * 70; c.beginPath(); c.arc(x, y, 34, 0, TAU); c.arc(x + 34, y + 6, 26, 0, TAU); c.arc(x - 30, y + 8, 22, 0, TAU); c.fill(); }
      const isl = (x, y, rx) => { c.fillStyle = '#6b4a2e'; c.beginPath(); c.ellipse(x, y + 30, rx * .9, rx * .4, 0, 0, Math.PI); c.fill(); c.beginPath(); c.moveTo(x - rx * .7, y + 30); c.lineTo(x, y + rx * .9); c.lineTo(x + rx * .7, y + 30); c.fill(); c.fillStyle = '#5fbf5a'; c.beginPath(); c.ellipse(x, y + 20, rx, rx * .38, 0, 0, TAU); c.fill(); c.fillStyle = '#74d36a'; c.beginPath(); c.ellipse(x, y + 14, rx * .85, rx * .28, 0, 0, TAU); c.fill(); };
      isl(w * .32, h * .55, 170); isl(w * .85, h * .45, 110);
      c.strokeStyle = '#5a3a1e'; c.lineWidth = 26; c.beginPath(); c.moveTo(w * .5, h * .62); c.lineTo(w * .78, h * .54); c.stroke(); c.strokeStyle = '#c99a5e'; c.lineWidth = 20; c.setLineDash([10, 4]); c.stroke(); c.setLineDash([]);
      const bob = Math.sin(t * 2) * 5; c.fillStyle = '#e2595b'; c.beginPath(); c.moveTo(w * .86, h * .1 + bob); c.lineTo(w * .86 + 20, h * .3 + bob); c.lineTo(w * .86, h * .42 + bob); c.lineTo(w * .86 - 20, h * .3 + bob); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.moveTo(w * .86, h * .1 + bob); c.lineTo(w * .86 + 6, h * .3 + bob); c.lineTo(w * .86, h * .42 + bob); c.fill();
      C.draw(c, w * .22, h * .62, { skin: '#f1c9a0', hair: 'helmet', hairCol: '#2b2018', shirt: '#9fb0d4', vest: '#5a6478', pants: '#2a2d3a', cape: '#9fb0d4', weapon: 'shield', wcol: '#4a9bea', emblem: '#4a9bea', beard: true, s: 1.55, aim: .1, glow: '#4a9bea', t });
      C.draw(c, w * .38, h * .7, { skin: '#f5d6b8', hair: 'wizard', hairCol: '#b48cff', shirt: '#b48cff', pants: '#2a2d3a', cape: '#b48cff', weapon: 'staff', wcol: '#b48cff', s: 1.45, aim: -.1, glow: '#4a9bea', t });
      C.draw(c, w * .66, h * .5, { skin: '#d9a477', hair: 'hood', hairCol: '#5a1a2a', shirt: '#ff6b8b', pants: '#2a2d3a', weapon: 'daggers', wcol: '#ff6b8b', mask: '#22202c', s: 1.4, aim: Math.PI, glow: '#ff3d5a', angry: true, t });
    },
    'jade-lanes'(c, w, h, t) {
      c.fillStyle = '#f1e6d2'; c.fillRect(0, 0, w, h);
      const mtn = (x, y, mw, mh, a) => { c.fillStyle = `rgba(40,40,45,${a})`; c.beginPath(); c.moveTo(x - mw, y); c.quadraticCurveTo(x - mw * .3, y - mh, x, y - mh); c.quadraticCurveTo(x + mw * .4, y - mh * .6, x + mw, y); c.fill(); };
      mtn(w * .2, h * .55, 200, 170, .12); mtn(w * .7, h * .5, 260, 210, .16); mtn(w * .95, h * .6, 160, 120, .1);
      c.strokeStyle = 'rgba(35,35,40,.18)'; c.lineWidth = 60; c.lineCap = 'round'; c.beginPath(); c.moveTo(-20, h * .85); c.quadraticCurveTo(w * .5, h * .6, w + 20, h * .78); c.stroke();
      const px = w * .82, py = h * .62; for (let k = 0; k < 3; k++) { const pw = 70 - k * 16, y = py - k * 26; c.fillStyle = '#f7efe0'; c.fillRect(px - pw / 2 + 8, y - 16, pw - 16, 18); c.fillStyle = '#26262c'; c.beginPath(); c.moveTo(px - pw / 2 - 8, y - 14); c.quadraticCurveTo(px, y - 30, px + pw / 2 + 8, y - 14); c.lineTo(px + pw / 2 - 6, y - 9); c.lineTo(px - pw / 2 + 6, y - 9); c.fill(); c.fillStyle = '#e2595b'; c.fillRect(px - 4, y - 11, 8, 8); }
      C.draw(c, w * .28, h * .72, { skin: '#f5d6b8', hair: 'long', hairCol: '#1f1f2a', shirt: '#6fd6b0', pants: '#2a2d3a', weapon: 'bow', wcol: '#6fd6b0', s: 1.5, aim: .05, glow: '#4a9bea', t });
      C.draw(c, w * .52, h * .66, { skin: '#d9a477', hair: 'spiky', hairCol: '#2b2018', shirt: '#ff9f5a', vest: '#3a2a1e', pants: '#2a2d3a', cape: '#ff9f5a', weapon: 'sword', wcol: '#ff9f5a', s: 1.5, aim: Math.PI - .2, glow: '#ff3d5a', angry: true, t, walk: t * 5, moving: true });
      c.fillStyle = 'rgba(232,140,170,.85)'; const r = R(3); for (let i = 0; i < 26; i++) { const x = (r() * w + t * 30) % w, y = (r() * h + t * 40 * (.5 + r())) % h; c.beginPath(); c.ellipse(x, y, 4, 2.4, t + i, 0, TAU); c.fill(); }
      c.fillStyle = 'rgba(180,20,40,.85)'; c.fillRect(w - 46, 14, 32, 32); c.fillStyle = '#f1e6d2'; c.font = '700 18px serif'; c.textAlign = 'center'; c.fillText('玉', w - 30, 37);
    },
    'duel-peak'(c, w, h, t) {
      c.fillStyle = '#1b1416'; c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = 'lighter'; const r = R(11);
      for (let i = 0; i < 14; i++) { let x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (r() - .5) * 120; y += (r() - .5) * 90; c.lineTo(x, y); } c.strokeStyle = `rgba(255,110,30,${.3 + Math.sin(t * 2 + i) * .1})`; c.lineWidth = 7; c.stroke(); c.strokeStyle = 'rgba(255,200,90,.5)'; c.lineWidth = 2; c.stroke(); }
      c.globalCompositeOperation = 'source-over';
      const lg = c.createLinearGradient(0, h * .82, 0, h); lg.addColorStop(0, 'rgba(255,150,40,.95)'); lg.addColorStop(1, 'rgba(200,40,10,1)'); c.fillStyle = lg; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 20) c.lineTo(x, h * .86 + Math.sin(x * .05 + t * 3) * 6); c.lineTo(w, h); c.fill();
      C.draw(c, w * .34, h * .6, { skin: '#f1c9a0', hair: 'wizard', hairCol: '#a48bff', shirt: '#a48bff', pants: '#2a2d3a', cape: '#a48bff', weapon: 'staff', wcol: '#ffb057', s: 1.65, aim: -.15, glow: '#4a9bea', t });
      C.draw(c, w * .66, h * .56, { skin: '#b07a50', hair: 'spiky', hairCol: '#e05a2a', shirt: '#ffa94d', vest: '#3a2a1e', pants: '#2a2d3a', cape: '#ffa94d', weapon: 'sword', wcol: '#ffa94d', s: 1.65, aim: Math.PI + .15, glow: '#ff3d5a', angry: true, t });
      c.globalCompositeOperation = 'lighter'; const k = (t * 1.3) % 1; c.fillStyle = `rgba(255,176,87,${1 - k})`; c.beginPath(); c.arc(w * .5, h * .45, 10 + k * 40, 0, TAU); c.fill();
      for (let i = 0; i < 30; i++) { const x = (r() * w) % w, y = h - ((r() * h + t * 60 * (.4 + r())) % h); c.fillStyle = 'rgba(255,170,60,.8)'; c.fillRect(x, y, 2.5, 2.5); }
      c.globalCompositeOperation = 'source-over';
    },
    'color-gradient'(c, w, h, t) {
      c.fillStyle = '#121825'; c.fillRect(0, 0, w, h);
      const cols = 9, rows = 5, gw = w / cols, gh = h / rows, sw = Math.floor(t / 1.6) % (cols * rows), k = Math.min(1, (t % 1.6) / .4);
      for (let i = 0; i < cols * rows; i++) {
        const x = i % cols, y = Math.floor(i / cols);
        let dx = 0; if (i === sw) dx = (1 - k) * gw; if (i === (sw + 1) % (cols * rows)) dx = -(1 - k) * gw;
        c.fillStyle = `hsl(${(200 + x * 15 - y * 10 + t * 8) % 360} ${55 + y * 7}% ${72 - y * 9 - x * 2}%)`;
        c.beginPath(); if (c.roundRect) c.roundRect(x * gw + 4 + dx, y * gh + 4, gw - 8, gh - 8, 8); else c.rect(x * gw + 4 + dx, y * gh + 4, gw - 8, gh - 8); c.fill();
      }
      c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.arc(gw / 2, gh / 2, 5, 0, TAU); c.arc(w - gw / 2, h - gh / 2, 5, 0, TAU); c.fill();
    }
  };

  const items = [...document.querySelectorAll('canvas[data-scene]')].map(cv => ({ cv, ctx: cv.getContext('2d'), scene: scenes[cv.dataset.scene], on: false, t: Math.random() * 10 }));
  const size = it => { const r = it.cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); it.w = r.width; it.h = r.height; it.cv.width = Math.round(r.width * d); it.cv.height = Math.round(r.height * d); it.ctx.setTransform(d, 0, 0, d, 0, 0); };
  items.forEach(size);
  addEventListener('resize', () => items.forEach(it => { size(it); try { it.scene && it.scene(it.ctx, it.w, it.h, it.t); } catch (e) {} }));
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { const it = items.find(i => i.cv === e.target); if (it) it.on = e.isIntersecting; })) : null;
  items.forEach(it => { if (io) io.observe(it.cv); else it.on = true; it.cv.classList.add('live'); });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = 0;
  function frame(ts) {
    const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
    for (const it of items) { if (!it.on || !it.scene) continue; if (!reduce) it.t += dt; try { it.scene(it.ctx, it.w, it.h, it.t); } catch (e) { if (!it.err) { it.err = 1; console.error(it.cv.dataset.scene, e.message); } } }
    requestAnimationFrame(frame);
  }
  items.forEach(it => { try { it.scene && it.scene(it.ctx, it.w, it.h, it.t); } catch (e) { console.error(it.cv.dataset.scene, e.message); } });
  requestAnimationFrame(frame);
})();
