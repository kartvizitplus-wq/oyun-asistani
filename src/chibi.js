/* PickRadar character painter: chunky "chibi" figures seen at a slight angle, with a face, hair or headgear,
   outfit, a weapon that follows the aim and a team-coloured glow outline. Shared by all PickRadar games.
   Chibi.draw(ctx, x, y, look) – x, y is the point between the feet. */
(function () {
  const TAU = Math.PI * 2, OL = '#15121c';
  const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
  const circ = (c, x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); };

  function weapon(c, w, col, o) {
    c.lineWidth = 2.2; c.strokeStyle = OL;
    const gun = { pistol: 15, smg: 22, shotgun: 27, rifle: 31, sniper: 40 }[w];
    if (gun) {
      c.fillStyle = '#2a2d38'; rr(c, 2, -4, gun, 7, 2); c.fill(); c.stroke();
      c.fillStyle = col; c.fillRect(6, -2.5, gun - 8, 2.5);
      c.fillStyle = '#2a2d38'; rr(c, 6, 2, 5, 7, 1.5); c.fill(); c.stroke();
      if (w === 'sniper') { c.fillStyle = '#111'; rr(c, 12, -9, 14, 5, 2); c.fill(); c.fillStyle = col; circ(c, 25, -6.5, 1.8); c.fill(); }
      if (w === 'shotgun') { c.fillStyle = '#6b4a2e'; rr(c, -4, -3, 9, 6, 2); c.fill(); c.stroke(); }
      if (w === 'rifle' || w === 'smg') { c.fillStyle = '#2a2d38'; rr(c, 14, 2, 4, 8, 1); c.fill(); }
      return;
    }
    if (w === 'sword') { c.fillStyle = '#e9eef7'; c.beginPath(); c.moveTo(8, -3); c.lineTo(44, -1); c.lineTo(48, 1); c.lineTo(44, 3); c.lineTo(8, 3); c.closePath(); c.fill(); c.stroke(); c.fillStyle = col; rr(c, 5, -7, 4, 14, 2); c.fill(); c.stroke(); c.fillStyle = '#6b4a2e'; rr(c, -2, -2, 8, 4, 2); c.fill(); }
    else if (w === 'daggers') { for (const dy of [-5, 6]) { c.fillStyle = '#e9eef7'; c.beginPath(); c.moveTo(6, dy - 2); c.lineTo(24, dy); c.lineTo(6, dy + 2); c.closePath(); c.fill(); c.stroke(); c.fillStyle = col; c.fillRect(3, dy - 3, 3, 6); } }
    else if (w === 'staff') { c.fillStyle = '#7a5230'; rr(c, -8, -2, 46, 4, 2); c.fill(); c.stroke(); c.save(); c.shadowColor = col; c.shadowBlur = 14; c.fillStyle = col; circ(c, 41, 0, 6.5); c.fill(); c.restore(); c.fillStyle = 'rgba(255,255,255,.7)'; circ(c, 39, -2, 2); c.fill(); }
    else if (w === 'bow') { c.strokeStyle = '#7a5230'; c.lineWidth = 4; c.beginPath(); c.arc(4, 0, 20, -1.15, 1.15); c.stroke(); c.strokeStyle = '#eee'; c.lineWidth = 1; c.beginPath(); c.moveTo(4 + Math.cos(-1.15) * 20, Math.sin(-1.15) * 20); c.lineTo(4 + Math.cos(1.15) * 20, Math.sin(1.15) * 20); c.stroke(); c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(2, 0); c.lineTo(28, 0); c.stroke(); }
    else if (w === 'shield') { c.fillStyle = '#c9d2e3'; rr(c, 8, -16, 10, 32, 5); c.fill(); c.stroke(); c.fillStyle = col; rr(c, 10, -11, 6, 22, 3); c.fill(); c.fillStyle = '#ffd23d'; circ(c, 13, 0, 2.5); c.fill(); }
    else if (w === 'lantern') { c.fillStyle = '#e8d8a8'; rr(c, -6, -2, 36, 4, 2); c.fill(); c.stroke(); c.save(); c.shadowColor = col; c.shadowBlur = 16; c.fillStyle = col; rr(c, 30, -6, 10, 13, 3); c.fill(); c.restore(); c.strokeStyle = OL; c.strokeRect(30, -6, 10, 13); }
  }

  function hair(c, st, col, hy, o) {
    c.lineWidth = 2.4; c.strokeStyle = OL; c.fillStyle = col;
    const cap = (from, to, r) => { c.beginPath(); c.arc(0, hy, r, from, to); c.closePath(); c.fill(); c.stroke(); };
    switch (st) {
      case 'cap': cap(Math.PI, TAU, 14); c.fillStyle = col; rr(c, 4, hy - 4, 16, 4, 2); c.fill(); c.stroke(); c.fillStyle = o.accent || '#fff'; circ(c, -2, hy - 10, 2.5); c.fill(); break;
      case 'beanie': cap(Math.PI * .95, TAU * 1.02, 14.5); c.fillStyle = o.accent || '#fff'; rr(c, -14, hy - 5, 28, 5, 2); c.fill(); c.stroke(); circ(c, -3, hy - 16, 4); c.fillStyle = o.accent || '#fff'; c.fill(); c.stroke(); break;
      case 'helmet': c.fillStyle = '#9aa6bb'; cap(Math.PI * .85, TAU * 1.08, 15); c.fillStyle = OL; rr(c, 2, hy - 3, 13, 4, 2); c.fill(); c.fillStyle = col; c.fillRect(-2, hy - 15, 4, 10); break;
      case 'spiky': c.beginPath(); for (let i = 0; i <= 6; i++) { const a = Math.PI + i / 6 * Math.PI, r = i % 2 ? 13 : 19; c.lineTo(Math.cos(a) * r, hy + Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke(); if (o.accent) { c.fillStyle = o.accent; c.fillRect(-12, hy - 6, 24, 4); } break;
      case 'hood': c.fillStyle = col; c.beginPath(); c.arc(-1, hy, 17, Math.PI * .6, Math.PI * 1.86); c.quadraticCurveTo(4, hy - 8, -3, hy + 13); c.closePath(); c.fill(); c.stroke(); c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 2; c.beginPath(); c.arc(-1, hy, 13, Math.PI * .95, Math.PI * 1.6); c.stroke(); break;
      case 'bandana': cap(Math.PI, TAU, 13.5); c.fillStyle = o.accent || '#e2595b'; rr(c, -13, hy - 8, 26, 5, 2); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-12, hy - 6); c.lineTo(-22, hy - 2); c.lineTo(-18, hy + 3); c.closePath(); c.fill(); c.stroke(); break;
      case 'long': c.beginPath(); c.arc(-1, hy, 14.5, Math.PI * .5, Math.PI * 2.05); c.lineTo(-3, hy + 16); c.closePath(); c.fill(); c.stroke(); break;
      case 'bun': cap(Math.PI, TAU, 13.5); circ(c, -10, hy - 12, 6); c.fill(); c.stroke(); if (o.accent) { c.fillStyle = o.accent; c.fillRect(-12, hy - 13, 4, 3); } break;
      case 'mohawk': c.beginPath(); for (let i = 0; i < 5; i++) { const x = -10 + i * 5; c.lineTo(x, hy - 12 - (i % 2 ? 10 : 4)); } c.lineTo(10, hy - 10); c.lineTo(-10, hy - 10); c.closePath(); c.fill(); c.stroke(); break;
      case 'wizard': c.fillStyle = col; c.beginPath(); c.moveTo(-17, hy - 6); c.lineTo(17, hy - 6); c.lineTo(-6, hy - 38); c.closePath(); c.fill(); c.stroke(); c.fillStyle = o.accent || '#ffd23d'; c.fillRect(-15, hy - 9, 30, 4); c.fillStyle = o.accent || '#ffd23d'; circ(c, -5, hy - 22, 2.5); c.fill(); break;
      default: cap(Math.PI, TAU, 13.5);
    }
  }

  function draw(c, x, y, o) {
    const s = o.s || 1, aim = o.aim || 0, left = Math.cos(aim) < 0;
    const mv = o.moving ? 1 : 0, step = Math.sin(o.walk || 0) * 3.5 * mv, bob = Math.abs(Math.cos(o.walk || 0)) * 1.8 * mv;
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(0, 15, 17, 6, 0, 0, TAU); c.fill();
    if (o.ring) { c.strokeStyle = o.ring; c.lineWidth = 3; c.beginPath(); c.ellipse(0, 15, 22, 8.5, 0, 0, TAU); c.stroke(); }
    c.translate(0, -bob);
    if (left) c.scale(-1, 1);
    const a = Math.max(-1.45, Math.min(1.45, Math.atan2(Math.sin(aim), left ? -Math.cos(aim) : Math.cos(aim))));
    c.lineJoin = 'round'; c.lineCap = 'round';
    const hy = -31;
    /* team glow outline: the silhouette drawn wide in the team colour behind the figure */
    if (o.glow) {
      c.save(); c.fillStyle = o.glow; c.strokeStyle = o.glow; c.lineWidth = 7; c.globalAlpha = .95;
      circ(c, 0, hy, 14.5); c.fill(); c.stroke(); rr(c, -11, -15, 22, 32, 7); c.fill(); c.stroke();
      c.restore();
    }
    c.lineWidth = 2.4; c.strokeStyle = OL;
    /* legs and boots */
    c.fillStyle = o.pants || '#333a4d'; rr(c, -8, 3 + step, 7, 11, 3); c.fill(); c.stroke(); rr(c, 1, 3 - step, 7, 11, 3); c.fill(); c.stroke();
    c.fillStyle = o.boots || OL; rr(c, -9, 11 + step, 9, 5, 2); c.fill(); rr(c, 1, 11 - step, 9, 5, 2); c.fill();
    /* back arm */
    c.strokeStyle = OL; c.lineWidth = 7; c.beginPath(); c.moveTo(-6, -9); c.lineTo(-9, 0); c.stroke();
    c.strokeStyle = o.shirt; c.lineWidth = 4.5; c.stroke();
    /* torso */
    c.lineWidth = 2.4; c.strokeStyle = OL;
    if (o.cape) { c.fillStyle = o.cape; c.beginPath(); c.moveTo(-8, -14); c.quadraticCurveTo(-20 - step, 2, -12, 12); c.lineTo(-4, 6); c.closePath(); c.fill(); c.stroke(); }
    c.fillStyle = o.shirt; rr(c, -10, -15, 20, 20, 7); c.fill(); c.stroke();
    if (o.vest) { c.fillStyle = o.vest; rr(c, -10, -13, 8, 17, 4); c.fill(); c.fillStyle = o.vest; rr(c, 3, -13, 7, 17, 4); c.fill(); }
    if (o.emblem) { c.fillStyle = o.emblem; c.beginPath(); c.moveTo(0, -10); c.lineTo(4, -5); c.lineTo(0, 0); c.lineTo(-4, -5); c.closePath(); c.fill(); }
    c.fillStyle = OL; c.fillRect(-10, 1, 20, 3.5);
    if (o.accent) { c.fillStyle = o.accent; c.fillRect(-2, 1, 4, 3.5); }
    /* weapon and front arm follow the aim */
    c.save(); c.translate(2, -7); c.rotate(a);
    weapon(c, o.weapon, o.wcol || '#7fd6ff', o);
    c.restore();
    const hx = 2 + Math.cos(a) * 9, hyy = -7 + Math.sin(a) * 9;
    c.strokeStyle = OL; c.lineWidth = 7; c.beginPath(); c.moveTo(4, -10); c.lineTo(hx, hyy); c.stroke();
    c.strokeStyle = o.shirt; c.lineWidth = 4.5; c.stroke();
    c.fillStyle = o.skin; c.lineWidth = 2; c.strokeStyle = OL; circ(c, hx, hyy, 3.6); c.fill(); c.stroke();
    /* head and face */
    c.fillStyle = o.skin; c.lineWidth = 2.4; circ(c, 0, hy, 13); c.fill(); c.stroke();
    const lx = Math.cos(a) * 1.4, ly = Math.sin(a) * 1.4;
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(3, hy - 1, 2.8, 3.4, 0, 0, TAU); c.ellipse(10, hy - 1, 2.5, 3.2, 0, 0, TAU); c.fill();
    c.fillStyle = OL; circ(c, 3.6 + lx, hy - .6 + ly, 1.6); c.fill(); circ(c, 10.4 + lx, hy - .6 + ly, 1.5); c.fill();
    c.strokeStyle = OL; c.lineWidth = 1.8; c.beginPath(); c.moveTo(0, hy - 6 + (o.angry ? 1 : 0)); c.lineTo(6, hy - 6 - (o.angry ? 1 : 0)); c.moveTo(8, hy - 6 - (o.angry ? 1 : 0)); c.lineTo(13, hy - 5 + (o.angry ? 1 : 0)); c.stroke();
    c.beginPath(); c.arc(7, hy + 5, 2.6, .2, Math.PI - .2); c.stroke();
    if (o.mask) { c.fillStyle = o.mask; c.beginPath(); c.moveTo(-1, hy + 2); c.lineTo(14, hy + 1); c.lineTo(12, hy + 10); c.lineTo(2, hy + 11); c.closePath(); c.fill(); c.lineWidth = 2; c.stroke(); }
    if (o.beard) { c.fillStyle = o.hairCol; c.beginPath(); c.arc(6, hy + 6, 6, .1, Math.PI - .4); c.fill(); }
    hair(c, o.hair, o.hairCol || '#2b2018', hy, o);
    if (o.hit) { c.globalAlpha = Math.min(1, o.hit * 3); c.fillStyle = '#fff'; circ(c, 0, hy, 13); c.fill(); rr(c, -10, -15, 20, 20, 7); c.fill(); c.globalAlpha = 1; }
    c.restore();
  }

  /* a random look for bots: skin, hair, colours */
  const SKIN = ['#f5d6b8', '#f1c9a0', '#d9a477', '#b07a50', '#7a4e30'];
  const HAIR = ['cap', 'beanie', 'spiky', 'bandana', 'long', 'bun', 'mohawk', 'hood'];
  const HAIRCOL = ['#2b2018', '#5a3a1e', '#d9b25a', '#e05a2a', '#1f1f2a', '#9aa0b5', '#ff5fa2', '#2ef2ff'];
  function randomLook(i) {
    const r = k => Math.floor(Math.random() * k);
    const hue = (i * 47 + r(40)) % 360;
    return { skin: SKIN[r(SKIN.length)], hair: HAIR[r(HAIR.length)], hairCol: HAIRCOL[r(HAIRCOL.length)], shirt: `hsl(${hue} 60% 50%)`, vest: Math.random() < .5 ? `hsl(${hue} 45% 28%)` : null,
      pants: `hsl(${(hue + 200) % 360} 25% 28%)`, accent: `hsl(${(hue + 160) % 360} 90% 60%)`, mask: Math.random() < .15 ? '#2a2d38' : null, beard: Math.random() < .15 };
  }
  window.Chibi = { draw, randomLook };
})();
