/* Browser UI for the game tools. Expects window.APP = {lang, game, kind, t, data, itemsTr}, window.Engine and window.Icons. */
(function () {
  const A = window.APP, E = window.Engine, I = window.Icons;
  if (!A || !A.kind || !E || !I) return;
  const T = A.t;
  const $ = id => document.getElementById(id);
  const t = (k, v) => { let s = T[k] || k; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; };
  const itemName = i => i.startsWith('#') ? t(i.slice(1)) : ((A.lang === 'tr' && A.itemsTr && A.itemsTr[i]) || i);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const el = (tag, attrs, html) => { const x = document.createElement(tag); for (const k in attrs || {}) x.setAttribute(k, attrs[k]); if (html != null) x.innerHTML = html; return x; };
  const scoreCls = s => s >= 7 ? 'good' : s >= 5 ? 'mid' : 'bad';
  const KEY = 'pick-' + A.game;
  const speak = text => {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = T.speechLang; u.rate = 1.05;
      const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith(T.speechLang.slice(0, 2)));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  };
  const load = def => { try { return Object.assign(def, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return def; } };
  const save = st => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  function teamBlock(title, names, showWarn) {
    const tm = E.mlTeam(A.data, names);
    const tot = tm.P + tm.M || 1, pp = Math.round(tm.P / tot * 100);
    const roles = E.ROLES.map(r => '<span class="rolechip' + (tm.roles[r] ? ' on' : '') + '" title="' + esc(t('role_' + r)) + '">' + I.talent(r.charAt(0).toUpperCase() + r.slice(1), 22) + '<small>' + esc(t('role_' + r)) + (tm.roles[r] > 1 ? ' ×' + tm.roles[r] : '') + '</small></span>').join('');
    return '<div class="team"><b>' + esc(title) + '</b>' +
      '<div class="dmgbar" role="img" aria-label="' + esc(t('dmgPhys')) + ' ' + pp + '%, ' + esc(t('dmgMag')) + ' ' + (100 - pp) + '%"><span class="p" style="width:' + (names.length ? pp : 50) + '%"></span><span class="m" style="width:' + (names.length ? 100 - pp : 50) + '%"></span></div>' +
      '<div class="dmglabels"><span>' + esc(t('dmgPhys')) + ' ' + (names.length ? pp + '%' : '–') + '</span><span>' + esc(t('dmgMag')) + ' ' + (names.length ? (100 - pp) + '%' : '–') + '</span></div>' +
      '<div class="roles">' + roles + '</div>' +
      (showWarn && tm.warn.length ? '<ul class="warn">' + tm.warn.map(k => '<li class="' + (k === 'wa_ok' ? 'ok' : '') + '">' + esc(t(k)) + '</li>').join('') + '</ul>' : '') + '</div>';
  }
  const chipOf = (n, role, cls) => el('button', { class: 'chip ' + (cls || ''), type: 'button' }, I.hero(n, role, 18) + '<span>' + esc(n) + '</span>');
  if (A.kind === 'draft') return draftTool();
  if (A.kind === 'ff') return ffTool();

  /* ---------- MOBA and Brawl Stars tools ---------- */
  const isMoba = A.kind === 'moba';
  const list = isMoba ? A.data.heroes : A.data.brawlers;
  const all = list.map(h => h.n);
  const roleOf = Object.fromEntries(list.map(h => [h.n, isMoba ? h.r : h.c]));
  const wrOf = Object.fromEntries(list.filter(h => h.wr).map(h => [h.n, h.wr]));
  const maxEnemy = isMoba ? 5 : 3;
  const st = load({ e: [], a: [], side: 'e', pool: [], hero: null, mode: 'gem' });
  st.e = (st.e || []).filter(n => all.includes(n));
  st.a = isMoba ? (st.a || []).filter(n => all.includes(n)) : [];
  if (!isMoba) st.side = 'e';
  const maxAlly = 4;
  st.pool = (st.pool || []).filter(n => all.includes(n));
  const qp = new URLSearchParams(location.search).get('e');
  if (qp && all.includes(qp)) st.e = [qp];
  let example = false;
  if (!st.e.length && !qp && A.example) { st.e = A.example.filter(n => all.includes(n)); example = true; }
  const chip = (n, cls) => el('button', { class: 'chip ' + (cls || ''), type: 'button' }, I.hero(n, roleOf[n], 18) + '<span>' + esc(n) + '</span>');

  function slotRow(id, arr, max, cls) {
    const sl = $(id); if (!sl) return; sl.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const n = arr[i];
      const b = el('button', { class: 'slot' + (n ? ' ' + cls : ''), type: 'button' }, n ? I.hero(n, roleOf[n], 26) + '<span>' + esc(n) + '</span>' : esc(t('emptySlot')));
      if (n) b.onclick = () => { arr.splice(i, 1); example = false; update(); };
      sl.appendChild(b);
    }
  }
  function renderSlots() {
    slotRow('slots', st.e, maxEnemy, 'on');
    slotRow('aslots', st.a, maxAlly, 'ally');
    const se = $('sideE'), sa = $('sideA');
    if (se) { se.setAttribute('aria-pressed', st.side === 'e'); sa.setAttribute('aria-pressed', st.side === 'a'); }
  }
  const target = () => st.side === 'a' ? st.a : st.e;
  const targetMax = () => st.side === 'a' ? maxAlly : maxEnemy;
  function renderPool() {
    const q = $('q').value.trim().toLowerCase(), p = $('pool'); p.innerHTML = '';
    all.filter(n => !q || n.toLowerCase().includes(q)).forEach(n => {
      const b = chip(n);
      b.disabled = st.e.includes(n) || st.a.includes(n) || target().length >= targetMax();
      b.onclick = () => { target().push(n); $('q').value = ''; example = false; update(); };
      p.appendChild(b);
    });
  }
  function renderMyPool() {
    const q = $('pq').value.trim().toLowerCase(), p = $('mypool'); p.innerHTML = '';
    all.filter(n => !q || n.toLowerCase().includes(q)).forEach(n => {
      const on = st.pool.includes(n), b = chip(n, on ? 'mine' : '');
      b.setAttribute('aria-pressed', on);
      b.onclick = () => { st.pool = on ? st.pool.filter(x => x !== n) : [...st.pool, n]; update(); };
      p.appendChild(b);
    });
    $('poolcount').textContent = st.pool.length ? ' (' + st.pool.length + ')' : '';
  }
  function whyText(w) {
    if (typeof w === 'string') return t(w);
    if (w.k === 'bw_counter') return t('bw_counter', { cls: t('cl_' + w.cls) });
    if (w.k === 'bw_mode') return t('bw_mode', { mode: t('m_' + w.mode) });
    return t(w.k);
  }
  let lastPicks = [];
  function renderPicks() {
    const pk = $('picks'); pk.innerHTML = '';
    if (!st.e.length) { pk.innerHTML = '<p class="note">' + esc(t('noEnemy')) + '</p>'; lastPicks = []; return; }
    const res = isMoba ? E.mlScore(A.data, st.e, st.pool, st.a) : E.bsScore(A.data, st.e, st.mode, st.pool);
    lastPicks = res.slice(0, 6);
    lastPicks.forEach((r, i) => {
      const d = el('div', { class: 'pick' });
      const role = isMoba ? t('role_' + r.r) : t('cl_' + r.c);
      const why = r.why.length ? [...new Set(r.why.map(whyText))].join(' · ') : t('neutral');
      d.innerHTML = I.hero(r.n, roleOf[r.n], 36) + '<span class="pmain"><span><span class="score ' + scoreCls(r.s) + '">' + r.s.toFixed(1) + '</span> <b>' + esc(r.n) + '</b> <span class="role">' + esc(role) + (i === 0 ? ' · ' + esc(t('bestChoice')) : '') + '</span>' + (wrOf[r.n] ? ' <span class="wr" title="' + esc(A.data.wrSource ? A.data.wrSource.name + ' · ' + A.data.wrSource.date : '') + '">' + esc(t('srcShort', { p: wrOf[r.n].toFixed(1) })) + '</span>' : '') + '</span><span class="why">' + esc(why) + '</span></span>' +
        (isMoba ? '<button class="use" type="button">' + esc(t('buildTitle')) + '</button>' : '');
      if (isMoba) d.querySelector('button').onclick = () => { st.hero = r.n; update(); $('buildsec').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      pk.appendChild(d);
    });
  }
  function renderBans() {
    const box = $('bans'); if (!box) return;
    const mine = [...new Set([...st.a, ...st.pool])];
    const bans = E.mlBans(A.data, mine, [...st.e, ...st.a]);
    box.innerHTML = (mine.length ? '' : '<p class="note">' + esc(t('banHint')) + '</p>') + bans.map(b => {
      const why = [b.hits.length ? t('ban_vs', { x: b.hits.join(', ') }) : '', b.meta ? t('ban_meta') : '', !b.hits.length && !b.meta ? t('ban_gen') : ''].filter(Boolean).join(' · ');
      return '<div class="pick">' + I.hero(b.n, roleOf[b.n], 36) + '<span class="pmain"><span><b>' + esc(b.n) + '</b> <span class="role">' + esc(t('role_' + b.r)) + '</span></span><span class="why">' + esc(why) + '</span></span><span class="banx" aria-hidden="true">✕</span></div>';
    }).join('');
  }
  function renderReport() {
    const box = $('report'); if (!box || A.kind !== 'moba') return;
    const hero = currentHero();
    $('reportHint').textContent = t('reportHint', { h: hero });
    $('reportMsg').textContent = '';
  }
  async function sendReport(result) {
    const msg = $('reportMsg');
    try {
      const r = await fetch('/api/vote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ game: A.game, hero: currentHero(), enemy: st.e, result }) });
      msg.textContent = r.ok ? t('thanks') : t('reportFail');
    } catch (e) { msg.textContent = t('reportFail'); }
  }
  function renderTeam() {
    const box = $('team'); if (!box) return;
    box.innerHTML = teamBlock(t('allySide'), st.a, true) + teamBlock(t('enemySide'), st.e, false);
  }
  const emblemText = em => em.set ? t('emblemTitle') + ': ' + [em.set, em.t1, em.t2, em.core].filter(Boolean).join(' · ') + (em.coreAdapt ? ' (' + t('adapted') + ')' : '')
    : t('runeTitle') + ': ' + em.core;
  function renderEmblem(em) {
    const box = $('emblem'), head = $('emblemHead');
    if (!box) return;
    box.innerHTML = '';
    head.hidden = box.hidden = !em;
    if (!em) return;
    head.textContent = em.set ? t('emblemTitle') : t('runeTitle');
    const parts = em.set ? [['em_set', em.set], ['em_t1', em.t1], ['em_t2', em.t2], ['em_core', em.core, em.coreAdapt]] : [['runeTitle', em.core]];
    parts.filter(p => p[1]).forEach(([k, v, ad]) => {
      const li = el('li', { class: ad ? 'adapt' : '' }, I.talent(v, 32) + '<span class="iname">' + esc(v) + '<small class="why">' + esc(ad ? t('adapted') : t(k)) + '</small></span>');
      box.appendChild(li);
    });
  }
  const currentHero = () => (st.hero && all.includes(st.hero)) ? st.hero : (lastPicks[0] ? lastPicks[0].n : all[0]);
  function renderBuild() {
    const hero = currentHero(), sel = $('heroSel');
    if (!sel.options.length) all.forEach(n => sel.appendChild(el('option', { value: n }, esc(n))));
    sel.value = hero;
    $('heroIcon').innerHTML = I.hero(hero, roleOf[hero], 44);
    const b = E.mlBuild(A.data, hero, st.e), bl = $('build'); bl.innerHTML = '';
    b.items.forEach(x => {
      const li = el('li', { class: x.adapt ? 'adapt' : '' });
      const name = itemName(x.item);
      const label = x.adapt ? t(x.reason || 'adapted') : (x.slot === 'boots' ? t('boots') : t('core'));
      li.innerHTML = I.item(x.item, 30) + '<span class="iname">' + esc(name) + (name !== x.item && !x.item.startsWith('#') ? '<small class="en">' + esc(x.item) + '</small>' : '') + '<small class="why">' + esc(label) + '</small></span>';
      bl.appendChild(li);
    });
    $('partial').hidden = !b.partial;
    const tl = $('tips'); tl.innerHTML = '';
    const sp = itemName(b.spell);
    renderEmblem(b.emblem);
    [t('spell') + ': ' + sp + (sp !== b.spell ? ' (' + b.spell + ')' : ''), ...(st.e.length ? E.mlTips(A.data, st.e).map(k => t(k)) : [])]
      .forEach(s => tl.appendChild(el('li', {}, esc(s))));
  }
  function renderBsTips() {
    const tl = $('tips'); tl.innerHTML = '';
    const top = lastPicks[0];
    if (top) tl.appendChild(el('li', {}, '<b>' + esc(t('bp_tip', { cls: t('cl_' + top.c) })) + ':</b> ' + esc(t('bt_' + top.c))));
    const gear = top && A.data.gears && A.data.gears[top.c];
    if (gear) tl.appendChild(el('li', {}, '<b>' + esc(t('gearTitle')) + ' (' + esc(top.n) + '):</b> ' + esc(gear.join(' + '))));
  }
  function renderModes() {
    const m = $('modes');
    if (!m.children.length) Object.keys(E.BS_MODES).forEach(k => {
      const b = el('button', { type: 'button', 'data-m': k }, esc(t('m_' + k)));
      b.onclick = () => { st.mode = k; update(); };
      m.appendChild(b);
    });
    [...m.children].forEach(b => b.setAttribute('aria-pressed', b.dataset.m === st.mode));
  }
  function update() {
    renderSlots(); renderPool(); renderMyPool();
    if (!isMoba) renderModes();
    renderPicks();
    if (isMoba) { renderTeam(); renderBans(); renderBuild(); renderReport(); } else renderBsTips();
    $('example').hidden = !example;
    save(st);
  }
  function speechText() {
    if (!st.e.length) return t('noEnemy');
    const parts = [];
    if (lastPicks[0]) parts.push(t('say_best', { x: lastPicks[0].n }));
    if (isMoba) {
      const hero = currentHero(), b = E.mlBuild(A.data, hero, st.e);
      if (b.items.length) parts.push(t('say_build', { h: hero, items: b.items.map(x => itemName(x.item)).join(', ') }));
      if (b.emblem) parts.push(t('say_emblem', { e: [b.emblem.set, b.emblem.t1, b.emblem.t2, b.emblem.core].filter(Boolean).join(', ') }));
      parts.push(t('say_spell', { s: itemName(b.spell) }));
      parts.push(t(E.mlTips(A.data, st.e)[0]));
    } else if (lastPicks[0]) { parts.push(t('bt_' + lastPicks[0].c)); const g = A.data.gears && A.data.gears[lastPicks[0].c]; if (g) parts.push(t('gearTitle') + ': ' + g.join(', ') + '.'); }
    return parts.join(' ');
  }
  $('speak').onclick = () => speak(speechText());
  $('clear').onclick = () => { st.e = []; st.a = []; example = false; update(); };
  if ($('winBtn')) { $('winBtn').onclick = () => sendReport('win'); $('lossBtn').onclick = () => sendReport('loss'); }
  if ($('sideE')) { $('sideE').onclick = () => { st.side = 'e'; update(); }; $('sideA').onclick = () => { st.side = 'a'; update(); }; }
  $('q').oninput = renderPool;
  $('pq').oninput = renderMyPool;
  if (isMoba) $('heroSel').onchange = e => { st.hero = e.target.value; update(); };
  update();

  /* ---------- Draft practice vs AI ---------- */
  function draftTool() {
    const heroes = A.data.heroes, all = heroes.map(h => h.n), roleOf = Object.fromEntries(heroes.map(h => [h.n, h.r]));
    const ORDER = ['B', 'R', 'R', 'B', 'B', 'R', 'R', 'B', 'B', 'R'];
    let me = [], bot = [], step = 0, log = [];
    const taken = () => [...me, ...bot];
    function slots(id, arr, cls) {
      const box = $(id); box.innerHTML = '';
      for (let i = 0; i < 5; i++) { const n = arr[i]; box.appendChild(el('div', { class: 'slot' + (n ? ' ' + cls : '') }, n ? I.hero(n, roleOf[n], 26) + '<span>' + esc(n) + '</span>' : esc(t('emptySlot')))); }
    }
    let pending = false;
    function botTurn() {
      if (pending) return; pending = true;
      $('status').textContent = t('draftTurnBot');
      setTimeout(() => {
        pending = false;
        const p = E.mlBotPick(A.data, me, bot, taken());
        bot.push(p.n); log.unshift(t('botPicked', { x: p.n }) + (p.why.length ? ': ' + [...new Set(p.why.map(k => t(k)))].slice(0, 2).join(' · ') : ''));
        step++; render();
      }, 650);
    }
    function render() {
      slots('dme', me, 'ally'); slots('dbot', bot, 'on');
      $('dlog').innerHTML = log.slice(0, 4).map(l => '<li>' + esc(l) + '</li>').join('');
      const done = step >= ORDER.length, myTurn = !done && ORDER[step] === 'B';
      $('status').textContent = done ? t('draftDone') : myTurn ? t('draftTurnYou') : t('draftTurnBot');
      const q = $('q').value.trim().toLowerCase(), pool = $('pool'); pool.innerHTML = '';
      all.filter(n => !q || n.toLowerCase().includes(q)).forEach(n => {
        const b = chipOf(n, roleOf[n]); b.disabled = !myTurn || taken().includes(n);
        b.onclick = () => { me.push(n); $('q').value = ''; step++; render(); };
        pool.appendChild(b);
      });
      $('pickbox').hidden = done;
      const sg = $('sugg'); sg.innerHTML = '';
      if (myTurn) E.mlScore(A.data, bot, null, me).filter(x => !taken().includes(x.n)).slice(0, 3).forEach(r => {
        const b = chipOf(r.n, roleOf[r.n], 'mine'); b.onclick = () => { me.push(r.n); step++; render(); }; sg.appendChild(b);
      });
      const res = $('result');
      res.hidden = !done;
      if (done) {
        const a = E.mlDraftRating(A.data, me, bot), b = E.mlDraftRating(A.data, bot, me);
        const verdict = Math.abs(a - b) <= 2 ? t('draftDraw') : a > b ? t('draftWin') : t('draftLose');
        res.innerHTML = '<h2>' + esc(t('draftRating')) + '</h2><div class="score-row"><span><b>' + esc(t('draftYou')) + '</b> <span class="big good">' + a + '</span></span><span><b>' + esc(t('draftBot')) + '</b> <span class="big bad">' + b + '</span></span></div><p class="lead" style="margin:6px 0 14px">' + esc(verdict) + '</p><div class="teams">' + teamBlock(t('allySide'), me, true) + teamBlock(t('enemySide'), bot, false) + '</div>';
      }
      if (!done && !myTurn) botTurn();
    }
    $('q').oninput = render;
    $('again').onclick = () => { me = []; bot = []; step = 0; log = []; render(); };
    render();
  }

  /* ---------- Free Fire tool ---------- */
  function ffTool() {
    const st = load({ style: 'rush', mode: 'br', threats: [] });
    const qp = new URLSearchParams(location.search).get('c');
    const force = qp && A.data.characters.some(c => c.n === qp) ? qp : null;
    const seg = (id, keys, prefix, getter, setter, multi) => {
      const box = $(id);
      if (!box.children.length) keys.forEach(k => {
        const b = el('button', { type: 'button', 'data-k': k }, esc(t(prefix + k)));
        b.onclick = () => { setter(k); render(); };
        box.appendChild(b);
      });
      [...box.children].forEach(b => b.setAttribute('aria-pressed', multi ? getter().includes(b.dataset.k) : getter() === b.dataset.k));
    };
    function card(c, label) {
      return '<div class="pick">' + I.hero(c.n, c.type, 40) + '<span class="pmain"><span><b>' + esc(c.n) + '</b> <span class="role">' + esc(label) + '</span></span><span class="why">' + esc(c.why.map(k => t(k)).join(' · ') || '') + '</span></span><span></span></div>';
    }
    let combo;
    function render() {
      seg('styles', Object.keys(E.FF_STYLE), 'ps_', () => st.style, k => st.style = k);
      seg('ffmodes', Object.keys(E.FF_MODE), 'ff_', () => st.mode, k => st.mode = k);
      seg('threats', Object.keys(E.FF_THREAT), 'th_', () => st.threats, k => st.threats = st.threats.includes(k) ? st.threats.filter(x => x !== k) : [...st.threats, k], true);
      combo = E.ffCombo(A.data, st.style, st.mode, st.threats, force);
      $('combo').innerHTML = card(combo.active, t('activeSkill')) + combo.passives.map(p => card(p, t('passiveSkill'))).join('');
      save(st);
    }
    $('speak').onclick = () => speak(t('say_ff', { a: combo.active.n, p: combo.passives.map(p => p.n).join(', ') }));
    render();
  }
})();

/* Community win rates on hero pages */
(function () {
  const box = document.getElementById('community');
  if (!box) return;
  const T = JSON.parse(box.dataset.t || '{}');
  const f = (s, v) => { for (const k in v) s = s.split('{' + k + '}').join(v[k]); return s; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  fetch('/api/stats?game=' + encodeURIComponent(box.dataset.game) + '&hero=' + encodeURIComponent(box.dataset.hero)).then(r => r.ok ? r.json() : null).then(d => {
    if (!d || !d.ok) return;
    const n = d.wins + d.losses;
    let html = '<h2>' + esc(T.commTitle) + '</h2>';
    if (n < 20) html += '<p class="note">' + esc(T.commFew) + '</p>';
    else {
      html += '<p style="margin:0">' + esc(f(T.commRate, { n, p: Math.round(d.wins / n * 100) })) + '</p>';
      const vs = d.vs.map(v => ({ n: v.n, t: v.wins + v.losses, p: Math.round(v.wins / (v.wins + v.losses) * 100) })).sort((a, b) => b.p - a.p);
      if (vs.length) html += '<ul class="tips">' + vs.slice(0, 6).map(v => '<li>' + esc(f(T.commVs, { x: v.n, p: v.p, n: v.t })) + '</li>').join('') + '</ul>';
    }
    box.innerHTML = html; box.hidden = false;
  }).catch(() => {});
})();

/* Language picker (all pages) */
(function () {
  const s = document.getElementById('langSel');
  if (s) s.onchange = () => { try { localStorage.setItem('lang', s.value); } catch (e) {} location.href = s.options[s.selectedIndex].dataset.href; };
})();
